# Design System - Podcast Website

## Overview

This document defines the comprehensive design system for the Podcast Website, ensuring consistency in styling, spacing, typography, and interactive elements across all pages and components.

## Color Palette

### Primary Colors
- **Primary Blue**: `#3B82F6` (Main brand color)
- **Primary Purple**: `#8B5CF6` (Accent color)
- **Gradient**: Linear gradient from Blue to Purple at 135° angle

### Extended Color Scale
```
Blue (Primary):
- 50: #f0f7ff (Lightest)
- 100: #e0effe
- 200: #bfdbfe
- 300: #93c5fd
- 400: #60a5fa
- 500: #3B82F6 (Primary)
- 600: #2563eb
- 700: #1d4ed8
- 800: #1e40af
- 900: #1e3a8a (Darkest)

Purple (Secondary):
- 50: #faf5ff (Lightest)
- 100: #f3e8ff
- 200: #e9d5ff
- 300: #d8b4fe
- 400: #c084fc
- 500: #8B5CF6 (Secondary)
- 600: #7c3aed
- 700: #6d28d9
- 800: #5b21b6
- 900: #4c1d95 (Darkest)
```

### Dark Mode Colors
- **Background**: `#111827` (Main dark background)
- **Secondary Background**: `#1f2937` (Card backgrounds)
- **Tertiary Background**: `#374151` (Hover states)
- **Primary Text**: `#f3f4f6` (Main text)
- **Secondary Text**: `#d1d5db` (Secondary text)

## Typography

