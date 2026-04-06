'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';

interface Episode {
  id: string;
  title: string;
  coverImage: string;
}

interface CollapsedViewProps {
  episodeData: Episode;
}

export default function CollapsedView({ episodeData }: CollapsedViewProps) {
  const { state, setIsPlaying, toggleCollapsed } = useAudio();

  const handlePlayPause = () => {
    setIsPlaying(!state.isPlaying);
  };

  const handleExpand = () => {
    toggleCollapsed();
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-1 flex items-center gap-3">
      {/* Expand button */}
      <button
        onClick={handleExpand}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-label="Expand player"
        title="Expand"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Cover and title */}
      <div className="flex-grow min-w-0 flex items-center gap-2">
        <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-200 dark:bg-dark-bg-tertiary shadow-sm">
          <img
            src={episodeData.coverImage}
            alt={episodeData.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
            {episodeData.title}
          </p>
        </div>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={handlePlayPause}
        className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg flex-shrink-0"
        aria-label={state.isPlaying ? 'Pause' : 'Play'}
        title={state.isPlaying ? 'Pause' : 'Play'}
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
    </div>
  );
}
