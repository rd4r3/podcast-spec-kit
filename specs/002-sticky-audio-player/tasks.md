---
description: "Task breakdown for Sticky Audio Player feature (002-sticky-audio-player)"
feature_branch: "002-sticky-audio-player"
created: 2026-04-05
total_tasks: 32
---

# Tasks: Sticky Audio Player

**Feature Branch**: `002-sticky-audio-player`  
**Input**: Design documents from `/specs/002-sticky-audio-player/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅  
**Testing**: Comprehensive test coverage required per Constitution (80%+ target)

**Organization**: Tasks grouped by user story to enable independent implementation and testing. Each user story is independently testable and deployable.

---

## Format Reference

```text
- [ ] [TaskID] [P?] [Story?] Description with exact file path
```

- **[ID]**: Sequential task number (T001, T002, ...)
- **[P]**: Optional parallelization marker (can run concurrently, no dependencies)
- **[Story]**: User story label [US1], [US2], [US3], or [US4] (omitted for setup/foundational/polish phases)
- **Description**: Clear action including exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure  
**Duration**: 0.5-1 day  
**Blocking**: No other phases can begin until this is complete

- [ ] T001 Create AudioContext type definitions in `podcast-website/src/types/audio.ts`
- [ ] T002 [P] Create project directory structure for audio player: `src/context/`, `src/components/StickyPlayer/`
- [ ] T003 [P] Verify TypeScript strict mode is enabled in `podcast-website/tsconfig.json`
- [ ] T004 [P] Verify ESLint and Prettier are configured for the project
- [ ] T005 Create constants file for audio player configurations in `podcast-website/src/utils/audioConstants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation  
**Duration**: 1-1.5 days  
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create AudioContext with provider in `podcast-website/src/context/AudioContext.tsx` (complete context with all state actions)
- [ ] T007 [P] Add AudioProvider wrapper to `podcast-website/src/pages/_app.tsx`
- [ ] T008 [P] Add custom useAudio hook in `podcast-website/src/context/AudioContext.tsx` (or separate file)
- [ ] T009 Add responsive bottom padding to main content wrapper in `podcast-website/src/components/Layout.tsx` to prevent sticky player obstruction
- [ ] T010 Create utility function `formatTime()` for displaying duration in `podcast-website/src/utils/formatters.ts`
- [ ] T011 [P] Create unit tests for AudioContext in `podcast-website/src/context/AudioContext.test.tsx` (test initial state, play, pause, seek, volume, collapse actions)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - Start Episode and Continue Browsing (Priority: P1) 🎯 MVP

**Goal**: Listener can start playing an episode on any page and playback continues uninterrupted as they navigate to other pages.

**Independent Test**: Start playback on homepage → navigate to episodes list → verify audio continues playing, player visible and functional. Should work on all pages (/, /episodes, /about, /faq, /episodes/[id]).

**User Story 1 Requirements Mapping**:
- FR-001: Render sticky player at bottom of viewport
- FR-002: Maintain audio playback state across page navigation
- FR-003: Display episode info (title, cover, duration, current time)
- FR-004: Provide play/pause button

### Tests for User Story 1 (Test-Driven Development)

- [ ] T012 [P] [US1] Write integration test for state persistence across page navigation in `podcast-website/cypress/e2e/sticky-player-state-persistence.cy.ts`
- [ ] T013 [P] [US1] Write integration test for playback continuation when navigating pages in `podcast-website/cypress/e2e/sticky-player-playback.cy.ts`
- [ ] T014 [P] [US1] Write unit test for play/pause state in Context in `podcast-website/src/context/AudioContext.test.tsx` (additional tests beyond T011)

### Implementation for User Story 1

- [ ] T015 [US1] Implement StickyPlayer component structure in `podcast-website/src/components/StickyPlayer.tsx` with expanded state UI (episode info, controls, progress bar)
- [ ] T016 [P] [US1] Create StickyPlayer subcomponents: `src/components/StickyPlayer/PlayerControls.tsx` (play/pause button, UI)
- [ ] T017 [P] [US1] Create StickyPlayer subcomponents: `src/components/StickyPlayer/EpisodeInfo.tsx` (title, cover, duration/current time display)
- [ ] T018 [US1] Integrate StickyPlayer component into `podcast-website/src/components/Layout.tsx` (render at bottom with fixed positioning)
- [ ] T019 [US1] Add hidden audio element to StickyPlayer for HTML5 audio playback in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T020 [US1] Sync Context state with HTML audio element (play/pause, currentTime, volume effects) in `podcast-website/src/components/StickyPlayer.tsx` using useEffect
- [ ] T021 [US1] Connect episode selection to Context (modify EpisodeCard component to dispatch setCurrentEpisode + play) in `podcast-website/src/components/EpisodeCard.tsx`
- [ ] T022 [P] [US1] Add unit tests for StickyPlayer expanded view rendering in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T023 [P] [US1] Add unit tests for play/pause button functionality in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T024 [US1] Test manually: Play episode on homepage → navigate to /episodes → verify playback continues, player visible

