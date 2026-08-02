# TowerOS Design System

**Version:** 1.0
**Last Updated:** 2026-08-02
**Status:** Production Ready

---

## Introduction

The TowerOS Design System is purpose-built for field technicians working on telecommunications towers. Every design decision prioritizes:

1. **Readability in sunlight** - High contrast, clear typography
2. **Touch-friendly** - Large targets, glove-compatible
3. **Professional** - Trustworthy, clean, modern
4. **Performance** - Fast loading, smooth animations
5. **Accessibility** - WCAG 2.1 AA compliant

This is **not a generic design system**. It's field-hardened.

---

## Brand Identity

### Logo

```
┌─────────────────────────┐
│                         │
│    ╔╦╗╔═╗╦ ╦╔═╗╦═╗     │
│     ║ ║ ║║║║║╣ ╠╦╝     │
│     ╩ ╚═╝╚╩╝╚═╝╩╚═     │
│         OS              │
│                         │
│  Field Operating System │
│  for Telecom Construction│
│                         │
└─────────────────────────┘
```

**Wordmark:** "TowerOS"
- T and O capitalized
- Rest lowercase
- Optional tagline: "Field Operating System"

**Usage:**
- Minimum size: 32px height (mobile), 40px height (web)
- Clear space: 16px on all sides
- Never distort or rotate
- Never change colors (use provided variants)

---

## Color System

### Primary Palette

#### Brand Blue (Primary)
```
Primary 500: #0066CC
Primary 400: #3385D6
Primary 600: #0052A3
Primary 700: #003D7A
Primary 800: #002952
```

**Usage:**
- CTAs, primary buttons
- Selected states
- Active elements
- Links

**Why:** Professional, trustworthy, high visibility. Works in sunlight.

---

#### Neutral Grays (Foundation)
```
Gray 50:  #FAFAFA (backgrounds)
Gray 100: #F5F5F5 (subtle backgrounds)
Gray 200: #EEEEEE (borders, dividers)
Gray 300: #E0E0E0 (disabled states)
Gray 400: #BDBDBD (placeholders)
Gray 500: #9E9E9E (secondary text)
Gray 600: #757575 (body text)
Gray 700: #616161 (emphasis text)
Gray 800: #424242 (headings)
Gray 900: #212121 (primary text)
```

**Usage:**
- Text hierarchy
- Backgrounds
- Borders
- Shadows

---

### Semantic Colors

#### Success (Green)
```
Success 500: #00B050
Success 400: #33C073
Success 600: #008A3D
```

**Usage:**
- Completed tasks
- Passed tests
- Success messages
- Online indicators

---

#### Warning (Orange)
```
Warning 500: #FF9500
Warning 400: #FFA933
Warning 600: #CC7700
```

**Usage:**
- Caution alerts
- Pending states
- Attention needed
- Weather warnings

---

#### Danger (Red)
```
Danger 500: #FF3B30
Danger 400: #FF6259
Danger 600: #CC2F26
```

**Usage:**
- Failed tests
- Errors
- Destructive actions
- Critical alerts

---

#### Info (Blue)
```
Info 500: #007AFF
Info 400: #339BFF
Info 600: #0062CC
```

**Usage:**
- Informational messages
- Tips
- Sync status
- General notifications

---

### Sector Colors (Special)

For visual differentiation of antenna sectors:

```
Sector Alpha:   #FF3B30 (Red)
Sector Beta:    #007AFF (Blue)
Sector Gamma:   #00B050 (Green)
Sector Delta:   #FF9500 (Orange)
```

**Usage:** Consistent sector identification across all views

---

### Gradients

#### Primary Gradient
```css
background: linear-gradient(135deg, #0066CC 0%, #003D7A 100%);
```

**Usage:** Hero sections, premium features, highlights

#### Subtle Gradient (Cards)
```css
background: linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%);
```

**Usage:** Card depth, subtle elevation

