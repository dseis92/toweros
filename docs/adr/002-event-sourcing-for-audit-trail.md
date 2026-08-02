# ADR 002: Event Sourcing for Complete Audit Trail

**Status:** Accepted
**Date:** 2026-08-02
**Decision Makers:** Architecture Team
**Context:** TowerOS Foundation Design

---

## Context

Telecommunications construction is a heavily regulated, compliance-driven industry:

- Carriers require complete documentation of all site work
- OSHA requires safety incident traceability
- Insurance requires proof of installation procedures
- Warranty claims require installation history
- Quality audits require "who did what when"
- Legal disputes require forensic evidence

Traditional CRUD systems lose historical state. When a record is updated, the previous value is lost unless explicitly versioned.

In TowerOS, the question "What happened on Site XYZ on March 4th, 2026?" must be answerable with complete accuracy.

## Decision

We will implement **Event Sourcing** as the core pattern for all state changes in TowerOS.

**Definition:** Every change to application state is captured as an immutable event. The current state is derived by replaying all events.

### Core Principles

1. **Events are immutable** - Never update or delete events
2. **Events are the source of truth** - Current state is a projection
3. **Events capture intent** - Not just data changes, but why
4. **Events enable time travel** - Replay to any point in history
5. **Events enable audit** - Complete forensic trail

## Implementation

### Event Structure

```typescript
interface DomainEvent {
  // Identity
  id: string                    // Unique event ID (ULID)
  type: string                  // Event type (e.g., "RADIO_INSTALLED")
  aggregateType: string         // Entity type (e.g., "Site", "Equipment")
  aggregateId: string           // Entity ID this event applies to

  // Temporal
  timestamp: number             // Unix milliseconds (device time)
  serverTimestamp?: number      // Server received time (if synced)

  // Causality
  vectorClock: Record<string, number>  // For conflict detection
  causationId?: string          // Event that caused this event
  correlationId?: string        // Related event chain

  // Context
  userId: string                // Who performed the action
  deviceId: string              // Which device
  sessionId: string             // Which session

  // Payload
  payload: Record<string, any>  // Event-specific data
  metadata?: Record<string, any> // Additional context

  // Versioning
  version: number               // Event schema version
}
```

### Event Examples

**Radio Installation:**
```typescript
{
  id: "01H2X4YFZK6HPQR8T9W0BCDXYZ",
  type: "RADIO_INSTALLED",
  aggregateType: "Equipment",
  aggregateId: "radio_abc123",
  timestamp: 1722604800000,
  userId: "user_mike_tech",
  deviceId: "iphone_123",
  sessionId: "session_xyz",
  payload: {
    siteId: "site_tower_north",
    sectorId: "sector_alpha",
    manufacturer: "Ericsson",
    model: "AIR 6449",
    serialNumber: "ABC123XYZ",
    mountHeight: 250,
    azimuth: 45,
    tilt: 3,
    installedBy: "Mike Johnson",
    crewId: "crew_delta",
    photos: ["photo_1", "photo_2"]
  },
  metadata: {
    weather: "Clear, 15mph winds",
    temperature: 72,
    safetyCheckCompleted: true
  },
  version: 1
}
```

**Site Inspection:**
```typescript
{
  id: "01H2X4ZFZK6HPQR8T9W0BCDXYZ",
  type: "INSPECTION_COMPLETED",
  aggregateType: "Site",
  aggregateId: "site_tower_north",
  timestamp: 1722604900000,
  userId: "user_inspector_jane",
  deviceId: "ipad_456",
  payload: {
    inspectionType: "FINAL",
    result: "PASSED",
    checklist: {
      structuralIntegrity: "PASS",
      groundingCompliance: "PASS",
      antennaAlignment: "PASS",
      cableDressing: "FAIL",
      labelingComplete: "PASS"
    },
    findings: [
      {
        item: "cableDressing",
        issue: "Excess fiber slack not secured in J-hooks",
        severity: "MINOR",
        photoId: "photo_finding_1"
      }
    ],
    inspectorNotes: "Minor punch list item identified",
    nextAction: "PUNCH_LIST_REQUIRED"
  },
  version: 1
}
```

