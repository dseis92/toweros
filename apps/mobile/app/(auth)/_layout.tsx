/**
 * Auth Layout
 *
 * Redirect to tabs if already authenticated.
 */

import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/store/auth';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show splash screen
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
