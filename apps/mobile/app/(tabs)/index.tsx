/**
 * Home Screen
 *
 * Dashboard with:
 * - Welcome message
 * - Quick actions
 * - Recent activity
 * - Sync status
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Badge } from '@tower/ui/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/store/auth';
import { router } from 'expo-router';

export default function HomeScreen() {
  const user = useAuth((state) => state.user);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.firstName}
        </Text>
        <Badge variant="success">Synced</Badge>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <Card
            variant="interactive"
            padding="md"
            onPress={() => router.push('/sites')}
            style={styles.actionCard}
          >
            <Ionicons name="location" size={32} color="#0066CC" />
            <Text style={styles.actionTitle}>View Sites</Text>
          </Card>

          <Card
            variant="interactive"
            padding="md"
            onPress={() => router.push('/work-orders')}
            style={styles.actionCard}
          >
            <Ionicons name="clipboard" size={32} color="#0066CC" />
            <Text style={styles.actionTitle}>Work Orders</Text>
          </Card>

          <Card
            variant="interactive"
            padding="md"
            style={styles.actionCard}
          >
            <Ionicons name="camera" size={32} color="#0066CC" />
            <Text style={styles.actionTitle}>Take Photo</Text>
          </Card>

          <Card
            variant="interactive"
            padding="md"
            style={styles.actionCard}
          >
            <Ionicons name="qr-code" size={32} color="#0066CC" />
            <Text style={styles.actionTitle}>Scan QR</Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Work</Text>

        <Card variant="elevated" padding="md" style={styles.workCard}>
          <View style={styles.workHeader}>
            <Text style={styles.workTitle}>5G NR Installation</Text>
            <Badge variant="warning">In Progress</Badge>
          </View>
          <Text style={styles.workSite}>North Tower Alpha</Text>
          <Text style={styles.workTime}>Started 2 hours ago</Text>
        </Card>

        <Card variant="elevated" padding="md" style={styles.workCard}>
          <View style={styles.workHeader}>
            <Text style={styles.workTitle}>Equipment Testing</Text>
            <Badge variant="primary">Assigned</Badge>
          </View>
          <Text style={styles.workSite}>South Tower Beta</Text>
          <Text style={styles.workTime}>Due tomorrow</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  actionTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  section: {
    padding: 16,
  },
  workCard: {
    marginBottom: 12,
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  workSite: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  workTime: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});
