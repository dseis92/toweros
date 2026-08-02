# TowerOS Wireframes & User Flows

**Version:** 1.0
**Last Updated:** 2026-08-02

---

## Overview

This document outlines the complete user interface design for TowerOS, with detailed wireframes for both mobile (primary) and web (secondary) applications.

### Design Priorities

1. **Mobile First** - Field technicians are the primary users
2. **Offline Capable** - All workflows must work without network
3. **One-Handed Operation** - Designed for use while wearing gloves
4. **Minimal Text Input** - Scanning, photos, and selection over typing
5. **Fast** - Maximum 3 taps to any common action
6. **Professional** - Clean, modern, trustworthy

### User Personas

#### Primary: Field Technician (Mike)
- 28 years old, 5 years tower climbing experience
- Uses iPhone 15 Pro with gloves
- Works 60% of day on tower (no signal)
- Needs: Fast equipment logging, photo capture, task tracking

#### Secondary: Project Manager (Sarah)
- 35 years old, 10 years telecom construction
- Uses MacBook Pro in office + iPad in field
- Manages 15-20 active sites simultaneously
- Needs: Real-time visibility, reporting, crew coordination

#### Tertiary: Carrier Inspector (David)
- 45 years old, AT&T network engineer
- Uses iPad for site inspections
- Read-only access to contractor work
- Needs: Closeout documentation, test results, photos

---

## Core Workflows

### Mobile Application

1. **Authentication & Onboarding**
2. **Site List & Selection**
3. **Work Order Management**
4. **Equipment Installation**
5. **Photo Capture & Documentation**
6. **Testing & Inspection**
7. **Offline Sync**

### Web Dashboard

1. **Dashboard Overview**
2. **Site Management**
3. **Crew Coordination**
4. **Analytics & Reporting**
5. **Equipment Inventory**
6. **Document Management**

---

## Mobile Wireframes

### 1. Authentication Flow

```
┌─────────────────────┐
│   Login Screen      │
├─────────────────────┤
│                     │
│   [TowerOS Logo]    │
│                     │
│  ┌───────────────┐  │
│  │ Email         │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ Password      │  │
│  └───────────────┘  │
│                     │
│  [ Forgot Password ]│
│                     │
│  ┌───────────────┐  │
│  │   LOG IN      │  │ ← Large button
│  └───────────────┘  │
│                     │
│  Don't have account?│
│     [Sign Up]       │
│                     │
└─────────────────────┘

After login → Biometric setup (Face ID / Touch ID)
```

**Design Notes:**
- Large touch targets (60px height minimum)
- Password manager integration
- "Remember this device" checkbox
- Offline login with cached credentials

---

### 2. Home Screen (Dashboard)

```
┌─────────────────────────────┐
│ ☰  TowerOS        👤 Mike   │ ← Header
├─────────────────────────────┤
│                             │
│ 📍 Current Location         │
│ San Francisco, CA           │
│ 🌤️ 72°F • Clear • 5mph     │ ← Weather
│                             │
├─────────────────────────────┤
│ TODAY'S WORK                │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ WO-2026-001234          │ │
│ │ North Tower Alpha       │ │
│ │ Install 5G NR Equipment │ │
│ │                         │ │
│ │ ▓▓▓▓▓▓▓▓░░░░ 65%       │ │ ← Progress
│ │ 13/20 tasks complete    │ │
│ │                         │ │
│ │ [CONTINUE WORK →]       │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ QUICK ACTIONS               │
├─────────────────────────────┤
│                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 📷   │ │ 📝   │ │ 📊   │ │
│ │Photo │ │ Add  │ │Tests │ │
│ │      │ │Equip │ │      │ │
│ └──────┘ └──────┘ └──────┘ │
│                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 📍   │ │ ⚡   │ │ 🔍   │ │
│ │Sites │ │Sync  │ │Search│ │
│ │      │ │      │ │      │ │
│ └──────┘ └──────┘ └──────┘ │
│                             │
└─────────────────────────────┘
│ [Sites] [Work] [Profile]   │ ← Bottom tabs
└─────────────────────────────┘
```

**Design Notes:**
- Current work order always visible
- Weather alerts prominent (critical for safety)
- Quick actions for common tasks
- GPS-based location detection
- Offline indicator when no signal

---

### 3. Site Detail Screen

