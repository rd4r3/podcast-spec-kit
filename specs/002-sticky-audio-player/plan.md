---
description: Implementation Plan for Sticky Audio Player
feature_branch: 002-sticky-audio-player
created: 2026-04-05
---

# Implementation Plan: Sticky Audio Player

## Technical Context

### Project Overview
- **Project Name**: Podcast Website (Next.js + Static Export)
- **Project Type**: Static Web Application (Podcast Website)
- **Primary Language**: TypeScript (React)
- **Framework**: Next.js 14+ (Pages Router, Static Export)
- **Styling**: Tailwind CSS 3+
- **State Management**: React Context API
- **Deployment Target**: Static CDN (Vercel, Netlify)
- **Existing Infrastructure**: JSON-based episode/host data in `src/data/`

### Dependencies
- React 18+: UI library with Hooks
- Next.js 14+: Static site generation framework
- TypeScript: Type safety and compile-time checking
- Tailwind CSS: Utility-first styling
- React Testing Library: Component testing
- Jest: Unit testing framework
- Cypress: End-to-end testing

### Integrations
- Integrates with existing `AudioContext` (if present) or creates new one
- Reuses existing episode data model from `src/data/episodes/`
- Uses existing `Layout.tsx` and page structure
- Respects existing Tailwind design system (Blue → Purple gradient, dark mode)
- Inherits existing audio file hosting in `public/audio/episodes/`

### Unknowns (NEEDS CLARIFICATION)
None — specification is complete and scope is well-defined. All technical decisions documented in assumptions.

## Constitution Check

### Project Constitution: Podcast Website (Next.js + Static Export)

The project constitution defines 6 core principles (v3.0.0, ratified 2026-04-05):

1. **Type Safety & Code Quality** — All TypeScript with strict mode, no `any` types, ESLint + Prettier
2. **Component Testing** — 80%+ coverage (unit, integration, E2E); TDD for UI features
3. **Design System Adherence** — Tailwind utility-first, Blue→Purple gradient, dark mode, 300ms animations
4. **Static Site Generation** — Pre-generated routes, `getStaticPaths`, JSON data, no external APIs
5. **Audio Player State Management** — React Context for persistent state, keyboard shortcuts, accessibility
6. **Specification-Driven Development** — Features designed in spec documents before implementation

### Alignment Assessment for Sticky Audio Player

| Principle | Requirement | Sticky Audio Player Alignment | Status |
|-----------|-------------|-------------------------------|--------|
| Type Safety | TypeScript strict mode, no `any` | New Context for audio state; all components typed | ✅ PASS |
| Component Testing | 80%+ coverage, TDD for UI | Unit tests for Context, StickyPlayer component; integration tests for state persistence; E2E tests for user flows | ✅ PASS |
| Design System | Tailwind, gradient, dark mode, animations | Sticky player uses Tailwind utility classes, respects Blue/Purple theme, includes dark mode variant, 300ms transition for expand/collapse | ✅ PASS |
| Static Gen | Pre-generated routes, getStaticPaths | No new dynamic routes; uses existing page structure; no API calls | ✅ PASS |
| Audio State Mgmt | React Context, keyboard shortcuts | Central requirement: context-based state persistence across pages; keyboard controls optional in v1 | ✅ PASS |
| Spec-Driven | Design before implementation | Complete specification exists; this plan documents implementation approach | ✅ PASS |

### Compliance Checklist

All constitutional requirements applicable to this feature:

- [x] **Code Quality**: TypeScript strict, ESLint-compliant, meaningful names (AudioContext, StickyPlayer, etc.)
- [x] **Test Coverage**: 80%+ target for AudioContext, StickyPlayer, state persistence logic
- [x] **Design System**: Tailwind-only styling, gradient/dark mode support, responsive design (mobile-first)
- [x] **Static Export**: No runtime API changes; all pages pre-generated
- [x] **Accessibility**: WCAG 2.1 AA (keyboard controls, ARIA labels, screen reader support)
- [x] **Performance**: Player state persists without performance degradation; lazy-load optional features

### Pre-Implementation Gates

