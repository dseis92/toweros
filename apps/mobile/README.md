# TowerOS Mobile

React Native mobile app for field technicians.

## Features

- **Offline-First** - Works without network connectivity
- **Authentication** - Secure login with biometric support
- **Site Management** - Browse and search sites
- **Work Orders** - View and manage assigned work
- **Photo Capture** - Document equipment with GPS tagging
- **Real-Time Sync** - Automatic background synchronization
- **Field-Optimized** - 48px touch targets, high contrast, glove-friendly

## Tech Stack

- **Framework:** React Native 0.73 + Expo SDK 50
- **Navigation:** Expo Router (file-based routing)
- **State:** Zustand (global state)
- **API:** Axios with auto-refresh
- **Storage:** Expo SecureStore (encrypted)
- **UI:** @tower/ui/native components
- **TypeScript:** Full type safety

## Quick Start

### 1. Install Dependencies

```bash
cd apps/mobile
pnpm install
```

### 2. Configure Environment

Create `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL || 'http://localhost:3000/api/v1',
    },
  },
};
```

### 3. Run Development Server

```bash
# Start Expo dev server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on physical device (scan QR code)
pnpm start
```

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth flow
│   │   ├── login.tsx      # Login screen
│   │   └── _layout.tsx    # Auth layout
│   ├── (tabs)/            # Main app
│   │   ├── index.tsx      # Home screen
│   │   ├── sites.tsx      # Sites list
│   │   ├── work-orders.tsx # Work orders
│   │   ├── profile.tsx    # User profile
│   │   └── _layout.tsx    # Tab navigation
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── store/
│   │   └── auth.tsx       # Auth state (Zustand)
│   └── lib/
│       └── api-client.ts  # Axios instance
├── assets/                # Images, fonts
├── app.json              # Expo config
├── package.json
└── tsconfig.json
```

## Authentication Flow

### Login

```typescript
import { useAuth } from '@/store/auth';

function LoginScreen() {
  const login = useAuth((state) => state.login);

  const handleLogin = async () => {
    await login(email, password);
    // Redirect to (tabs) on success
  };
}
```

The auth store:
1. Calls `POST /api/v1/auth/login`
2. Stores refresh token in SecureStore (encrypted)
3. Stores access token in memory (Zustand state)
4. Stores user data in SecureStore

### Auto-Refresh

API client automatically refreshes access token on 401:

```typescript
// In api-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return retryRequest();
    }
  }
);
```

### Logout

```typescript
const logout = useAuth((state) => state.logout);

await logout();
// Clears SecureStore and redirects to login
```

## API Integration

### Making Requests

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const response = await apiClient.get('/sites');
const sites = response.data.sites;

// POST request
const response = await apiClient.post('/sites', {
  name: 'North Tower Alpha',
  carrier: 'ATT',
  latitude: 37.7749,
  longitude: -122.4194,
});

// Access token automatically added to headers
// Refresh automatically handled on 401
```

### Error Handling

```typescript
try {
  const response = await apiClient.get('/sites');
} catch (error) {
  if (error.response?.status === 403) {
    // Insufficient permissions
  } else if (error.response?.status === 404) {
    // Not found
  } else {
    // Network or other error
  }
}
```

## Navigation

### File-Based Routing (Expo Router)

```
app/
├── (auth)/
│   └── login.tsx          → /(auth)/login
├── (tabs)/
│   ├── index.tsx          → /(tabs)/  (Home)
│   ├── sites.tsx          → /(tabs)/sites
│   └── work-orders.tsx    → /(tabs)/work-orders
└── sites/
    └── [id].tsx           → /sites/:id
```

### Programmatic Navigation

```typescript
import { router } from 'expo-router';

// Navigate to site detail
router.push(`/sites/${siteId}`);

// Replace (no back button)
router.replace('/(auth)/login');

// Go back
router.back();
```

### Protected Routes

```typescript
// (tabs)/_layout.tsx
export default function TabsLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Tabs>...</Tabs>;
}
```

## Offline Support

### Current Status

The app uses SecureStore for:
- Refresh tokens (encrypted)
- User data (encrypted)
- Device ID (encrypted)

### Future Offline Features

1. **Local Database** - SQLite with WatermelonDB
2. **Offline Queue** - Queue mutations while offline
3. **Background Sync** - Sync when network returns
4. **Conflict Resolution** - Vector clocks for merge

## UI Components

All components from `@tower/ui/native`:

```typescript
import { Button, Input, Card, Badge, Spinner } from '@tower/ui/native';

<Button variant="primary" size="lg" fullWidth>
  Install Equipment
</Button>

<Input
  label="Site Name"
  value={name}
  onChangeText={setName}
  required
/>

<Card variant="interactive" onPress={handlePress}>
  <Text>North Tower Alpha</Text>
  <Badge variant="success">In Service</Badge>
</Card>
```

## Camera & Photos

### Permissions

Configured in `app.json`:
- Camera
- Photo Library
- Location (GPS tagging)

### Usage (Future)

```typescript
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Capture photo
const photo = await camera.takePictureAsync();

// Pick from library
const result = await ImagePicker.launchImageLibraryAsync();

// Upload to API
const formData = new FormData();
formData.append('photo', {
  uri: photo.uri,
  type: 'image/jpeg',
  name: 'equipment.jpg',
});

await apiClient.post('/photos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

## Performance

### Optimization

- **Lazy Loading** - Routes loaded on demand
- **Image Optimization** - expo-image for caching
- **List Virtualization** - FlatList for large lists
- **Memoization** - React.memo for expensive components

### Monitoring

```typescript
// Log render times
import { useEffect } from 'react';

useEffect(() => {
  const start = Date.now();
  return () => {
    console.log(`Screen mounted for ${Date.now() - start}ms`);
  };
}, []);
```

## Testing

### Development

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Run on device
pnpm ios
pnpm android
```

### Production Build

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Deployment

### EAS Build

1. Install EAS CLI
```bash
npm install -g eas-cli
```

2. Login
```bash
eas login
```

3. Configure
```bash
eas build:configure
```

4. Build
```bash
# Development build
eas build --profile development --platform all

# Production build
eas build --profile production --platform all
```

### Over-the-Air (OTA) Updates

```bash
# Publish update
eas update --branch production --message "Fix sync bug"
```

## Environment Variables

```javascript
// app.config.js
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL,
      sentryDsn: process.env.SENTRY_DSN,
    },
  },
};
```

Access in code:
```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

## Troubleshooting

### "Expo not found"
```bash
pnpm add -g expo-cli
```

### "Metro bundler failed"
```bash
# Clear cache
pnpm start -c
```

### "SecureStore is null"
```bash
# Rebuild app
pnpm ios --device
```

### "Network request failed"
```bash
# Check API URL in app.config.js
# Ensure API server is running
# Check device/simulator network
```

## License

Private - TowerOS Internal Use Only
