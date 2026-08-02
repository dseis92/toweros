# ADR 003: React Native + Expo for Mobile Applications

**Status:** Accepted
**Date:** 2026-08-02
**Decision Makers:** Architecture Team
**Context:** TowerOS Foundation Design

---

## Context

TowerOS mobile apps are the primary interface for field technicians. These apps must:

- Work on both iOS (iPhones/iPads) and Android devices
- Function perfectly offline
- Access device hardware (camera, GPS, accelerometer)
- Provide native performance and feel
- Support rapid iteration and updates
- Enable code sharing with web dashboard
- Be maintainable by a small team

The mobile experience is not secondary—it's the core product.

## Decision

We will build TowerOS mobile applications using **React Native with Expo**.

### Technology Stack

**Framework:** React Native 0.74+
**Toolchain:** Expo SDK 51+
**Language:** TypeScript (strict mode)
**Navigation:** React Navigation 6
**State:** Zustand + TanStack Query
**Database:** WatermelonDB (SQLite)
**Styling:** NativeWind (Tailwind for RN)
**Testing:** Jest + Detox

## Rationale

### React Native

**Pros:**
- Single codebase for iOS and Android
- JavaScript/TypeScript familiarity
- Large ecosystem of libraries
- Native performance via native modules
- Hot reloading for fast development
- Excellent documentation and community
- Proven at scale (Facebook, Microsoft, Shopify, Discord)

