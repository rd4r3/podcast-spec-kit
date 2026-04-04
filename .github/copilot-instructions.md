# Copilot Instructions for Podcast Website Project

## Project Overview

This repository contains the implementation of a **modern podcast website** using Next.js, TypeScript, and Tailwind CSS. The project is organized around multiple feature branches, with the main feature branch being **`001-podcast-website`**.

The site serves 20 mocked podcast episodes (not pulled from real feeds) with pages for:
- Landing page with featured episode
- Episode browsing and discovery
- Individual episode detail pages with audio player
- About page with host information
- FAQ page

All data is embedded as JSON files in `src/data/` — there is no database or external API.

## Key Architecture Patterns

### Data Structure
- **Episode data**: Individual JSON files in `src/data/episodes/` (one file per episode with id pattern `ep-XXX.json`)
- **Host data**: Individual JSON files in `src/data/hosts/` (pattern `host-XXX.json`)
- **Static metadata**: `src/data/faqs.json` and `src/data/site-metadata.json`

**Important**: See `specs/001-podcast-website/data-model.md` for the authoritative schema definitions, validation rules, and examples for all data structures (PodcastEpisode, PodcastHost, FAQItem, SiteMetadata).

### Static Site Generation
- Next.js configured for **static export** (`output: 'export'` in `next.config.js`)
- Images are unoptimized for static output
- Trailing slashes enabled (`trailingSlash: true`)
- Dynamic routes use `getStaticPaths` for pre-generation

### React Context & State Management
- Audio player state persists across page navigation using React Context
- Centralized context defined in `src/utils/` or `src/context/`

### Design System
- **Styling**: Tailwind CSS utility-first framework
- **Color palette**: Primary gradient from Blue (#3B82F6) to Purple (#8B5CF6)
- **Typography**: Inter font family with responsive scaling
- **Spacing base**: 1rem (16px)
- **Animations**: 300ms ease-in-out transitions
- **Responsive breakpoints**: 640px, 768px, 1024px, 1280px
- **Dark mode**: Implemented with #111827 background and light text
- **Card design**: Subtle shadows (shadow-sm), rounded corners (0.5rem), hover effects (shadow-lg, scale 1.02)

See `specs/001-podcast-website/plan.md` (Phase 2.5) for complete design system implementation tasks.

### Component Structure
- Reusable components in `src/components/`
- Page components in `src/pages/`
- Utility functions in `src/utils/`
- Type definitions in `src/types/index.ts`

## Build, Test & Lint Commands

### Development
```bash
npm run dev          # Start Next.js dev server on localhost:3000
```

### Building
```bash
npm run build        # Build the project for static export
npm run export       # (if configured separately) Generate static files to /out
```

### Testing
```bash
npm test                    # Run all Jest tests with React Testing Library
npm test -- --watch        # Run tests in watch mode
npm test -- <filename>     # Run tests for a specific file
npm run test:e2e          # Run Cypress E2E tests (if configured)
```

### Linting & Code Quality
```bash
npm run lint         # Run ESLint (configured in .eslintrc.json)
npm run format       # Run Prettier (if script exists in package.json)
npm run lint:fix     # Fix linting issues automatically
```

## File Organization Reference

```
specs/001-podcast-website/        # Specification and planning documents
├── spec.md                        # User stories and requirements
├── plan.md                        # Implementation phases and tasks
├── data-model.md                  # Data structure definitions (AUTHORITATIVE)
├── quickstart.md                  # Setup and initialization guide
├── research.md                    # Technical research and decisions
├── tasks.md                       # Dependency-ordered task breakdown
└── checklists/                    # Phase-specific checklists

src/                               # Application source code
├── components/                    # Reusable React components
├── data/                          # Embedded JSON data
│   ├── episodes/                  # Individual episode JSON files (ep-001.json, etc.)
│   ├── hosts/                     # Host JSON files (host-001.json, etc.)
│   ├── faqs.json                  # FAQ items
│   └── site-metadata.json         # Site configuration
├── pages/                         # Next.js page components (routes)
├── types/                         # TypeScript type definitions
├── utils/                         # Utility functions and helpers
└── styles/                        # Global styles and Tailwind config

public/                            # Static assets
├── audio/episodes/                # Mocked episode MP3 files
└── images/episodes/               # Episode cover images

.specify/                          # Specify framework configuration
.vibe/                             # Vibe tool templates
.github/                           # GitHub-specific files
```

## Important Conventions

### TypeScript & Type Safety
- All data structures are defined in `src/types/index.ts` (always reference this file, not inline types)
- Episode IDs and host IDs follow a predictable pattern: `ep-001`, `host-001`, etc.
- Use strict type checking; avoid `any` types

### Data Validation
- When creating or modifying episode/host data, validate against the schemas in `specs/001-podcast-website/data-model.md`
- Episode descriptions must be 20-300 characters; titles must be 5-100 characters
- Episode durations must be in "HH:MM:SS" format
- Dates must be ISO 8601 format (YYYY-MM-DD)

### Component Patterns
- Prefer functional components with hooks
- Use React Context for cross-component audio player state
- All interactive components should have unit tests in a `.test.tsx` file

### Naming Conventions
- Episode data files: `src/data/episodes/ep-001.json` (not `episode-001.json`)
- Host data files: `src/data/hosts/host-001.json`
- Component files: PascalCase (e.g., `EpisodeCard.tsx`)
- Utility functions: camelCase (e.g., `formatDuration.ts`)

### Audio Player State
- Audio player state (current time, playing status, etc.) is persisted across page navigation
- Use the centralized audio player context (not local component state) for shared state
- Keyboard shortcuts should include spacebar for play/pause

## Specification Documents

When you need detailed information:
- **User stories & requirements**: `specs/001-podcast-website/spec.md`
- **Implementation phases & dependency order**: `specs/001-podcast-website/plan.md`
- **Data structure schemas**: `specs/001-podcast-website/data-model.md` (authoritative reference)
- **Setup instructions**: `specs/001-podcast-website/quickstart.md`
- **Task breakdown**: `specs/001-podcast-website/tasks.md`

## Common Development Workflows

### Adding a New Page
1. Create page component in `src/pages/` (follows Next.js routing)
2. Add link to navigation in header/layout component
3. Follow design system for styling (Tailwind classes, colors from palette)
4. Add unit tests in a `.test.tsx` file
5. Create E2E test if it's a user-facing page

### Modifying Episode Data
1. Edit the corresponding JSON file in `src/data/episodes/`
2. Ensure it matches the PodcastEpisode schema from `data-model.md`
3. Test that the page renders correctly (unit + E2E tests)
4. If adding a new episode, ensure at least one episode has `"isFeatured": true`

### Building UI Components
1. Create component in `src/components/`
2. Apply styles using Tailwind utility classes (follow design system colors/spacing)
3. Write PropTypes or use TypeScript interfaces for props
4. Add hover and active states for interactive elements
5. Test with React Testing Library

## Testing Standards

- **Unit tests**: Use Jest + React Testing Library for component testing
- **E2E tests**: Use Cypress for critical user flows (landing page, episode browsing, audio player)
- **Test file location**: `.test.tsx` or `.test.ts` in same directory as source
- **Coverage target**: Aim for high coverage on critical components and utilities

## Notes for Future Sessions

- This is a **static site** — no server-side logic or dynamic data fetching from external APIs
- All 20 episodes must exist in `src/data/episodes/` before the site can build
- Images are unoptimized for web; consider manual optimization for performance
- Dark mode support should be consistent across all pages (toggle in header)
- The audio player must maintain playback state when navigating between pages
