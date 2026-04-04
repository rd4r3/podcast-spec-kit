import { GetStaticProps } from 'next';
import { PodcastHost, SiteMetadata } from '@/types';
import { getAllHosts, getSiteMetadata } from '@/utils/data-loader';

interface AboutProps {
  hosts: PodcastHost[];
  metadata: SiteMetadata;
}

export default function AboutPage({ hosts, metadata }: AboutProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">About Our Podcast</h1>

      {/* Mission Statement */}
      <section className="card mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {metadata.description}
        </p>
      </section>

      {/* Hosts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Meet Our Hosts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hosts.map((host) => (
            <div key={host.id} className="card">
              <img
                src={host.photo}
                alt={host.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-2xl font-bold text-center mb-2">{host.name}</h3>
              <p className="text-center text-blue-500 font-semibold mb-4">{host.role}</p>
              <p className="text-gray-700 dark:text-gray-300 text-center mb-4">{host.bio}</p>
              
              {host.socialLinks && Object.keys(host.socialLinks).length > 0 && (
                <div className="flex justify-center gap-4">
                  {Object.entries(host.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const hosts = await getAllHosts();
  const metadata = await getSiteMetadata();

  return {
    props: {
      hosts,
      metadata,
    },
  };
};
