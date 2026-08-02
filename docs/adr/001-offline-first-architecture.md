# ADR 001: Offline-First Architecture

**Status:** Accepted
**Date:** 2026-08-02
**Decision Makers:** Architecture Team
**Context:** TowerOS Foundation Design

---

## Context

Telecommunications construction technicians work in environments with unreliable or nonexistent network connectivity:

- On tower structures 50-500 feet above ground
- In remote rural locations
- Inside equipment shelters with poor signal
- In RF-shielded environments
- During network outages at the site being constructed

The application must function perfectly in these conditions. Work cannot stop due to connectivity issues.

## Decision

We will architect TowerOS as an **offline-first** system where:

1. All data is stored locally on the device first
2. All operations work without network connectivity
3. Synchronization happens in the background when connectivity is available
4. Conflicts are resolved automatically using CRDTs and vector clocks
5. The user never thinks about "online" vs "offline" modes

## Consequences

### Positive

- **Work continuity:** Technicians can work anywhere without disruption
- **Performance:** All reads/writes are instant (local database)
- **Reliability:** No dependency on network conditions
- **User trust:** The app always works when needed
- **Battery efficiency:** No constant network polling

### Negative

- **Complexity:** Sync engine is significantly more complex than traditional client-server
- **Conflict resolution:** Must handle concurrent edits from multiple devices
- **Storage:** Devices must store more local data
- **Testing:** Must test sync scenarios extensively
- **Initial development:** Slower to build than online-only approach

## Technical Implementation

### Local Storage

**Mobile:** WatermelonDB (SQLite wrapper)
- Observ able queries
- Lazy loading for performance
- Built-in sync primitives
- React Native optimized

**Web:** IndexedDB via Dexie.js
- Structured storage
- Observable queries
- Transaction support
- Good Safari/Chrome support

### Synchronization Strategy

**Event-based sync:**
```typescript
// Local change creates event
{
  id: "evt_abc123",
  type: "RADIO_INSTALLED",
  aggregateId: "radio_xyz",
  payload: { serialNumber: "ABC-123", ... },
  timestamp: 1722604800000,
  deviceId: "device_123",
  userId: "user_456",
  vectorClock: { device_123: 42, device_456: 15 }
}
```

Events are:
1. Written to local event log immediately
2. Queued for background sync
3. Sent to server when connected
4. Merged using vector clocks
5. Broadcast to other devices

### Conflict Resolution

**Strategy:** Last-write-wins with vector clocks

```typescript
// Device A (offline): Updates radio serial at 10:00 AM
{
  vectorClock: { deviceA: 10 },
  payload: { serialNumber: "OLD-123" }
}

// Device B (offline): Updates same radio at 10:05 AM
{
  vectorClock: { deviceB: 5 },
  payload: { serialNumber: "NEW-456" }
}

// Both sync later:
// Server detects concurrent modification
// Compares vector clocks (no causal relationship)
// Uses timestamp as tiebreaker
// Device B wins (10:05 > 10:00)
// Server broadcasts resolution to Device A
```

**Immutable audit trail:**
Both events are preserved in the event log. The projection uses the winning event, but history shows both modifications occurred.

### Data Validation

**Optimistic validation:**
- Client validates business rules immediately
- Provides instant feedback to user
- Server re-validates on sync
- If server rejects, client shows conflict resolution UI

**Example:**
```typescript
// Client-side validation
if (!radio.serialNumber) {
  throw new ValidationError("Serial number required")
}

// Server-side validation (same rules)
if (!radio.serialNumber) {
  return {
    status: "rejected",
    reason: "Serial number required"
  }
}
```

### Sync States

The app recognizes these states:

1. **Fully synced:** All local changes sent, all remote changes received
2. **Pending sync:** Local changes waiting to be sent
3. **Syncing:** Active upload/download
4. **Conflict:** User resolution required (rare)
5. **Sync error:** Server rejected change (validation failure)

**User communication:**
- Subtle indicator shows sync state
- User is never blocked by sync
- Conflicts are resolved in background when possible
- Only critical conflicts require user input

### Storage Quotas

**Mobile:**
- Expect 50-200MB per site (photos are thumbnailed locally, full-res on server)
- Support 100+ sites locally
- Automatic cleanup of old cached data

**Web:**
- IndexedDB quota ~50MB minimum
- Cache most recent 10 sites fully
- Stream data for older sites

## Alternatives Considered

### 1. Online-Only Architecture
**Rejected:** Fundamentally incompatible with field work environments

### 2. Cached Online (Network-First)
**Rejected:** Breaks when connectivity drops mid-operation

### 3. Manual Sync (User Clicks "Sync")
**Rejected:** Puts burden on user, leads to data loss

### 4. Operational Transform (Google Docs style)
**Rejected:** More complex than needed; telecom data is less collaborative than document editing

## References

- [Local-First Software](https://www.inkandswitch.com/local-first/)
- [WatermelonDB Sync Documentation](https://watermelondb.dev/docs/Sync/Intro)
- [CRDTs and the Quest for Distributed Consistency](https://www.youtube.com/watch?v=B5NULPSiOGw)
- [Event Sourcing Pattern](https://martinfowler.com/eaaDev/EventSourcing.html)

## Review Date

2027-02-02 (6 months) - Evaluate sync performance and conflict resolution effectiveness

---

**This decision is foundational to TowerOS and should only be revisited if field conditions fundamentally change.**
