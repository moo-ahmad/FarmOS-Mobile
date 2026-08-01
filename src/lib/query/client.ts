import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';

import { kv } from '@/lib/kv';

/** How long persisted cache stays valid across restarts. */
export const QUERY_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h

const CACHE_KEY = 'farmos.query-cache';

/**
 * The TanStack Query client for *server* state. This is deliberately distinct
 * from the SQLite offline store (the outbox): Query caches reads for a snappy
 * UI, while durable offline writes live in SQLite and sync via the outbox.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Offline-first: serve cache, fetch when connectivity allows.
        networkMode: 'offlineFirst',
        staleTime: 30_000,
        gcTime: QUERY_CACHE_MAX_AGE_MS,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  });
}

/** MMKV-backed synchronous persister for the query cache. */
export function createQueryPersister() {
  return createSyncStoragePersister({
    key: CACHE_KEY,
    storage: {
      getItem: (key) => kv.getString(key) ?? null,
      setItem: (key, value) => {
        kv.set(key, value);
      },
      removeItem: (key) => {
        kv.remove(key);
      },
    },
  });
}
