/**
 * Login Page
 *
 * Authentication screen with:
 * - Email/password form
 * - Error handling
 * - Loading states
 * - Auto-redirect on success
 */

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { getErrorMessage } from '@/lib/api-client';
import { Button, Input, Card } from '@tower/ui/web';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-100 px-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary-600">TowerOS</h1>
          <p className="text-neutral-600">Field Operating System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-base bg-danger-50 p-4 text-sm text-danger-700">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          <p>
            Demo credentials:
            <br />
            <span className="font-mono text-xs">admin@example.com / password</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