**Checkpoint**: User Story 1 complete - core sticky player with playback persistence functional and independently testable ✅

---

## Phase 4: User Story 2 - Player Controls and Visibility (Priority: P1)

**Goal**: All player controls (play/pause, progress bar, volume) work correctly across all pages. Player doesn't obstruct page content.

**Independent Test**: Verify play/pause button works on 3 different pages, progress bar seeks correctly, volume slider adjusts audio level, player doesn't obscure headers/CTAs/content on long pages.

**User Story 2 Requirements Mapping**:
- FR-004: Play/pause button functionality ✅ (partially from US1, complete here)
- FR-005: Progress bar with seek capability
- FR-006: Volume control slider
- FR-010: Ensure no content obstruction

### Tests for User Story 2

- [ ] T025 [P] [US2] Write unit test for progress bar seek functionality in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T026 [P] [US2] Write unit test for volume control in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T027 [US2] Write E2E test for seeking to position using progress bar in `podcast-website/cypress/e2e/sticky-player-controls.cy.ts`
- [ ] T028 [US2] Write E2E test for volume adjustment in `podcast-website/cypress/e2e/sticky-player-controls.cy.ts`
- [ ] T029 [US2] Write visual regression test: long FAQ page scrolled to bottom shows player above content in `podcast-website/cypress/e2e/sticky-player-layout.cy.ts`

### Implementation for User Story 2

- [ ] T030 [US2] Implement progress bar component in `podcast-website/src/components/StickyPlayer/ProgressBar.tsx` (range input with seek on change)
- [ ] T031 [US2] Implement volume control component in `podcast-website/src/components/StickyPlayer/VolumeControl.tsx` (slider, 0-1 range)
- [ ] T032 [P] [US2] Add time display logic (current time / total duration) in `podcast-website/src/components/StickyPlayer.tsx` (use formatTime utility)
- [ ] T033 [P] [US2] Connect progress bar to Context: seek action updates currentTime on input change in `podcast-website/src/components/StickyPlayer/ProgressBar.tsx`
- [ ] T034 [P] [US2] Connect volume control to Context: setVolume action on slider change in `podcast-website/src/components/StickyPlayer/VolumeControl.tsx`
- [ ] T035 [US2] Sync audio element with progress bar and volume changes in `podcast-website/src/components/StickyPlayer.tsx` using useEffect
- [ ] T036 [US2] Test responsive padding: Verify content scrolls above player on all breakpoints (640px, 768px, 1024px, 1280px)
- [ ] T037 [P] [US2] Add visual tests: Player doesn't obstruct critical page elements on homepage, episodes list, episode detail, about, FAQ pages
- [ ] T038 [US2] Verify dark mode styling for all controls (progress bar, volume slider, time display) in `podcast-website/src/components/StickyPlayer.tsx`

**Checkpoint**: User Stories 1 AND 2 complete - full playback control functionality working across all pages ✅

---

## Phase 5: User Story 3 - Collapse/Expand Player (Priority: P2)

**Goal**: Listeners can toggle between expanded (full controls) and collapsed (minimal) player states. Player remains functional in both states.

**Independent Test**: Click collapse button on expanded player → player transitions to compact view → click expand → full view restored. Controls work in both states. Collapsed state takes less vertical space.

**User Story 3 Requirements Mapping**:
- FR-007: Collapse/expand toggle functionality
- FR-011: Mobile responsive design (collapsed by default on mobile)

### Tests for User Story 3

- [ ] T039 [P] [US3] Write unit test for collapse/expand toggle in Context in `podcast-website/src/context/AudioContext.test.tsx`
- [ ] T040 [P] [US3] Write unit test for conditional rendering (expanded vs collapsed UI) in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T041 [US3] Write E2E test for collapse/expand toggle on desktop in `podcast-website/cypress/e2e/sticky-player-collapse.cy.ts`
- [ ] T042 [US3] Write E2E test for mobile-default-collapsed behavior (responsive) in `podcast-website/cypress/e2e/sticky-player-mobile.cy.ts`
- [ ] T043 [US3] Write E2E test for playback controls work in both expanded and collapsed states in `cypress/e2e/sticky-player-collapse.cy.ts`

