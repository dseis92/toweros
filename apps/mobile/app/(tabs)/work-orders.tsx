/**
 * Work Orders Screen
 *
 * View assigned work orders with:
 * - Status filters
 * - Task progress
 * - Quick start action
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Badge, Button } from '@tower/ui/native';
import { Ionicons } from '@expo/vector-icons';

export default function WorkOrdersScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Work Orders</Text>
      </View>

      <View style={styles.content}>
        <Card variant="elevated" padding="md" style={styles.workCard}>
          <View style={styles.workHeader}>
            <Badge variant="warning">In Progress</Badge>
            <Text style={styles.workTime}>2 hrs ago</Text>
          </View>

          <Text style={styles.workTitle}>5G NR Installation</Text>
          <Text style={styles.workSite}>North Tower Alpha</Text>

          <View style={styles.progress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <Text style={styles.progressText}>7 of 10 tasks</Text>
          </View>

          <View style={styles.tasks}>
            <View style={styles.task}>
              <Ionicons name="checkmark-circle" size={20} color="#00B050" />
              <Text style={styles.taskText}>Safety briefing</Text>
            </View>
            <View style={styles.task}>
              <Ionicons name="checkmark-circle" size={20} color="#00B050" />
              <Text style={styles.taskText}>Install Alpha antenna</Text>
            </View>
            <View style={styles.task}>
              <Ionicons name="checkmark-circle" size={20} color="#00B050" />
              <Text style={styles.taskText}>Install Alpha radio</Text>
            </View>
            <View style={styles.task}>
              <Ionicons name="ellipse-outline" size={20} color="#BDBDBD" />
              <Text style={[styles.taskText, styles.taskPending]}>
                PIM testing
              </Text>
            </View>
          </View>

          <Button variant="primary" fullWidth>
            Continue Work
          </Button>
        </Card>

        <Card variant="elevated" padding="md" style={styles.workCard}>
          <View style={styles.workHeader}>
            <Badge variant="primary">Assigned</Badge>
            <Text style={styles.workTime}>Tomorrow</Text>
          </View>

          <Text style={styles.workTitle}>Equipment Testing</Text>
          <Text style={styles.workSite}>South Tower Beta</Text>

          <View style={styles.progress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
            <Text style={styles.progressText}>0 of 5 tasks</Text>
          </View>

          <Button variant="secondary" fullWidth>
            Start Work
          </Button>
        </Card>

        <Card variant="elevated" padding="md" style={styles.workCard}>
          <View style={styles.workHeader}>
            <Badge variant="success">Completed</Badge>
            <Text style={styles.workTime}>Yesterday</Text>
          </View>

          <Text style={styles.workTitle}>Site Survey</Text>
          <Text style={styles.workSite}>East Tower Gamma</Text>

          <View style={styles.completedInfo}>
            <Ionicons name="checkmark-circle" size={16} color="#00B050" />
            <Text style={styles.completedText}>All tasks completed</Text>
          </View>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  content: {
    padding: 16,
  },
  workCard: {
    marginBottom: 16,
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workTime: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  workTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  workSite: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 16,
  },
  progress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066CC',
  },
  progressText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  tasks: {
    gap: 8,
    marginBottom: 16,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskText: {
    fontSize: 14,
    color: '#212121',
  },
  taskPending: {
    color: '#9E9E9E',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#00B050',
    fontWeight: '500',
  },
});
