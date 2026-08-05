# KidMemoir Design System

The Design System is built on Tailwind CSS v4, shadcn/ui conventions, Radix primitives, Lucide icons, and semantic CSS variables. Components are stateless unless interaction or accessibility behavior requires a Client Component.

## Foundations

- `ThemeProvider` supplies system-aware light and dark themes.
- `globals.css` owns semantic colors, typography, spacing, radius, shadow, animation, breakpoint, and layer tokens.
- `design-system.ts` exposes non-CSS constants for breakpoints, icons, animation durations, and z-index layers.
- `Container` and `Grid` provide the responsive 4/8/12-column layout foundation.
- `Typography` supplies the approved H1-H4, body, caption, small, and label styles.
- `Icon` standardizes Lucide icon size and stroke width.

## Component groups

- Inputs: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, and `RadioGroup`.
- Content: `Badge`, `Chip`, `Card`, `Typography`, and `Icon`.
- Overlays: `Dialog`, `Drawer`, `DropdownMenu`, `Tooltip`, and `Popover`.
- Navigation: `Tabs` and `Accordion`.
- Feedback: `Toast`, `Alert`, `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, and `LoadingState`.
- Layout: `Container`, `Grid`, `PageHeader`, and `SectionHeader`.

Import component modules directly when a server/client boundary matters. The `ui` and `layout` barrel files are available for tooling, documentation, and contexts where a combined import is appropriate.

All interactive controls preserve keyboard navigation, focus indication, disabled states, and accessible Radix semantics. Product code should use semantic token utilities rather than literal colors, arbitrary z-index values, or custom shadows.