**All gates pass** — No violations of constitution principles:
- ✅ TypeScript strict mode compatible
- ✅ 80% test coverage achievable (Context, component logic, state sync)
- ✅ Design system compliant (Tailwind-only, theme-aware)
- ✅ Static export compatible (no new API routes, no database changes)
- ✅ Audio state management pattern approved in Constitution
- ✅ Specification-driven approach maintained

## Phase 0: Research & Design Decisions

### Research Tasks (All Resolved)

No NEEDS CLARIFICATION markers exist in specification, but key design decisions documented:

#### 1. Audio State Persistence Approach
- **Decision**: Use React Context API (no Redux/Zustand)
- **Rationale**: Specification explicitly calls for Context API in FR-009; sufficient for single global audio state
- **Implementation**: New `src/context/AudioContext.tsx` manages `{currentTime, isPlaying, volume, currentEpisodeId}`
- **Benefits**: No additional dependencies, integrates with existing React patterns, lightweight for this use case

#### 2. Sticky Positioning Strategy
- **Decision**: CSS `position: fixed` at bottom of viewport with `z-index: 50` (Tailwind `fixed bottom-0`)
- **Rationale**: Simplest approach, works across all pages, survives page navigation, standard podcast site pattern
- **Fallback**: Check browser support (IE11 not required; modern browsers guaranteed)
- **Mobile**: Full sticky player on desktop; collapsible on mobile to save space (FR-007)

#### 3. State Synchronization Across Pages
- **Decision**: Context provider wraps entire app in `_app.tsx`; state survives Next.js client-side navigation
- **Rationale**: Context persists during client-side page transitions; only resets on full page reload
- **Validation**: Integration tests verify state persists when using Next.js Link navigation between pages

#### 4. Keyboard Shortcuts
- **Decision**: Spacebar (play/pause) mandatory in v1; arrow keys (seek) optional for Phase 2
- **Rationale**: Spacebar is standard UX for media players; arrow key seek adds complexity; defer to v2 per assumptions
- **Implementation**: Global keyboard event listener in AudioContext or StickyPlayer component

#### 5. Collapse/Expand Animation
- **Decision**: 300ms ease-in-out transition (Tailwind `transition-all duration-300`)
- **Rationale**: Matches design system specification (SC-002: player occupies ≤12% viewport expanded, ≤5% collapsed)
- **States**: Expanded = full controls visible; Collapsed = play button + episode title + progress indicator

#### 6. Content Obstruction Prevention
- **Decision**: Add `pb-[120px]` (or responsive variant) padding to main content wrapper to account for sticky player height
- **Rationale**: FR-010 requires no obstruction of critical content; padding ensures content scrolls above player
- **Measurement**: Expanded player ≈120px height on desktop; Collapsed ≈48px height; padding adjusts per screen size

### Design Artifacts to Generate

These artifacts will be created during Phase 1:

1. **`data-model.md`** (if needed for state schema)
2. **`research.md`** (document all decisions above)
3. **`quickstart.md`** (setup guide for sticky player feature)
4. **No API contracts required** (static site, no external APIs)

## Phase 1: Design & Architecture

### 1. Audio Player State Context

**File**: `src/context/AudioContext.tsx`

```typescript
// Type definitions (from spec: AudioPlayerState entity)
interface AudioState {
  currentEpisodeId: string | null;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isCollapsed: boolean;
}

// Context value type
interface AudioContextType {
  state: AudioState;
  setCurrentEpisode: (episodeId: string) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleCollapsed: () => void;
}
```

**State Persistence**:
- Context value persists across client-side page navigation (React context is in-memory)
- State resets on full page reload (acceptable per FR-002: "navigate to different pages")
- No localStorage persistence required for v1 (simplifies implementation)

**Testing**:
- Unit test: Context provider exports correct initial state
- Unit test: Action creators (play, pause, seek) update state correctly
- Integration test: State persists when navigating between pages using Next.js Link

### 2. StickyPlayer Component

**File**: `src/components/StickyPlayer.tsx`

**Props**:
```typescript
interface StickyPlayerProps {
  // No props required — reads from AudioContext
}
```

