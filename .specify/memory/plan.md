# Main Implementation Plan

**Last Updated**: 2026-04-05  
**Version**: 1.0.0

This document outlines the overall implementation strategy, dependencies, architecture, and technical decisions for all features in the project.

---

## Merged Features

### Feature: Modern Podcast Website [Source: specs/001-podcast-website]

**Status**: Completed  
**Branch**: 001-podcast-website  
**Completed**: 2026-04-05

---

## Project Overview

### Technology Stack

- **Framework**: Next.js (React framework for static site generation)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Testing**: Jest + React Testing Library (unit tests), Cypress (E2E tests)
- **Data Storage**: Embedded JSON files (no database required)
- **Deployment Target**: Static site hosting (Vercel, Netlify, etc.)

### Primary Dependencies

```
next: ^14.0.0
react: ^18.0.0
react-dom: ^18.0.0
typescript: ^5.0.0
tailwindcss: ^3.0.0
jest: ^29.0.0
@testing-library/react: ^14.0.0
@testing-library/jest-dom: ^6.0.0
cypress: ^13.0.0
```

---

## Architecture Standards

### 1. Static Site Generation (SSG)

**Decision**: All pages pre-generated at build time using Next.js static export (`output: 'export'`).

**Implementation**:
- Pages Router-based routing in `src/pages/`
- `getStaticProps` for data fetching at build time
- `getStaticPaths` for dynamic episode and host pages
- No Server-Side Rendering (SSR) — all content generated statically
- Trailing slashes enabled (`trailingSlash: true`)

**Rationale**: Static export enables CDN distribution, guarantees consistent performance, and eliminates operational complexity.

### 2. Data Architecture

**Decision**: JSON-based data storage with embedded files in `src/data/`.

**Structure**:
```
src/data/
├── episodes/          # Individual episode files
│   ├── ep-001.json
│   ├── ep-002.json
│   └── ... (20 total)
├── hosts/             # Host information
│   ├── host-001.json
│   ├── host-002.json
│   └── ...
├── faqs.json          # FAQ items (single file)
└── site-metadata.json # Site configuration
```

**Validation**: All data must conform to schemas defined in `specs/001-podcast-website/data-model.md`.

**Rationale**: JSON files are:
- Simple to manage and version control
- Require no database infrastructure
- Fast to load and parse
- Easy to validate and structure

### 3. Component Architecture

**Decision**: Reusable, composable components with hooks and Context API.

**Structure**:
```
src/
├── components/    # Reusable React components
├── pages/         # Next.js page components (routing)
├── utils/         # Utility functions and helpers
├── types/         # TypeScript type definitions
└── styles/        # Global styles
```

**Patterns**:
- Functional components with hooks (no class components)
- Props defined with TypeScript interfaces
- Separation of concerns: UI components separate from business logic
- Context API for cross-page audio player state

### 4. Audio Player State Management

**Decision**: React Context API for persistent audio player state across page navigation.

**Implementation**:
- Centralized audio context in `src/context/AudioContext.tsx`
- State includes: current episode, playback position, playing status, volume
- Event listeners on route changes to preserve state
- HTML5 `<audio>` element with custom controls

**Features**:
- Play/pause with visual feedback
- Progress bar with seek capability
- Volume control
- Keyboard shortcuts (spacebar for play/pause, arrow keys for volume/seek)
- Loading indicator while buffering
- Duration and current time display

### 5. Design System & Styling

**Decision**: Tailwind CSS for utility-first, responsive design.

