import { GetStaticProps } from 'next';
import Link from 'next/link';
import { PodcastEpisode } from '@/types';
import { getAllEpisodes } from '@/utils/data-loader';
import { formatDate } from '@/utils/date-utils';

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
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden shadow-lg">
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
                <Link
                  href={`/episodes/${featuredEpisode.id}`}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
                >
                  Listen Now
                </Link>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:bg-opacity-10">
                  Add to Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Episodes Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recent Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEpisodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/episodes/${episode.id}`}
              className="card hover:shadow-xl hover:scale-105"
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
