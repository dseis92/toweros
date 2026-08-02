# TowerOS Web Dashboard

Next.js web dashboard for project managers and office staff.

## Features

- **Dashboard Overview** - Key metrics, recent activity, quick actions
- **Site Management** - Browse, create, edit, delete cell sites
- **Work Order Management** - Assign and track field operations
- **Equipment Tracking** - View equipment across all sites
- **Team Management** - Manage users and permissions
- **Real-Time Updates** - Live sync with field technicians (planned)
- **Timeline View** - Event sourcing for complete audit trail (planned)
- **Analytics** - Reports and insights (planned)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **State:** Zustand (global state)
- **API:** Axios with auto-refresh
- **Styling:** Tailwind CSS + CSS custom properties
- **UI:** @tower/ui/web components
- **Icons:** Lucide React
- **Charts:** Recharts (planned)
- **WebSocket:** Socket.io (planned)
- **TypeScript:** Full type safety

## Quick Start

### 1. Install Dependencies

```bash
cd apps/web
pnpm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### 3. Run Development Server

```bash
# Start Next.js dev server
pnpm dev

# Server runs on http://localhost:3001
```

### 4. Build for Production

```bash
# Type check
pnpm type-check

# Build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Entry point (redirect)
│   │   ├── globals.css         # Global styles
│   │   ├── login/              # Login page
│   │   ├── dashboard/          # Dashboard page
│   │   ├── sites/              # Sites pages
│   │   │   ├── page.tsx        # Sites list
│   │   │   └── [id]/           # Site detail
│   │   ├── work-orders/        # Work order pages
│   │   ├── equipment/          # Equipment pages
│   │   ├── team/               # Team management
│   │   └── settings/           # Settings
│   ├── components/
│   │   ├── AuthProvider.tsx    # Auth initialization
│   │   └── DashboardLayout.tsx # Main app layout
│   ├── store/
│   │   └── auth.ts             # Auth state (Zustand)
│   └── lib/
│       └── api-client.ts       # Axios instance
├── public/                      # Static assets
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json
└── package.json
```

## Authentication Flow

### Login

```typescript
import { useAuthStore } from '@/store/auth';

function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    await login(email, password);
    // Redirect to dashboard on success
  };
}
```

The auth store:
1. Calls `POST /api/v1/auth/login`
2. Stores access token in cookie (15 minutes)
3. Refresh token stored in httpOnly cookie by API
4. Stores user data in Zustand state

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

### Protected Routes

```typescript
// components/DashboardLayout.tsx
export function DashboardLayout({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  return <div>{children}</div>;
}
```

### Logout

```typescript
const logout = useAuthStore((state) => state.logout);

await logout();
// Clears cookies and redirects to login
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
import { getErrorMessage, getErrorCode } from '@/lib/api-client';

try {
  const response = await apiClient.get('/sites');
} catch (error) {
  const message = getErrorMessage(error); // "Site not found"
  const code = getErrorCode(error); // "SITE_NOT_FOUND"

  if (code === 'INSUFFICIENT_PERMISSIONS') {
    // Handle permission error
  }
}
```

## Navigation

### File-Based Routing (App Router)

```
app/
├── page.tsx                    → /
├── login/
│   └── page.tsx                → /login
├── dashboard/
│   └── page.tsx                → /dashboard
├── sites/
│   ├── page.tsx                → /sites
│   ├── [id]/
│   │   └── page.tsx            → /sites/:id
│   └── new/
│       └── page.tsx            → /sites/new
└── work-orders/
    ├── page.tsx                → /work-orders
    └── [id]/
        └── page.tsx            → /work-orders/:id
```

### Programmatic Navigation

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navigate to site detail
router.push(`/sites/${siteId}`);

// Replace (no back button)
router.replace('/login');

// Go back
router.back();
```

## UI Components

All components from `@tower/ui/web`:

```typescript
import { Button, Input, Card, Badge, Spinner } from '@tower/ui/web';

<Button variant="primary" size="lg" fullWidth>
  Create Site
</Button>

<Input
  label="Site Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>

<Card variant="interactive" onClick={handleClick}>
  <h3>North Tower Alpha</h3>
  <Badge variant="success">In Service</Badge>
</Card>
```

## Styling

### Tailwind CSS

All pages use Tailwind for styling:

```typescript
<div className="flex items-center gap-4 p-6 bg-white rounded-base shadow-md">
  <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
</div>
```

### Design System Variables

CSS custom properties from design system:

```css
/* globals.css */
:root {
  --color-primary-500: #0066CC;
  --spacing-4: 16px;
  --text-base: 16px;
  --radius-base: 8px;
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
}
```

### Responsive Design

Mobile-first approach:

```typescript
<div className="
  flex flex-col gap-4        /* Mobile: stack vertically */
  md:flex-row md:items-center /* Tablet+: horizontal layout */
  lg:gap-6                   /* Desktop: larger gap */
">
  {/* Content */}
</div>
```

## State Management

### Auth State (Zustand)

```typescript
import { useAuthStore } from '@/store/auth';

function ProfileMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div>
      <p>{user?.firstName} {user?.lastName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Local Component State

```typescript
function SitesList() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    const response = await apiClient.get('/sites');
    setSites(response.data.sites);
    setIsLoading(false);
  };
}
```

## Real-Time Updates (Planned)

### WebSocket Connection

```typescript
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL);

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.on('SITE_UPDATED', (data) => {
  // Update site in state
});

socket.on('WORK_ORDER_COMPLETED', (data) => {
  // Show notification
});
```

### Event Subscriptions

```typescript
useEffect(() => {
  socket.emit('subscribe', {
    companyId: user.companyId,
    events: ['SITE_UPDATED', 'WORK_ORDER_COMPLETED']
  });

  return () => {
    socket.emit('unsubscribe');
  };
}, [user.companyId]);
```

## Performance

### Optimization

- **Code Splitting** - Automatic with App Router
- **Image Optimization** - next/image for responsive images
- **Static Generation** - Pre-render pages where possible
- **API Routes** - Server-side API handlers
- **Memoization** - React.memo for expensive components

### Monitoring

```typescript
// Log render times
import { useEffect } from 'react';

useEffect(() => {
  const start = Date.now();
  return () => {
    console.log(`Component mounted for ${Date.now() - start}ms`);
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

# Run dev server
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Analyze bundle
ANALYZE=true pnpm build
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy automatically on push

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN corepack enable && pnpm install --prod
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Self-Hosted

```bash
# Build
pnpm build

# Start production server
pnpm start

# Or use PM2
pm2 start "pnpm start" --name toweros-web
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

Access in code:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Security

### Headers

Security headers configured in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
}
```

### CSRF Protection

API client sends credentials:

```typescript
const apiClient = axios.create({
  withCredentials: true, // Send cookies
});
```

### XSS Prevention

- All user input escaped by React
- No `dangerouslySetInnerHTML`
- CSP headers (planned)

## Troubleshooting

### "Module not found" errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### "API request failed"

```bash
# Check API server is running
curl http://localhost:3000/api/v1/health

# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Check CORS settings in API server
```

### "Authentication failed"

```bash
# Clear cookies
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

# Reload page
```

### "Build failed"

```bash
# Type check first
pnpm type-check

# Check for ESLint errors
pnpm lint

# Clear cache and rebuild
rm -rf .next
pnpm build
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- ARIA labels on interactive elements
- Focus indicators

## License

Private - TowerOS Internal Use Only