**Punch List Item Resolved:**
```typescript
{
  id: "01H2X50FZK6HPQR8T9W0BCDXYZ",
  type: "PUNCH_ITEM_RESOLVED",
  aggregateType: "Site",
  aggregateId: "site_tower_north",
  timestamp: 1722605000000,
  userId: "user_mike_tech",
  deviceId: "iphone_123",
  causationId: "01H2X4ZFZK6HPQR8T9W0BCDXYZ", // References inspection event
  payload: {
    findingId: "finding_123",
    resolution: "Fiber slack properly secured with J-hooks per spec",
    beforePhoto: "photo_before",
    afterPhoto: "photo_after",
    verifiedBy: "user_foreman_bob"
  },
  version: 1
}
```

### Event Store Schema (PostgreSQL)

```sql
CREATE TABLE events (
  -- Identity
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,

  -- Temporal (indexed for queries)
  timestamp BIGINT NOT NULL,
  server_timestamp BIGINT,

  -- Causality
  vector_clock JSONB NOT NULL,
  causation_id TEXT REFERENCES events(id),
  correlation_id TEXT,

  -- Context
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  session_id TEXT NOT NULL,

  -- Payload
  payload JSONB NOT NULL,
  metadata JSONB,

  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,

  -- Indexing
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_events_aggregate ON events(aggregate_type, aggregate_id, timestamp);
CREATE INDEX idx_events_type ON events(type, timestamp);
CREATE INDEX idx_events_user ON events(user_id, timestamp);
CREATE INDEX idx_events_timestamp ON events(timestamp DESC);
CREATE INDEX idx_events_correlation ON events(correlation_id) WHERE correlation_id IS NOT NULL;

-- GIN index for JSONB queries
CREATE INDEX idx_events_payload ON events USING GIN(payload);
```

### Projections (Read Models)

Current state is derived from events using **projections**:

```typescript
// Projection: Current equipment state
CREATE MATERIALIZED VIEW equipment_current AS
SELECT DISTINCT ON (aggregate_id)
  aggregate_id as id,
  payload->>'siteId' as site_id,
  payload->>'manufacturer' as manufacturer,
  payload->>'model' as model,
  payload->>'serialNumber' as serial_number,
  payload->>'status' as status,
  timestamp,
  user_id as last_modified_by
FROM events
WHERE aggregate_type = 'Equipment'
  AND type IN ('RADIO_INSTALLED', 'RADIO_UPDATED', 'RADIO_REMOVED')
ORDER BY aggregate_id, timestamp DESC;

-- Refresh strategy: Real-time via triggers or periodic refresh
CREATE UNIQUE INDEX ON equipment_current(id);
```

**Projection Update Flow:**
1. Event appended to event store
2. Trigger notifies projection service
3. Projection service updates materialized view
4. Cache invalidated
5. Clients receive updated data

### Time Travel Queries

**"What was the state of this site on March 4th?"**

```typescript
async function getSiteStateAtTime(siteId: string, timestamp: number) {
  const events = await db.query(`
    SELECT * FROM events
    WHERE aggregate_id = $1
      AND timestamp <= $2
    ORDER BY timestamp ASC
  `, [siteId, timestamp])

  // Replay events to build state at that point in time
  return events.reduce((state, event) => {
    return applyEvent(state, event)
  }, initialState)
}
```

**"Show me everything that happened on this site today"**

```typescript
async function getSiteTimeline(siteId: string, date: Date) {
  const startOfDay = date.setHours(0, 0, 0, 0)
  const endOfDay = date.setHours(23, 59, 59, 999)

  return db.query(`
    SELECT
      timestamp,
      type,
      user_id,
      payload,
      metadata
    FROM events
    WHERE aggregate_id = $1
      AND timestamp BETWEEN $2 AND $3
    ORDER BY timestamp ASC
  `, [siteId, startOfDay, endOfDay])
}
```

### Event Versioning