---

### Dark Mode

#### Dark Palette
```
Dark BG Primary:    #121212
Dark BG Secondary:  #1E1E1E
Dark BG Elevated:   #2C2C2C
Dark Text Primary:  #FFFFFF
Dark Text Secondary:#B3B3B3
Dark Border:        #3C3C3C
```

**Adaptation:**
- Primary blue → Lighter: #3385D6
- Success green → Lighter: #33C073
- All text → Inverted with sufficient contrast
- Shadows → Removed or subtle highlights

---

## Typography

### Font Families

#### Primary (Sans-Serif)
- **iOS:** SF Pro (System)
- **Android:** Roboto (System)
- **Web:** Inter (Google Fonts)

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', sans-serif;
```

#### Monospace (Data Display)
- **All Platforms:** SF Mono, Consolas, monospace

```css
font-family: 'SF Mono', Consolas, 'Courier New', monospace;
```

**Usage:** Serial numbers, coordinates, technical data

---

### Type Scale

#### Mobile (16px base)
```
Display:    32px / 40px line-height / Bold
H1:         28px / 36px / Bold
H2:         24px / 32px / Semibold
H3:         20px / 28px / Semibold
H4:         18px / 24px / Semibold
Body:       16px / 24px / Regular
Body Small: 14px / 20px / Regular
Caption:    12px / 16px / Regular
Overline:   11px / 16px / Semibold / Uppercase
```

#### Web (16px base)
```
Display:    48px / 56px / Bold
H1:         36px / 44px / Bold
H2:         30px / 38px / Semibold
H3:         24px / 32px / Semibold
H4:         20px / 28px / Semibold
Body:       16px / 24px / Regular
Body Small: 14px / 20px / Regular
Caption:    12px / 16px / Regular
```

---

### Font Weights
```
Light:      300
Regular:    400
Medium:     500
Semibold:   600
Bold:       700
```

**Usage:**
- Headers: Bold (700) or Semibold (600)
- Body: Regular (400)
- Emphasis: Medium (500) or Semibold (600)
- Never use Light (300) for important text

---

### Text Colors

#### Light Mode
```css
--text-primary:   #212121  (Gray 900)
--text-secondary: #616161  (Gray 700)
--text-tertiary:  #9E9E9E  (Gray 500)
--text-disabled:  #BDBDBD  (Gray 400)
--text-inverse:   #FFFFFF
```

#### Dark Mode
```css
--text-primary:   #FFFFFF
--text-secondary: #B3B3B3
--text-tertiary:  #808080
--text-disabled:  #4D4D4D
--text-inverse:   #212121
```

---

### Line Length

**Optimal readability:**
- Mobile: 40-60 characters per line
- Web: 60-75 characters per line
- Maximum: 80 characters

**Implementation:**
```css
max-width: 65ch; /* Characters, not pixels */
```

---

## Spacing System

### Scale (8px base unit)

```
0:   0px
1:   4px   (0.5 × base)
2:   8px   (1 × base)
3:   12px  (1.5 × base)
4:   16px  (2 × base)
5:   24px  (3 × base)
6:   32px  (4 × base)
7:   40px  (5 × base)
8:   48px  (6 × base)
9:   64px  (8 × base)
10:  80px  (10 × base)
```

**Usage:**
- Components: 4, 8, 12, 16px
- Sections: 24, 32, 40px
- Page margins: 16px (mobile), 24-48px (web)

---

### Component Spacing

#### Cards
```
Padding: 16px
Gap between cards: 16px (mobile), 24px (web)
```

#### Lists
```
Item padding: 16px vertical, 16px horizontal
Gap between items: 8px
```

#### Forms
```
Input height: 48px (mobile), 40px (web)
Input padding: 12px 16px
Gap between fields: 16px
Label margin-bottom: 8px
```

---

## Iconography

### Icon Library
- **iOS:** SF Symbols 5
- **Android:** Material Icons
- **Web:** Heroicons v2 (outline + solid)

### Icon Sizes
```
Small:  16px (inline with text)
Medium: 24px (default)
Large:  32px (prominent actions)
XL:     48px (hero/empty states)
```

### Icon Usage Guidelines

**Outlined vs Filled:**
- Outlined: Default, inactive states
- Filled: Active, selected states

**Color:**
- Primary actions: Brand blue (#0066CC)
- Destructive: Danger red (#FF3B30)
- Success: Success green (#00B050)
- Neutral: Gray 600 (#757575)

**Common Icons:**
```
Navigation:  arrow-left, arrow-right, menu, close
Actions:     plus, edit, trash, download, share
Status:      check-circle, x-circle, alert-triangle, info
Equipment:   tower, radio, antenna, cable
Work:        clipboard, camera, tools, checkmark
Sync:        cloud-upload, cloud-download, refresh
```

---

## Elevation & Shadows

### Shadow Scale (Material Design inspired)

```css
--shadow-1: 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-2: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-3: 0 4px 8px rgba(0, 0, 0, 0.12);
--shadow-4: 0 8px 16px rgba(0, 0, 0, 0.16);
--shadow-5: 0 16px 32px rgba(0, 0, 0, 0.20);
```

**Usage:**
- Cards: shadow-2
- Modals: shadow-4
- Dropdowns: shadow-3
- Tooltips: shadow-2
- Floating action buttons: shadow-3

**Dark Mode:**
Use subtle highlights instead of shadows
```css
box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
```

---

## Border Radius

### Scale
```
None:   0px    (tables, data grids)
SM:     4px    (inputs, small buttons)
Base:   8px    (cards, buttons)
MD:     12px   (prominent cards)
LG:     16px   (modals, drawers)
XL:     24px   (hero cards)
Full:   9999px (pills, avatars)
```

**Usage:**
- Buttons: 8px
- Inputs: 8px
- Cards: 12px
- Modals: 16px
- Chips/Tags: 9999px (full)

---

## Buttons

### Primary Button
```
Background: #0066CC
Text: #FFFFFF
Height: 48px (mobile), 40px (web)
Padding: 12px 24px
Border Radius: 8px
Font: Semibold 16px
Shadow: shadow-2

