# TowerOS UI Component Guide

Comprehensive guide for using the TowerOS UI component library in production.

## Table of Contents

- [Philosophy](#philosophy)
- [Component Catalog](#component-catalog)
- [Usage Patterns](#usage-patterns)
- [Field-Specific Considerations](#field-specific-considerations)
- [Accessibility](#accessibility)
- [Performance](#performance)

---

## Philosophy

TowerOS components are designed with three core principles:

### 1. Field-First Design
Every component is optimized for technicians working on cell towers:
- **48px minimum touch targets** - Usable with heavy gloves
- **High contrast colors** - Readable in direct sunlight
- **Large text** - Easy to read at arm's length on scaffolding
- **Simple interactions** - Minimal taps, no complex gestures

### 2. Production-Ready
No placeholders, no "TODO" comments, no demo code:
- **Full TypeScript types** - Every prop documented
- **Error handling** - Graceful degradation
- **Accessibility** - WCAG 2.1 AA compliant
- **Performance** - Optimized renders, tree-shakable

### 3. Platform Consistency
Same API for web and native:
```tsx
// Same props, same behavior
<Button variant="primary">Install</Button> // Web
<Button variant="primary">Install</Button> // Native
```

---

## Component Catalog

### Button

**Purpose:** Primary interactive element for user actions

**Variants:**
- `primary` - Main call-to-action (blue background)
- `secondary` - Secondary actions (gray background)
- `tertiary` - Low-emphasis actions (transparent, blue text)
- `danger` - Destructive actions (red background)
- `ghost` - Minimal actions (transparent)

**Sizes:**
- `sm` - 40px height (web), 40px (native)
- `md` - 48px height (web and native) - **Default for field use**
- `lg` - 56px height (web and native)

**Examples:**

```tsx
// Primary action
<Button variant="primary" size="md" onPress={handleInstall}>
  Install Equipment
</Button>

// Destructive action with confirmation
<Button
  variant="danger"
  loading={isDeleting}
  disabled={!canDelete}
>
  Delete Site
</Button>

// Icon button
<Button variant="tertiary" iconLeft={<PlusIcon />}>
  Add Photo
</Button>

// Full-width (mobile)
<Button variant="primary" fullWidth>
  Complete Work Order
</Button>
```

**Field Best Practices:**
- Use `md` or `lg` size only (sm is too small for gloves)
- Always show loading state for network operations
- Keep text short (max 2-3 words)
- Use iconLeft for visual reinforcement

---

### Input

**Purpose:** Text input with label, validation, and helper text

**States:**
- `default` - Normal state
- `error` - Validation error (red border)
- `success` - Validation success (green border)
- `disabled` - Non-editable

**Examples:**

```tsx
// Basic input
<Input
  label="Site Name"
  placeholder="Enter site name"
  value={siteName}
  onChangeText={setSiteName}
  required
/>

// With validation
<Input
  label="Email"
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  helperText="We'll use this for notifications"
/>

// With icon
<Input
  label="Search Equipment"
  iconLeft={<SearchIcon />}
  placeholder="Type to search..."
  value={searchQuery}
  onChangeText={setSearchQuery}
/>

// Disabled (read-only)
<Input
  label="Equipment ID"
  value={equipmentId}
  editable={false}
/>
```

**Field Best Practices:**
- Always include `label` prop
- Use appropriate `keyboardType` (number-pad, email-address, phone-pad)
- Show clear validation errors immediately
- Use `helperText` for context
- Avoid auto-focus (causes keyboard jank on mobile)

---

### Card

**Purpose:** Container for grouping related content

**Variants:**
- `default` - Border, no shadow
- `elevated` - Shadow, no border (use for overlays)
- `interactive` - Clickable card with press effect

**Padding:**
- `none` - No padding (custom content)
- `sm` - 12px padding
- `md` - 16px padding (default)
- `lg` - 24px padding

**Examples:**

```tsx
// Site information card
<Card variant="elevated" padding="md">
  <Text style={styles.title}>North Tower Alpha</Text>
  <Text style={styles.subtitle}>Carrier: Verizon</Text>
  <Badge variant="success">In Service</Badge>
</Card>

// Interactive card (tappable)
<Card variant="interactive" onPress={handleViewWorkOrder}>
  <Text style={styles.title}>Work Order #12345</Text>
  <Text style={styles.description}>5G NR Installation</Text>
  <Badge variant="warning">In Progress</Badge>
</Card>

// Composable card (web only)
<Card variant="default" padding="lg">
  <CardHeader>
    <CardTitle>Equipment Details</CardTitle>
    <CardDescription>Installed March 20, 2026</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Model: AIR 6449</p>
    <p>Serial: ABC123456</p>
  </CardContent>
  <CardFooter>
    <Button variant="tertiary">View History</Button>
  </CardFooter>
</Card>
```

**Field Best Practices:**
- Use `elevated` for important content
- Use `interactive` for tappable cards (entire card is touch target)
- Keep content concise (3-5 lines max)
- Use consistent padding across app

---

### Badge

**Purpose:** Status indicators, labels, and tags

**Variants:**
- `default` - Gray (neutral)
- `primary` - Blue (informational)
- `success` - Green (positive status)
- `warning` - Orange (caution)
- `danger` - Red (critical)
- `info` - Blue (informational)
- `alpha/beta/gamma/delta` - Sector-specific

**Sizes:**
- `sm` - 12px text (default)
- `md` - 14px text
- `lg` - 16px text

**Examples:**

```tsx
// Status indicators
<Badge variant="success">In Service</Badge>
<Badge variant="danger">Critical Alert</Badge>
<Badge variant="warning">Maintenance Due</Badge>

// Sector labels
<Badge variant="alpha">Sector Alpha</Badge>
<Badge variant="beta">Sector Beta</Badge>
<Badge variant="gamma">Sector Gamma</Badge>

// With icon
<Badge variant="success" icon={<CheckIcon />}>
  Completed
</Badge>

// Workflow status
<Badge variant="primary">In Progress</Badge>
<Badge variant="default">Pending</Badge>
```

**Field Best Practices:**
- Use semantic variants (success = good, danger = bad)
- Use sector variants (alpha/beta/gamma/delta) for sector labels
- Keep text short (1-2 words)
- Place near related content

---

### Toast (Web Only)

**Purpose:** Temporary notification messages

**Variants:**
- `default` - White background
- `success` - Green background
- `warning` - Orange background
- `danger` - Red background
- `info` - Blue background

**Examples:**

```tsx
// Setup once at root
function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}

// Use in any component
function InstallEquipmentScreen() {
  const { toast } = useToast();

  const handleInstall = async () => {
    try {
      await installEquipment();
      toast({
        title: "Equipment installed",
        description: "Alpha Radio installed successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Installation failed",
        description: error.message,
        variant: "danger",
      });
    }
  };

  return <Button onPress={handleInstall}>Install</Button>;
}

// With action
toast({
  title: "Work order updated",
  description: "Task marked as complete",
  variant: "success",
  action: (
    <ToastAction altText="Undo" onClick={handleUndo}>
      Undo
    </ToastAction>
  ),
});
```

**Field Best Practices:**
- Always show toast for async operations (network success/failure)
- Use `success` for positive feedback
- Use `danger` for errors
- Keep description under 50 characters
- Auto-dismiss after 5 seconds (default)

---

### Spinner

**Purpose:** Loading indicator for async operations

**Sizes:**
- `small` - Inline loading (web: 16px, native: small)
- `large` - Page loading (web: 32px, native: large)

**Variants:**
- `primary` - Blue (default)
- `white` - White (for dark backgrounds)
- `gray` - Gray (subtle loading)

**Examples:**

```tsx
// Inline loading (in button)
<Button loading={isSaving}>
  Save Changes
</Button>

// Full-screen loading
{isLoading && (
  <View style={styles.loadingContainer}>
    <Spinner size="large" variant="primary" />
    <Text>Loading site data...</Text>
  </View>
)}

// Inline loading (in list)
{isLoadingMore && (
  <Spinner size="small" variant="gray" />
)}
```

**Field Best Practices:**
- Always show loading state for network operations (>500ms)
- Use `large` for full-screen loading
- Use `small` for inline/list loading
- Include text label for accessibility
- Position centrally for visibility

---

## Usage Patterns

### Forms

```tsx
function SiteForm() {
  const [siteName, setSiteName] = useState('');
  const [carrier, setCarrier] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const validation = validateSite({ siteName, carrier });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    try {
      await createSite({ siteName, carrier });
      toast({ title: "Site created", variant: "success" });
    } catch (error) {
      toast({ title: "Failed to create site", variant: "danger" });
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <Input
        label="Site Name"
        value={siteName}
        onChangeText={setSiteName}
        error={errors.siteName}
        required
      />
      <Input
        label="Carrier"
        value={carrier}
        onChangeText={setCarrier}
        error={errors.carrier}
        required
      />
      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit}
      >
        Create Site
      </Button>
    </Card>
  );
}
```

### Lists with Status

```tsx
function EquipmentList({ equipment }) {
  return (
    <View>
      {equipment.map((item) => (
        <Card
          key={item.id}
          variant="interactive"
          onPress={() => handleViewEquipment(item.id)}
        >
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.title}>{item.model}</Text>
              <Text style={styles.subtitle}>{item.serialNumber}</Text>
            </View>
            <Badge variant={getStatusVariant(item.status)}>
              {item.status}
            </Badge>
          </View>
        </Card>
      ))}
    </View>
  );
}

function getStatusVariant(status) {
  switch (status) {
    case 'IN_SERVICE': return 'success';
    case 'DECOMMISSIONED': return 'danger';
    case 'MAINTENANCE': return 'warning';
    default: return 'default';
  }
}
```

### Confirmation Dialogs

```tsx
function DeleteSiteButton({ siteId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete site?",
      description: "This action cannot be undone.",
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteSite(siteId);
      toast({ title: "Site deleted", variant: "success" });
    } catch (error) {
      toast({ title: "Failed to delete site", variant: "danger" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="danger"
      loading={isDeleting}
      onPress={handleDelete}
    >
      Delete Site
    </Button>
  );
}
```

---

## Field-Specific Considerations

### Sunlight Readability

All components use high-contrast colors:
- Primary blue (#0066CC) on white (#FFFFFF) = **4.7:1 contrast**
- Text (#212121) on white (#FFFFFF) = **16.1:1 contrast**
- Always meets WCAG AA standards

**Best Practices:**
- Use `primary` variant for main actions (highest contrast)
- Avoid `tertiary` variant in bright sunlight (lower contrast)
- Use `elevated` cards for important content (shadow adds depth)

### Glove Operation

All interactive elements have 48px minimum touch target:
- Button `md` size = 48px height
- Input height = 48px
- Card minimum = 48px (with padding)

**Best Practices:**
- Never use `sm` buttons on mobile
- Add padding around small interactive elements
- Use `fullWidth` buttons when possible
- Space interactive elements 8px apart minimum

### Offline States

Show clear offline indicators:

```tsx
function SyncStatus() {
  const { isOnline, pendingCount } = useSyncStatus();

  if (isOnline && pendingCount === 0) {
    return <Badge variant="success">Synced</Badge>;
  }

  if (!isOnline && pendingCount > 0) {
    return (
      <Badge variant="warning" icon={<OfflineIcon />}>
        {pendingCount} pending
      </Badge>
    );
  }

  if (isOnline && pendingCount > 0) {
    return (
      <Badge variant="primary" icon={<SyncIcon />}>
        Syncing...
      </Badge>
    );
  }

  return null;
}
```

---

## Accessibility

### Screen Readers

All components support screen readers:

```tsx
// Web - aria-label
<Button aria-label="Delete site North Tower Alpha">
  <TrashIcon />
</Button>

// Native - accessibilityLabel
<Button accessibilityLabel="Delete site North Tower Alpha">
  <TrashIcon />
</Button>
```

### Keyboard Navigation (Web)

All interactive components support keyboard:
- `Tab` - Navigate between elements
- `Enter` / `Space` - Activate button
- `Esc` - Close dialog/toast

### Focus Indicators

All components show 2px focus ring:
```tsx
focus:outline-none
focus:ring-2
focus:ring-primary-500
focus:ring-offset-2
```

### Color Blindness

Don't rely on color alone:

```tsx
// Bad - color only
<Badge variant="danger">Critical</Badge>

// Good - color + icon
<Badge variant="danger" icon={<AlertIcon />}>
  Critical Alert
</Badge>

// Good - color + text
<Badge variant="danger">
  Critical - Immediate Action Required
</Badge>
```

---

## Performance

### Tree Shaking

Import only what you need:

```tsx
// Good - tree-shakable
import { Button, Input } from '@tower/ui/web';

// Bad - imports everything
import * as UI from '@tower/ui/web';
```

### React Native Optimization

Use `React.memo` for list items:

```tsx
const EquipmentCard = React.memo(({ equipment }) => (
  <Card variant="interactive" onPress={() => handlePress(equipment.id)}>
    <Text>{equipment.model}</Text>
    <Badge variant="success">{equipment.status}</Badge>
  </Card>
));
```

### Web Optimization

Components use CSS-in-JS for zero runtime:
- Tailwind classes compiled at build time
- No style injection at runtime
- Minimal bundle size

---

## Next Steps

1. Review [Design System](../../docs/design/DESIGN_SYSTEM.md) for complete token reference
2. Check [Wireframes](../../docs/wireframes/WIREFRAME_OVERVIEW.md) for usage in context
3. Read [User Flows](../../docs/wireframes/USER_FLOWS.md) for interaction patterns
4. Explore component source code for implementation details

---

**All components are production-ready. No placeholders. No TODOs. Ship it.**
