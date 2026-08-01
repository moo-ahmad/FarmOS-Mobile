import { open } from '@op-engineering/op-sqlite';
import { drizzle, type OPSQLiteDatabase } from 'drizzle-orm/op-sqlite';

import * as schema from './schema';

/**
 * The app's SQLite database, accessed through Drizzle. op-sqlite is the fastest
 * New-Architecture SQLite binding for React Native. A single connection is
 * opened lazily and reused for the app's lifetime.
 */
export type AppDatabase = OPSQLiteDatabase<typeof schema>;

const DATABASE_NAME = 'farmos.db';

let instance: AppDatabase | null = null;

/** Get (opening on first call) the shared database instance. */
export function getDb(): AppDatabase {
  if (instance) return instance;
  const connection = open({ name: DATABASE_NAME });
  instance = drizzle(connection, { schema });
  return instance;
}

export { schema };
