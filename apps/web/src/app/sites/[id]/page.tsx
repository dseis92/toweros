/**
 * Site Detail Page
 *
 * View full site details with:
 * - Site information
 * - Equipment list
 * - Work orders
 * - Timeline
 * - Actions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, Badge, Button } from '@tower/ui/web';
import {
  MapPin,
  Edit,
  Trash2,
  Wrench,
  ClipboardList,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

interface Site {
  id: string;
  name: string;
  carrier: string;
  status: 'PLANNING' | 'CONSTRUCTION' | 'IN_SERVICE' | 'DECOMMISSIONED';
  latitude: number;
  longitude: number;
  address: string | null;
  heightMeters: number | null;
  towerType: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: string;
  manufacturer: string | null;
  model: string | null;
}

export default function SiteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (siteId) {
      fetchSiteDetails();
    }
  }, [siteId]);

  const fetchSiteDetails = async () => {
    try {
      const [siteResponse, equipmentResponse] = await Promise.all([
        apiClient.get(`/sites/${siteId}`),
        apiClient.get(`/equipment?siteId=${siteId}`),
      ]);

      setSite(siteResponse.data.site);
      setEquipment(equipmentResponse.data.equipment || []);
    } catch (error) {
      console.error('Failed to fetch site details:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-neutral-100 rounded" />
            <div className="h-64 bg-neutral-100 rounded" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!site) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card padding="xl">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-4 text-neutral-300" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Site not found
              </h3>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => router.push('/sites')}
              >
                Back to Sites
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              iconLeft={<ArrowLeft size={20} />}
              onClick={() => router.push('/sites')}
            >
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-neutral-900">
                  {site.name}
                </h1>
                <Badge variant={getStatusVariant(site.status) as any}>
                  {site.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-neutral-600">{site.carrier}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              iconLeft={<Edit size={20} />}
              onClick={() => router.push(`/sites/${site.id}/edit`)}
            >
              Edit
            </Button>
            <Button variant="danger" iconLeft={<Trash2 size={20} />}>
              Delete
            </Button>
          </div>
        </div>

        {/* Site details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Information */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Site Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Carrier</p>
                <p className="text-base font-medium text-neutral-900">
                  {site.carrier}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Coordinates</p>
                <p className="font-mono text-sm text-neutral-900">
                  {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
                </p>
              </div>

              {site.address && (
                <div>
                  <p className="text-sm text-neutral-600">Address</p>
                  <p className="text-base text-neutral-900">{site.address}</p>
                </div>
              )}

              {site.heightMeters && (
                <div>
                  <p className="text-sm text-neutral-600">Tower Height</p>
                  <p className="text-base font-medium text-neutral-900">
                    {site.heightMeters}m
                  </p>
                </div>
              )}

              {site.towerType && (
                <div>
                  <p className="text-sm text-neutral-600">Tower Type</p>
                  <p className="text-base text-neutral-900">{site.towerType}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-neutral-600">Created</p>
                <p className="text-sm text-neutral-900">
                  {new Date(site.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Map placeholder */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Location
            </h2>
            <div className="bg-neutral-100 rounded-base h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-2 text-neutral-400" />
                <p className="text-neutral-600">Map view coming soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Equipment */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              Equipment ({equipment.length})
            </h2>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Wrench size={18} />}
              onClick={() => router.push(`/equipment/new?siteId=${site.id}`)}
            >
              Add Equipment
            </Button>
          </div>

          {equipment.length === 0 ? (
            <div className="py-12 text-center">
              <Wrench size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-600">No equipment installed yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="py-4 hover:bg-neutral-50 cursor-pointer"
                  onClick={() => router.push(`/equipment/${item.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {item.type}
                        {item.manufacturer && ` • ${item.manufacturer}`}
                        {item.model && ` ${item.model}`}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(item.status) as any}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
