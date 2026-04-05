# Research: Sticky Audio Player Design Decisions

**Date**: 2026-04-05  
**Feature**: Sticky Audio Player (002-sticky-audio-player)  
**Status**: Complete

## Overview

All design decisions for the sticky audio player feature are documented below. No [NEEDS CLARIFICATION] markers existed in the specification; all unknowns were resolved through research into best practices and project constraints.

---

## Decision 1: Audio State Persistence (Context API vs External Library)

### Decision
Use React Context API (native React) for managing audio player state across page navigation.

### Rationale
- **Specification Requirement**: FR-009 explicitly states "Sticky player MUST use React Context or equivalent state management"
- **Scope Appropriateness**: Single global audio state (currentTime, isPlaying, volume, currentEpisodeId) is ideal for Context API
- **Dependency Constraint**: Project philosophy favors minimal dependencies; adding Redux/Zustand adds complexity without commensurate benefit
- **Performance**: Context re-renders only affected components; sufficient for audio player frequency of updates
- **Maintainability**: Developers familiar with React hooks can understand and modify Context easily
- **Next.js Compatibility**: Works seamlessly with Next.js client-side navigation (does NOT reset on Link navigation)

### Alternatives Considered
1. **Redux**: Over-engineered for single global state; adds 20+KB bundle size; steeper learning curve
2. **Zustand**: Lightweight alternative; but adds external dependency when Context is sufficient
3. **localStorage + State**: Persists across full page reloads; unnecessary for v1 (context state sufficient)
4. **Props Drilling**: Pass audio state through every component; unmaintainable with deep nesting

### Implementation Approach
Create `src/context/AudioContext.tsx` with:
- AudioState interface: `{currentEpisodeId, currentTime, isPlaying, volume, isCollapsed}`
- useAudio custom hook for consuming context
- AudioProvider component to wrap app in `_app.tsx`
- Action creators: play(), pause(), seek(), setVolume(), setCurrentEpisode(), toggleCollapsed()

### Validation
- Specification compliance: ✅ FR-009 requirement met
- Constitution compliance: ✅ Type Safety (typed context value), Testing (unit tests for state transitions)
- Integration test: Verify state persists when using Next.js Link to navigate between pages

---

## Decision 2: Sticky Positioning & Layout Strategy

### Decision
Use CSS `position: fixed` with Tailwind class `fixed bottom-0 left-0 right-0` to keep player visible at bottom of viewport.

### Rationale
- **CSS Standard**: `position: fixed` is well-supported in all modern browsers (no IE11 requirement)
- **Visual Pattern**: Matches industry standard from Serial, The Daily, NPR, Spotify
- **Z-index Control**: Set `z-index: 50` (Tailwind `z-50`) to ensure player always visible above other content
- **Simplicity**: No JavaScript-based positioning; no layout recalculation during scroll
- **Responsive**: Fixed positioning works identically on desktop, tablet, and mobile

### Content Obstruction Prevention
- **Problem**: Fixed element at bottom can obscure page content when scrolled to bottom
- **Solution**: Add responsive bottom padding to main content container:
  - Desktop (≥1024px): `pb-[120px]` (accommodates expanded player ~120px height)
  - Tablet (768px-1024px): `pb-[100px]`
  - Mobile (<768px): `pb-[60px]` (accounts for collapsed player ~48px height)
- **Validation**: FR-010 explicitly requires no obstruction of critical content

### Alternatives Considered
1. **Sticky Positioning** (`position: sticky`): Doesn't stay fixed during scroll; not appropriate
2. **Absolute Positioning**: Requires JavaScript scroll tracking; complex and error-prone
3. **Modal/Portal**: Overkill and breaks app context; makes player feel disconnected
4. **Header Position**: Deferred to v2 per assumptions; bottom is standard podcast UX

### Validation
- Specification compliance: ✅ FR-001 (visible and fixed at bottom)
- Constitution compliance: ✅ Design System (Tailwind positioning), Accessibility (always reachable)

---