```
┌─────────────────────────────┐
│ ← Back    North Tower Alpha │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │  [Site Photo - Hero]     │ │
│ │                          │ │
│ └─────────────────────────┘ │
│                             │
│ 📍 123 Tower Rd             │
│    San Francisco, CA 94102  │
│                             │
│ 📡 AT&T • Monopole • 150'   │
│ 🟢 Status: Active           │
│                             │
├─────────────────────────────┤
│ TABS                        │
├─────────────────────────────┤
│ [Overview] Equipment Photos │
│                             │
│ ▼ SECTORS (3)               │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔴 Alpha Sector         │ │
│ │ Azimuth: 45° • 140' AGL │ │
│ │                         │ │
│ │ • Antenna: AIR 6449     │ │
│ │ • Radio: RRU 5G         │ │
│ │ • Status: In Service    │ │
│ │                         │ │
│ │ [View Details →]        │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔵 Beta Sector          │ │
│ │ Azimuth: 165° • 140' AGL│ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🟢 Gamma Sector         │ │
│ │ Azimuth: 285° • 140' AGL│ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ ACTIVE WORK ORDERS (2)      │
├─────────────────────────────┤
│ WO-2026-001234              │
│ 5G Modernization • 65%      │
│                             │
│ WO-2026-001189              │
│ Fiber Upgrade • 90%         │
│                             │
└─────────────────────────────┘
```

**Design Notes:**
- Hero image shows site at a glance
- Key info above the fold
- Sectored organization (how techs think)
- Quick access to active work
- Swipe between tabs (Overview, Equipment, Photos, Timeline)

---

### 4. Equipment Installation Flow

```
STEP 1: Scan Equipment
┌─────────────────────────────┐
│ ← Cancel  Install Equipment │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │   CAMERA VIEWFINDER     │ │
│ │                         │ │
│ │   [Scanning for         │ │
│ │    barcode/QR code...]  │ │
│ │                         │ │
│ │   ┌───────────────┐     │ │
│ │   │  Scan Frame   │     │ │
│ │   └───────────────┘     │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ Point camera at equipment   │
│ barcode or QR code          │
│                             │
│ [Enter Manually Instead]    │
│                             │
└─────────────────────────────┘

↓ After scan

STEP 2: Verify Equipment
┌─────────────────────────────┐
│ ← Back    Verify Equipment  │
├─────────────────────────────┤
│                             │
│ ✅ Equipment Identified     │
│                             │
│ Manufacturer: Ericsson      │
│ Model: AIR 6449             │
│ Serial: ABC-123-XYZ         │
│                             │
│ Equipment Type:             │
│ ┌─────────────────────────┐ │
│ │ Radio RRU            ▼  │ │ ← Dropdown
│ └─────────────────────────┘ │
│                             │
│ Install Location:           │
│ ┌─────────────────────────┐ │
│ │ Sector Alpha         ▼  │ │
│ └─────────────────────────┘ │
│                             │
│ Mount Height:               │
│ ┌─────────────────────────┐ │
│ │ 140' AGL                │ │
│ └─────────────────────────┘ │
│                             │
│ [CONTINUE →]                │
│                             │
└─────────────────────────────┘

↓

STEP 3: Take Photos
┌─────────────────────────────┐
│ ← Back    Equipment Photos  │
├─────────────────────────────┤
│                             │
│ Take photos of installation │
│                             │
│ ☑ Before Installation       │
│ ┌─────────────────────────┐ │
│ │   [Photo thumbnail]     │ │
│ │                         │ │
│ └─────────────────────────┘ │
│ [Retake]                    │
│                             │
│ ☑ Equipment Label           │
│ ┌─────────────────────────┐ │
│ │   [Photo thumbnail]     │ │
│ └─────────────────────────┘ │
│ [Retake]                    │
│                             │
│ ☐ After Installation        │
│ [TAKE PHOTO]                │
│                             │
│ ☐ Connection Closeup        │
│ [TAKE PHOTO]                │
│                             │
│ [CONTINUE →]                │
│                             │
└─────────────────────────────┘

↓

STEP 4: Checklist
┌─────────────────────────────┐
│ ← Back    Installation      │
├─────────────────────────────┤
│                             │
│ Installation Checklist      │
│                             │
│ ☑ Verify torque specs       │
│ ☑ Check grounding           │
│ ☑ Dress cables properly     │
│ ☐ Verify fiber connections  │
│ ☐ Test power continuity     │
│ ☐ Label equipment           │
│                             │
│ Notes (optional):           │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ [MARK COMPLETE]             │
│                             │
└─────────────────────────────┘

↓

STEP 5: Confirmation
┌─────────────────────────────┐
│     Equipment Installed!    │
├─────────────────────────────┤
│                             │
│         ✅                  │
│                             │
│ Radio RRU successfully      │
│ installed on Sector Alpha   │
│                             │
│ Serial: ABC-123-XYZ         │
│ Time: 2:45 PM               │
│                             │
│ 4 photos captured           │
│ All checklist items ✓       │
│                             │
│ [VIEW EQUIPMENT]            │
│ [INSTALL ANOTHER]           │
│ [BACK TO WORK ORDER]        │
│                             │
└─────────────────────────────┘
```

