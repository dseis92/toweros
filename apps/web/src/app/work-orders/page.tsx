/**
 * Work Orders Page
 *
 * Manage work orders with:
 * - Status filters
 * - Assignment tracking
 * - Task progress
 * - Quick actions
 */

'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Input, Button } from '@tower/ui/web';
import {
  ClipboardList,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
} from 'lucide-react';

interface WorkOrder {
  id: string;
  title: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  site: {
    id: string;
    name: string;
  };
  assignee: {
    firstName: string;
    lastName: string;
  } | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export default function WorkOrdersPage() {
  const router = useRouter();

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await apiClient.get('/work-orders');
      setWorkOrders(response.data.workOrders || []);
    } catch (error) {
      console.error('Failed to fetch work orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch = wo.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'ASSIGNED':
        return 'primary';
      case 'PENDING':
        return 'default';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'primary';
      case 'LOW':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={20} className="text-success-600" />;
      case 'IN_PROGRESS':
        return <Clock size={20} className="text-warning-600" />;
      case 'PENDING':
        return <AlertCircle size={20} className="text-neutral-400" />;
      default:
        return <ClipboardList size={20} className="text-neutral-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Work Orders</h1>
            <p className="mt-1 text-neutral-600">
              Manage and track field operations
            </p>
          </div>
          <Button
            variant="primary"
            iconLeft={<Plus size={20} />}
            onClick={() => router.push('/work-orders/new')}
          >
            Create Work Order
          </Button>
        </div>

        {/* Filters */}
        <Card padding="md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search work orders..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                iconLeft={<Search size={20} />}
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter(null)}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  !statusFilter
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'IN_PROGRESS'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </Card>

        {/* Work orders list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} padding="lg">
                <div className="h-24 animate-pulse rounded bg-neutral-100" />
              </Card>
            ))}
          </div>
        ) : filteredWorkOrders.length === 0 ? (
          <Card padding="xl">
            <div className="text-center">
              <ClipboardList
                size={48}
                className="mx-auto mb-4 text-neutral-300"
              />
              <h3 className="text-lg font-semibold text-neutral-900">
                No work orders found
              </h3>
              <p className="mt-1 text-neutral-600">
                {searchQuery || statusFilter
                  ? 'Try adjusting your filters'
                  : 'Create your first work order to get started'}
              </p>
              {!searchQuery && !statusFilter && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => router.push('/work-orders/new')}
                >
                  Create Work Order
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredWorkOrders.map((wo) => (
              <Card
                key={wo.id}
                variant="interactive"
                padding="lg"
                onClick={() => router.push(`/work-orders/${wo.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getStatusIcon(wo.status)}</div>

                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {wo.title}
                        </h3>
                        <Badge variant={getStatusVariant(wo.status) as any}>
                          {wo.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityVariant(wo.priority) as any}>
                          {wo.priority}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <ClipboardList size={16} />
                          <span>{wo.site.name}</span>
                        </div>

                        {wo.assignee && (
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>
                              {wo.assignee.firstName} {wo.assignee.lastName}
                            </span>
                          </div>
                        )}

                        {wo.dueDate && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>
                              Due {new Date(wo.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
