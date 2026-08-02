export { getDb, type AppDatabase } from './client';
export { runMigrations } from './migrate';
export { outbox, syncMeta, activityLogs } from './schema';
export type {
  OutboxRow,
  NewOutboxRow,
  SyncMetaRow,
  ActivityLogRow,
  NewActivityLogRow,
} from './schema';
