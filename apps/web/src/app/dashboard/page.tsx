/**
 * Dashboard Page
 *
 * Overview dashboard with:
 * - Key metrics
 * - Recent activity
 * - Quick actions
 * - Work summary
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Button } from '@tower/ui/web';
import {
  MapPin,
  Wrench,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';

interface DashboardStats {
  totalSites: number;
  activeSites: number;
  totalEquipment: number;
  activeWorkOrders: number;
  completedWorkOrders: number;
  pendingWorkOrders: number;
  totalTechnicians: number;
}

interface RecentActivity {
  id: string;
  type: 'SITE_CREATED' | 'WORK_ORDER_COMPLETED' | 'EQUIPMENT_INSTALLED';
  description: string;
  timestamp: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await apiClient.get('/dashboard/stats');
      setStats(statsResponse.data);

      // Fetch recent activity
      const activityResponse = await apiClient.get('/events', {
        params: { limit: 10 },
      });
      setRecentActivity(activityResponse.data.events || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Welcome back, {user?.firstName}
          </h1>
          <p className="mt-1 text-neutral-600">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} padding="lg">
                <div className="h-24 animate-pulse rounded bg-neutral-100" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Sites */}
            <Card padding="lg" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Sites</p>
                  <p className="mt-2 text-3xl font-bold text-neutral-900">
                    {stats?.totalSites || 0}
                  </p>
                  <p className="mt-1 text-xs text-success-600">
                    {stats?.activeSites || 0} active
                  </p>
                </div>
                <div className="rounded-base bg-primary-50 p-3">
                  <MapPin className="text-primary-600" size={24} />
                </div>
              </div>
            </Card>

            {/* Equipment */}
            <Card padding="lg" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Equipment</p>
                  <p className="mt-2 text-3xl font-bold text-neutral-900">
                    {stats?.totalEquipment || 0}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Across all sites
                  </p>
                </div>
                <div className="rounded-base bg-warning-50 p-3">
                  <Wrench className="text-warning-600" size={24} />
                </div>
              </div>
            </Card>

            {/* Active Work Orders */}
            <Card padding="lg" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Active Work</p>
                  <p className="mt-2 text-3xl font-bold text-neutral-900">
                    {stats?.activeWorkOrders || 0}
                  </p>
                  <p className="mt-1 text-xs text-warning-600">
                    {stats?.pendingWorkOrders || 0} pending
                  </p>
                </div>
                <div className="rounded-base bg-success-50 p-3">
                  <ClipboardList className="text-success-600" size={24} />
                </div>
              </div>
            </Card>

            {/* Team */}
            <Card padding="lg" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Team Size</p>
                  <p className="mt-2 text-3xl font-bold text-neutral-900">
                    {stats?.totalTechnicians || 0}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Active technicians
                  </p>
                </div>
                <div className="rounded-base bg-neutral-100 p-3">
                  <Users className="text-neutral-600" size={24} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              variant="interactive"
              padding="lg"
              onClick={() => router.push('/sites/new')}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-base bg-primary-50 p-3">
                  <MapPin className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Create Site</h3>
                  <p className="text-sm text-neutral-600">Add new cell site</p>
                </div>
              </div>
            </Card>

            <Card
              variant="interactive"
              padding="lg"
              onClick={() => router.push('/work-orders/new')}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-base bg-success-50 p-3">
                  <ClipboardList className="text-success-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">New Work Order</h3>
                  <p className="text-sm text-neutral-600">Assign new task</p>
                </div>
              </div>
            </Card>

            <Card
              variant="interactive"
              padding="lg"
              onClick={() => router.push('/equipment/new')}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-base bg-warning-50 p-3">
                  <Wrench className="text-warning-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Add Equipment</h3>
                  <p className="text-sm text-neutral-600">Install new gear</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Recent Activity
          </h2>
          <Card padding="none">
            {recentActivity.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle size={48} className="mx-auto mb-4 text-neutral-300" />
                <p className="text-neutral-600">No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-neutral-50">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {activity.type === 'WORK_ORDER_COMPLETED' && (
                          <CheckCircle className="text-success-600" size={20} />
                        )}
                        {activity.type === 'SITE_CREATED' && (
                          <MapPin className="text-primary-600" size={20} />
                        )}
                        {activity.type === 'EQUIPMENT_INSTALLED' && (
                          <Wrench className="text-warning-600" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-900">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {activity.user.firstName} {activity.user.lastName} •{' '}
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
