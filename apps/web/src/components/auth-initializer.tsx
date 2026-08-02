'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

/**
 * Component that initializes the auth store on mount
 * Should be included in the root layout
 */
export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
