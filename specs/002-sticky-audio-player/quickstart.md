# Quickstart: Implementing Sticky Audio Player

**Feature**: Sticky Audio Player  
**Branch**: `002-sticky-audio-player`  
**Estimated Duration**: 4-5 days  
**Prerequisite**: Familiarity with React Hooks, Next.js, Tailwind CSS, TypeScript

## Feature Overview

The sticky audio player is a fixed component that stays visible at the bottom of the viewport as users navigate the podcast website. It allows seamless audio playback while browsing episodes, show notes, and other pages.

**Key Features**:
- ✅ Audio playback state persists across page navigation
- ✅ Full playback controls (play/pause, seek, volume)
- ✅ Expand/collapse toggle for responsive UX
- ✅ Keyboard support (spacebar to play/pause)
- ✅ Dark mode and mobile-responsive design
- ✅ No content obstruction on any page

---

## Architecture Overview

### Component Structure

```
src/
├── context/
│   └── AudioContext.tsx          # Audio state management
├── components/
│   └── StickyPlayer.tsx          # Fixed player UI component
├── pages/
│   ├── _app.tsx                  # Wrap with AudioProvider
│   └── [other pages...]          # Consume audio state
└── types/
    └── index.ts                  # (may need to add audio types)
```

### State Flow

```
AudioContext (global state)
    ├── currentEpisodeId (string | null)
    ├── currentTime (number)
    ├── isPlaying (boolean)
    ├── volume (number, 0-1)
    └── isCollapsed (boolean)
           │
           └─→ StickyPlayer (reads + updates state)
                   └─→ useAudio hook (consume context)
           └─→ EpisodeCard (dispatch setCurrentEpisode + play)
```

---

## Step-by-Step Implementation

### Phase 1: Audio Context (Days 1-2)

#### Step 1.1: Create AudioContext.tsx

**File**: `podcast-website/src/context/AudioContext.tsx`

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions
export interface AudioState {
  currentEpisodeId: string | null;
  currentTime: number;
  isPlaying: boolean;
  volume: number; // 0 to 1
  isCollapsed: boolean;
}

export interface AudioContextType {
  state: AudioState;
  setCurrentEpisode: (episodeId: string) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleCollapsed: () => void;
}

// Create context with undefined default (force usage within provider)
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Provider component
export function AudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AudioState>({
    currentEpisodeId: null,
    currentTime: 0,
    isPlaying: false,
    volume: 0.8,
    isCollapsed: false,
  });

  const setCurrentEpisode = (episodeId: string) => {
    setState(prev => ({ ...prev, currentEpisodeId: episodeId }));
  };

  const play = () => {
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const pause = () => {
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const togglePlayPause = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const seek = (time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const toggleCollapsed = () => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  const value: AudioContextType = {
    state,
    setCurrentEpisode,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    toggleCollapsed,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// Custom hook to use audio context
export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
```

**Testing** (`src/context/AudioContext.test.tsx`):
```typescript
import { renderHook, act } from '@testing-library/react';
import { AudioProvider, useAudio } from './AudioContext';

describe('AudioContext', () => {
  const wrapper = ({ children }: any) => (
    <AudioProvider>{children}</AudioProvider>
  );

  test('initializes with default state', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    expect(result.current.state.isPlaying).toBe(false);
    expect(result.current.state.volume).toBe(0.8);
    expect(result.current.state.isCollapsed).toBe(false);
  });

  test('play action sets isPlaying to true', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => {
      result.current.play();
    });
    expect(result.current.state.isPlaying).toBe(true);
  });

  test('pause action sets isPlaying to false', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => {
      result.current.play();
      result.current.pause();
    });
    expect(result.current.state.isPlaying).toBe(false);
  });

  test('togglePlayPause toggles isPlaying', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => {
      result.current.togglePlayPause();
    });
    expect(result.current.state.isPlaying).toBe(true);
    act(() => {
      result.current.togglePlayPause();
    });
    expect(result.current.state.isPlaying).toBe(false);
  });

  test('seek updates currentTime', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => {
      result.current.seek(125.5);
    });
    expect(result.current.state.currentTime).toBe(125.5);
  });

  test('setVolume clamps value between 0 and 1', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => {
      result.current.setVolume(1.5); // Should clamp to 1
    });
    expect(result.current.state.volume).toBe(1);
    act(() => {
      result.current.setVolume(-0.5); // Should clamp to 0
    });
    expect(result.current.state.volume).toBe(0);
  });

  test('toggleCollapsed toggles isCollapsed', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => {
      result.current.toggleCollapsed();
    });
    expect(result.current.state.isCollapsed).toBe(true);
  });
});
```

#### Step 1.2: Wrap App with AudioProvider

**File**: `podcast-website/src/pages/_app.tsx`

```typescript
import { AudioProvider } from '@/context/AudioContext';
import Layout from '@/components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AudioProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AudioProvider>
  );
}