States:
- Hover: Background #0052A3
- Active: Background #003D7A
- Disabled: Background #E0E0E0, Text #9E9E9E
- Loading: Show spinner, maintain size
```

### Secondary Button
```
Background: Transparent
Border: 2px solid #0066CC
Text: #0066CC
Height: 48px (mobile), 40px (web)
Padding: 12px 24px
Border Radius: 8px

States:
- Hover: Background #F0F7FF
- Active: Background #E0EFFF
- Disabled: Border #E0E0E0, Text #9E9E9E
```

### Tertiary Button
```
Background: Transparent
Text: #0066CC
Height: 48px (mobile), 40px (web)
Padding: 12px 24px
No border

States:
- Hover: Background #F0F7FF
- Active: Background #E0EFFF
- Disabled: Text #9E9E9E
```

### Danger Button
```
Background: #FF3B30
Text: #FFFFFF
(Same dimensions as Primary)

States:
- Hover: Background #CC2F26
- Active: Background #A32720
```

### Icon Button
```
Size: 48px × 48px (mobile), 40px × 40px (web)
Icon Size: 24px
Padding: 12px
Border Radius: 8px

States:
- Hover: Background #F5F5F5
- Active: Background #EEEEEE
```

---

## Form Elements

### Text Input
```
Height: 48px (mobile), 40px (web)
Padding: 12px 16px
Border: 1px solid #E0E0E0
Border Radius: 8px
Font: Regular 16px
Background: #FFFFFF

