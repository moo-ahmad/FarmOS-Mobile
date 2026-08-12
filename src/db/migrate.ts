import { sql } from 'drizzle-orm';

import type { AppDatabase } from './client';
import bundle from './migrations/bundle';

const MIGRATIONS_TABLE = '__drizzle_migrations';

let inFlight: Promise<void> | null = null;

/**
 * Apply any pending migrations. Call at app startup, after {@link getDb}.
 * The migration SQL is inlined into `bundle.ts` by `pnpm db:generate`, so no
 * Metro/babel `.sql` handling is required.
 *
 * Runs at most once per process: `DatabaseGate` mounts its effect more than
 * once on a cold launch (React dev double-invoke / router settling), and two
 * concurrent runs would both observe an empty `__drizzle_migrations` and both
 * issue `CREATE TABLE`, so the loser throws "table already exists" even though
 * the schema applied fine.
 */
export function runMigrations(db: AppDatabase): Promise<void> {
  inFlight ??= applyMigrations(db).catch((error: unknown) => {
    inFlight = null;
    throw error;
  });
  return inFlight;
}

/**
 * Add `IF NOT EXISTS` to creation DDL so replaying a migration is a no-op.
 *
 * Needed to self-heal databases whose `__drizzle_migrations` rows went missing:
 * their schema is already up to date, but the tracking table reads as empty, so
 * migration 0000 replays and would otherwise die on `CREATE TABLE outbox`. With
 * the tracking read below fixed this path should not be hit again — it only
 * rescues databases already left in that state.
 */
function idempotent(statement: string): string {
  return statement
    .replace(/^CREATE TABLE(?! IF NOT EXISTS)/i, 'CREATE TABLE IF NOT EXISTS')
    .replace(
      /^CREATE( UNIQUE)? INDEX(?! IF NOT EXISTS)/i,
      'CREATE$1 INDEX IF NOT EXISTS',
    );
}

async function applyMigrations(db: AppDatabase): Promise<void> {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier(MIGRATIONS_TABLE)} (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at numeric
    )
  `);

  // Must be `values()`, not `all()`/`get()`: with op-sqlite 17 those two call
  // `client.execute(...).rows._array` synchronously, but `execute` now returns a
  // Promise, so they silently resolve to `[]` every time. An always-empty read
  // here means every launch replays migration 0000 and dies on `CREATE TABLE
  // outbox` ("already exists"). `values()` goes through `executeRawAsync`, which
  // is properly awaited, and returns rows as positional arrays.
  const rows = await db.values<[number]>(
    sql`SELECT created_at FROM ${sql.identifier(MIGRATIONS_TABLE)} ORDER BY created_at DESC LIMIT 1`,
  );
  const lastAppliedAt = Number(rows[0]?.[0] ?? 0);

  for (const entry of bundle.journal.entries) {
    if (entry.when <= lastAppliedAt) continue;

    const key =
      `m${String(entry.idx).padStart(4, '0')}` as keyof typeof bundle.migrations;
    const query = bundle.migrations[key];
    for (const statement of query.split('--> statement-breakpoint')) {
      const trimmed = statement.trim();
      if (trimmed) await db.run(sql.raw(idempotent(trimmed)));
    }

    await db.run(
      sql`INSERT INTO ${sql.identifier(MIGRATIONS_TABLE)} (hash, created_at) VALUES (${entry.tag}, ${entry.when})`,
    );
  }
}
