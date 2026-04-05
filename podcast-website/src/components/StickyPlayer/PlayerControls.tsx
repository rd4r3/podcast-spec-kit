'use client';

import React, { RefObject } from 'react';
import { useAudio } from '@/context/AudioContext';

interface PlayerControlsProps {
  audioRef: RefObject<HTMLAudioElement>;
}

export default function PlayerControls({ audioRef }: PlayerControlsProps) {
  const { state, setIsPlaying, toggleCollapsed } = useAudio();

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Handle play errors silently
        });
      }
      setIsPlaying(!state.isPlaying);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 15
      );
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Skip backward button */}
      <button
        onClick={handleSkipBackward}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-label="Skip backward 15 seconds"
        title="Skip back 15s"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 12c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6-6 2.69-6 6zm1.53 0H13V4.5L9.5 8l3.5 3.5V10h5.47v2z" />
        </svg>
      </button>

      {/* Play/Pause button */}
      <button
        onClick={handlePlayPause}
        className="p-3 rounded-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
        aria-label={state.isPlaying ? 'Pause' : 'Play'}
        title={state.isPlaying ? 'Pause (spacebar)' : 'Play (spacebar)'}
      >
        {state.isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Skip forward button */}
      <button
        onClick={handleSkipForward}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-label="Skip forward 15 seconds"
        title="Skip forward 15s"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 12c0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6 6-2.69 6-6zm-1.53 0H11v5.5l3.5-3.5-3.5-3.5V14H5.53v-2z" />
        </svg>
      </button>

      {/* Collapse button */}
      <button
        onClick={toggleCollapsed}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 ml-auto"
        aria-label="Collapse player"
        title="Collapse"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>
  );
}