## Decision 3: State Synchronization Across Page Navigation

### Decision
Context state persists across client-side page navigation using Next.js Link. State resets only on full page reload.

### Rationale
- **React Behavior**: Context is in-memory; survives client-side navigation (Link component)
- **Next.js Pattern**: Link component performs client-side navigation; does NOT reload the page
- **Specification Alignment**: FR-002 "maintain audio playback state...as users navigate to different pages without interruption"
- **Implementation Simplicity**: No extra logic needed; Context inherently solves this

### Technical Details
- When user clicks `<Link href="/episodes">`, Next.js:
  1. Loads new page component
  2. Preserves provider tree (AudioProvider wraps entire app in `_app.tsx`)
  3. Audio state remains in memory
  4. Player continues playing without interruption
- If user does full page reload (F5, address bar enter), state resets (acceptable per assumptions)

### Potential Issues & Mitigation
1. **Issue**: User has multiple tabs open with different episodes playing
   - **Mitigation**: Each tab has independent React context; no conflict. Noted as edge case.
2. **Issue**: Network latency delays audio file streaming
   - **Mitigation**: FR-002 allows "without interruption"; if network disconnects, graceful pause acceptable
3. **Issue**: Audio element buffering state not synced
   - **Mitigation**: Only track playback position (currentTime), not buffer position; acceptable for v1

### Validation
- Specification compliance: ✅ FR-002 (state persists across navigation)
- Constitution compliance: ✅ Static Export (no API calls needed), Type Safety (typed state)
- Integration test: Play episode → use Link to navigate → verify state unchanged

---

## Decision 4: Keyboard Shortcuts (Spacebar v1, Arrow Keys v2)

### Decision
Implement spacebar (play/pause) as mandatory in v1. Arrow keys (seek forward/backward) deferred to Phase 2.

### Rationale
- **Specification**: FR-012 states "System MUST display keyboard shortcuts or indicators"
- **UX Standard**: Spacebar for play/pause is universal media player convention
- **Implementation Complexity**: Spacebar (toggle boolean) vs arrow keys (seek by interval) differ in complexity
- **Assumptions**: "Keyboard shortcut support is a nice to have and can be added in a follow-up phase"
- **Phase 2**: Can add arrow keys (+/- 15 seconds) once v1 is stable

### Implementation Approach
Global keyboard event listener in StickyPlayer component:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      audioContext.togglePlayPause();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [audioContext]);
```

### Alternatives Considered
1. **No Keyboard Shortcuts**: Violates FR-012; omitted
2. **All Keyboard Shortcuts (v1)**: Arrow keys, J/K, etc.; too much scope for v1
3. **Floating Tooltip**: Display keyboard hints; acceptable but lower priority

### Validation
- Specification compliance: ✅ FR-012 (keyboard shortcut for play/pause)
- Constitution compliance: ✅ Accessibility (keyboard controls), User Testing (standard media player UX)
- E2E test: Press spacebar → verify play/pause toggles

---

## Decision 5: Collapse/Expand Animation

### Decision
Support expand/collapse UI toggle with 300ms ease-in-out transition (Tailwind `transition-all duration-300`).

### Rationale
- **Specification**: FR-007 "MUST support a collapsed/expanded toggle to minimize or maximize the player UI"
- **Mobile UX**: Collapsed state saves screen space on phones (<640px width)
- **Design System**: 300ms transitions mandated in Constitution for animation consistency
- **Success Criteria**: SC-002 specifies ≤12% viewport height (expanded), ≤5% (collapsed)

### Sizing Standards
- **Expanded State**: 
  - Height: ~120px (contains cover image, controls, progress bar)
  - Shows: Episode cover, title, play button, progress bar, time, volume, collapse button
- **Collapsed State**:
  - Height: ~48px (single row of controls)
  - Shows: Play button, episode title (mini), collapse toggle
  - Hides: Cover image, detailed controls, progress bar

### Implementation
Tailwind classes control visibility:
- Expanded: `h-auto` or `h-[120px]` with all child elements visible
- Collapsed: `h-[48px]` with `hidden` utility on detailed elements
- Animation: `transition-all duration-300 ease-in-out` on container

### Mobile-First Responsive
- Desktop (≥1024px): Player defaults to expanded (users have space)
- Tablet (768px-1024px): Player defaults to collapsed (save space)
- Mobile (<768px): Player defaults to collapsed (screen constraints)

### Validation
- Specification compliance: ✅ FR-007 (collapse/expand toggle), SC-002 (viewport percentage)
- Constitution compliance: ✅ Design System (300ms animation), Responsive Design (mobile-first)
- Unit test: Toggle button switches isCollapsed state
- E2E test: Collapse on desktop → navigate to mobile viewport → verify collapsed by default

---

## Decision 6: Content Obstruction Prevention (Padding Strategy)

### Decision
Add responsive bottom padding to main content wrapper to prevent sticky player from obscuring page content.

### Rationale
- **Specification**: FR-010 "System MUST ensure the sticky player does not obscure critical page content"
- **Scroll Behavior**: Without padding, scrolling to bottom of page places content under sticky player
- **Layout Engineering**: Padding on wrapper is cleaner than z-index games or dynamic height tracking

### Implementation
Modify `src/pages/_app.tsx` or central `Layout.tsx`:
```typescript
<main className="pb-[120px] md:pb-[100px] sm:pb-[60px]">
  <Component {...pageProps} />
