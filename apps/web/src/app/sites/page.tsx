/**
 * Sites List Page
 *
 * Browse and manage all sites with:
 * - Search and filter
 * - Status badges
 * - Sortable columns
 * - Pagination
 */

'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Input, Button } from '@tower/ui/web';
import { MapPin, Search, Plus, Filter } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  carrier: string;
  status: 'PLANNING' | 'CONSTRUCTION' | 'IN_SERVICE' | 'DECOMMISSIONED';
  latitude: number;
  longitude: number;
  address: string | null;
  createdAt: string;
}

export default function SitesPage() {
  const router = useRouter();

  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await apiClient.get('/sites');
      setSites(response.data.sites || []);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'IN_SERVICE':
        return 'success';
      case 'CONSTRUCTION':
        return 'warning';
      case 'PLANNING':
        return 'primary';
      case 'DECOMMISSIONED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Sites</h1>
            <p className="mt-1 text-neutral-600">
              Manage cell sites and infrastructure
            </p>
          </div>
          <Button
            variant="primary"
            iconLeft={<Plus size={20} />}
            onClick={() => router.push('/sites/new')}
          >
            Create Site
          </Button>
        </div>

        {/* Filters */}
        <Card padding="md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search sites..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                iconLeft={<Search size={20} />}
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-2">
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
                onClick={() => setStatusFilter('PLANNING')}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'PLANNING'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Planning
              </button>
              <button
                onClick={() => setStatusFilter('CONSTRUCTION')}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'CONSTRUCTION'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Construction
              </button>
              <button
                onClick={() => setStatusFilter('IN_SERVICE')}
                className={`rounded-base px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'IN_SERVICE'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                In Service
              </button>
            </div>
          </div>
        </Card>

        {/* Sites list */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} padding="lg">
                <div className="h-32 animate-pulse rounded bg-neutral-100" />
              </Card>
            ))}
          </div>
        ) : filteredSites.length === 0 ? (
          <Card padding="xl">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-4 text-neutral-300" />
              <h3 className="text-lg font-semibold text-neutral-900">
                No sites found
              </h3>
              <p className="mt-1 text-neutral-600">
                {searchQuery || statusFilter
                  ? 'Try adjusting your filters'
                  : 'Create your first site to get started'}
              </p>
              {!searchQuery && !statusFilter && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => router.push('/sites/new')}
                >
                  Create Site
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <Card
                key={site.id}
                variant="interactive"
                padding="lg"
                onClick={() => router.push(`/sites/${site.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-primary-600" size={20} />
                    <h3 className="font-semibold text-neutral-900">
                      {site.name}
                    </h3>
                  </div>
                  <Badge variant={getStatusVariant(site.status) as any}>
                    {getStatusLabel(site.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-neutral-600">
                    <span className="font-medium">Carrier:</span> {site.carrier}
                  </p>
                  {site.address && (
                    <p className="text-neutral-500">{site.address}</p>
                  )}
                  <p className="font-mono text-xs text-neutral-400">
                    {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
