'use client';

import React from 'react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Current time */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[2.5rem]" aria-live="polite">
        {formatTime(state.currentTime)}
      </span>

      {/* Progress bar with range input */}
      <div className="flex-grow relative">
        <input
          type="range"
          min="0"
          max={state.duration || 100}
          step="0.1"
          value={state.currentTime}
          onChange={handleInputChange}
          className="w-full h-1 bg-gray-300 dark:bg-dark-bg-tertiary rounded-full cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
          aria-label="Seek playback"
          role="slider"
          aria-valuenow={state.currentTime}
          aria-valuemin={0}
          aria-valuemax={state.duration}
        />
        {/* Visual progress indicator overlay */}
        <div className="absolute inset-0 h-1 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[2.5rem] text-right" aria-live="polite">
        {formatTime(state.duration)}
      </span>
    </div>
  );
}