**Responsibilities** (from spec: StickyPlayer Component entity):
- Display current episode info (title, cover, duration, current time) — FR-003
- Render play/pause button — FR-004
- Render progress bar with seek capability — FR-005
- Render volume control — FR-006
- Render collapse/expand toggle — FR-007
- Stay fixed at bottom viewport — FR-001
- Not obstruct page content — FR-010
- Support dark mode and responsive design — FR-011

**Styling Approach**:
- Tailwind classes: `fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900`
- Z-index: `z-50` (high priority for always-visible)
- Responsive: Full expanded on desktop (≥1024px); collapsible on mobile (<1024px)
- Expanded state: Show title, cover, play button, progress bar, time, volume, expand/collapse toggle
- Collapsed state: Show only play button, episode title mini, collapse toggle

**Component Composition**:
```
StickyPlayer (fixed container)
├── PlayerContent (conditional: expanded vs collapsed)
│   ├── EpisodeCover (image)
│   ├── EpisodeInfo (title, duration, current time)
│   ├── PlayPauseButton (uses AudioContext)
│   ├── ProgressBar (draggable, updates currentTime on seek)
│   ├── VolumeControl (slider, updates volume)
│   └── ToggleCollapseButton
└── CollapsedView (only when collapsed)
    ├── PlayPauseButton
    ├── EpisodeTitle (mini)
    └── ExpandButton
```

**Testing**:
- Unit test: Player renders without errors
- Unit test: All buttons trigger correct Context actions
- Integration test: Clicking play/pause updates player UI
- E2E test: Player remains visible when navigating between pages

### 3. Layout Integration

**File**: `src/pages/_app.tsx` (modify existing)

**Changes**:
- Wrap entire app with AudioProvider: `<AudioProvider><Component {...pageProps} /></AudioProvider>`
- Add bottom padding to main content area: `pb-[120px]` (or responsive variant) to prevent content obstruction — FR-010

**Alternative Wrapper**: If central Layout component exists (`src/components/Layout.tsx`), wrap there instead.

### 4. Episode Selection Integration

**File**: `src/components/EpisodeCard.tsx` (modify existing) or new component

**Current Behavior**: Clicking an episode card navigates or loads episode data

**New Behavior**: 
- When user clicks play on an episode card, dispatch Context action: `setCurrentEpisode(episodeId)` 
- Then call `play()` to start playback
- Player state immediately updates across the site — FR-008

**Implementation**:
```typescript
const handlePlayEpisode = (episodeId: string) => {
  audioContext.setCurrentEpisode(episodeId);
  audioContext.play();
  // Optional: navigate to episodes list or detail page
};
```

### 5. Data Model (No Schema Changes Required)

Per assumptions: "The feature integrates with the existing episodes data model without requiring schema changes"

- Existing `PodcastEpisode` schema in `src/data/episodes/` is sufficient
- No new fields needed for sticky player (duration, audio file already exist)
- No changes to `src/types/index.ts` required for this feature

### 6. No API Contracts Required

This is a static site with no external APIs. Player state is client-only; no backend contracts needed.

---

### Design Decision Summary

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **State Management** | React Context | Simplicity, no extra dependencies, fits spec FR-009 |
| **Sticky Positioning** | CSS `fixed` bottom | Standard UX, works cross-page, works on all modern browsers |
| **Responsive Behavior** | Expand/collapse toggle on mobile | Mobile screen space constraint; users can minimize player |
| **Keyboard Support** | Spacebar (v1), arrows (v2) | Spacebar is essential UX; arrow keys defer to phase 2 |
| **Styling Framework** | Tailwind CSS only | Project standard; dark mode support included |
| **Testing Strategy** | Unit (Context, Component) + Integration (state sync) + E2E (user flows) | Meets 80% coverage requirement |
| **Data Model** | Reuse existing | No schema changes required; existing episode data sufficient |

---

## Phase 2: Implementation Execution

### Milestone 1: Audio Context & Core State (Days 1-2)

**Deliverables**:
1. Create `src/context/AudioContext.tsx` with full type definitions and state management
2. Create `src/context/AudioProvider.tsx` (or integrate into AudioContext)
3. Write unit tests for Context (play, pause, seek, volume)
4. Wrap app in AudioProvider in `_app.tsx`

