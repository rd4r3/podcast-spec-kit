'use client';

import React from 'react';

interface Episode {
  id: string;
  title: string;
  coverImage: string;
}

interface EpisodeInfoProps {
  episodeData: Episode;
}

export default function EpisodeInfo({ episodeData }: EpisodeInfoProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Cover image */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-bg-tertiary shadow-sm">
        <img
          src={episodeData.coverImage}
          alt={episodeData.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Episode title and info */}
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {episodeData.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          Now playing
        </p>
      </div>
    </div>
  );
}
