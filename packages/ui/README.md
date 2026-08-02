# @tower/ui

Production-ready UI component library for TowerOS. Implements the TowerOS design system with components for both web (React) and native (React Native) platforms.

## Features

- **Dual Platform**: Web (React) and Native (React Native) components
- **Type-Safe**: Full TypeScript support with comprehensive prop types
- **Accessible**: WCAG 2.1 AA compliant with proper ARIA labels
- **Field-Optimized**: 48px minimum touch targets, high contrast, sunlight-readable
- **Design System**: Implements complete TowerOS design tokens
- **Tree-Shakable**: Only import what you need
- **Well-Documented**: Inline JSDoc comments with usage examples

## Installation

```bash
pnpm add @tower/ui
```

## Usage

### Web Components (React)

```tsx
import { Button, Input, Card, Badge, Toast, Spinner } from '@tower/ui/web';

function MyComponent() {
  return (
    <Card variant="elevated" padding="md">
      <Input
        label="Site Name"
        placeholder="Enter site name"
        required
      />
      <Button variant="primary" size="md">
        Save Site
      </Button>
      <Badge variant="success">Active</Badge>
    </Card>
  );
}
```

### Native Components (React Native)

```tsx
import { Button, Input, Card, Badge, Spinner } from '@tower/ui/native';
import { View } from 'react-native';

function MyScreen() {
  return (
    <View>
      <Card variant="elevated" padding="md">
        <Input
          label="Site Name"
          placeholder="Enter site name"
          required
        />
        <Button variant="primary" size="md" onPress={handleSave}>
          Save Site
        </Button>
        <Badge variant="success">Active</Badge>
      </Card>
    </View>
  );
}
```

## Available Components

### Web

- **Button**: Primary interactive element with variants (primary, secondary, tertiary, danger, ghost)
- **Input**: Text input with label, validation states, and icons
- **Textarea**: Multi-line text input with validation
- **Card**: Container for grouping related content with composable sub-components
- **Badge**: Status indicators and labels with semantic colors
- **Toast**: Notification system with useToast hook and Toaster component
- **Spinner**: Loading indicators

### Native

- **Button**: Touch-optimized button with 48px minimum height
- **Input**: Text input with glove-friendly touch target
- **Card**: Pressable card component
- **Badge**: Status badges with sector color variants
- **Spinner**: Native ActivityIndicator wrapper

## Design System Integration

All components implement TowerOS design tokens:

- **Colors**: Brand blue (#0066CC), semantic colors (success, warning, danger), sector colors (alpha, beta, gamma, delta)
- **Typography**: 16px base, system fonts (SF Pro, Roboto, Inter)
- **Spacing**: 8px base unit (0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80px)
- **Border Radius**: 0, 4, 8, 12, 16, 24, 9999px
- **Shadows**: 5 elevation levels
- **Animations**: 100ms (fast), 200ms (base), 300ms (moderate), 500ms (slow)

## Field Optimization

Mobile components are optimized for field technicians:

- **48px minimum touch targets** - Works with gloves
- **High contrast colors** - Readable in direct sunlight (#0066CC on #FFFFFF = 4.7:1)
- **Large text** - 16px base, 18px for buttons
- **Haptic feedback** - Pressable components with visual feedback
- **Clear visual hierarchy** - Distinct states (default, pressed, disabled)

## Toast Notifications (Web Only)

```tsx
import { Toaster, useToast } from '@tower/ui/web';

// Add Toaster once at root level
function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}

// Use toast in any component
function MyComponent() {
  const { toast } = useToast();

  const handleInstall = () => {
    toast({
      title: "Equipment installed",
      description: "Alpha Radio installed successfully",
      variant: "success",
    });
  };

  return <Button onClick={handleInstall}>Install</Button>;
}
```

## Component Variants

### Button

- **primary**: Blue background, white text (primary actions)
- **secondary**: Gray background, dark text (secondary actions)
- **tertiary**: Transparent background, blue text (low-emphasis actions)
- **danger**: Red background, white text (destructive actions)
- **ghost**: Transparent background, gray text (minimal actions)

### Badge

- **default**: Gray (neutral status)
- **primary**: Blue (information)
- **success**: Green (positive status)
- **warning**: Orange (caution)
- **danger**: Red (critical)
- **info**: Blue (informational)
- **alpha/beta/gamma/delta**: Sector-specific colors

### Card

- **default**: Border, no shadow
- **elevated**: Shadow, no border
- **interactive**: Border + shadow, hover/press effects

## Styling

### Web (Tailwind)

Web components use Tailwind CSS classes. Ensure your project has:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@tower/ui/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-500': '#0066CC',
        'primary-600': '#0052A3',
        // ... other design tokens
      },
    },
  },
};
```

### Native (StyleSheet)

Native components use React Native StyleSheet. No additional setup required.

## TypeScript

All components are fully typed:

```tsx
import type { ButtonProps, InputProps, CardProps } from '@tower/ui/web';

// Props are fully typed with JSDoc descriptions
const customButton: ButtonProps = {
  variant: 'primary', // autocomplete available
  size: 'md',
  loading: false,
  children: 'Click me',
};
```

## Accessibility

### Web

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators (2px ring)
- Screen reader announcements
- High contrast mode support

### Native

- AccessibilityLabel props
- AccessibilityRole props
- VoiceOver/TalkBack support
- Large touch targets (48px minimum)

## Best Practices

1. **Use semantic variants**: Choose variant based on action importance
2. **Provide labels**: Always include label prop for form inputs
3. **Show validation**: Use error/success props for user feedback
4. **Loading states**: Use loading prop during async operations
5. **Accessibility**: Include aria-label for icon-only buttons
6. **Consistent spacing**: Use design system spacing tokens
7. **Field context**: Use fullWidth on mobile, fixed width on desktop

## Development

```bash
# Install dependencies
pnpm install

# Build library
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
```

## License

Private - TowerOS Internal Use Only