**Tests**:
- ✅ Context initializes with correct default state
- ✅ play() action sets isPlaying to true
- ✅ pause() action sets isPlaying to false
- ✅ seek(time) updates currentTime
- ✅ setVolume(v) updates volume

### Milestone 2: StickyPlayer Component (Days 2-3)

**Deliverables**:
1. Create `src/components/StickyPlayer.tsx` with expanded and collapsed views
2. Implement play/pause, progress bar, volume controls
3. Implement collapse/expand toggle with 300ms animation
4. Write unit tests for component rendering and interactions
5. Write integration tests for Context integration

**Tests**:
- ✅ Component renders without errors
- ✅ Play button triggers play action
- ✅ Pause button triggers pause action
- ✅ Clicking progress bar seeks to position
- ✅ Volume slider updates volume
- ✅ Collapse button toggles collapsed state
- ✅ Player doesn't obscure page content (layout test)

### Milestone 3: Integration & E2E (Days 3-4)

**Deliverables**:
1. Integrate StickyPlayer into `_app.tsx` or Layout
2. Add bottom padding to content wrapper (FR-010)
3. Integrate episode selection (clicking episode card starts playback)
4. Write E2E tests for user flows

**E2E Test Scenarios** (using Cypress):
1. **User Story 1**: Start episode on homepage → navigate to episodes page → verify playback continues
2. **User Story 2**: Play/pause/seek/volume controls all work on multiple pages
3. **User Story 3**: Collapse/expand toggle works, player doesn't obstruct content
4. **User Story 4**: Navigate away and back, playback position maintained

**Tests**:
- ✅ E2E: Play episode → navigate to /episodes → verify playing
- ✅ E2E: Play episode → navigate to /about → verify playing
- ✅ E2E: Long page scroll → sticky player remains visible
- ✅ E2E: Collapse/expand toggle works across page navigations
- ✅ E2E: Mobile responsive: collapsed state on small screens

### Milestone 4: Polish & Testing (Days 4-5)

**Deliverables**:
1. Test coverage audit (aim for 80%+ on Context, StickyPlayer, integration)
2. Dark mode testing and refinement
3. Mobile/tablet responsive testing
4. Accessibility audit (WCAG 2.1 AA)
5. Performance check (no bundle size increase >50KB)

**Testing Checklist**:
- ✅ Unit test coverage ≥80% for AudioContext
- ✅ Unit test coverage ≥80% for StickyPlayer
- ✅ Integration tests for state persistence
- ✅ E2E tests for all user stories (4 tests)
- ✅ Dark mode: colors, contrast, visibility
- ✅ Mobile (640px): player collapsible, no obstruction
- ✅ Accessibility: keyboard navigation, ARIA labels, screen reader compatible
- ✅ Performance: build size impact <50KB, no runtime slowdown

### Milestone 5: Documentation (Day 5)

**Deliverables**:
1. Add code comments to Context and StickyPlayer
2. Create `docs/sticky-player.md` (usage guide)
3. Update README with feature description
4. Update design system documentation if needed

---

## Gates Evaluation

### Pre-Phase 1 Gates ✅

- [x] All NEEDS CLARIFICATION resolved (none existed; spec is complete)
- [x] Constitution principles followed (all 6 principles compliant)
- [x] Design artifacts complete (Context, Component, Integration plan defined)
- [x] Technical decisions documented (6 key decisions + rationale)
- [x] No conflicts with existing architecture (reuses existing patterns)

### Pre-Phase 2 Gates ✅

- [x] Data model finalized (no schema changes required)
- [x] API contracts defined (none needed; static site)
- [x] Testing strategy approved (unit, integration, E2E with 80%+ coverage)
- [x] Design approved by team (implements FR-001 through FR-012)
- [x] Dependencies identified (no new packages required; uses existing React, Next.js, Tailwind)

### Post-Phase 2 Gates (Verification at End)

- [ ] Build succeeds with no errors
- [ ] All tests pass (unit, integration, E2E)
- [ ] Test coverage ≥80% for new code
- [ ] Code quality checks pass (TypeScript strict, ESLint clean)
- [ ] Design system compliance verified (Tailwind, dark mode, animations)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance acceptable (no degradation from baseline)