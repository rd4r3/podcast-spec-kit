'use client';

import React, { useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

interface VolumeControlProps {
  className?: string;
}

export default function VolumeControl({ className = '' }: VolumeControlProps) {
  const { state, setVolume } = useAudio();
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    if (state.volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.8);
    }
  };

  const volumePercentage = Math.round(state.volume * 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Mute button */}
      <button
        onClick={handleMuteToggle}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-label={state.volume === 0 ? 'Unmute' : 'Mute'}
        title={state.volume === 0 ? 'Unmute' : 'Mute'}
      >
        {state.volume === 0 ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19.1 4.9L4.9 19.1c.9 1.3 2.4 2.1 4.1 2.1 3.31 0 6-2.69 6-6 0-1.7-.8-3.2-2.1-4.1l8.1-8.1zm0-2.83L2.07 15.07c.5 1 1.4 2 2.4 2.6l13.6-13.6zM2 4.1v2.36c-1.1.7-2 1.97-2 3.54 0 3.31 2.69 6 6 6 1.57 0 2.84-.9 3.54-2h2.36C7.3 16.99 4.7 19 2 19s-5-2.3-5-5.2c0-1.8.8-3.4 2-4.6V4.1z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>

      {/* Volume slider */}
      <input
        ref={sliderRef}
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={state.volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 bg-gray-300 dark:bg-dark-bg-tertiary rounded-full cursor-pointer accent-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
        aria-label="Volume"
        title={`Volume: ${volumePercentage}%`}
      />

      {/* Volume percentage */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[2rem]">
        {volumePercentage}%
      </span>
    </div>
  );
}