### Implementation for User Story 3

- [ ] T044 [US3] Create collapsed player UI layout in `podcast-website/src/components/StickyPlayer/CollapsedView.tsx` (play button, title mini, time, expand toggle)
- [ ] T045 [US3] Create expand/collapse toggle button in `podcast-website/src/components/StickyPlayer.tsx` with 300ms transition animation
- [ ] T046 [US3] Implement conditional rendering logic in StickyPlayer: show expanded or collapsed based on Context.state.isCollapsed in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T047 [P] [US3] Add Tailwind transition classes for smooth 300ms animation on container height/opacity changes in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T048 [US3] Implement responsive defaults: collapsed by default on mobile (<768px), expanded on desktop (≥1024px) in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T049 [P] [US3] Add unit tests: Verify play/pause works in collapsed state in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T050 [P] [US3] Add unit tests: Verify expanded state shows all controls, collapsed state shows minimal controls in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T051 [US3] Test collapsed state height: Verify ≤5% viewport height (≈48px on desktop) vs expanded ≤12% (≈120px on desktop)
- [ ] T052 [US3] Test dark mode variants for collapsed view styling
- [ ] T053 [US3] Test animation smoothness: Toggle collapse/expand multiple times, verify 300ms transition

**Checkpoint**: User Stories 1, 2, AND 3 complete - sticky player with full functionality and responsive collapse/expand ✅

---

## Phase 6: User Story 4 - Audio Player State Persistence Across Navigation (Priority: P1)

**Goal**: Audio playback state (position, play/pause) is maintained when navigating between pages.

**Independent Test**: Play episode at position 5:30 → navigate to different page → verify playback continues from ~5:30 without reset. Pause episode → navigate away and back → verify pause state persists.

**User Story 4 Requirements Mapping**:
- FR-002: Maintain audio playback state (currentTime, isPlaying) across page navigation (core requirement)

### Tests for User Story 4

- [ ] T054 [P] [US4] Write integration test: Play episode → navigate using Link → verify currentTime hasn't reset in `podcast-website/cypress/e2e/sticky-player-persistence.cy.ts`
- [ ] T055 [P] [US4] Write integration test: Pause episode → navigate → verify isPlaying=false persists in `podcast-website/cypress/e2e/sticky-player-persistence.cy.ts`
- [ ] T056 [P] [US4] Write integration test: Seek to position → navigate between 3+ pages → verify currentTime maintained within 1 second accuracy in `podcast-website/cypress/e2e/sticky-player-persistence.cy.ts`
- [ ] T057 [US4] Write unit test: Context state survives shallow component remounts in `podcast-website/src/context/AudioContext.test.tsx`

### Implementation for User Story 4

- [ ] T058 [US4] Verify AudioProvider wrapping in `_app.tsx` ensures Context persists across Next.js Link navigation (verify no provider unmount/remount during navigation)
- [ ] T059 [US4] Verify audio element currentTime is read from Context.state.currentTime and synced via useEffect in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T060 [US4] Add timeupdate event listener to audio element to continuously update Context.state.currentTime in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T061 [US4] Test playback continuation: Play from different page (e.g., start on / then navigate to /episodes) - verify Context maintains state
- [ ] T062 [P] [US4] Test pause persistence: Pause at position → navigate 3 times → verify paused state maintained
- [ ] T063 [P] [US4] Test seek persistence: Seek to 2:45 → navigate to /about → navigate to /faq → verify position is ~2:45 (±1 second)
- [ ] T064 [US4] Manual test: Open DevTools → toggle audio playback → switch pages → verify currentTime updates shown in Network/Performance

**Checkpoint**: User Stories 1, 2, 3, AND 4 complete - sticky player fully functional with state persistence ✅ **FEATURE MVP COMPLETE**

---

## Phase 7: Keyboard Accessibility (Priority: P1, Optional for V1)

**Goal**: Spacebar play/pause functionality (keyboard shortcut support for accessibility).

**Independent Test**: Press spacebar → audio plays/pauses. Works from any page. Arrow keys deferred to Phase 2.

**User Story Mapping**: FR-012 (keyboard shortcuts - v1 scope: spacebar play/pause)

### Tests for Keyboard Accessibility

- [ ] T065 [P] Write unit test for spacebar keydown listener in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T066 [P] Write E2E test for spacebar play/pause on homepage in `podcast-website/cypress/e2e/sticky-player-keyboard.cy.ts`
- [ ] T067 [P] Write E2E test for spacebar play/pause from /episodes page in `podcast-website/cypress/e2e/sticky-player-keyboard.cy.ts`

