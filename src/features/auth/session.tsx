import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { clearTokens } from '@/lib/auth';
import { kv } from '@/lib/kv';

export type UserRole = 'manager' | 'worker';

interface SessionValue {
  signedIn: boolean;
  /** manager = full access; worker = capture-only (the four log screens). */
  role: UserRole | null;
  signIn: (role: UserRole) => void;
  signOut: () => void;
}

const SIGNED_IN_KEY = 'farmos.auth.signedIn';
const ROLE_KEY = 'farmos.auth.role';

const SessionContext = createContext<SessionValue | null>(null);

/** Holds who is signed in and their role, persisted in MMKV (not the tokens). */
export function SessionProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<{
    signedIn: boolean;
    role: UserRole | null;
  }>(() => ({
    signedIn: kv.getBoolean(SIGNED_IN_KEY) ?? false,
    role: (kv.getString(ROLE_KEY) as UserRole | undefined) ?? null,
  }));

  const signIn = useCallback((role: UserRole) => {
    kv.set(SIGNED_IN_KEY, true);
    kv.set(ROLE_KEY, role);
    setState({ signedIn: true, role });
  }, []);

  const signOut = useCallback(() => {
    kv.remove(SIGNED_IN_KEY);
    kv.remove(ROLE_KEY);
    setState({ signedIn: false, role: null });
    // Tokens live in SecureStore, not MMKV — clear them too so a stale
    // access/refresh token can't outlive the session that issued it.
    void clearTokens();
  }, []);

  const value = useMemo<SessionValue>(
    () => ({ ...state, signIn, signOut }),
    [state, signIn, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
