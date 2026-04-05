<!--
Sync Impact Report
Version: 2.0.0 → 3.0.0
Date: 2026-04-05
MAJOR VERSION BUMP: Complete project pivot from Vite + SQLite to Next.js podcast website
Changes:
- Complete rewrite of all core principles aligned with Next.js + static export architecture
- Removed backend/database principles (no longer applicable)
- Added static site generation and JSON data architecture principles
- Added podcast-specific design system and audio player UX principles
- Updated technical governance for static export constraints
- Updated development process for specification-driven workflow
- Architecture Standards now reflect Next.js patterns and TypeScript-first approach
Files requiring updates:
⚠ .specify/templates/plan-template.md - Update Constitution Check for podcast project
⚠ .specify/templates/spec-template.md - Update for static site + data-driven requirements
⚠ .specify/templates/tasks-template.md - Update task categories for frontend-only development
⚠ .specify/templates/commands/*.md - Review for Next.js-specific guidance
-->
---
version: 3.0.0
ratification_date: 2026-04-05
last_amended_date: 2026-04-05
---

# Project Constitution for Podcast Website (Next.js + Static Export)

## 1. Preamble

This constitution establishes the governing principles, technical standards, and decision-making framework for the Podcast Specification Kit—a modern podcast website built with Next.js, TypeScript, and Tailwind CSS. It serves as the authoritative source of truth for all architectural, quality, and process requirements.

Version: 3.0.0
Ratified: 2026-04-05
Last Amended: 2026-04-05

## 2. Core Principles

### Type Safety & Code Quality
All code must be written in TypeScript with strict type checking and consistent style:

- **TypeScript-First**: All source files must use TypeScript (`.ts`, `.tsx`) with strict mode enabled
- **No Unsafe Types**: Avoid `any` types; use explicit types or generics
- **Consistent Style**: Enforce ESLint + Prettier for code formatting and style
- **Meaningful Names**: Use descriptive PascalCase for components, camelCase for functions/utilities
- **Single Responsibility**: Each component/function has one clear purpose
- **Component Composition**: Prefer functional components with hooks; avoid class components

**Rationale**: Type safety catches errors at development time, improves IDE support, and ensures maintainability across team contributions.

### Component Testing
All components must have unit and integration tests to ensure reliability:

- **Component Unit Tests**: Test components in isolation using React Testing Library
- **Integration Tests**: Test component interactions and state management
- **Test Coverage**: Minimum 80% coverage for critical components and utilities
- **Test-Driven Development**: Write tests first for new UI features
- **E2E Testing**: Cypress tests for critical user flows (episode browsing, audio player)

**Rationale**: Component testing ensures features work as intended and prevents regressions during refactoring.

### Design System Adherence
The visual and interactive design must be consistent across all pages:

- **Tailwind Utility-First**: Use Tailwind CSS for all styling; no custom CSS except for global resets
- **Color Palette**: Blue (#3B82F6) to Purple (#8B5CF6) gradient for primary; respect dark mode variants
- **Responsive Design**: Mobile-first approach; test at 640px, 768px, 1024px, 1280px breakpoints
- **Animation Consistency**: 300ms ease-in-out transitions for all interactive elements
- **Component Patterns**: Cards, buttons, inputs follow established design patterns
- **Dark Mode**: All components must support dark mode with appropriate contrast ratios

**Rationale**: A consistent design system improves user experience, reduces cognitive load, and enables rapid feature development.

### Static Site Generation Best Practices
Leverage Next.js static export to ensure optimal performance and reliability:

- **Pre-generated Routes**: All pages must be pre-generated at build time (no dynamic SSR)
- **getStaticPaths**: Dynamic routes use `getStaticPaths` with complete path enumeration
- **JSON Data Architecture**: All data lives in `src/data/` as JSON files; no external APIs or databases
- **Unoptimized Images**: Next.js Image optimization disabled; images must be optimized manually
- **Trailing Slashes**: Enable `trailingSlash: true` for consistent URL structure
- **Build Validation**: Build must succeed and generate all 20+ pages without errors

**Rationale**: Static exports enable CDN distribution, reduce operational complexity, and guarantee consistent performance.

### Audio Player State Management
The podcast audio player must maintain state across page navigation:

- **Context API**: Audio player state managed via React Context (current time, playing status, volume)
- **Persistent State**: Player state survives navigation between pages
- **Keyboard Controls**: Spacebar toggles play/pause; arrow keys adjust volume and seek
- **Visual Feedback**: Progress bar, duration display, and playback status always visible
- **Accessibility**: Audio player supports keyboard navigation and screen readers

**Rationale**: Seamless audio playback across the site is central to the podcast experience.

## 3. Technical Governance

### Architecture Standards
- **Next.js Pages Router**: Use pages-based routing in `src/pages/`; follow Next.js file conventions
- **TypeScript Strict Mode**: All tsconfig settings enforce strict type checking
- **Component Organization**: Reusable components in `src/components/`, pages in `src/pages/`, utilities in `src/utils/`
- **Data Structure**: Episode and host data follow schemas defined in `specs/001-podcast-website/data-model.md` (authoritative)
- **Separation of Concerns**: UI components separate from business logic; utilities for common functions
- **No Backend Logic**: Static site only; all logic executes at build time or in the browser

### Quality Gates
1. TypeScript compilation must succeed with no errors or warnings
2. ESLint must pass without errors (warnings acceptable if justified)
3. All tests must pass before build
4. Build must generate all expected static pages without errors
5. Code coverage must meet 80% for new components and utilities
6. No unoptimized images in the output
7. Accessibility (WCAG 2.1 AA) must be maintained

### Compliance Requirements
- **Data Schema Compliance**: All episode/host JSON must validate against `data-model.md` schemas
- **Design System Compliance**: All UI must follow Tailwind design system defined in `plan.md` Phase 2.5
- **Content Standards**: Episode titles 5-100 characters, descriptions 20-300 characters
- **Performance**: Lighthouse scores must be maintained (Core Web Vitals green)
- **Accessibility**: WCAG 2.1 AA conformance for all pages and components

## 4. Development Process

### Specification-Driven Development
- All features must be designed in the specification documents before implementation
- Specifications live in `specs/001-podcast-website/` (spec.md, plan.md, data-model.md, tasks.md)
- Major decisions are documented as Architecture Decision Records (ADRs)
- Design system implementation tracked in specification checklists

### Change Control
- All changes go through pull requests with code review
- Changes that affect data structure must update `data-model.md`
- Changes to pages/features must update specification documents
- Breaking changes to data schema require MAJOR version bump
- Feature additions require MINOR version bump

### Versioning Policy for Data & Specifications
- **MAJOR**: Backward-incompatible data schema changes, breaking API changes
- **MINOR**: New podcast features, new data fields, new pages added
- **PATCH**: Bug fixes, content updates, documentation clarifications, design refinements

## 5. Amendments and Ratification

### Amendment Procedure
1. Propose changes to constitution via pull request with clear justification
2. Discuss changes with the team and rationale for each principle adjustment
3. Incorporate feedback and update version according to semantic versioning
4. Approve constitution changes with at least one reviewer
5. Propagate changes across dependent templates (plan-template.md, spec-template.md, etc.)
6. Communicate changes clearly in commit message

### Ratification Requirements
- MAJOR changes (new project direction, removed principles) require explicit team consensus
- MINOR changes (new principle, expanded guidance) require approval from one team member
- PATCH changes (clarifications, wording) can be ratified by proposing author with self-review
- All changes documented in constitution history via Sync Impact Report

## 6. Glossary

- **ADR**: Architecture Decision Record - documentation of important architectural choices
- **Component**: A reusable React element (functional component with TypeScript props interface)
- **Static Export**: Next.js output mode that pre-generates all pages at build time
- **getStaticPaths**: Next.js function that enumerates all dynamic route paths for static generation
- **Tailwind**: Utility-first CSS framework providing responsive, composable design tokens
- **WCAG**: Web Content Accessibility Guidelines - standards for accessible web design
- **Data Schema**: TypeScript interface defining structure and validation rules for episode/host data
- **Context API**: React mechanism for managing global state (used for audio player)
