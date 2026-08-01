import { migrate } from 'drizzle-orm/op-sqlite/migrator';

import type { AppDatabase } from './client';
import bundle from './migrations/bundle';

/**
 * Apply any pending migrations. Call once at app startup, after {@link getDb}.
 * The migration SQL is inlined into `bundle.ts` by `pnpm db:generate`, so no
 * Metro/babel `.sql` handling is required.
 */
export async function runMigrations(db: AppDatabase): Promise<void> {
  await migrate(db, bundle);
}