export default MyApp;
```

---

### Phase 2: StickyPlayer Component (Days 2-3)

#### Step 2.1: Create StickyPlayer.tsx

**File**: `podcast-website/src/components/StickyPlayer.tsx`

```typescript
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAudio } from '@/context/AudioContext';
import { getEpisodeById } from '@/utils/loaders'; // Assuming this exists

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export function StickyPlayer() {
  const { state, seek, togglePlayPause, setVolume, toggleCollapsed } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [episode, setEpisode] = useState<any>(null);

  // Load episode data when episodeId changes
  useEffect(() => {
    if (state.currentEpisodeId) {
      const ep = getEpisodeById(state.currentEpisodeId);
      setEpisode(ep);
    }
  }, [state.currentEpisodeId]);

  // Sync audio element with context state
  useEffect(() => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioRef.current.play().catch(() => {
        // Handle autoplay policy restrictions
      });
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = state.currentTime;
    }
  }, [state.currentTime]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      seek(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  if (!episode) {
    return null; // Don't render player if no episode selected
  }

  // Hidden audio element for playback
  const audioSrc = `/audio/episodes/${state.currentEpisodeId}.mp3`;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Sticky player container */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
        {/* Expanded view */}
        {!state.isCollapsed && (
          <div className="px-4 py-3 max-w-full">
            {/* Top row: Episode info and collapse button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {/* Episode cover */}
                <div className="flex-shrink-0 w-14 h-14 rounded overflow-hidden">
                  <Image
                    src={episode.coverImage}
                    alt={episode.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Episode title and time */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {episode.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatTime(state.currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </div>

              {/* Collapse button */}
              <button
                onClick={toggleCollapsed}
                className="ml-2 p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                aria-label="Collapse player"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={state.currentTime}
                onChange={handleProgressBarChange}
                className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer accent-blue-500"
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              {/* Play/Pause button */}
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                aria-label={state.isPlaying ? 'Pause' : 'Play'}
              >
                {state.isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume control */}
              <div className="flex items-center gap-2 flex-1 mx-4">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={state.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer accent-blue-500"
                  aria-label="Volume"
                />
              </div>

              {/* Episode duration display */}
              <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        )}

        {/* Collapsed view */}
        {state.isCollapsed && (
          <div className="px-4 py-2 flex items-center justify-between h-14 gap-2">
            {/* Play/Pause button */}
            <button
              onClick={togglePlayPause}
              className="p-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors flex-shrink-0"
              aria-label={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Episode title (abbreviated) */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {episode.title}
              </h4>
            </div>

            {/* Progress indicator (mini) */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {formatTime(state.currentTime)}
            </div>

            {/* Expand button */}
            <button
              onClick={toggleCollapsed}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0"
              aria-label="Expand player"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default StickyPlayer;
```

#### Step 2.2: Integrate into Layout

**File**: `podcast-website/src/components/Layout.tsx` (modify existing)

```typescript
import StickyPlayer from './StickyPlayer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>{/* Navigation */}</nav>
      
      {/* Main content with bottom padding for sticky player */}
      <main className="pb-[120px] md:pb-[100px] sm:pb-[60px]">
        {children}
      </main>

      {/* Sticky player */}
      <StickyPlayer />
    </>
  );
}
```

#### Step 2.3: Integrate Episode Selection

**File**: `podcast-website/src/components/EpisodeCard.tsx` (modify existing)

```typescript
import { useAudio } from '@/context/AudioContext';

export function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const { setCurrentEpisode, play } = useAudio();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentEpisode(episode.id);
    play();
  };

  return (
    <div className="...">
      {/* Episode card content */}
      <button onClick={handlePlay} className="...">
        Play
      </button>
    </div>
  );
}
```

#### Step 2.4: Testing

**File**: `src/components/StickyPlayer.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StickyPlayer } from './StickyPlayer';
import { AudioProvider } from '@/context/AudioContext';

describe('StickyPlayer', () => {
  const renderWithAudio = (component: React.ReactNode) => {
    return render(
      <AudioProvider>
        {component}
      </AudioProvider>
    );
  };

  test('renders play button when episode is loaded', () => {
    renderWithAudio(<StickyPlayer />);
    // Would need mock episode data to fully test
  });

  test('toggles collapse state when collapse button clicked', () => {
    renderWithAudio(<StickyPlayer />);
    // Test collapse button functionality
  });

  test('updates progress bar when current time changes', () => {
    renderWithAudio(<StickyPlayer />);
    // Test progress bar updates
  });
});
```

---

### Phase 3: E2E Testing (Day 4)

**File**: `podcast-website/cypress/e2e/sticky-player.cy.ts`

```typescript
describe('Sticky Player', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('starts playing an episode and maintains state when navigating', () => {
    // Start playing episode on homepage
    cy.get('button').contains('Play').first().click();
    cy.get('button[aria-label="Pause"]').should('exist');

    // Navigate to episodes page
    cy.get('a').contains('Episodes').click();

    // Verify player still shows and is playing
    cy.get('button[aria-label="Pause"]').should('exist');
    cy.get('[aria-label="Volume"]').should('exist');
  });

  it('collapses and expands player', () => {
    // Play episode
    cy.get('button').contains('Play').first().click();

    // Collapse
    cy.get('button[aria-label="Collapse player"]').click();
    cy.get('h3').should('not.be.visible'); // Episode title hidden in collapsed

    // Expand
    cy.get('button[aria-label="Expand player"]').click();
    cy.get('h3').should('be.visible');
  });

  it('seeks to new position using progress bar', () => {
    cy.get('button').contains('Play').first().click();
    cy.get('input[type="range"]').first().invoke('val', 120).trigger('input');
    cy.get('input[type="range"]').first().should('have.value', '120');
  });
});
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Audio Element Not Syncing with Context State
**Problem**: HTML `<audio>` element doesn't update when context state changes.  
**Solution**: Use `useEffect` hooks to sync context state to audio element properties:
```typescript
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = state.volume;
  }
}, [state.volume]);
```

### Pitfall 2: Player State Resets on Page Reload
**Problem**: User expects playback to resume after full page reload.  
**Solution**: Add localStorage persistence (v2 feature):
```typescript
useEffect(() => {
  localStorage.setItem('playerState', JSON.stringify(state));
}, [state]);
```

### Pitfall 3: Player Obscures Content on Mobile
**Problem**: Fixed player at bottom covers page content on small screens.  
**Solution**: Add responsive bottom padding (already in template above).

### Pitfall 4: Audio Plays in Multiple Tabs
**Problem**: User opens site in two tabs, both play audio simultaneously.  
**Solution**: This is acceptable in v1 (noted as edge case). V2 can add shared state via localStorage.

---

## Checklist

- [ ] `AudioContext.tsx` created with full state management
- [ ] `AudioProvider` wraps app in `_app.tsx`
- [ ] `StickyPlayer.tsx` component created with expanded/collapsed views
- [ ] StickyPlayer integrated into Layout
- [ ] Episode selection (`EpisodeCard`) dispatches play action
- [ ] Bottom padding added to main content wrapper
- [ ] Unit tests written for AudioContext (80%+ coverage)
- [ ] Unit tests written for StickyPlayer (80%+ coverage)
- [ ] Integration tests verify state persistence across page nav
- [ ] E2E tests verify user workflows (play, pause, seek, navigate)
- [ ] Dark mode tested and working
- [ ] Mobile responsive tested (640px, 768px, 1024px)
- [ ] Accessibility tested (keyboard nav, ARIA labels)
- [ ] Build succeeds with no errors
- [ ] All tests pass
- [ ] TypeScript strict mode compliance verified
- [ ] ESLint checks pass

---

## Resources

- [React Context API Docs](https://react.dev/reference/react/useContext)
- [Next.js Link Component](https://nextjs.org/docs/api-reference/next/link)
- [Tailwind CSS Positioning](https://tailwindcss.com/docs/position)
- [HTMLAudioElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Testing Docs](https://docs.cypress.io/)

---

**Status**: Implementation guide complete. Ready to start Phase 1.