**Design Notes:**
- Barcode scanning first (fastest)
- Auto-populate from scan
- Photos required (can't skip)
- Offline: Queued for sync
- GPS coordinates auto-captured
- Timestamp automatic

---

### 5. Work Order Task List

```
┌─────────────────────────────┐
│ ← Back  WO-2026-001234      │
│ North Tower Alpha           │
├─────────────────────────────┤
│                             │
│ ▓▓▓▓▓▓▓▓░░░░ 65%           │
│ 13 of 20 tasks complete     │
│                             │
├─────────────────────────────┤
│ TASKS                       │
├─────────────────────────────┤
│                             │
│ ✅ Safety Briefing          │
│    Completed 8:00 AM        │
│                             │
│ ✅ Site Survey              │
│    Completed 8:30 AM        │
│                             │
│ ✅ Material Staging         │
│    Completed 9:00 AM        │
│                             │
│ ▶ Install Alpha Antenna     │ ← In progress
│   Started 9:15 AM           │
│   Assigned to: Mike J.      │
│   [CONTINUE →]              │
│                             │
│ ⏸ Install Alpha Radio      │ ← Next
│   Equipment: AIR 6449       │
│   Est. 90 min               │
│   [START TASK]              │
│                             │
│ ⏸ Fiber Termination        │
│   12-strand SMF             │
│   [START TASK]              │
│                             │
│ ⏸ PIM Testing              │
│   All sectors               │
│   [START TASK]              │
│                             │
│ [+ ADD TASK]                │
│                             │
└─────────────────────────────┘
```

**Design Notes:**
- Visual progress bar
- Sequential workflow (unlock next task)
- Estimated time for planning
- Can add ad-hoc tasks
- Offline: Tasks saved locally

---

### 6. Photo Capture Screen

```
┌─────────────────────────────┐
│ [×]         CAMERA          │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │                         │ │
│ │   VIEWFINDER            │ │
│ │                         │ │
│ │                         │ │
│ │                         │ │
│ │         [O]             │ │ ← Shutter
│ │                         │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ [Grid] [HDR] [Flash]        │
│                             │
│ Category:                   │
│ Equipment Installed         │
│                             │
│ Location:                   │
│ Site: North Tower Alpha     │
│ Equipment: Radio RRU #123   │
│                             │
└─────────────────────────────┘

After capture:
┌─────────────────────────────┐
│ ← Retake      Photo Review  │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │   [Photo Preview]       │ │
│ │                         │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ Category:                   │
│ ┌─────────────────────────┐ │
│ │ Equipment Installed  ▼  │ │
│ └─────────────────────────┘ │
│                             │
│ Caption (optional):         │
│ ┌─────────────────────────┐ │
│ │ Alpha sector radio...   │ │
│ └─────────────────────────┘ │
│                             │
│ 📍 GPS: 37.7749, -122.4194  │
│ 📅 Aug 2, 2026 2:45 PM      │
│                             │
│ [SAVE PHOTO]                │
│                             │
└─────────────────────────────┘
```

**Design Notes:**
- Full screen viewfinder
- Auto-tag with location context
- GPS coordinates auto-captured
- Timestamp automatic
- Offline: Stored locally, synced later
- HDR for better tower shots
- Grid for alignment

---

### 7. Offline Sync Indicator

```
┌─────────────────────────────┐
│ ☰  TowerOS    👤 Mike   ⚡❌│ ← Offline indicator
├─────────────────────────────┤
│                             │
│ ⚡ OFFLINE MODE             │
│                             │
│ All changes saving locally  │
│                             │
│ Pending sync:               │
│ • 5 equipment installations │
│ • 12 photos                 │
│ • 3 task updates            │
│ • 1 test result             │
│                             │
│ Last synced: 8:30 AM        │
│                             │
│ Will sync automatically     │
│ when connection restored    │
│                             │
│ [VIEW DETAILS]              │
│                             │
└─────────────────────────────┘

When back online:
┌─────────────────────────────┐
│ ☰  TowerOS    👤 Mike   ⚡✅│ ← Syncing
├─────────────────────────────┤
│                             │
│ ⚡ SYNCING...               │
│                             │
│ ▓▓▓▓▓▓▓▓░░░░ 73%           │
│                             │
│ Synced: 15 of 21 items      │
│                             │
│ ✅ Equipment installations  │
│ ✅ Photos (8/12 uploaded)   │
│ ⏳ Task updates (pending)   │
│                             │
└─────────────────────────────┘

Sync complete:
┌─────────────────────────────┐
│       Sync Complete! ✅     │
├─────────────────────────────┤
│                             │
│ All changes synced          │
│                             │
│ • 5 equipment installations │
│ • 12 photos                 │
│ • 3 task updates            │
│ • 1 test result             │
│                             │
│ Updated at: 3:15 PM         │
│                             │
│ [DISMISS]                   │
│                             │
└─────────────────────────────┘
```

**Design Notes:**
- Clear offline indicator always visible
- Pending sync count
- Transparent background sync
- User never blocks on sync
- Conflicts shown if any (rare)

---

## Web Dashboard Wireframes

### 1. Dashboard Home

```
┌─────────────────────────────────────────────────────────────────┐
│ TowerOS    [Sites] [Work Orders] [Equipment] [Analytics]  👤   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Dashboard                                      Aug 2, 2026     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│ │ Active Sites│ │Work Orders  │ │ Crews       │ │Equipment  │ │
│ │             │ │             │ │             │ │           │ │
│ │     42      │ │     128     │ │     8       │ │   1,247   │ │
│ │  +3 today   │ │  12 urgent  │ │  6 active   │ │ +45 this  │ │
│ │             │ │             │ │             │ │   week    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ACTIVE WORK ORDERS                              [View All →]   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ WO-2026-001234  North Tower Alpha    5G Modernization    │  │
│ │ Crew Delta • Mike Johnson (Lead)                         │  │
│ │ ▓▓▓▓▓▓▓▓░░░░ 65% • 13/20 tasks • Due: Aug 15           │  │
│ │ [View] [Update Status]                                   │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ WO-2026-001235  South Tower Beta     Fiber Upgrade       │  │
│ │ Crew Alpha • Sarah Chen (Lead)                           │  │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓ 90% • 18/20 tasks • Due: Aug 10          │  │
│ │ [View] [Update Status]                                   │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ RECENT ACTIVITY                                 [View All →]   │
│                                                                 │
│ ⚡ Equipment installed: Radio RRU (Site: North Alpha)          │
│    Mike Johnson • 2:45 PM                                      │
│                                                                 │
│ ✅ Task completed: PIM Testing (WO-001234)                     │
│    Sarah Chen • 2:30 PM                                        │
│                                                                 │
│ 📷 12 photos uploaded (Site: South Beta)                       │
│    John Doe • 1:15 PM                                          │
│                                                                 │
│ 📊 Inspection completed: Final QA passed                       │
│    Inspector David • 11:30 AM                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Metrics at a glance
- Real-time activity feed (WebSocket)
- Quick actions on work orders
- Map view option (toggle)
- Responsive grid layout

---

### 2. Site Map View

```
┌─────────────────────────────────────────────────────────────────┐
│ TowerOS    [Sites] [Work Orders] [Equipment] [Analytics]  👤   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Sites                [List View] [Map View●]    🔍 Search...   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐                                                     │
│ │Filters ▼│                                                     │
│ └─────────┘                                                     │
│ ☐ Active                                                        │
│ ☐ Construction     ┌─────────────────────────────────────────┐ │
│ ☐ Planning         │                                         │ │
│                    │          [Interactive Map]              │ │
│ Carrier:           │                                         │ │
│ ☐ AT&T             │   📍 (North Tower Alpha)                │ │
│ ☐ Verizon          │       Active • 5G Modernization        │ │
│ ☐ T-Mobile         │                                         │ │
│                    │               📍 (South Beta)            │ │
│ Region:            │                   Fiber Upgrade         │ │
│ [All]           ▼  │                                         │ │
│                    │  📍 (East Gamma)                        │ │
│ [Apply Filters]    │      Planning                           │ │
│                    │                                         │ │
│                    │             📍                          │ │
│                    │           📍     📍                      │ │
│                    │                                         │ │
│                    └─────────────────────────────────────────┘ │
│                                                                 │
│                    Legend: 🟢 Active  🟡 Construction          │
│                            🔵 Planning  🔴 Issue                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Click site marker →

┌────────────────────────────┐
│ North Tower Alpha          │
├────────────────────────────┤
│ [Site Photo]               │
│                            │
│ Status: Active             │
│ AT&T • Monopole • 150'     │
│                            │
│ Active Work Orders: 2      │
│ Equipment: 24 items        │
│                            │
│ [View Details →]           │
│ [Get Directions]           │
└────────────────────────────┘
```

**Design Notes:**
- Interactive map (MapLibre)
- Cluster markers when zoomed out
- Click for quick info popup
- Filter sidebar
- Export to PDF/CSV

---

### 3. Equipment Detail Page

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Site            Equipment Detail                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐  Ericsson AIR 6449                             │
│ │             │  Radio RRU • Serial: ABC-123-XYZ               │
│ │  [Photo]    │  Status: In Service                            │
│ │             │                                                 │
│ └─────────────┘  Site: North Tower Alpha                       │
│                  Sector: Alpha (45°) • Mount: 140' AGL         │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ INSTALLATION                                                │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ Installed: March 20, 2026 at 2:45 PM                        │ │
│ │ Installed By: Mike Johnson (Crew Delta)                     │ │
│ │ Work Order: WO-2026-000845                                  │ │
│ │ Warranty: Until March 20, 2029 (36 months)                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ SPECIFICATIONS                                              │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ Frequency Bands: B2 (1900 MHz), B66 (AWS)                   │ │
│ │ Power Output: 60W                                           │ │
│ │ MIMO Config: 4x4                                            │ │
│ │ Firmware: v2.5.1                                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CONNECTIONS                                                 │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ → Antenna: Panel Array (via Hybrid Cable)                   │ │
│ │ → Fiber: 12-strand SMF (Ports 1-4)                          │ │
│ │ → Power: Breaker 1 (60A)                                    │ │
│ │ → RET: Motor #7                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ TEST RESULTS (4)                          [View All →]      │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ ✅ PIM Test - Passed • -110 dBm • March 20, 2026            │ │
│ │ ✅ VSWR Test - Passed • 1.2:1 • March 20, 2026              │ │
│ │ ✅ Fiber Loss - Passed • 0.3 dB • March 20, 2026            │ │
│ │ ✅ Power Test - Passed • 48V DC • March 20, 2026            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ PHOTOS (8)                                [View All →]      │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ [📷] [📷] [📷] [📷] [📷] [📷] [📷] [📷]                     │ │
│ │  Before Install Label Connections After...                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [Export Report] [Schedule Maintenance] [Remove Equipment]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Complete equipment history
- Connection graph visualization
- Timeline of all changes (event sourcing)
- Export to PDF for closeout
- Link to manuals/docs

---

## Design System Foundation

These wireframes follow a consistent design system:

### Typography
- **Headers:** 24-32px bold
- **Body:** 16-18px regular
- **Small:** 14px regular
- **Font:** San Francisco (iOS), Roboto (Android), Inter (Web)

### Colors (Field-Optimized)
- **Primary:** Blue (#0066CC) - Professional, trustworthy
- **Success:** Green (#00B050) - Passed tests, completed
- **Warning:** Orange (#FF9500) - Caution, attention needed
- **Danger:** Red (#FF3B30) - Failed tests, critical
- **Neutral:** Gray (#8E8E93) - Secondary info

### Spacing
- **Small:** 8px
- **Medium:** 16px
- **Large:** 24px
- **XL:** 32px

### Touch Targets
- **Minimum:** 48x48 dp (iOS) / px (Android)
- **Buttons:** 60px height minimum
- **List items:** 72px height minimum

### Iconography
- **Style:** Rounded, friendly
- **Size:** 24-32px standard
- **Source:** SF Symbols (iOS), Material Icons (Android)

---

## Next Steps

1. ✅ Wireframes complete
2. ⏳ Create high-fidelity mockups
3. ⏳ Design system specification
4. ⏳ Component library implementation
5. ⏳ Prototype interactive flows

---

**These wireframes provide the blueprint for building TowerOS with field technicians as the primary focus.**
