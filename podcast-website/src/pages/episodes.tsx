import { GetStaticProps } from 'next';
import Link from 'next/link';
import { PodcastEpisode } from '@/types';
import { getAllEpisodes } from '@/utils/data-loader';
import { formatDate } from '@/utils/date-utils';

interface EpisodesProps {
  episodes: PodcastEpisode[];
}

export default function EpisodesPage({ episodes }: EpisodesProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">All Episodes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <Link
            key={episode.id}
            href={`/episodes/${episode.id}`}
            className="card hover:shadow-xl hover:scale-105 cursor-pointer"
          >
            <img
              src={episode.coverImage}
              alt={episode.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{episode.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {episode.description}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{formatDate(episode.publishDate)}</span>
              <span>{episode.duration}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<EpisodesProps> = async () => {
  const episodes = await getAllEpisodes();

  return {
    props: {
      episodes,
    },
  };
};
