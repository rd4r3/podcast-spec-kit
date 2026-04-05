import { GetStaticProps } from 'next';
import EpisodeCard from '@/components/EpisodeCard';
import { PodcastEpisode } from '@/types';
import { getAllEpisodes } from '@/utils/data-loader';

interface EpisodesProps {
  episodes: PodcastEpisode[];
}

export default function EpisodesPage({ episodes }: EpisodesProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">All Episodes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={{
              id: episode.id,
              title: episode.title,
              description: episode.description,
              coverImage: episode.coverImage,
              duration: episode.duration,
              publishDate: episode.publishDate,
            }}
          />
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
