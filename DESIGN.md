# PulseLoop Design System

The visual identity for PulseLoop. Use this document as the source of truth for all design decisions. Deviations from this system should be intentional and documented.

## Color Palette

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Blue (Primary) | `#354B8C` | Primary actions, sidebar, links |
| Green (Success) | `#2D733E` | Positive scores, promoters, success states |
| Amber (Warning) | `#F2BB77` | Sidebar accent, warnings, passive scores |
| Red (Error) | `#D93A2B` | Detractors, errors, destructive actions |
| Off-White (Base) | `#F2F1F0` | Light mode text, dark mode background text |

### Dark Mode Variants

| Name | Hex | Usage |
|------|-----|-------|
| Blue (Dark Primary) | `#5B7AD4` | Lighter blue for dark backgrounds |
| Green (Dark Success) | `#3D9E54` | Lighter green for dark mode |
| Page Background (Light) | `#e8e6e4` | Light mode body |
| Page Background (Dark) | `#0f1225` | Dark mode body |

### Glassmorphism Tokens

```css
/* Light mode */
--glass-bg: rgba(255, 255, 255, 0.35);
--glass-border: rgba(255, 255, 255, 0.5);
--glass-shadow: rgba(53, 75, 140, 0.08);

/* Dark mode */
--glass-bg: rgba(40, 48, 80, 0.35);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-shadow: rgba(0, 0, 0, 0.3);
```

### NPS Score Colors

| Score Range | Category | Color |
|-------------|----------|-------|
| 9-10 | Promoter | `#2D733E` (green) |
| 7-8 | Passive | `#354B8C` (blue) |
| 0-6 | Detractor | `#D93A2B` (red) |

Use these consistently across ScoreTag, ScoreDistributionChart, RecentComments, and TopPerformers.

## Typography

**Font stack:** System fonts. `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

This is intentional for an internal tool. System fonts load instantly, feel native, and don't require font hosting.

| Element | Size | Weight |
|---------|------|--------|
| Page title (h3) | 24px | 600 |
| Section title (h5) | 16px | 600 |
| Body text | 14px | 400 |
| Labels | 12px | 500 |
| Small/caption | 11px | 400 |

## Spacing Scale

Based on 4px increments: **4, 8, 12, 16, 20, 24, 32, 40, 48px**

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps, pill padding |
| sm | 8px | Default gap, card internal spacing |
| md | 12px | Section gap within cards |
| base | 16px | Standard padding, content gaps |
| lg | 20px | Card padding |
| xl | 24px | Page padding, section spacing |
| 2xl | 32px | Major section spacing |

## Component Patterns

### GlassCard

The primary container. Frosted glass effect with backdrop blur.

```css
background: var(--glass-bg);
backdrop-filter: blur(20px) saturate(1.4);
border: 1px solid var(--glass-border);
border-radius: 12px;
padding: 20px;
box-shadow: 0 8px 32px var(--glass-shadow);
```

Hover: `translateY(-2px)` lift with deeper shadow. Only on interactive cards (app list), not on static containers (charts, settings).

### Sidebar

Gradient blue glass with depth shadow.

```css
background: linear-gradient(180deg,
  rgba(40, 55, 110, 0.92) 0%,
  rgba(53, 75, 140, 0.88) 40%,
  rgba(35, 50, 100, 0.95) 100%);
box-shadow: 4px 0 24px rgba(53, 75, 140, 0.3);
```

- Text: white at 0.95 opacity (active), 0.6 opacity (inactive)
- Selected item: amber left border (3px), white text, subtle white background
- Collapses to 0 width on mobile (`breakpoint="md"`)

### Theme Toggle

Three-button radio group in the sidebar. White text on dark background.

```css
background: rgba(0, 0, 0, 0.25);  /* container */
selected: rgba(255, 255, 255, 0.18);  /* active button */
```

### Score Tag

Ant Design `Tag` colored by NPS category. Use `theme.useToken()` for colors.

### Filter Bar

Horizontal row of Ant `Select`, `RangePicker`, and `Button` components. Wraps on mobile via `Space` with `wrap`.

## Dark Mode

Three modes: **Light**, **System**, **Dark**. Persisted to localStorage.

### Rules

1. All Ant component overrides go in `glass.css` under `[data-theme='dark']` selectors
2. Never hardcode light-mode colors in inline styles without a dark alternative
3. Floating components (dropdowns, popovers, date pickers) need explicit dark styling because they render in portals outside the component tree
4. Text colors: `#F2F1F0` (primary), `#b0b0c0` (secondary), `#808098` (muted)
5. Placeholder text: `rgba(255, 255, 255, 0.35)`

### Covered components

Select dropdown, Popover, DatePicker dropdown, Message, Popconfirm, Tooltip, Tag, Table, Input, Button, Descriptions, Form labels, Switch, InputNumber.

## Accessibility

1. ARIA labels on all navigation landmarks, forms, and interactive controls
2. `role="radiogroup"` on theme toggle with `aria-checked` per button
3. `autoComplete` attributes on auth form inputs
4. Ant Design provides baseline keyboard navigation and ARIA on all components
5. Focus indicators: rely on Ant defaults. Custom buttons (ThemeToggle, Logout) should add `:focus-visible` styling

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 576px | Sidebar collapsed, single column grid |
| Tablet | 576-768px | Sidebar collapsible, 2-column where appropriate |
| Desktop | > 768px | Full sidebar, multi-column layouts |

Grid uses Ant responsive props: `xs`, `sm`, `md`, `lg`.

## Background

Radial gradient overlays on `body::before` create the colored depth that glassmorphism blurs over:

```css
radial-gradient(ellipse at 15% 15%, rgba(53, 75, 140, 0.3) 0%, transparent 50%),
radial-gradient(ellipse at 85% 85%, rgba(45, 115, 62, 0.18) 0%, transparent 45%),
radial-gradient(ellipse at 55% 25%, rgba(242, 187, 119, 0.14) 0%, transparent 40%),
radial-gradient(ellipse at 70% 60%, rgba(217, 58, 43, 0.06) 0%, transparent 35%);
```

## Logo

PulseLoop logo at `src/assets/pulseloop.png`. Teal/cyan pulse waveform in a circle on dark background.

- Sidebar: 32x32px, `border-radius: 6px`
- Favicon: `public/favicon.png` (same image)

## Anti-Patterns (Don't Do This)

- Don't use `transition: all`. List specific properties.
- Don't hardcode hex colors in inline styles. Use `theme.useToken()` or CSS variables.
- Don't add new floating components (Modal, Drawer) without dark mode styles in `glass.css`.
- Don't use `outline: none` without a replacement focus indicator.
- Don't use fixed pixel widths on form inputs without a responsive fallback.
