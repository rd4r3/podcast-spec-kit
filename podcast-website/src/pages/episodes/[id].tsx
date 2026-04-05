import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { PodcastEpisode } from '@/types';
import { getAllEpisodes, getEpisodeById } from '@/utils/data-loader';
import { formatDate } from '@/utils/date-utils';
import AudioPlayer from '@/components/AudioPlayer';

interface EpisodeDetailProps {
  episode: PodcastEpisode | null;
  relatedEpisodes?: PodcastEpisode[];
}

export default function EpisodeDetailPage({ episode, relatedEpisodes = [] }: EpisodeDetailProps) {
  if (!episode) {
    return <div>Episode not found</div>;
  }

  return (
    <div>
      <Link href="/episodes" className="text-blue-500 hover:text-blue-600 mb-8 inline-block">
        ← Back to Episodes
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{episode.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {formatDate(episode.publishDate)} • {episode.duration}
          </p>

          {/* Audio Player */}
          <div className="mb-8">
            <AudioPlayer
              src={episode.audioFile}
              title={episode.title}
              coverImage={episode.coverImage}
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Show Notes</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {episode.longDescription}
            </p>
          </div>

          {/* Tags */}
          {episode.tags && episode.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {episode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Episodes */}
          {relatedEpisodes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Related Episodes</h2>
              <div className="grid grid-cols-1 gap-4">
                {relatedEpisodes.map((relatedEpisode) => (
                  <Link
                    key={relatedEpisode.id}
                    href={`/episodes/${relatedEpisode.id}`}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2">{relatedEpisode.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {formatDate(relatedEpisode.publishDate)} • {relatedEpisode.duration}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {relatedEpisode.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <div className="card sticky top-8">
            <h3 className="text-xl font-bold mb-4">About This Episode</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                <p className="font-semibold">{episode.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Published</p>
                <p className="font-semibold">{formatDate(episode.publishDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hosts</p>
                <div className="space-y-1">
                  {episode.hosts.map((hostId) => (
                    <p key={hostId} className="font-semibold text-sm">
                      {hostId}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const episodes = await getAllEpisodes();
  const paths = episodes.map((episode) => ({
    params: { id: episode.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<EpisodeDetailProps> = async ({
  params,
}) => {
  const id = params?.id as string;
  const episode = await getEpisodeById(id);

  return {
    props: {
      episode,
    },
  };
};
