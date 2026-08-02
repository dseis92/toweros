/**
 * Profile Screen
 *
 * User profile with:
 * - Account info
 * - Settings
 * - Logout
 */

import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Badge } from '@tower/ui/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/store/auth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName[0]}{user?.lastName[0]}
          </Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Badge variant="primary" style={styles.roleBadge}>
          {user?.role}
        </Badge>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Card variant="default" padding="none" style={styles.card}>
          <View style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#616161" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </View>
        </Card>

        <Card variant="default" padding="none" style={styles.card}>
          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#616161" />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </View>
        </Card>

        <Card variant="default" padding="none" style={styles.card}>
          <View style={styles.menuItem}>
            <Ionicons name="sync-outline" size={24} color="#616161" />
            <Text style={styles.menuText}>Sync Settings</Text>
            <Badge variant="success" size="sm">
              Synced
            </Badge>
          </View>
        </Card>

        <Card variant="default" padding="none" style={styles.card}>
          <View style={styles.menuItem}>
            <Ionicons name="key-outline" size={24} color="#616161" />
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>About</Text>

        <Card variant="default" padding="md" style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>0.1.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>1</Text>
          </View>
        </Card>

        <Button
          variant="danger"
          fullWidth
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
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
    padding: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 8,
  },
  roleBadge: {
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#616161',
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 24,
  },
});
