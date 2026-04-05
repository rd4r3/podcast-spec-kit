import { GetStaticProps } from 'next';
import EpisodeCard from '@/components/EpisodeCard';
import FeaturedEpisodeSection from '@/components/FeaturedEpisodeSection';
import { PodcastEpisode } from '@/types';
import { getAllEpisodes } from '@/utils/data-loader';

interface HomeProps {
  featuredEpisode: PodcastEpisode | null;
  recentEpisodes: PodcastEpisode[];
}

export default function Home({ featuredEpisode, recentEpisodes }: HomeProps) {
  if (!featuredEpisode) {
    return <div>No episodes found</div>;
  }

  return (
    <div>
      {/* Featured Episode Section */}
      <FeaturedEpisodeSection featuredEpisode={featuredEpisode} />

      {/* Recent Episodes Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Recent Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEpisodes.map((episode) => (
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
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const episodes = await getAllEpisodes();
  const featuredEpisode = episodes.find((e) => e.isFeatured) || null;
  const recentEpisodes = episodes.slice(0, 6);

  return {
    props: {
      featuredEpisode,
      recentEpisodes,
    },
  };
};
