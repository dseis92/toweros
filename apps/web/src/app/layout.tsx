/**
 * Root Layout
 *
 * Global layout wrapping all pages:
 * - HTML structure
 * - Global styles
 * - Font loading
 * - Metadata
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthInitializer } from '@/components/auth-initializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TowerOS - Field Operating System',
  description: 'Construction management platform for telecommunications infrastructure',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
