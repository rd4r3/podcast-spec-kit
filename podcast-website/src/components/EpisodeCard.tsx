'use client';

import React from 'react';
import Link from 'next/link';
import { useAudio } from '@/context/AudioContext';

interface Episode {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  duration: string;
  publishDate: string;
}

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const { setCurrentEpisode, play } = useAudio();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentEpisode(episode.id);
    play();
  };

  return (
    <div className="group relative card hover:shadow-xl hover:scale-105 transition-all duration-300">
      {/* Image container */}
      <div className="relative w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-200 dark:bg-dark-bg-tertiary">
        <img
          src={episode.coverImage}
          alt={episode.title}
          className="w-full h-full object-cover"
        />
        {/* Play overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={`Play ${episode.title}`}
        >
          <svg
            className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <Link href={`/episodes/${episode.id}`} className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
          {episode.title}
        </h3>
      </Link>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {episode.description}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{new Date(episode.publishDate).toLocaleDateString()}</span>
        <span>{episode.duration}</span>
      </div>
    </div>
  );
}