States:
- Focus: Border #0066CC, Shadow 0 0 0 3px rgba(0, 102, 204, 0.1)
- Error: Border #FF3B30
- Disabled: Background #F5F5F5, Text #9E9E9E
```

### Textarea
```
Min Height: 120px
Padding: 12px 16px
Resize: vertical
(Other properties same as Text Input)
```

### Select Dropdown
```
Height: 48px (mobile), 40px (web)
Icon: chevron-down (16px)
Icon position: Right 16px
(Other properties same as Text Input)
```

### Checkbox
```
Size: 24px × 24px
Border: 2px solid #E0E0E0
Border Radius: 4px

Checked:
- Background: #0066CC
- Border: #0066CC
- Icon: check (white, 16px)
```

### Radio Button
```
Size: 24px × 24px
Border: 2px solid #E0E0E0
Border Radius: 50%

Selected:
- Border: #0066CC
- Inner dot: 12px, #0066CC
```

### Switch Toggle
```
Width: 52px
Height: 32px
Border Radius: 16px
Thumb: 28px circle

Off: Background #E0E0E0, Thumb left
On: Background #0066CC, Thumb right

Transition: 200ms ease
```

---

## Cards

### Base Card
```
Background: #FFFFFF
Border Radius: 12px
Padding: 16px
Shadow: shadow-2
Border: 1px solid #EEEEEE (optional)

Hover:
- Shadow: shadow-3
- Transform: translateY(-2px)
- Transition: 200ms ease
```

### Card Variants

#### Equipment Card
```
Header: Equipment type + status badge
Body: Manufacturer, model, location
Footer: Actions (View, Edit, Remove)
Thumbnail: Left-aligned, 80px × 80px
```

#### Site Card
```
Hero Image: Top, 16:9 aspect ratio
Content: Site name, location, carrier
Footer: Work order count, equipment count
```

#### Work Order Card
```
Header: WO number + priority badge
Progress Bar: Visual completion %
Body: Title, site, crew
Footer: Due date, task count
```

---

## Badges & Tags

### Badge (Status Indicator)
```
Height: 24px
Padding: 4px 12px
Border Radius: 9999px (full)
Font: Semibold 12px, Uppercase

Variants:
- Success: Background #E6F7ED, Text #008A3D
- Warning: Background #FFF3E0, Text #CC7700
- Danger: Background #FFEBEE, Text #CC2F26
- Info: Background #E3F2FD, Text #0062CC
- Neutral: Background #F5F5F5, Text #616161
```

### Tag (Category Label)
```
Height: 28px
Padding: 6px 12px
Border Radius: 6px
Font: Medium 14px

Background: #F5F5F5
Text: #616161
Border: 1px solid #E0E0E0

Removable:
- Add × icon (16px) on right
- Hover: × icon background #E0E0E0
```

---

## Modals & Overlays

### Modal
```
Max Width: 600px (desktop), 90vw (mobile)
Background: #FFFFFF
Border Radius: 16px
Shadow: shadow-5
Padding: 24px

Header:
- Title: H3 (24px Bold)
- Close button: Top right

Footer:
- Buttons: Right-aligned
- Primary action: Right-most
```

### Drawer (Side Panel)
```
Width: 400px (desktop), 80vw (mobile)
Background: #FFFFFF
Shadow: shadow-5
Padding: 24px
Slide in from right
```

### Toast Notification
```
Max Width: 400px
Background: #424242 (dark)
Text: #FFFFFF
Border Radius: 8px
Padding: 16px
Shadow: shadow-4

Position: Bottom center (mobile), Top right (web)
Duration: 4 seconds
Dismissible: × button

Variants:
- Success: Left border 4px #00B050
- Error: Left border 4px #FF3B30
- Warning: Left border 4px #FF9500
```

---

## Loading States

### Spinner
```
Size: 24px (inline), 48px (full screen)
Color: #0066CC
Animation: rotate 1s linear infinite
Thickness: 3px
```

```css
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Skeleton Loader
```
Background: linear-gradient(
  90deg,
  #F5F5F5 25%,
  #EEEEEE 50%,
  #F5F5F5 75%
)
Animation: shimmer 2s infinite
Border Radius: 4px
```

