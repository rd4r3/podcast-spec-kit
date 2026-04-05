# Feature Specification: Sticky Audio Player

**Feature Branch**: `002-sticky-audio-player`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "A sticky (or floating) audio player stays visible at the bottom (or top) of the screen as visitors navigate your site. This allows listeners to start an episode on the homepage and continue playing it while browsing show notes, guest profiles, or your blog. Improves user experience by enabling seamless listening. Increases episode completion rates. Commonly seen on high-performing podcast sites like Serial and The Daily"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently

  TESTING REQUIREMENTS (from Constitution):
  - Unit tests for individual components
  - Integration tests for component interactions
  - End-to-end tests for user flows
  - Minimum 80% test coverage
  - Tests must be written before implementation for critical components
-->

### User Story 1 - Start Episode and Continue Browsing (Priority: P1)

A listener discovers an episode on the homepage, clicks play, and wants to continue listening while exploring other parts of the site. The audio player remains accessible and visible without interrupting their navigation, allowing them to easily control playback from anywhere on the site.

**Why this priority**: This is the core value proposition of the feature. It directly enables the primary use case of uninterrupted listening while browsing, which is essential for the feature to deliver its promised UX improvement.

**Independent Test**: Can be fully tested by starting playback on one page, navigating to different pages (episodes list, about, FAQ), and verifying playback continues uninterrupted with player visible and functional on each page. Delivers seamless listening experience as the core MVP.

**Acceptance Scenarios**:

1. **Given** listener is on the homepage with an episode loaded, **When** they click the play button, **Then** audio begins playing and the player remains visible as they navigate to other pages
2. **Given** an episode is currently playing, **When** user navigates to the episodes list page, **Then** playback continues without interruption and the player remains visible at the bottom of the screen
3. **Given** an episode is currently playing, **When** user navigates to the about page, **Then** playback continues without interruption and the player remains visible at the bottom of the screen
4. **Given** an episode is currently playing on any page, **When** user clicks the pause button in the player, **Then** audio pauses and playback state persists if they navigate away and return
5. **Given** audio is playing in the sticky player, **When** user scrolls the page content, **Then** the player remains fixed and always visible, not affected by scrolling

---

### User Story 2 - Player Controls and Visibility (Priority: P1)

The sticky player displays essential playback controls (play/pause, progress bar, volume, current time) that remain accessible and functional regardless of what page the listener is viewing. The player's position and visual prominence don't interfere with main page content.

**Why this priority**: The sticky player must be functional and usable from any location on the site. If controls are not accessible or playback state is not visible, the feature fails to deliver its primary benefit.

**Independent Test**: Can be fully tested by verifying that all playback controls (play/pause, seek, volume) work correctly from multiple pages, the progress bar reflects actual playback position, and the player doesn't obstruct important page content. Delivers core functionality of the feature.

**Acceptance Scenarios**:

1. **Given** a sticky player is visible at the bottom of the screen, **When** user clicks the play/pause button, **Then** playback state changes correctly
2. **Given** an episode is playing in the sticky player, **When** user clicks on the progress bar to seek, **Then** playback jumps to the selected position
3. **Given** audio is playing, **When** user adjusts the volume slider in the sticky player, **Then** audio volume changes accordingly
4. **Given** a sticky player is visible, **When** user views the main page content, **Then** the player does not obscure critical page elements (headers, CTAs, important content)
5. **Given** the player is at the bottom of the screen, **When** user scrolls to the very bottom of a long page, **Then** the player remains visible and accessible without covering content

---

### User Story 3 - Collapse/Expand Player (Priority: P2)

Listeners can minimize the sticky player to a compact form (showing only playback button and episode title) or expand it to show full controls. This gives users control over how much screen real estate the player uses while maintaining the ability to see and control playback.

**Why this priority**: This improves usability on smaller screens and gives users flexibility to hide the player when not needed while keeping essential info visible. Secondary to core playback functionality but valuable for mobile UX.

**Independent Test**: Can be fully tested by toggling between collapsed and expanded states on multiple pages, verifying that essential controls are always accessible, and that the player doesn't obstruct content in either state.

**Acceptance Scenarios**:

1. **Given** the sticky player is in expanded state showing all controls, **When** user clicks a collapse button or toggle, **Then** player transitions to a compact/minimal view showing only play button and current track info
2. **Given** the player is in collapsed state, **When** user clicks an expand button, **Then** player transitions back to full control view
3. **Given** player is in collapsed state, **When** user clicks the play/pause button, **Then** playback controls still work correctly
4. **Given** a compact player is visible, **When** comparing screen space used versus full player, **Then** collapsed state uses noticeably less vertical space while remaining functional

---

### User Story 4 - Audio Player State Persistence Across Navigation (Priority: P1)

When a listener navigates between pages with an episode playing, the player state (current time, playback position, pause/play status) is maintained. If they navigate away and come back, playback resumes from where they left off.

