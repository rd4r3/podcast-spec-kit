'use client';

import React from 'react';
import Link from 'next/link';
import { useAudio } from '@/context/AudioContext';
import { PodcastEpisode } from '@/types';

interface FeaturedEpisodeSectionProps {
  featuredEpisode: PodcastEpisode;
}

export default function FeaturedEpisodeSection({ featuredEpisode }: FeaturedEpisodeSectionProps) {
  const { setCurrentEpisode, play } = useAudio();

  const handlePlayNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentEpisode(featuredEpisode.id);
    play();
  };

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="flex items-center justify-center">
            <img
              src={featuredEpisode.coverImage}
              alt={featuredEpisode.title}
              className="w-full max-w-sm rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">Featured Episode</h2>
            <h3 className="text-3xl font-bold mb-4">{featuredEpisode.title}</h3>
            <p className="text-lg mb-6 opacity-90">{featuredEpisode.description}</p>
            <div className="flex gap-4">
              <button
                onClick={handlePlayNow}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                ▶ Play Now
              </button>
              <Link
                href={`/episodes/${featuredEpisode.id}`}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                Show Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
