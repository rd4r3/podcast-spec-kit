'use client';

import React, { useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

interface ProgressBarProps {
  className?: string;
}

export default function ProgressBar({ className = '' }: ProgressBarProps) {
  const { state, setCurrentTime } = useAudio();
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * state.duration;
    
    setCurrentTime(newTime);
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Current time */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[2.5rem]">
        {formatTime(state.currentTime)}
      </span>

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="flex-grow h-1 bg-gray-300 dark:bg-dark-bg-tertiary rounded-full cursor-pointer hover:h-1.5 transition-all group"
        role="progressbar"
        aria-label="Playback progress"
        aria-valuenow={Math.floor(progressPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        {/* Filled portion */}
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Thumb */}
          <div className="float-right h-full w-4 bg-white dark:bg-dark-text rounded-full shadow-md transform -translate-x-1/2 top-1/2 -translate-y-1/2 relative opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[2.5rem] text-right">
        {formatTime(state.duration)}
      </span>
    </div>
  );
}