**Why this priority**: State persistence is critical for seamless listening. Without it, listeners would lose their place in the episode, defeating the purpose of the sticky player and frustrating users.

**Independent Test**: Can be fully tested by playing an episode, navigating to different pages, then returning to verify playback position is maintained. Can also test by pausing, navigating away, and verifying pause state persists.

**Acceptance Scenarios**:

1. **Given** an episode is playing at position 5:30, **When** user navigates to another page, **Then** the player continues playing from the current position without resetting
2. **Given** an episode is paused at position 3:45, **When** user navigates away and returns to the site, **Then** playback resumes from the paused position when user clicks play
3. **Given** an episode is at 50% progress in the current session, **When** user navigates between multiple pages, **Then** playback position is maintained at approximately 50% without drifting or resetting

---

### Edge Cases

- What happens when user has two instances of the site open in different tabs? (Player state may conflict; each tab should manage independently)
- How does the player behave when network connectivity is lost during playback? (Should pause gracefully and show buffering/error state)
- What if user selects a new episode while one is already playing? (Should pause current episode and load new one, or ask for confirmation)
- How does the player handle very long pages where content extends well below the viewport? (Player must remain accessible and not become obscured)
- What happens on mobile devices with limited screen space? (Collapsed state becomes more important; may need responsive adjustments)
- How does the player behave when audio file fails to load or becomes unavailable? (Should show error state clearly and allow user to select another episode)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST render a sticky audio player that remains visible and fixed at the bottom of the viewport at all times as users navigate between pages
- **FR-002**: System MUST maintain audio playback state (current position, play/pause status) as users navigate to different pages without interruption
- **FR-003**: Sticky player MUST display the current episode title, cover image, current playback time, and total duration
- **FR-004**: Sticky player MUST provide play/pause button that controls audio playback
- **FR-005**: Sticky player MUST provide a progress bar that shows current playback position and allows users to seek to a new position
- **FR-006**: Sticky player MUST provide a volume control (slider or buttons) to adjust audio level
- **FR-007**: Sticky player MUST support a collapsed/expanded toggle to minimize or maximize the player UI
- **FR-008**: System MUST allow users to load a new episode from the main content area while the sticky player is visible, managing the transition gracefully
- **FR-009**: Sticky player MUST use React Context or equivalent state management to persist audio state across page navigations
- **FR-010**: System MUST ensure the sticky player does not obscure critical page content or interactive elements
- **FR-011**: Sticky player MUST remain accessible and functional on both desktop and mobile viewports
- **FR-012**: System MUST display keyboard shortcuts (spacebar for play/pause, arrow keys for seeking) or indicators for accessibility

### Key Entities

- **AudioPlayerState**: Manages current playback position (currentTime), playback status (playing/paused), volume level, and current episode reference
- **StickyPlayer Component**: The UI component that displays at the bottom of viewport with controls and episode information
- **EpisodeReference**: Link to the currently playing episode data (id, title, cover, duration, audioFile)

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can start playing an episode and navigate to at least 3 different pages while playback continues uninterrupted, maintaining playback position within 1 second accuracy
- **SC-002**: The sticky player occupies no more than 12% of the viewport height in expanded state and no more than 5% in collapsed state on desktop (1024px+ width)
- **SC-003**: All player controls (play/pause, seek, volume) respond to user input within 200ms of interaction
- **SC-004**: 95% of automated tests pass, including unit tests for AudioContext, integration tests for player state persistence across page transitions, and E2E tests for user workflows
- **SC-005**: The sticky player does not obstruct any critical page content (headers, CTAs, navigation, main body text) when compared against layout specs
- **SC-006**: Average episode completion rate increases by 15% compared to baseline (measured by tracking completion events before and after feature launch)
- **SC-007**: User satisfaction for audio playback experience improves by at least 20% in post-launch surveys
- **SC-008**: Mobile users (on screens 640px wide and smaller) successfully complete playback of at least one full episode per session without complaints about player obstruction

## Assumptions

- The existing audio playback functionality and audio file handling will be reused from the current implementation
- The React Context API or equivalent state management pattern is appropriate for this use case (no need for external state library like Redux)
- Users have sufficient browser cache/memory to maintain audio stream and state across page navigations
- The audio files are hosted and accessible from all pages (no CORS or loading issues)
- Keyboard shortcut support (spacebar, arrow keys) is a "nice to have" and can be added in a follow-up phase if not critical for v1
- Mobile optimization is important but the initial implementation can prioritize desktop UX, with mobile refinements in v2
- The sticky player will be positioned at the bottom of the viewport; positioning at the top is deferred to v2
- Audio player controls will match the existing design system (Tailwind colors, spacing, and styling conventions)
- Autoplay is not supported by default; users must explicitly click play to start listening
- The feature integrates with the existing episodes data model without requiring schema changes
