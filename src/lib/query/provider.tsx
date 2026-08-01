import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { type PropsWithChildren, useState } from 'react';

import {
  createQueryClient,
  createQueryPersister,
  QUERY_CACHE_MAX_AGE_MS,
} from './client';

/**
 * Wraps the app in a TanStack Query provider whose cache is persisted to MMKV,
 * so server reads survive restarts and are available offline.
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(createQueryClient);
  const [persister] = useState(createQueryPersister);

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{ persister, maxAge: QUERY_CACHE_MAX_AGE_MS }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