</main>
```

### Padding Ratios
- Desktop (≥1024px): `pb-[120px]` (expanded player height + margin)
- Tablet (768px-1024px): `pb-[100px]` (accommodates both expanded and collapsed)
- Mobile (<768px): `pb-[60px]` (collapsed player height by default + margin)

### Testing Approach
- Visual test: Scroll to bottom of long page (e.g., FAQ with many items)
- Verify: Content is readable above sticky player; no text cut off or obscured
- Responsive: Test at 640px, 768px, 1024px, 1280px breakpoints

### Alternatives Considered
1. **Margin on Player**: Doesn't push content up; still obscures bottom of page
2. **Shadow + Transparency**: Visual hack; doesn't solve obstruction problem
3. **Dynamic Padding**: JavaScript calculates player height; overcomplicated
4. **Scroll Event Listener**: Move content above player on scroll; janky UX

### Validation
- Specification compliance: ✅ FR-010 (no obstruction), SC-005 (measurable criteria)
- Constitution compliance: ✅ Design System (responsive design), Accessibility (content always reachable)
- Layout test: Content scrolls above player, never hidden

---

## Technology Stack Confirmation

### No New Dependencies Required
Per existing podcast website project setup:
- ✅ React 18+ (already in use)
- ✅ Next.js 14+ (already in use)
- ✅ TypeScript (already in use, strict mode)
- ✅ Tailwind CSS 3+ (already in use)
- ✅ Jest (already in use for tests)
- ✅ React Testing Library (already in use)
- ✅ Cypress (already in use for E2E)

### No Additional Packages Needed
Sticky audio player uses only existing dependencies. No `npm install` required.

---

## Summary: All Decisions Documented

| # | Decision | Outcome | Impact |
|----|----------|---------|--------|
| 1 | React Context for state | Lightweight, spec-compliant | ✅ Minimal complexity |
| 2 | Fixed bottom positioning | Standard podcast UX | ✅ Easy to implement, familiar to users |
| 3 | Client-side nav persistence | Context survives Link nav | ✅ No extra code needed |
| 4 | Spacebar shortcuts v1 | Implement play/pause | ✅ Meets FR-012, simple UX |
| 5 | 300ms collapse animation | Design system compliance | ✅ Smooth UX, responsive |
| 6 | Padding for obstruction | Main wrapper pb adjustment | ✅ Solves FR-010, clean approach |

All decisions are **specification-compliant**, **constitution-aligned**, and **implementation-ready**.

---

**Status**: All research complete. Ready to proceed to Phase 1 Design phase and Phase 2 Implementation.