**Cons:**
- Not truly "native" (mitigated by Expo's native modules)
- Occasional platform-specific bugs
- Bridge overhead (mitigated by new architecture)
- Requires some native knowledge for custom modules

### Why React Native Over Native?

**Native iOS (Swift) + Native Android (Kotlin):**
- Pro: Maximum performance and platform integration
- Con: Two completely separate codebases
- Con: 2x development time
- Con: 2x maintenance burden
- Con: Harder to share code with web dashboard
- Con: Requires iOS and Android specialists

**Verdict:** For a small team building an MVP, native development is too slow. React Native provides 90% of native performance with 50% of the effort.

### Why React Native Over Flutter?

**Flutter:**
- Pro: Excellent performance
- Pro: Beautiful UI framework
- Pro: Single codebase
- Con: Dart language (separate from web TypeScript)
- Con: Smaller ecosystem than React Native
- Con: Cannot share code with React web dashboard
- Con: Less mature offline-first libraries

**Verdict:** React Native wins due to TypeScript/React ecosystem alignment and code sharing with web.

### Why Expo?

**Expo Managed Workflow:**
- Over-the-air (OTA) updates without app store review
- Simplified build process (EAS Build)
- Pre-built native modules for common features
- Excellent developer experience
- Easy environment management
- Simplified deployment

**Expo Cons (Addressed):**
- Used to restrict native modules (no longer true with Expo Dev Client)
- Larger bundle size (acceptable tradeoff for DX)
- Abstraction layer (worth it for ease of use)

**Custom Native Modules:**
If we need custom native code, Expo supports:
1. Expo Dev Client (custom native modules in managed workflow)
2. Prebuild (generate native projects when needed)
3. Expo Modules API (write native modules in Swift/Kotlin)

**Verdict:** Expo provides excellent DX without sacrificing flexibility.

## Architecture

### App Structure

```
apps/mobile/
├── src/
│   ├── app/                    # Expo Router (file-based routing)
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── (tabs)/             # Main app (tab navigation)
│   │   │   ├── sites/
│   │   │   │   ├── index.tsx   # Sites list
│   │   │   │   └── [id].tsx    # Site detail
│   │   │   ├── work-orders/
│   │   │   ├── profile/
│   │   │   └── _layout.tsx
│   │   ├── site/
│   │   │   └── [id]/
│   │   │       ├── index.tsx   # Site overview
│   │   │       ├── equipment.tsx
│   │   │       ├── timeline.tsx
│   │   │       └── inspection.tsx
│   │   └── _layout.tsx
│   ├── components/             # UI components
│   │   ├── ui/                 # Design system primitives
│   │   ├── site/               # Site-specific components
│   │   ├── equipment/
│   │   └── forms/
│   ├── services/               # Business logic
│   │   ├── database/           # WatermelonDB schema & models
│   │   ├── sync/               # Sync engine
│   │   ├── api/                # API client
│   │   └── auth/
│   ├── hooks/                  # React hooks
│   ├── stores/                 # Zustand stores
│   ├── utils/                  # Utilities
│   └── constants/              # Constants
├── assets/                     # Images, fonts
├── app.json                    # Expo config
├── eas.json                    # EAS Build config
└── package.json
```

### Navigation Strategy

**Expo Router** (File-based routing):
- File system defines routes (like Next.js)
- Deep linking built-in
- Type-safe navigation
- Excellent DX

```typescript
// Navigate to site detail
router.push(`/site/${siteId}`)

// Type-safe params
import { useLocalSearchParams } from 'expo-router'
const { id } = useLocalSearchParams<{ id: string }>()
```

### State Management

**Local State:** React useState/useReducer
**Server State:** TanStack Query (React Query)
**Global State:** Zustand
**Database State:** WatermelonDB observables

```typescript
// Example: Site detail with offline support
import { useObservable } from '@nozbe/watermelondb/react'
import { useSite } from '@/hooks/useSite'

function SiteDetail({ siteId }: Props) {
  // Local database (observable, updates automatically)
  const site = useObservable(siteCollection.findAndObserve(siteId))

  // Server state (auto-syncs when online)
  const { data: serverSite, isLoading } = useSite(siteId)

  // Local state always renders (offline-first)
  // Server state syncs in background
  return <SiteView site={site || serverSite} />
}
```

### Offline Database: WatermelonDB

**Why WatermelonDB:**
- Built specifically for React Native
- Lazy loading (handles 10,000+ records)
- Observable queries (updates automatically)
- Multi-threaded (doesn't block UI)
- Excellent sync support
- SQLite under the hood

**Schema Example:**
```typescript
// Site model
@model('sites')
class Site extends Model {
  static table = 'sites'
  static associations = {
    equipment: { type: 'has_many', foreignKey: 'site_id' },
    work_orders: { type: 'has_many', foreignKey: 'site_id' }
  }

  @field('name') name!: string
  @field('address') address!: string
  @field('latitude') latitude!: number
  @field('longitude') longitude!: number
  @field('status') status!: string
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date
  @json('metadata', sanitizeMetadata) metadata!: SiteMetadata

  @children('equipment') equipment!: Query<Equipment>
  @children('work_orders') workOrders!: Query<WorkOrder>
}
```

**Query Example:**
```typescript
// Observable query (updates UI automatically)
const activeSites = database.collections
  .get<Site>('sites')
  .query(Q.where('status', 'ACTIVE'))
  .observe()

// In component
const sites = useObservable(activeSites)
```

### Styling: NativeWind

**Why NativeWind:**
- Tailwind CSS for React Native
- Consistent styling with web dashboard
- Responsive design utilities
- Dark mode support
- TypeScript autocomplete

```typescript
import { View, Text } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)

function SiteCard({ site }) {
  return (
    <StyledView className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <StyledText className="text-lg font-bold text-gray-900 dark:text-white">
        {site.name}
      </StyledText>
      <StyledText className="text-sm text-gray-600 dark:text-gray-400">
        {site.address}
      </StyledText>
    </StyledView>
  )
}
```

### Hardware Access

**Camera:**
```typescript
import { CameraView, useCameraPermissions } from 'expo-camera'

function EquipmentPhotoCapture() {
  const [permission, requestPermission] = useCameraPermissions()

  return (
    <CameraView
      style={{ flex: 1 }}
      onBarCodeScanned={handleBarCodeScanned}
    >
      <Button onPress={takePicture} />
    </CameraView>
  )
}
```

**GPS:**
```typescript
import * as Location from 'expo-location'

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') return

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  })

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy
  }
}
```

**Barcode/QR Scanner:**
```typescript
import { BarCodeScanner } from 'expo-barcode-scanner'

function EquipmentScanner() {
  const handleBarCodeScanned = ({ type, data }) => {
    // data = equipment serial number
    lookupEquipment(data)
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  )
}
```

## Offline-First Implementation

### Sync Flow

```typescript
// 1. User installs radio (offline)
await database.write(async () => {
  await equipmentCollection.create(equipment => {
    equipment.siteId = siteId
    equipment.model = 'AIR 6449'
    equipment.serialNumber = 'ABC123'
    equipment._raw._status = 'created' // Mark as unsynced
  })
})

// 2. Create sync event
await createSyncEvent({
  type: 'EQUIPMENT_CREATED',
  localId: equipment.id,
  payload: equipment._raw
})

// 3. Background sync (when online)
syncEngine.on('connected', async () => {
  const pendingEvents = await getPendingSyncEvents()

  for (const event of pendingEvents) {
    try {
      const response = await api.sync.push(event)
      await markEventSynced(event.id, response.serverId)
    } catch (error) {
      await markEventFailed(event.id, error)
    }
  }
})
```

## Performance Optimization

### 1. Image Optimization
```typescript
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

async function optimizePhoto(uri: string) {
  // Create thumbnail
  const thumbnail = await manipulateAsync(
    uri,
    [{ resize: { width: 400 } }],
    { compress: 0.7, format: SaveFormat.JPEG }
  )

  // Full-res for upload
  const fullRes = await manipulateAsync(
    uri,
    [],
    { compress: 0.8, format: SaveFormat.JPEG }
  )

  return { thumbnail, fullRes }
}
```

### 2. List Virtualization
```typescript
import { FlashList } from '@shopify/flash-list'

function SitesList({ sites }) {
  return (
    <FlashList
      data={sites}
      renderItem={({ item }) => <SiteCard site={item} />}
      estimatedItemSize={100}
      // Automatically virtualizes, much faster than FlatList
    />
  )
}
```

### 3. Lazy Loading
```typescript
// Only load site details when viewed
const siteDetails = useObservable(
  site.observe().pipe(
    switchMap(s => s.equipment.observe())
  )
)
```

## Deployment Strategy

### Development
```bash
# Local development
npx expo start

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android
```

### Staging/Production
```bash
# Build with EAS
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android

# OTA updates (no app store review needed)
eas update --branch production --message "Fix sync bug"
```

### Environment Management
```typescript
// app.config.ts
export default {
  expo: {
    name: process.env.APP_ENV === 'production' ? 'TowerOS' : 'TowerOS Dev',
    extra: {
      apiUrl: process.env.API_URL,
      environment: process.env.APP_ENV
    }
  }
}
```

## Testing Strategy

**Unit Tests:** Jest
```typescript
describe('Equipment sync', () => {
  it('creates sync event when equipment installed', async () => {
    const equipment = await createEquipment({ serialNumber: 'ABC123' })
    const events = await getSyncEvents()

    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('EQUIPMENT_CREATED')
  })
})
```

**Integration Tests:** Detox
```typescript
describe('Site workflow', () => {
  it('should install radio and sync', async () => {
    await element(by.id('sites-tab')).tap()
    await element(by.id('site-123')).tap()
    await element(by.id('add-equipment-btn')).tap()
    await element(by.id('scan-serial')).tap()
    // ... simulate barcode scan
    await element(by.id('save-equipment')).tap()
    await expect(element(by.text('Equipment saved'))).toBeVisible()
  })
})
```

## Consequences

### Positive
- Single codebase for iOS/Android (50% time savings)
- Code sharing with web (shared types, validation, business logic)
- Fast iteration (hot reload, OTA updates)
- Great developer experience
- Large ecosystem and community
- Offline-first libraries (WatermelonDB)

### Negative
- Not 100% native performance (acceptable for our use case)
- Occasional platform-specific bugs
- Bundle size larger than native
- Requires occasional native debugging

## Alternatives Considered

### 1. Native iOS + Native Android
**Rejected:** Too slow for small team, no code sharing

### 2. Flutter
**Rejected:** Different language than web, smaller ecosystem

### 3. Progressive Web App (PWA)
**Rejected:** Limited offline capabilities, no native hardware access, worse UX

### 4. Ionic/Capacitor
**Rejected:** WebView-based (worse performance), not truly native feel

## References

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [WatermelonDB Documentation](https://watermelondb.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)

## Review Date

2027-08-02 (1 year) - Evaluate performance and consider native modules extraction

---

**React Native + Expo provides the optimal balance of development speed, performance, and code sharing for TowerOS mobile apps.**
