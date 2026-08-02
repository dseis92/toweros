/**
 * Database Seed Script
 *
 * Seeds the database with demo data for development and testing.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { ulid } from 'ulid';
import * as bcrypt from 'bcrypt';

// Import all tables
import { companies, devices } from './schema/identity';
import { users } from './schema/identity';
import { sites } from './schema/sites';
import { sectors } from './schema/sites';
import { equipment } from './schema/equipment';
import { equipmentConnections } from './schema/equipment';
import { projects } from './schema/work-orders';
import { workOrders } from './schema/work-orders';
import { tasks } from './schema/work-orders';
import { events } from './schema/events';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Seeding database with demo data...\n');

  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  try {
    // Hash password for demo users
    const passwordHash = await bcrypt.hash('password', 12);

    // 1. Create companies
    console.log('📦 Creating companies...');
    const [acmeCompany] = await db
      .insert(companies)
      .values({
        id: ulid(),
        name: 'Acme Telecom',
        type: 'CONTRACTOR',
        settings: {
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          units: 'IMPERIAL',
          defaultCurrency: 'USD',
        },
      })
      .returning();

    const [betaCompany] = await db
      .insert(companies)
      .values({
        id: ulid(),
        name: 'Beta Construction',
        type: 'CONTRACTOR',
        settings: {
          timezone: 'America/Los_Angeles',
          dateFormat: 'YYYY-MM-DD',
          units: 'IMPERIAL',
          defaultCurrency: 'USD',
        },
      })
      .returning();

    console.log(`✅ Created 2 companies\n`);

    // 2. Create users
    console.log('👥 Creating users...');
    const [adminUser] = await db
      .insert(users)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        email: 'admin@acme-telecom.com',
        passwordHash,
        firstName: 'Alice',
        lastName: 'Admin',
        role: 'COMPANY_ADMIN',
        phone: '+1-555-0101',
        status: 'ACTIVE',
        certifications: [
          {
            type: 'Tower Climbing Safety',
            issuer: 'NATE',
            issuedDate: '2023-01-15',
            expiryDate: '2026-01-15',
          },
        ],
      })
      .returning();

    const [managerUser] = await db
      .insert(users)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        email: 'manager@acme-telecom.com',
        passwordHash,
        firstName: 'Mike',
        lastName: 'Manager',
        role: 'PROJECT_MANAGER',
        phone: '+1-555-0102',
        status: 'ACTIVE',
      })
      .returning();

    const [techUser1] = await db
      .insert(users)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        email: 'tech1@acme-telecom.com',
        passwordHash,
        firstName: 'Tom',
        lastName: 'Technician',
        role: 'TECHNICIAN',
        phone: '+1-555-0103',
        status: 'ACTIVE',
        certifications: [
          {
            type: 'RF Safety',
            issuer: 'OSHA',
            issuedDate: '2023-06-01',
            expiryDate: '2025-06-01',
          },
          {
            type: 'First Aid',
            issuer: 'Red Cross',
            issuedDate: '2024-01-10',
            expiryDate: '2026-01-10',
          },
        ],
      })
      .returning();

    const [techUser2] = await db
      .insert(users)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        email: 'tech2@acme-telecom.com',
        passwordHash,
        firstName: 'Sarah',
        lastName: 'Specialist',
        role: 'TECHNICIAN',
        phone: '+1-555-0104',
        status: 'ACTIVE',
      })
      .returning();

    const [viewerUser] = await db
      .insert(users)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        email: 'viewer@acme-telecom.com',
        passwordHash,
        firstName: 'Victor',
        lastName: 'Viewer',
        role: 'CLIENT',
        phone: '+1-555-0105',
        status: 'ACTIVE',
      })
      .returning();

    // Beta company user
    const [betaAdmin] = await db
      .insert(users)
      .values({
        id: ulid(),
        companyId: betaCompany.id,
        email: 'admin@beta-construction.com',
        passwordHash,
        firstName: 'Bob',
        lastName: 'Builder',
        role: 'COMPANY_ADMIN',
        phone: '+1-555-0201',
        status: 'ACTIVE',
      })
      .returning();

    console.log(`✅ Created 6 users\n`);

    // 3. Create devices
    console.log('📱 Creating devices...');
    const [adminDevice] = await db
      .insert(devices)
      .values({
        id: ulid(),
        userId: adminUser.id,
        deviceName: 'Alice iPhone 15',
        platform: 'ios',
        appVersion: '1.0.0',
        pushToken: 'admin-push-token-123',
      })
      .returning();

    const [techDevice1] = await db
      .insert(devices)
      .values({
        id: ulid(),
        userId: techUser1.id,
        deviceName: 'Tom Samsung Galaxy',
        platform: 'android',
        appVersion: '1.0.0',
        pushToken: 'tech1-push-token-456',
      })
      .returning();

    const [techDevice2] = await db
      .insert(devices)
      .values({
        id: ulid(),
        userId: techUser2.id,
        deviceName: 'Sarah iPad Pro',
        platform: 'ios',
        appVersion: '1.0.0',
        pushToken: 'tech2-push-token-789',
      })
      .returning();

    console.log(`✅ Created 3 devices\n`);

    // 4. Create sites
    console.log('📍 Creating sites...');
    const [site1] = await db
      .insert(sites)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        name: 'North Tower Alpha',
        carrier: 'ATT',
        status: 'ON_AIR',
        latitude: 40.7128,
        longitude: -74.006,
        address: '123 Main St, New York, NY 10001',
        siteType: 'MONOPOLE',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    const [site2] = await db
      .insert(sites)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        name: 'South Tower Beta',
        carrier: 'VERIZON',
        status: 'CONSTRUCTION',
        latitude: 34.0522,
        longitude: -118.2437,
        address: '456 Oak Ave, Los Angeles, CA 90001',
        siteType: 'LATTICE_TOWER',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    const [site3] = await db
      .insert(sites)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        name: 'East Tower Gamma',
        carrier: 'TMOBILE',
        status: 'PLANNED',
        latitude: 41.8781,
        longitude: -87.6298,
        address: '789 Pine Rd, Chicago, IL 60601',
        siteType: 'GUYED_TOWER',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    const [site4] = await db
      .insert(sites)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        name: 'West Tower Delta',
        carrier: 'ATT',
        status: 'ON_AIR',
        latitude: 37.7749,
        longitude: -122.4194,
        address: '321 Elm St, San Francisco, CA 94102',
        siteType: 'MONOPOLE',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    // Beta company site (should not be visible to Acme users)
    const [betaSite] = await db
      .insert(sites)
      .values({
        id: ulid(),
        companyId: betaCompany.id,
        name: 'Beta HQ Tower',
        carrier: 'DISH',
        status: 'ON_AIR',
        latitude: 47.6062,
        longitude: -122.3321,
        address: '999 Beta Way, Seattle, WA 98101',
        siteType: 'MONOPOLE',
        createdBy: betaAdmin.id,
        updatedBy: betaAdmin.id,
      })
      .returning();

    console.log(`✅ Created 5 sites\n`);

    // 4. Create sectors
    console.log('📡 Creating sectors...');
    const sectorIds = [];

    for (let i = 0; i < 3; i++) {
      const [sector] = await db
        .insert(sectors)
        .values({
          id: ulid(),
          companyId: acmeCompany.id,
          siteId: site1.id,
          name: `Alpha-${i + 1}`,
          sectorNumber: i + 1,
          azimuth: i * 120,
          beamwidth: i === 0 ? 65 : 360, // Panel antenna: 65°, Omni: 360°
          mountHeightFt: 120,
        })
        .returning();
      sectorIds.push(sector.id);
    }

    console.log(`✅ Created 3 sectors\n`);

    // 5. Create equipment
    console.log('🔧 Creating equipment...');
    const [radio1] = await db
      .insert(equipment)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        siteId: site1.id,
        name: 'Radio Unit 1',
        equipmentType: 'RADIO_RRU',
        category: 'RF',
        status: 'IN_SERVICE',
        manufacturer: 'Ericsson',
        model: 'AIR 6488',
        serialNumber: 'ESN-2024-001',
        installDate: '2024-01-15',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    const [antenna1] = await db
      .insert(equipment)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        siteId: site1.id,
        name: 'Antenna Panel 1',
        equipmentType: 'ANTENNA',
        category: 'RF',
        status: 'IN_SERVICE',
        manufacturer: 'CommScope',
        model: 'NHH-65C-R4',
        serialNumber: 'ANT-2024-001',
        installDate: '2024-01-15',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    const [fiber1] = await db
      .insert(equipment)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        siteId: site1.id,
        name: 'Fiber Cable 1',
        equipmentType: 'FIBER_CABLE',
        category: 'CONNECTIVITY',
        status: 'IN_SERVICE',
        manufacturer: 'Corning',
        model: 'SMF-28',
        serialNumber: 'FIB-2024-001',
        installDate: '2024-01-15',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    const [power1] = await db
      .insert(equipment)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        siteId: site1.id,
        name: 'Power Supply 1',
        equipmentType: 'RECTIFIER',
        category: 'POWER',
        status: 'IN_SERVICE',
        manufacturer: 'Eltek',
        model: 'Flatpack2',
        serialNumber: 'PWR-2024-001',
        installDate: '2024-01-15',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      })
      .returning();

    console.log(`✅ Created 4 equipment items\n`);

    // 6. Create equipment connections
    console.log('🔗 Creating equipment connections...');
    await db.insert(equipmentConnections).values([
      {
        id: ulid(),
        companyId: acmeCompany.id,
        fromEquipmentId: power1.id,
        toEquipmentId: radio1.id,
        connectionType: 'POWER',
        cableType: 'DC Power',
      },
      {
        id: ulid(),
        companyId: acmeCompany.id,
        fromEquipmentId: radio1.id,
        toEquipmentId: fiber1.id,
        connectionType: 'FIBER',
        cableType: 'Single Mode Fiber',
      },
      {
        id: ulid(),
        companyId: acmeCompany.id,
        fromEquipmentId: radio1.id,
        toEquipmentId: antenna1.id,
        connectionType: 'RF_PATH',
        cableType: '7/8" Coax',
      },
    ]);

    console.log(`✅ Created 3 equipment connections\n`);

    // 7. Create projects
    console.log('📋 Creating projects...');
    const [project1] = await db
      .insert(projects)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        name: '5G Rollout Phase 1',
        description: 'Initial 5G deployment across metro areas',
        status: 'ACTIVE',
        client: 'AT&T',
        projectManagerId: managerUser.id,
        startDate: '2024-01-01',
      })
      .returning();

    console.log(`✅ Created 1 project\n`);

    // 8. Create work orders
    console.log('📝 Creating work orders...');
    const [wo1] = await db
      .insert(workOrders)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        projectId: project1.id,
        siteId: site2.id,
        workOrderNumber: 'WO-2024-001',
        title: '5G NR Installation',
        description: 'Install 5G New Radio equipment at South Tower Beta',
        workType: 'NEW_BUILD',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedToUserId: techUser1.id,
        assignedBy: managerUser.id,
        scheduledStart: new Date('2024-06-01'),
        scheduledEnd: new Date('2024-06-05'),
        createdBy: managerUser.id,
        updatedBy: managerUser.id,
      })
      .returning();

    const [wo2] = await db
      .insert(workOrders)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        projectId: project1.id,
        siteId: site3.id,
        workOrderNumber: 'WO-2024-002',
        title: 'Site Survey',
        description: 'Complete site survey for East Tower Gamma',
        workType: 'INSPECTION',
        status: 'ASSIGNED',
        priority: 'NORMAL',
        assignedToUserId: techUser2.id,
        assignedBy: managerUser.id,
        scheduledStart: new Date('2024-06-10'),
        scheduledEnd: new Date('2024-06-11'),
        createdBy: managerUser.id,
        updatedBy: managerUser.id,
      })
      .returning();

    const [wo3] = await db
      .insert(workOrders)
      .values({
        id: ulid(),
        companyId: acmeCompany.id,
        siteId: site1.id,
        workOrderNumber: 'WO-2024-003',
        title: 'Equipment Testing',
        description: 'Quarterly equipment testing and calibration',
        workType: 'TESTING',
        status: 'COMPLETED',
        priority: 'LOW',
        assignedToUserId: techUser1.id,
        assignedBy: managerUser.id,
        scheduledStart: new Date('2024-05-01'),
        scheduledEnd: new Date('2024-05-02'),
        completedAt: new Date('2024-05-02'),
        createdBy: managerUser.id,
        updatedBy: managerUser.id,
      })
      .returning();

    console.log(`✅ Created 3 work orders\n`);

    // 9. Create tasks
    console.log('✅ Creating tasks...');
    await db.insert(tasks).values([
      {
        id: ulid(),
        companyId: acmeCompany.id,
        workOrderId: wo1.id,
        title: 'Safety briefing',
        description: 'Complete safety briefing and equipment check',
        taskType: 'SAFETY_BRIEFING',
        sequenceNumber: 1,
        assignedTo: techUser1.id,
        assignedBy: managerUser.id,
        status: 'COMPLETED',
        completedAt: new Date('2024-06-01T08:00:00Z'),
      },
      {
        id: ulid(),
        companyId: acmeCompany.id,
        workOrderId: wo1.id,
        title: 'Install Alpha antenna',
        description: 'Mount and align alpha sector antenna',
        taskType: 'EQUIPMENT_INSTALLATION',
        sequenceNumber: 2,
        assignedTo: techUser1.id,
        assignedBy: managerUser.id,
        status: 'COMPLETED',
        completedAt: new Date('2024-06-01T12:00:00Z'),
      },
      {
        id: ulid(),
        companyId: acmeCompany.id,
        workOrderId: wo1.id,
        title: 'Install Alpha radio',
        description: 'Install and configure alpha radio unit',
        taskType: 'EQUIPMENT_INSTALLATION',
        sequenceNumber: 3,
        assignedTo: techUser1.id,
        assignedBy: managerUser.id,
        status: 'COMPLETED',
        completedAt: new Date('2024-06-02T10:00:00Z'),
      },
      {
        id: ulid(),
        companyId: acmeCompany.id,
        workOrderId: wo1.id,
        title: 'PIM testing',
        description: 'Perform passive intermodulation testing',
        taskType: 'TESTING_PIM',
        sequenceNumber: 4,
        assignedTo: techUser1.id,
        assignedBy: managerUser.id,
        status: 'IN_PROGRESS',
      },
      {
        id: ulid(),
        companyId: acmeCompany.id,
        workOrderId: wo1.id,
        title: 'Integration testing',
        description: 'Complete end-to-end integration tests',
        taskType: 'INSPECTION',
        sequenceNumber: 5,
        assignedTo: techUser1.id,
        assignedBy: managerUser.id,
        status: 'PENDING',
      },
    ]);

    console.log(`✅ Created 5 tasks\n`);

    // 11. Create events
    console.log('📅 Creating events...');

    // Generate session IDs for events
    const adminSessionId = ulid();
    const tech1SessionId = ulid();

    await db.insert(events).values([
      {
        id: ulid(),
        type: 'SITE_CREATED',
        aggregateType: 'Site',
        aggregateId: site1.id,
        userId: adminUser.id,
        companyId: acmeCompany.id,
        deviceId: adminDevice.id,
        sessionId: adminSessionId,
        timestamp: new Date('2024-01-15T09:00:00Z').getTime(),
        serverTimestamp: new Date('2024-01-15T09:00:00Z').getTime(),
        vectorClock: { [adminDevice.id]: 1 },
        payload: {
          siteId: site1.id,
          name: site1.name,
          carrier: site1.carrier,
        },
        metadata: {
          ipAddress: '192.168.1.100',
          userAgent: 'TowerOS/1.0',
        },
      },
      {
        id: ulid(),
        type: 'EQUIPMENT_INSTALLED',
        aggregateType: 'Equipment',
        aggregateId: radio1.id,
        userId: techUser1.id,
        companyId: acmeCompany.id,
        deviceId: techDevice1.id,
        sessionId: tech1SessionId,
        timestamp: new Date('2024-01-15T14:30:00Z').getTime(),
        serverTimestamp: new Date('2024-01-15T14:30:01Z').getTime(),
        vectorClock: { [techDevice1.id]: 1 },
        payload: {
          equipmentId: radio1.id,
          siteId: site1.id,
          type: 'RADIO',
          manufacturer: 'Ericsson',
          model: 'AIR 6488',
        },
        metadata: {
          latitude: site1.latitude,
          longitude: site1.longitude,
        },
      },
      {
        id: ulid(),
        type: 'WORK_ORDER_COMPLETED',
        aggregateType: 'WorkOrder',
        aggregateId: wo3.id,
        userId: techUser1.id,
        companyId: acmeCompany.id,
        deviceId: techDevice1.id,
        sessionId: tech1SessionId,
        timestamp: new Date('2024-05-02T16:00:00Z').getTime(),
        serverTimestamp: new Date('2024-05-02T16:00:02Z').getTime(),
        vectorClock: { [techDevice1.id]: 2 },
        payload: {
          workOrderId: wo3.id,
          siteId: site1.id,
          title: wo3.title,
        },
        metadata: {
          duration: '8h',
        },
      },
    ]);

    console.log(`✅ Created 3 events\n`);

    console.log('🎉 Database seeded successfully!\n');
    console.log('Demo credentials:');
    console.log('  Admin:      admin@acme-telecom.com / password');
    console.log('  Manager:    manager@acme-telecom.com / password');
    console.log('  Technician: tech1@acme-telecom.com / password');
    console.log('  Viewer:     viewer@acme-telecom.com / password\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