### Progress Bar
```
Height: 8px
Background: #E0E0E0
Fill: #0066CC
Border Radius: 4px
Transition: width 300ms ease
```

---

## Animations & Transitions

### Timing Functions
```
Ease Out: cubic-bezier(0.0, 0.0, 0.2, 1)  (exit)
Ease In:  cubic-bezier(0.4, 0.0, 1, 1)    (enter)
Ease:     cubic-bezier(0.4, 0.0, 0.2, 1)  (move)
```

### Durations
```
Fast:     100ms  (small changes)
Base:     200ms  (default)
Moderate: 300ms  (complex animations)
Slow:     500ms  (page transitions)
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 200ms ease-out;
```

#### Slide Up
```css
@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
animation: slideUp 300ms ease-out;
```

#### Scale
```css
@keyframes scale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
animation: scale 200ms ease-out;
```

**Usage:**
- Modals: scale
- Toast: slideUp
- Content: fadeIn
- Keep animations subtle

---

## Responsive Breakpoints

```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Grid System

**Mobile:** 4-column grid, 16px gutters
**Tablet:** 8-column grid, 24px gutters
**Desktop:** 12-column grid, 24px gutters

---

## Accessibility

### Contrast Ratios (WCAG 2.1 AA)

**Normal Text (< 18px):**
- Minimum: 4.5:1

**Large Text (≥ 18px or ≥ 14px bold):**
- Minimum: 3:1

**Interactive Elements:**
- Minimum: 3:1 against background

**Verified Combinations:**
```
✅ #212121 on #FFFFFF = 16.1:1
✅ #616161 on #FFFFFF = 7.0:1
✅ #0066CC on #FFFFFF = 4.7:1
✅ #FFFFFF on #0066CC = 4.7:1
✅ #00B050 on #FFFFFF = 2.9:1 (large text only)
```

### Focus Indicators
```
outline: 2px solid #0066CC;
outline-offset: 2px;
border-radius: 8px;
```

Never remove focus outlines without providing alternative.

### Screen Reader Text
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Dark Mode Implementation

### CSS Variables Approach

```css
:root {
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #FAFAFA;
  --color-text-primary: #212121;
  --color-text-secondary: #616161;
  --color-border: #E0E0E0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #121212;
    --color-bg-secondary: #1E1E1E;
    --color-text-primary: #FFFFFF;
    --color-text-secondary: #B3B3B3;
    --color-border: #3C3C3C;
  }
}
```

### Dark Mode Adjustments
- Reduce elevation (shadows → highlights)
- Slightly desaturate colors
- Increase contrast for important elements
- Use darker primary blue (#3385D6)

---

## Motion & Microinteractions

### Button Press
```css
button:active {
  transform: scale(0.98);
  transition: transform 100ms ease;
}
```

### Card Hover
```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16);
  transition: all 200ms ease;
}
```

### Ripple Effect (Material)
Use native platform ripples on mobile.

---

## Usage Guidelines

### Do's ✅
- Use system fonts
- Maintain 8px spacing grid
- Provide loading states
- Use semantic colors
- Test in sunlight conditions
- Support offline states
- Large touch targets (48px min)

### Don'ts ❌
- Don't use pure black (#000000)
- Don't use low contrast (<3:1)
- Don't animate excessively
- Don't use small text (<14px) for body
- Don't remove focus indicators
- Don't use red/green only for status (colorblind)

---

## Next Steps

1. ✅ Design system complete
2. ⏳ Implement in code (@tower/ui package)
3. ⏳ Create Storybook documentation
4. ⏳ Build component library
5. ⏳ Design tokens (JSON export)

---

**This design system provides every specification needed to build TowerOS with consistent, professional, field-hardened UI.**