### Font Family
- **Primary Font**: Inter (system fallbacks: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Fallback**: Generic sans-serif

### Font Sizes
```
xs:  0.75rem   (12px)
sm:  0.875rem  (14px)
base: 1rem     (16px)
lg:  1.125rem  (18px)
xl:  1.25rem   (20px)
2xl: 1.5rem    (24px)
3xl: 1.875rem  (30px)
4xl: 2.25rem   (36px)
```

### Font Weights
- **Light**: 300
- **Normal**: 400 (Default)
- **Medium**: 500
- **Semi-Bold**: 600 (Headings)
- **Bold**: 700 (Strong headings)
- **Extra-Bold**: 800 (Display text)

### Line Heights
- **Headings**: 1.1-1.3
- **Body**: 1.5-1.6
- **Small**: 1.25

## Spacing System

### Base Unit: 1rem (16px)

```
xs:   0.125rem (2px)   - Micro spacing
sm:   0.25rem  (4px)   - Small spacing
base: 0.5rem  (8px)   - Default padding/margin
md:   0.75rem (12px)  - Medium spacing
lg:   1rem    (16px)  - Large spacing
xl:   1.25rem (20px)
2xl:  1.5rem  (24px)
3xl:  1.75rem (28px)
4xl:  2rem    (32px)
5xl:  2.5rem  (40px)
6xl:  3rem    (48px)
...continuing to 8rem (128px)
```

### Layout Padding/Margin
- **Small screens**: 1rem padding on both sides
- **Medium screens**: 1.5rem padding on both sides
- **Large screens**: 2rem padding on both sides

## Border Radius

### Rounded Corners
```
none:  0px
sm:    0.375rem (6px)
base:  0.5rem   (8px)  - Default radius
md:    0.75rem  (12px)
lg:    1rem     (16px) - Large radius
xl:    1.5rem   (24px)
2xl:   2rem     (32px)
3xl:   3rem     (48px)
full:  9999px   - Pill-shaped
```

## Shadows

### Shadow Variants
```
none:  No shadow
sm:    0 1px 2px 0 rgba(0, 0, 0, 0.05)              - Subtle
base:  0 1px 3px 0 rgba(0, 0, 0, 0.1),              - Default
       0 1px 2px 0 rgba(0, 0, 0, 0.06)
md:    0 4px 6px -1px rgba(0, 0, 0, 0.1),           - Medium
       0 2px 4px -1px rgba(0, 0, 0, 0.06)
lg:    0 10px 15px -3px rgba(0, 0, 0, 0.1),        - Large
       0 4px 6px -2px rgba(0, 0, 0, 0.05)
xl:    0 20px 25px -5px rgba(0, 0, 0, 0.1),        - Extra Large
       0 10px 10px -5px rgba(0, 0, 0, 0.04)
2xl:   0 25px 50px -12px rgba(0, 0, 0, 0.25)       - Elevation
```

### Shadow Usage
- **shadow-sm**: Subtle hover states, minimal elevation
- **shadow-base**: Default card elevation
- **shadow-lg**: Hover states on cards, modals
- **shadow-xl**: Dropdowns, floating elements

## Cards

### Card Component Structure
```
<div className="bg-white dark:bg-dark-bg_secondary rounded-base shadow-sm 
                p-lg hover:shadow-lg transition-all duration-300 ease-in-out
                hover:scale-105">
  <!-- Card content -->
</div>
```

### Card Specifications
- **Background**: White (light), `#1f2937` (dark)
- **Border Radius**: `0.5rem` (8px)
- **Base Shadow**: `shadow-sm`
- **Hover Shadow**: `shadow-lg`
- **Hover Transform**: `scale(1.02)` - subtle scale
- **Padding**: `1.5rem` (24px)
- **Transition**: `300ms ease-in-out`

## Buttons

### Button Base
```
display: inline-flex;
align-items: center;
justify-content: center;
padding: 0.5rem 1.5rem;
border-radius: 0.5rem;
font-weight: 600;
transition: all 300ms ease-in-out;
cursor: pointer;
border: none;
```

### Button Variants

#### Primary Button
- **Background**: Gradient (Blue to Purple)
- **Text Color**: White
- **Hover**: Brightness +10%, shadow-lg
- **Active**: Scale -2% (0.98)

#### Secondary Button
- **Background**: Transparent
- **Border**: 2px solid Primary Blue
- **Text Color**: Primary Blue
- **Hover**: Background changes to Blue, text White

### Button Sizes
- **Small**: `0.5rem 1rem`
- **Medium**: `0.75rem 1.5rem` (Default)
- **Large**: `1rem 2rem`

## Transitions

### Transition Durations
- **Fast**: 150ms
- **Default**: 300ms
- **Slow**: 500ms

### Timing Functions
- **ease-in**: `cubic-bezier(0.4, 0, 1, 1)`
- **ease-out**: `cubic-bezier(0, 0, 0.2, 1)`
- **ease-in-out**: `cubic-bezier(0.4, 0, 0.2, 1)` (Default)

### Common Transitions
- **All properties**: `transition: all 300ms ease-in-out;`
- **Opacity**: `transition: opacity 300ms ease-in-out;`
- **Transform**: `transition: transform 300ms ease-in-out;`
- **Shadow**: `transition: box-shadow 300ms ease-in-out;`

## Animations

### Available Animations
```
fadeIn:      Opacity 0 → 1 (300ms)
slideInUp:   translateY(10px) → 0, opacity 0 → 1 (300ms)
slideInDown: translateY(-10px) → 0, opacity 0 → 1 (300ms)
scaleIn:     scale(0.95) → 1, opacity 0 → 1 (300ms)
pulse:       Opacity pulse 2s infinite
```

### Animation Usage
```html
<div className="animate-fade-in">Content</div>
<div className="animate-slide-in-up">Slide up</div>
<div className="animate-scale-in">Scale in</div>
```

## Responsive Design

### Breakpoints
- **xs**: 0px (Mobile first)
- **sm**: 640px (Small devices)
- **md**: 768px (Tablets)
- **lg**: 1024px (Desktops)
- **xl**: 1280px (Large desktops)
- **2xl**: 1536px (Extra large)

### Responsive Utility Pattern
```html
<!-- Classes apply based on breakpoint -->
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <!-- Content -->
</div>
```

### Mobile-First Approach
- Design for mobile first, then enhance for larger screens
- Use `sm:`, `md:`, `lg:`, `xl:` prefixes for breakpoint-specific styles

## Layout System

### Container
- **Max Width**: 1280px (centered)
- **Horizontal Padding**: 1.5rem (responsive)
- **Margin**: `auto` (horizontal centering)

```html
<div className="max-w-container mx-auto px-6">
  <!-- Centered content with max width -->
</div>
```

### Grid and Flexbox
- **Default Gap**: 1.5rem (24px)
- **Column Count**: 
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (lg): 3-4 columns

## Dark Mode

### Implementation
- **Class-based**: Add `dark` class to root element
- **CSS Variable Approach**: Uses Tailwind's dark mode utilities

### Dark Mode Color Usage
```html
<!-- Light mode (default) -->
<div className="bg-white text-gray-900">

<!-- Dark mode (when 'dark' class is present) -->
<div className="bg-white dark:bg-dark-bg_secondary text-gray-900 dark:text-dark-text">
```

### Dark Mode Workflow
1. Toggle adds/removes `dark` class on root
2. CSS automatically applies dark variants
3. No JavaScript required for styles (except toggle button)

## Component Guidelines

### Consistency Rules
1. **Spacing**: Use spacing scale (0.5rem, 1rem, 1.5rem, 2rem)
2. **Shadows**: Use only defined shadow variants
3. **Colors**: Use defined color palette, not arbitrary colors
4. **Border Radius**: Use defined radius scale
5. **Transitions**: Always specify duration and timing function
6. **Typography**: Use defined font sizes and weights

### Accessibility
- **Color Contrast**: Ensure WCAG AA compliance (4.5:1 minimum)
- **Focus States**: All interactive elements must have visible focus
- **Semantic HTML**: Use proper heading hierarchy
- **ARIA Labels**: Add for non-text content

## Implementation Examples

### Featured Episode Card
```tsx
<div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg 
                overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
  <!-- Card content -->
</div>
```

### Episode Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {episodes.map(episode => (
    <div key={episode.id} className="card hover:shadow-lg hover:scale-105">
      <!-- Card content -->
    </div>
  ))}
</div>
```

### Primary Button
```tsx
<button className="btn btn-primary px-6 py-3 rounded-base font-semibold
                   hover:shadow-lg active:scale-95 transition-all">
  Listen Now
</button>
```

### Responsive Typography
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 
               dark:text-dark-text">
  Featured Episode
</h1>
```

## Updating the Design System

When making design changes:

1. **Update Tailwind Config**: Modify `tailwind.config.js`
2. **Update Design System CSS**: Update `src/styles/design-system.css`
3. **Update This Document**: Keep documentation in sync
4. **Audit Components**: Ensure all components follow new system
5. **Run Tests**: Verify no visual regressions

## Future Enhancements

- [ ] Storybook integration for component showcase
- [ ] Design token generation from Figma
- [ ] CSS-in-JS library for advanced theming
- [ ] Automated visual regression testing
- [ ] Design system component library

## References

- Tailwind CSS: https://tailwindcss.com/
- Design System Best Practices: https://www.designsystems.com/
- Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
