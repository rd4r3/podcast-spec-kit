'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import EpisodeInfo from './EpisodeInfo';
import CollapsedView from './CollapsedView';

interface Episode {
  id: string;
  title: string;
  coverImage: string;
  duration: string;
  audioFile: string;
}

interface StickyPlayerProps {
  episodes: Episode[];
}

export default function StickyPlayer({ episodes }: StickyPlayerProps) {
  const { state, setIsPlaying, setCurrentTime, setDuration, toggleCollapsed } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [episodeData, setEpisodeData] = useState<Episode | null>(null);
  const initialResponsiveSetupRef = useRef(false);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = state.isPlaying;

  // Find current episode
  useEffect(() => {
    if (state.currentEpisodeId) {
      const episode = episodes.find(ep => ep.id === state.currentEpisodeId);
      setEpisodeData(episode || null);
    }
  }, [state.currentEpisodeId, episodes]);

  // Responsive default: collapsed on mobile (<768px), expanded on desktop
  // Only runs once on initial mount to set the default state
  useEffect(() => {
    if (initialResponsiveSetupRef.current) return; // Only run once

    initialResponsiveSetupRef.current = true;
    const isMobile = window.innerWidth < 768;

    // Set collapsed state based on initial screen size
    if (isMobile && !state.isCollapsed) {
      toggleCollapsed();
    }
  });

  // Keyboard accessibility: Spacebar for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore spacebar when focus is in input, textarea, or select
      const activeElement = document.activeElement;
      const isInputField = activeElement?.tagName === 'INPUT' ||
                           activeElement?.tagName === 'TEXTAREA' ||
                           activeElement?.tagName === 'SELECT';

      if (e.code === 'Space' && !isInputField) {
        e.preventDefault();
        if (audioRef.current) {
          if (isPlayingRef.current) {
            audioRef.current.pause();
          } else {
            audioRef.current.play().catch(() => {
              // Handle play errors silently
            });
          }
          setIsPlaying(!isPlayingRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Attach audio event listeners directly to the DOM element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (isPlayingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [state.currentEpisodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play the audio when a new episode is selected or the audio element becomes available
  // This handles the case where episodes load asynchronously
  useEffect(() => {
    if (!audioRef.current || !state.isPlaying) return;

    audioRef.current.play().catch(() => {
      // Handle play errors silently
    });
  }, [state.currentEpisodeId, episodeData, state.isPlaying]);

  // Sync audio element with context state
  useEffect(() => {
    if (!audioRef.current) return;

    if (state.isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        // Handle play errors silently
      });
    } else if (!state.isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  // Sync audio time from context
  useEffect(() => {
    if (!audioRef.current) return;
    if (Math.abs(audioRef.current.currentTime - state.currentTime) > 0.1) {
      audioRef.current.currentTime = state.currentTime;
    }
  }, [state.currentTime]);

  // Sync audio volume from context
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Don't render if no episode is selected
  if (!state.currentEpisodeId || !episodeData) {
    return null;
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        key={state.currentEpisodeId}
        ref={audioRef}
        src={episodeData.audioFile}
        autoPlay={state.isPlaying}
      />

      {/* Sticky player container */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg-secondary shadow-lg border-t border-gray-200 dark:border-dark-bg-tertiary transition-all duration-300 ease-in-out ${
          state.isCollapsed ? 'h-12' : 'h-auto'
        }`}
        role="region"
        aria-label="Audio player"
      >
        {state.isCollapsed ? (
          <CollapsedView episodeData={episodeData} />
        ) : (
          <div className="max-w-7xl mx-auto w-full px-4 py-1">
            {/* Main row: Episode info, controls, volume, collapse */}
            <div className="flex items-center gap-4">
              {/* Episode info */}
              <div className="flex-shrink-0">
                <EpisodeInfo episodeData={episodeData} />
              </div>

              {/* Progress bar - full width remaining */}
              <div className="flex-grow min-w-0">
                <ProgressBar />
              </div>

              {/* Collapse toggle */}
              <button
                onClick={toggleCollapsed}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 flex-shrink-0"
                aria-label="Collapse player"
                title="Collapse player"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between mt-3">
              <PlayerControls audioRef={audioRef} />
              <VolumeControl />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
