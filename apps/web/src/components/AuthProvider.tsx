/**
 * Auth Provider
 *
 * Client component that initializes authentication state on mount.
 * Wraps the app to ensure auth is initialized before rendering.
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-neutral-600">Loading TowerOS...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
