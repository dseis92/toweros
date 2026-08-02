/**
 * Dashboard Layout
 *
 * Main application layout with:
 * - Sidebar navigation
 * - Top header with user menu
 * - Protected route wrapper
 * - Responsive design
 */

'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  MapPin,
  Wrench,
  ClipboardList,
  Image,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@tower/ui/web';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Sites', href: '/sites', icon: <MapPin size={20} /> },
  { label: 'Equipment', href: '/equipment', icon: <Wrench size={20} /> },
  { label: 'Work Orders', href: '/work-orders', icon: <ClipboardList size={20} /> },
  { label: 'Media', href: '/media', icon: <Image size={20} /> },
  { label: 'Team', href: '/team', icon: <Users size={20} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">
          <div>
            <h1 className="text-xl font-bold text-primary-600">TowerOS</h1>
            <p className="text-xs text-neutral-500">Field OS</p>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={24} className="text-neutral-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <button
                    onClick={() => {
                      router.push(item.href);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      flex w-full items-center gap-3 rounded-base px-4 py-3 text-left transition-colors
                      ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }
                    `}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="primary" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-neutral-200 p-4">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex w-full items-center gap-3 rounded-base p-3 hover:bg-neutral-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white font-semibold">
                {user?.firstName[0]}
                {user?.lastName[0]}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-neutral-500 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User menu dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-base bg-white shadow-lg">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-base px-4 py-3 text-left text-danger-600 hover:bg-danger-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={24} className="text-neutral-600" />
          </button>

          {/* Page title (hidden on mobile, shown on larger screens) */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-neutral-900">
              {navItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Right side - could add notifications, search, etc. */}
          <div className="flex items-center gap-4">
            <Badge variant="success" size="sm">
              Synced
            </Badge>
          </div>
        </header>

        {/* Page content */}
        <main className="scrollbar-thin flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