### Implementation for Keyboard Accessibility

- [ ] T068 Add global keyboard event listener for spacebar in `podcast-website/src/components/StickyPlayer.tsx` (call togglePlayPause on spacebar, prevent default)
- [ ] T069 [P] Add ARIA label to spacebar shortcut button: "Play/pause audio (spacebar)" in `podcast-website/src/components/StickyPlayer.tsx`
- [ ] T070 [P] Test: Verify spacebar works from any page (doesn't conflict with textarea focus)
- [ ] T071 Test: Verify spacebar works when sticky player is not in focus

**Checkpoint**: Keyboard accessibility for v1 complete ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements and final validation across all features  
**Duration**: 1-1.5 days

### Quality & Coverage

- [ ] T072 [P] Run full test suite: All unit tests, integration tests, E2E tests in `podcast-website/`
- [ ] T073 [P] Run coverage report for AudioContext: Ensure ≥80% coverage in `podcast-website/src/context/AudioContext.test.tsx`
- [ ] T074 [P] Run coverage report for StickyPlayer: Ensure ≥80% coverage in `podcast-website/src/components/StickyPlayer.test.tsx`
- [ ] T075 [P] Run TypeScript strict mode check: `npm run tsc --noEmit` should pass with zero errors
- [ ] T076 [P] Run ESLint: `npm run lint` should pass with zero errors

### Dark Mode & Responsive

- [ ] T077 [P] Test dark mode: Navigate all pages with dark theme enabled, verify player colors/contrast in all states
- [ ] T078 [P] Test mobile (640px): Verify collapsed by default, player doesn't obstruct content on small screens
- [ ] T079 [P] Test tablet (768px): Verify responsive padding and controls visibility
- [ ] T080 [P] Test desktop (1024px, 1280px): Verify expanded state, full controls, proper spacing

### Accessibility & Performance

- [ ] T081 [P] WCAG 2.1 AA audit: Verify keyboard navigation, ARIA labels, color contrast in all player states
- [ ] T082 [P] Verify no console errors or warnings when using sticky player on all pages
- [ ] T083 [P] Performance test: Measure bundle size impact (should be <50KB for new code)
- [ ] T084 [P] Performance test: Verify no lag when toggling play/pause, seeking, changing volume

### Documentation & Setup

- [ ] T085 Review and verify quickstart.md setup guide still matches implementation in `podcast-website/`
- [ ] T086 [P] Add inline code comments to AudioContext.tsx explaining state shape and actions
- [ ] T087 [P] Add inline code comments to StickyPlayer.tsx explaining component structure
- [ ] T088 Update project README.md with sticky audio player feature description

### Final Validation

- [ ] T089 Full manual test: Complete user journey on all pages (/, /episodes, /about, /faq, /episodes/[id])
- [ ] T090 [P] Verify sticky player doesn't conflict with existing site functionality
- [ ] T091 [P] Run `npm run build` successfully (static export builds without errors)
- [ ] T092 [P] Verify generated static files include all pages with sticky player
- [ ] T093 Code review: Verify TypeScript strict mode, ESLint compliance, no unsafe patterns
- [ ] T094 Final checklist: All tasks complete, all tests passing, ready for merge to main

**Final Checkpoint**: Sticky Audio Player feature complete, tested, documented, and ready for production ✅

---

## Dependencies & Execution Order

### Critical Path (Minimum to Ship MVP)

1. ✅ **Phase 1: Setup** (Days 1, T001-T005) - 4 hours
2. ✅ **Phase 2: Foundational** (Days 1-2, T006-T011) - 8 hours
3. ✅ **Phase 3: User Story 1** (Days 2-3, T012-T024) - 8 hours
4. ✅ **Phase 4: User Story 2** (Days 3-4, T025-T038) - 8 hours
5. ✅ **Phase 5: User Story 3** (Days 4-5, T039-T053) - 6 hours
6. ✅ **Phase 6: User Story 4** (Days 5, T054-T064) - 4 hours
7. ⚠️ **Phase 7: Keyboard** (Optional for V1, T065-T071) - 2 hours
8. ✅ **Phase 8: Polish** (Day 5, T072-T094) - 4 hours

**Total MVP Duration**: 4-5 days (32 tasks, can parallelize within phases)

### Phase Dependencies

| Phase | Depends On | Can Begin After |
|-------|-----------|-----------------|
| 1: Setup | — | Immediately |
| 2: Foundational | Phase 1 ✅ | Setup complete |
| 3: US1 | Phase 2 ✅ | Foundational complete |
| 4: US2 | Phase 2 ✅ (US1 optional) | Foundational complete (US1 recommended) |
| 5: US3 | Phase 2 ✅ (US1, US2 optional) | Foundational complete |
| 6: US4 | Phase 2 ✅ (US1, US2, US3 optional) | Foundational complete |
| 7: Keyboard | Phase 2 ✅ (any US optional) | Foundational complete (after any US) |
| 8: Polish | All desired stories | Stories complete |

### User Story Independence

- **US1 (P1)**: Standalone - creates sticky player with basic playback
- **US2 (P1)**: Standalone - adds full controls (seek, volume) - can combine with US1 for better MVP
- **US3 (P2)**: Standalone - adds collapse/expand (mobile UX improvement)
- **US4 (P1)**: Standalone - ensures state persists (critical for core UX)

**Recommended MVP**: US1 + US2 + US4 (days 1-4) = Sticky player with state persistence and full controls

### Parallel Opportunities

**Within Phase 1** (Setup):
```
T002, T003, T004 → Can run in parallel (separate directories/configs)
```

**Within Phase 2** (Foundational):
```
T007, T008, T011 → Can run in parallel (separate files)
```

**Within Phase 3** (US1):
```
T016, T017 → Can run in parallel (separate subcomponents)
T022, T023 → Can run in parallel (separate test files)
```

**Within Phase 4** (US2):
```
T032, T033, T034 → Can run in parallel (separate component connections)
T037, T039 → Can run in parallel (separate visual tests)
```

**Within Phase 8** (Polish):
```
All [P] marked tasks → Can run in parallel (linting, testing, performance, docs)
```

**Between Stories** (if staffed):
```
Once Phase 2 complete:
- Developer A: Phase 3 (US1)
- Developer B: Phase 4 (US2)
- Developer C: Phase 5 (US3)
- Developer D: Phase 6 (US4)
All complete in parallel, then merge & validate
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 + 4)

**Recommended for shipping ASAP with core value**:

1. ✅ Complete **Phase 1: Setup** (4 hours)
2. ✅ Complete **Phase 2: Foundational** (8 hours) - BLOCKS everything, critical path
3. ✅ Complete **Phase 3: User Story 1** (8 hours) - Core sticky player with playback
4. ✅ Complete **Phase 4: User Story 2** (8 hours) - Full controls (seek, volume)
5. ✅ Complete **Phase 6: User Story 4** (4 hours) - State persistence (critical)
6. ⏭️ User Story 3 + Keyboard → Phase 2 releases
7. ✅ Complete **Phase 8: Polish** (4 hours) - Final validation

**MVP Time**: ~2 days (36 hours of work)  
**MVP Features**: Sticky player with playback, controls, and state persistence ✅

### Incremental Delivery (All Stories)

For complete feature with all polish:

1. Ship MVP (US1 + US2 + US4) → Validate with users
2. Add US3 (Collapse/Expand) → Improves mobile UX
3. Add US7 (Keyboard) → Accessibility improvement
4. Polish & optimize → Performance, dark mode, documentation

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] label**: Maps task to specific user story for traceability
- **Test first**: Write tests (T012-T014, etc.) and verify they FAIL before implementing (T015+)
- **Checkpoint validation**: Stop at each checkpoint to verify story works independently
- **Commit per task** or logical group to enable rollback if needed
- **Avoid cross-story dependencies** that would block independent testing

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 94 |
| **Phases** | 8 (Setup → Polish) |
| **User Stories** | 4 (P1, P1, P2, P1) |
| **Setup Tasks** | 5 |
| **Foundational Tasks** | 6 |
| **US1 Tasks** | 13 (4 tests, 9 impl) |
| **US2 Tasks** | 14 (5 tests, 9 impl) |
| **US3 Tasks** | 15 (5 tests, 10 impl) |
| **US4 Tasks** | 11 (4 tests, 7 impl) |
| **Keyboard Tasks** | 7 (3 tests, 4 impl) |
| **Polish Tasks** | 23 |
| **MVP Time** | ~2 days (36 hours) |
| **Full Feature Time** | ~4-5 days (50-60 hours) |
| **Parallelizable Tasks** | ~45% (marked [P]) |
| **Test Coverage Target** | 80%+ |

---

**Status**: Task breakdown complete and ready for implementation  
**Next Steps**: Assign team members, start Phase 1: Setup, follow execution order  
**Command**: Run `/speckit.implement` to begin execution, or assign tasks per phase
