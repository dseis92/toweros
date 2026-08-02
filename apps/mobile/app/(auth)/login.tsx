/**
 * Login Screen
 *
 * Email/password authentication with:
 * - Biometric support (future)
 * - Offline indicator
 * - Error handling
 */

import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, Spinner } from '@tower/ui/native';
import { useAuth } from '@/store/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuth((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.error?.message || 'Invalid credentials'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>TowerOS</Text>
        <Text style={styles.tagline}>Field Operating System</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="mike@example.com"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          placeholder="Enter password"
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        >
          Sign In
        </Button>
      </View>

      <Text style={styles.version}>v0.1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0066CC',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#616161',
  },
  form: {
    gap: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  version: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 12,
    color: '#9E9E9E',
  },
});
