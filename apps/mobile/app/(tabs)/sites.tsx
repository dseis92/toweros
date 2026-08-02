/**
 * Sites List Screen
 *
 * Browse all sites with:
 * - Search and filter
 * - Status badges
 * - Pull to refresh
 */

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Card, Badge, Input } from '@tower/ui/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { apiClient } from '@/lib/api-client';

interface Site {
  id: string;
  name: string;
  carrier: string;
  status: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

export default function SitesScreen() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSites = async () => {
    try {
      const response = await apiClient.get('/sites');
      setSites(response.data.sites);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSites();
  };

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'IN_SERVICE':
        return 'success';
      case 'PLANNING':
        return 'primary';
      case 'CONSTRUCTION':
        return 'warning';
      case 'DECOMMISSIONED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ');
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Search sites..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          iconLeft={<Ionicons name="search" size={20} color="#9E9E9E" />}
        />
      </View>

      <FlatList
        data={filteredSites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            variant="interactive"
            padding="md"
            onPress={() => router.push(`/sites/${item.id}`)}
            style={styles.siteCard}
          >
            <View style={styles.siteHeader}>
              <View style={styles.siteTitleRow}>
                <Ionicons name="location" size={20} color="#0066CC" />
                <Text style={styles.siteName}>{item.name}</Text>
              </View>
              <Badge variant={getStatusVariant(item.status) as any}>
                {getStatusLabel(item.status)}
              </Badge>
            </View>

            <Text style={styles.siteCarrier}>{item.carrier}</Text>

            {item.address && (
              <Text style={styles.siteAddress}>{item.address}</Text>
            )}

            <Text style={styles.siteCoords}>
              {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
            </Text>
          </Card>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#0066CC"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="location-outline" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>No sites found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  list: {
    padding: 16,
  },
  siteCard: {
    marginBottom: 12,
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  siteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  siteCarrier: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  siteAddress: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  siteCoords: {
    fontSize: 12,
    color: '#BDBDBD',
    fontFamily: 'monospace',
  },
  empty: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9E9E9E',
  },
});
