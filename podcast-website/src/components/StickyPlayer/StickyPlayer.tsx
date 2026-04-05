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
  const { state, setIsPlaying, setCurrentTime, setDuration } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [episodeData, setEpisodeData] = useState<Episode | null>(null);

  // Find current episode
  useEffect(() => {
    if (state.currentEpisodeId) {
      const episode = episodes.find(ep => ep.id === state.currentEpisodeId);
      setEpisodeData(episode || null);
    }
  }, [state.currentEpisodeId, episodes]);

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

  // Handle audio events
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Don't render if no episode is selected
  if (!state.currentEpisodeId || !episodeData) {
    return null;
  }

  const audioSrc = `/audio/episodes/${state.currentEpisodeId}.mp3`;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Sticky player container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg-secondary shadow-lg border-t border-gray-200 dark:border-dark-bg-tertiary transition-all duration-300 ease-in-out">
        {state.isCollapsed ? (
          <CollapsedView episodeData={episodeData} />
        ) : (
          <div className="max-w-7xl mx-auto w-full px-4 py-4 space-y-3">
            {/* Episode info */}
            <EpisodeInfo episodeData={episodeData} />

            {/* Progress bar */}
            <ProgressBar />

            {/* Controls and volume */}
            <div className="flex items-center justify-between">
              <PlayerControls audioRef={audioRef} />
              <VolumeControl />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