As the application evolves, event schemas change. We handle this with **version numbers** and **upcasters**:

```typescript
// V1: Original event
{
  type: "RADIO_INSTALLED",
  version: 1,
  payload: {
    manufacturer: "Ericsson",
    model: "AIR 6449"
  }
}

// V2: Added equipment category
{
  type: "RADIO_INSTALLED",
  version: 2,
  payload: {
    manufacturer: "Ericsson",
    model: "AIR 6449",
    category: "RRU" // New field
  }
}

// Upcaster: V1 → V2
function upcastRadioInstalledV1toV2(event: DomainEvent): DomainEvent {
  if (event.version === 1) {
    return {
      ...event,
      version: 2,
      payload: {
        ...event.payload,
        category: inferCategoryFromModel(event.payload.model)
      }
    }
  }
  return event
}
```

When replaying old events, upcasters transform them to the current schema.

## Command-Query Responsibility Segregation (CQRS)

Event sourcing pairs naturally with CQRS:

**Commands** (Write Side):
```typescript
// Command: Install radio
async function installRadio(command: InstallRadioCommand) {
  // 1. Validate business rules
  validateRadioInstallation(command)

  // 2. Create event
  const event: DomainEvent = {
    id: ulid(),
    type: "RADIO_INSTALLED",
    aggregateType: "Equipment",
    aggregateId: command.radioId,
    timestamp: Date.now(),
    userId: command.userId,
    deviceId: command.deviceId,
    payload: command.payload,
    version: 1
  }

  // 3. Append to event store
  await eventStore.append(event)

  // 4. Return success
  return { eventId: event.id }
}
```

**Queries** (Read Side):
```typescript
// Query: Get current site equipment
async function getSiteEquipment(siteId: string) {
  // Read from optimized projection, not event store
  return db.query(`
    SELECT * FROM equipment_current
    WHERE site_id = $1
    ORDER BY installation_date DESC
  `, [siteId])
}
```

## Benefits for TowerOS

### 1. Complete Audit Trail
Every action is recorded permanently. Regulators, carriers, and auditors can see exactly what happened.

### 2. Time Travel Debugging
When a customer reports "something broke after the March upgrade", we can replay events to see exactly what changed.

### 3. Analytics & Reporting
Historical data is perfect for:
- "How long does radio installation typically take?"
- "Which technicians have the lowest rework rate?"
- "What are common inspection failures?"

### 4. Offline Sync Compatibility
Events are naturally append-only, making sync conflicts easier to handle.

### 5. System Evolution
When requirements change, old data doesn't need migration. We just create new projections from existing events.

## Consequences

### Positive
- Complete historical accuracy
- Forensic investigation capability
- Natural audit logging
- Easy debugging
- Schema evolution without migration

### Negative
- Storage grows continuously (mitigated by archival)
- Query complexity (projections required)
- Learning curve for developers
- Eventual consistency (projections lag slightly)

## Alternatives Considered

### 1. Traditional CRUD + Audit Logging
**Rejected:** Audit logs are often afterthoughts, incomplete, or inconsistent

### 2. Database Triggers for History
**Rejected:** Tightly couples history to database, doesn't capture intent

### 3. Change Data Capture (CDC)
**Rejected:** Captures database changes, not business events

## Storage Management

**Event Retention:**
- Hot storage: Last 2 years (PostgreSQL)
- Warm storage: 2-7 years (Compressed PostgreSQL)
- Cold storage: 7+ years (S3 Glacier)

**Projection Retention:**
- Materialized views can be dropped and rebuilt from events
- Only events are required for data recovery

## References

- [Event Sourcing - Martin Fowler](https://martinfowler.com/eaaDev/EventSourcing.html)
- [CQRS Journey - Microsoft](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10))
- [Event Sourcing Patterns - Greg Young](https://www.youtube.com/watch?v=JHGkaShoyNs)

## Review Date

2027-02-02 (6 months) - Evaluate event store size and projection performance

---

**Event sourcing provides the immutable audit trail that telecommunications construction demands.**
