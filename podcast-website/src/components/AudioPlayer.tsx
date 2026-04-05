import React, { useRef, useEffect, useState, useCallback } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  coverImage?: string;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * Custom Audio Player Component
 * Features:
 * - Play/Pause controls
 * - Progress bar with scrubbing
 * - Volume control
 * - Keyboard shortcuts (space for play/pause)
 * - Loading state indication
 * - Time display
 * - Accessibility support
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Episode',
  coverImage,
  onLoadingChange,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't intercept if user is typing in an input
    if ((e.target as HTMLElement).matches('input, textarea, [contenteditable]')) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (audioRef.current) {
          if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
          } else {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        }
        break;
      case 'ArrowRight':
        // Skip forward 10 seconds
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            duration,
            audioRef.current.currentTime + 10
          );
        }
        break;
      case 'ArrowLeft':
        // Skip backward 10 seconds
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(
            0,
            audioRef.current.currentTime - 10
          );
        }
        break;
      case 'ArrowUp':
        // Increase volume
        e.preventDefault();
        setVolume((prev) => Math.min(1, prev + 0.1));
        if (audioRef.current) {
          audioRef.current.volume = Math.min(1, volume + 0.1);
        }
        break;
      case 'ArrowDown':
        // Decrease volume
        e.preventDefault();
        setVolume((prev) => Math.max(0, prev - 0.1));
        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, volume - 0.1);
        }
        break;
      case 'KeyM':
        // Mute/unmute
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.muted = !audioRef.current.muted;
        }
        break;
      default:
        break;
    }
  }, [duration, volume]);

  // Register keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setVolume(audio.volume);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isSeeking]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleProgressSeekStart = () => {
    setIsSeeking(true);
  };

  const handleProgressSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-dark-bg-secondary rounded-base shadow-md p-6 space-y-4" role="region" aria-label="Audio player">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={src} crossOrigin="anonymous" />

      {/* Title */}
      {title && (
        <div className="flex items-center gap-4">
          {coverImage && (
            <img
              src={coverImage}
              alt={title}
              className="w-16 h-16 rounded-sm object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Now Playing</p>
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-sm text-center text-gray-500 dark:text-gray-400 py-2">
          Loading audio...
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          onMouseDown={handleProgressSeekStart}
          onMouseUp={handleProgressSeekEnd}
          onTouchStart={handleProgressSeekStart}
          onTouchEnd={handleProgressSeekEnd}
          className="w-full h-2 bg-gray-200 dark:bg-dark-bg-tertiary rounded-full cursor-pointer appearance-none accent-primary-500"
          aria-label="Progress"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Skip Backward */}
        <button
          onClick={skipBackward}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
          title="Skip backward 10 seconds (←)"
          aria-label="Skip backward 10 seconds"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
          <span className="text-xs mt-1 block">-10s</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transition-all disabled:opacity-50"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 1.5A.75.75 0 004 2.75v14.5a.75.75 0 001.75 0V2.75A.75.75 0 005.75 1.5zm8.5 0A.75.75 0 0012 2.75v14.5a.75.75 0 001.75 0V2.75a.75.75 0 00-1.75 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        {/* Skip Forward */}
        <button
          onClick={skipForward}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
          title="Skip forward 10 seconds (→)"
          aria-label="Skip forward 10 seconds"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          <span className="text-xs mt-1 block">+10s</span>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0118 10a6.972 6.972 0 01-1.929 4.828 1 1 0 01-1.414-1.414A4.972 4.972 0 0016 10c0-1.713-.672-3.262-1.757-4.364a1 1 0 010-1.414z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-gray-200 dark:bg-dark-bg-tertiary rounded-full cursor-pointer appearance-none accent-primary-500"
          title="Volume control (↑/↓)"
          aria-label="Volume"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Keyboard Shortcuts Help */}
      <details className="text-xs text-gray-600 dark:text-gray-400">
        <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
          Keyboard shortcuts
        </summary>
        <div className="mt-2 p-2 bg-gray-100 dark:bg-dark-bg-tertiary rounded space-y-1">
          <p><kbd>Space</kbd> Play/Pause</p>
          <p><kbd>→</kbd> Skip forward 10s</p>
          <p><kbd>←</kbd> Skip backward 10s</p>
          <p><kbd>↑</kbd> Volume up</p>
          <p><kbd>↓</kbd> Volume down</p>
          <p><kbd>M</kbd> Mute</p>
        </div>
      </details>
    </div>
  );
};

export default AudioPlayer;