**Color Palette**:
- **Primary Gradient**: Blue (#3B82F6) → Purple (#8B5CF6)
- **Secondary**: Dark gray (#1F2937)
- **Accent**: Light blue (#60A5FA)
- **Background**: Light (#F9FAFB) / Dark (#111827)

**Typography**:
- Font: Inter (sans-serif)
- Base: 16px (1rem)
- Headings: 600-700 weight
- Body: 400 weight

**Spacing**:
- Base unit: 1rem (16px)
- Consistent padding/margin throughout
- Max content width: 1280px (centered)

**Animations**:
- Duration: 300ms
- Easing: ease-in-out
- Applied to: buttons, cards, transitions

**Responsive Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Dark Mode**: All components support dark mode with appropriate contrast ratios.

### 6. Testing Strategy

**Unit Testing**:
- Framework: Jest + React Testing Library
- Scope: All components and utilities
- Minimum coverage: 80% for critical paths
- Approach: Test user interactions and component behavior

**Integration Testing**:
- Test component interactions
- Test data loading and processing
- Test navigation between pages
- Verify audio player state persistence

**End-to-End Testing**:
- Framework: Cypress
- Scope: Critical user flows
- Flows tested:
  - Landing page → Episode list → Episode detail
  - Audio player functionality across pages
  - Navigation between all pages
  - Responsive behavior

**Performance Testing**:
- Page load times under 2 seconds
- Lighthouse Core Web Vitals in green
- Bundle size optimization

**Accessibility Testing**:
- WCAG 2.1 AA conformance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation

### 7. Build & Deployment

**Build Process**:
- `npm run build` — compiles TypeScript and generates static site
- `next export` — outputs static files to `/out` directory
- All 20+ pages pre-generated at build time

**Deployment**:
- Target: Vercel (optimized for Next.js)
- Alternative: Netlify, CloudFlare Pages, any static host
- CDN distribution for global performance

**Quality Gates**:
1. TypeScript compilation succeeds (no errors/warnings)
2. ESLint passes without errors
3. All tests pass
4. Build generates all expected static pages
5. Lighthouse score maintained
6. Code coverage ≥ 80%

---

## Project Structure

```
podcast-spec-kit/
├── .specify/                      # Specification framework
│   ├── memory/                    # Main project memory
│   │   ├── constitution.md        # Project principles
│   │   ├── spec.md                # Consolidated specifications
│   │   ├── plan.md                # This file
│   │   └── changelog.md           # Merged features log
│   ├── templates/                 # Document templates
│   ├── extensions/                # Custom extensions
│   └── scripts/                   # Utility scripts
├── specs/001-podcast-website/     # Feature specification
│   ├── spec.md                    # Feature spec
│   ├── plan.md                    # Feature implementation plan
│   ├── data-model.md              # Data structure definitions
│   ├── research.md                # Technical research
│   ├── tasks.md                   # Dependency-ordered tasks
│   ├── quickstart.md              # Setup guide
│   └── checklists/                # Phase-specific checklists
├── podcast-website/               # Application source code
│   ├── src/
│   │   ├── pages/                 # Next.js pages (routes)
│   │   ├── components/            # Reusable React components
│   │   ├── context/               # React Context (audio player)
│   │   ├── data/                  # JSON data files
│   │   │   ├── episodes/          # Episode files
│   │   │   ├── hosts/             # Host files
│   │   │   ├── faqs.json          # FAQ items
│   │   │   └── site-metadata.json # Site config
│   │   ├── types/                 # TypeScript definitions
│   │   ├── utils/                 # Utility functions
│   │   └── styles/                # Global styles
│   ├── public/                    # Static assets
│   │   ├── audio/episodes/        # Mocked audio files
│   │   ├── images/episodes/       # Episode covers
│   │   └── images/hosts/          # Host photos
│   ├── next.config.js             # Next.js configuration
│   ├── tsconfig.json              # TypeScript config
│   ├── tailwind.config.js         # Tailwind config
│   ├── jest.config.js             # Jest config
│   ├── cypress.config.js          # Cypress config
│   └── package.json               # Dependencies
├── .github/                       # GitHub config
├── README.md                      # Project README
└── [other project files]
```

---

## New Components & Modules

### Core Pages

- **Landing Page** (`src/pages/index.tsx`): Featured episode hero + episode grid
- **Episodes Page** (`src/pages/episodes.tsx`): Complete episode listing
- **Episode Detail** (`src/pages/episodes/[id].tsx`): Episode details with audio player
- **About Page** (`src/pages/about.tsx`): Podcast and host information
- **FAQ Page** (`src/pages/faq.tsx`): Categorized FAQ items
- **404 Page** (`src/pages/404.tsx`): Not found page with navigation

### Reusable Components

- **AudioPlayer**: HTML5 audio control with custom UI and state persistence
- **EpisodeCard**: Episode preview card with thumbnail, title, description
- **HostCard**: Host information card with photo and bio
- **Navigation**: Site header with dark/light mode toggle
- **Layout**: Wrapper for consistent page structure
- **FAQSection**: Collapsible FAQ items by category

### Context & State

- **AudioContext**: Manages audio player state across pages
  - Current episode
  - Playback position and duration
  - Playing status
  - Volume level

### Utilities

- **Data loaders**: Load and parse episode, host, and FAQ data
- **Data validators**: Validate data against schemas
- **formatters**: Format duration, dates, etc.
- **hooks**: Custom React hooks (useAudio, useEpisode, etc.)

---

## Configuration Changes

### Next.js Configuration (`next.config.js`)

- `output: 'export'` — Enable static export
- `trailingSlash: true` — Enforce trailing slashes
- `unoptimizedImages: true` — Disable Image optimization (static export)
- Configure path aliases for `src/` directory

### TypeScript Configuration (`tsconfig.json`)

- `strict: true` — Enable strict type checking
- `noImplicitAny: true` — Disallow implicit any
- `esModuleInterop: true` — Enable ES module interop
- Path aliases: `@/*` → `src/*`

### Tailwind Configuration (`tailwind.config.js`)

- Dark mode enabled
- Custom color palette with podcast branding
- Responsive breakpoints defined
- Custom animations (transitions)
- Plugin configuration for consistent spacing

### ESLint Configuration (`.eslintrc.json`)

- React hooks rules enabled
- Next.js best practices plugin
- TypeScript eslint parser
- Enforces consistent code style

---

## Development Commands

### Build & Run

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for static export
npm start            # Run production build
```

### Testing

```bash
npm test                    # Run all Jest tests
npm test -- --watch        # Watch mode
npm test -- <filename>     # Specific file
npm run test:e2e           # Cypress E2E tests
npm run test:coverage      # Coverage report
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run lint:fix           # Fix linting issues
npm run format             # Run Prettier (if configured)
```

---

## Data Model Reference

For complete data structure definitions, validation rules, and examples, refer to `specs/001-podcast-website/data-model.md`.

**Key Entities**:
- **PodcastEpisode**: Episode metadata with 20 total instances
- **PodcastHost**: Host information (2-3 hosts)
- **FAQItem**: Frequently asked questions (10-15 items)
- **SiteMetadata**: Website configuration

---

## Constitution Compliance

This implementation fully adheres to the project constitution:

✅ **Type Safety & Code Quality**: All code in TypeScript with strict mode
✅ **Component Testing**: Unit tests + E2E tests with coverage targets
✅ **Design System Adherence**: Tailwind-based design system across all pages
✅ **Static Site Generation**: Pre-generated pages with getStaticPaths/Props
✅ **Audio Player State Management**: React Context for persistent state

---

**Revision History**:
- 2026-04-05: Archived from specs/001-podcast-website (v1.0.0)
