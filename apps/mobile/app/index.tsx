/**
 * App Entry Point
 *
 * Redirects to appropriate screen based on auth state.
 */

import { Redirect } from 'expo-router';
import { useAuth } from '@/store/auth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Splash screen
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
