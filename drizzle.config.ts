import { defineConfig } from 'drizzle-kit';

/**
 * drizzle-kit config for generating SQLite migration files from the schema.
 * Migrations are applied at app startup by the op-sqlite migrator
 * (see src/db/migrate.ts), not by drizzle-kit push.
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
});
