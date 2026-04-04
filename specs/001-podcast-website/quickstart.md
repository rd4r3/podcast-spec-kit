# Quick Start Guide: Next.js Podcast Website

## Project Setup

### 1. Initialize Next.js Project

```bash
# Create a new Next.js project with TypeScript
npx create-next-app@latest podcast-website --ts --eslint --tailwind --src-dir --import-alias "@/*" --use-npm

cd podcast-website
```

### 2. Configure Static Export

Edit `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
```

### 3. Install Additional Dependencies

```bash
npm install date-fns @types/node-sass
```

### 4. Project Structure

```
podcast-website/
├── public/
│   ├── audio/          # Episode audio files
│   ├── images/         # All images (episodes, hosts, etc.)
│   └── favicon.ico
├── src/
│   ├── components/     # Reusable components
│   ├── data/           # Data files (episodes, hosts, FAQs)
│   ├── styles/         # Global styles and Tailwind config
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── pages/          # Page components
├── next.config.js
├── package.json
└── tsconfig.json
```

## Data Implementation

### 1. Create Data Directory Structure

```bash
mkdir -p src/data/episodes src/data/hosts
touch src/data/faqs.json src/data/site-metadata.json
```

### 2. Add Type Definitions

Create `src/types/index.ts`:

```typescript
export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  coverImage: string;
  audioFile: string;
  duration: string;
  publishDate: string;
  isFeatured: boolean;
  hosts: string[];
  tags?: string[];
  transcript?: string;
}

export interface PodcastHost {
  id: string;
  name: string;
  bio: string;
  photo: string;
  role: string;
  socialLinks?: Record<string, string>;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SiteMetadata {
  title: string;
  description: string;
  logo: string;
  favicon: string;
  socialLinks: Record<string, string>;
  copyright: string;
}
```

### 3. Create Data Loader Utility

Create `src/utils/data-loader.ts`:

```typescript
import { PodcastEpisode, PodcastHost, FAQItem, SiteMetadata } from '@/types';

// Load all episodes
export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  const modules = import.meta.glob('/src/data/episodes/*.json');
  const episodes = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const module = await loader();
      return module.default as PodcastEpisode;
    })
  );
  return episodes.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// Load a single episode by ID
export async function getEpisodeById(id: string): Promise<PodcastEpisode | null> {
  try {
    const episode = await import(`../data/episodes/${id}.json`);
    return episode.default as PodcastEpisode;
  } catch (error) {
    return null;
  }
}

// Load all hosts
export async function getAllHosts(): Promise<PodcastHost[]> {
  const modules = import.meta.glob('/src/data/hosts/*.json');
  const hosts = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const module = await loader();
      return module.default as PodcastHost;
    })
  );
  return hosts;
}

// Load FAQ items
export async function getFAQs(): Promise<FAQItem[]> {
  const faqs = await import('../data/faqs.json');
  return faqs.default.sort((a: FAQItem, b: FAQItem) => a.order - b.order);
}

// Load site metadata
export async function getSiteMetadata(): Promise<SiteMetadata> {
  const metadata = await import('../data/site-metadata.json');
  return metadata.default as SiteMetadata;
}
```

## Component Implementation

### 1. Create Core Components

**Audio Player (`src/components/AudioPlayer.tsx`)**:
```typescript
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 19V5h4v14h-4zM6 19V5h4v14H6z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {title}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-1 bg-blue-600 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Episode Card (`src/components/EpisodeCard.tsx`)**:
```typescript
import Link from 'next/link';
import Image from 'next/image';
import { PodcastEpisode } from '@/types';

interface EpisodeCardProps {
  episode: PodcastEpisode;
  hosts: Record<string, { name: string }>;
}

export default function EpisodeCard({ episode, hosts }: EpisodeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/episodes/${episode.id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={episode.coverImage}
            alt={episode.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {episode.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            {episode.description}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{new Date(episode.publishDate).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{episode.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            {episode.hosts.map((hostId) => (
              <span key={hostId} className="mr-1">
                {hosts[hostId]?.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
```

### 2. Create Layout Component

Create `src/components/Layout.tsx`:

```typescript
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteMetadata } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  metadata: SiteMetadata;
}

export default function Layout({ children, metadata }: LayoutProps) {
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.favicon} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <img
                  src={metadata.logo}
                  alt={metadata.title}
                  className="h-8 w-auto"
                />
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  {metadata.title}
                </span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                      router.pathname === link.href
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <button className="md:hidden text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-800 mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                {metadata.copyright}
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                {Object.entries(metadata.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label={platform}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {/* Platform-specific icon would go here */}
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.199 4.6 3.22 1.39-.008 2.685-.56 3.567-1.474.602 1.705 1.805 2.919 3.197 3.517 1.772-1.75 2.847-4.085 2.877-6.687z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
```

## Page Implementation

### 1. Home Page (`src/pages/index.tsx`)

```typescript
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import EpisodeCard from '@/components/EpisodeCard';
import { getAllEpisodes, getAllHosts, getSiteMetadata } from '@/utils/data-loader';
import { PodcastEpisode, PodcastHost, SiteMetadata } from '@/types';

interface HomePageProps {
  featuredEpisode: PodcastEpisode;
  recentEpisodes: PodcastEpisode[];
  hosts: Record<string, PodcastHost>;
  metadata: SiteMetadata;
}

export default function HomePage({
  featuredEpisode,
  recentEpisodes,
  hosts,
  metadata,
}: HomePageProps) {
  // Create a hosts map for quick lookup
  const hostsMap = hosts.reduce((acc, host) => {
    acc[host.id] = host;
    return acc;
  }, {} as Record<string, PodcastHost>);

  return (
    <Layout metadata={metadata}>
      {/* Featured Episode Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-xl p-6 md:p-8 text-white overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-2">
                Featured Episode
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {featuredEpisode.title}
              </h1>
              <p className="text-lg mb-6">
                {featuredEpisode.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredEpisode.hosts.map((hostId) => (
                  <div key={hostId} className="flex items-center">
                    <img
                      src={hostsMap[hostId]?.photo}
                      alt={hostsMap[hostId]?.name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="font-medium">
                      {hostsMap[hostId]?.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {new Date(featuredEpisode.publishDate).toLocaleDateString()}
                </span>
                <span className="text-sm">{featuredEpisode.duration}</span>
              </div>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img
                src={featuredEpisode.coverImage}
                alt={featuredEpisode.title}
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Episodes Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Episodes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              hosts={hostsMap}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [episodes, hosts, metadata] = await Promise.all([
    getAllEpisodes(),
    getAllHosts(),
    getSiteMetadata(),
  ]);

  const featuredEpisode = episodes.find((ep) => ep.isFeatured) || episodes[0];
  const recentEpisodes = episodes
    .filter((ep) => ep.id !== featuredEpisode.id)
    .slice(0, 6);

  return {
    props: {
      featuredEpisode,
      recentEpisodes,
      hosts,
      metadata,
    },
  };
};
```

### 2. Episodes Page (`src/pages/episodes/index.tsx`)

```typescript
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import EpisodeCard from '@/components/EpisodeCard';
import { getAllEpisodes, getAllHosts, getSiteMetadata } from '@/utils/data-loader';
import { PodcastEpisode, PodcastHost, SiteMetadata } from '@/types';

interface EpisodesPageProps {
  episodes: PodcastEpisode[];
  hosts: PodcastHost[];
  metadata: SiteMetadata;
}

export default function EpisodesPage({
  episodes,
  hosts,
  metadata,
}: EpisodesPageProps) {
  const hostsMap = hosts.reduce((acc, host) => {
    acc[host.id] = host;
    return acc;
  }, {} as Record<string, PodcastHost>);

  return (
    <Layout metadata={metadata}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          All Episodes
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              hosts={hostsMap}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [episodes, hosts, metadata] = await Promise.all([
    getAllEpisodes(),
    getAllHosts(),
    getSiteMetadata(),
  ]);

  return {
    props: {
      episodes,
      hosts,
      metadata,
    },
  };
};
```

### 3. Episode Detail Page (`src/pages/episodes/[id].tsx`)

```typescript
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import AudioPlayer from '@/components/AudioPlayer';
import { getAllEpisodes, getEpisodeById, getAllHosts, getSiteMetadata } from '@/utils/data-loader';
import { PodcastEpisode, PodcastHost, SiteMetadata } from '@/types';

interface EpisodeDetailPageProps {
  episode: PodcastEpisode;
  hosts: Record<string, PodcastHost>;
  relatedEpisodes: PodcastEpisode[];
  metadata: SiteMetadata;
}

export default function EpisodeDetailPage({
  episode,
  hosts,
  relatedEpisodes,
  metadata,
}: EpisodeDetailPageProps) {
  const episodeHosts = episode.hosts.map((hostId) => hosts[hostId]).filter(Boolean);

  return (
    <Layout metadata={metadata}>
      <div className="max-w-4xl mx-auto">
        <article className="mb-12">
          <div className="mb-6">
            <img
              src={episode.coverImage}
              alt={episode.title}
              className="w-full max-h-96 object-cover rounded-xl"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {episode.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
            <span>
              {new Date(episode.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {episode.duration}
            </span>
          </div>

          <div className="mb-8">
            <AudioPlayer src={episode.audioFile} title={episode.title} />
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              {episode.longDescription}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Hosts
            </h2>
            <div className="flex flex-wrap gap-4">
              {episodeHosts.map((host) => (
                <div key={host.id} className="flex items-center">
                  <img
                    src={host.photo}
                    alt={host.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {host.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {host.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {episode.tags && episode.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {episode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {relatedEpisodes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Episodes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedEpisodes.map((relatedEpisode) => (
                <div
                  key={relatedEpisode.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link href={`/episodes/${relatedEpisode.id}`} className="block">
                    <div className="relative h-40 w-full">
                      <Image
                        src={relatedEpisode.coverImage}
                        alt={relatedEpisode.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {relatedEpisode.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(relatedEpisode.publishDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const [episode, allEpisodes, hosts, metadata] = await Promise.all([
    getEpisodeById(id),
    getAllEpisodes(),
    getAllHosts(),
    getSiteMetadata(),
  ]);

  if (!episode) {
    return {
      notFound: true,
    };
  }

  // Find related episodes (same hosts or tags)
  const relatedEpisodes = allEpisodes
    .filter((ep) => ep.id !== id)
    .filter((ep) =>
      ep.hosts.some((hostId) => episode.hosts.includes(hostId)) ||
      (episode.tags && ep.tags && ep.tags.some((tag) => episode.tags?.includes(tag)))
    )
    .slice(0, 3);

  const hostsMap = hosts.reduce((acc, host) => {
    acc[host.id] = host;
    return acc;
  }, {} as Record<string, PodcastHost>);

  return {
    props: {
      episode,
      hosts: hostsMap,
      relatedEpisodes,
      metadata,
    },
  };
};
```

### 4. About Page (`src/pages/about.tsx`)

```typescript
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { getAllHosts, getSiteMetadata } from '@/utils/data-loader';
import { PodcastHost, SiteMetadata } from '@/types';

interface AboutPageProps {
  hosts: PodcastHost[];
  metadata: SiteMetadata;
}

export default function AboutPage({ hosts, metadata }: AboutPageProps) {
  return (
    <Layout metadata={metadata}>
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            About {metadata.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Welcome to {metadata.title}, your premier destination for insightful
              conversations about technology, culture, and the future. Our podcast
              brings together experts, innovators, and thought leaders to explore
              the topics that shape our world.
            </p>
            <p className="text-lg">
              Launched in 2023, we've grown from a small passion project to a community
              of thousands of listeners worldwide. Each episode is carefully crafted
              to provide value, whether you're a seasoned professional or just
              starting your journey.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Our Hosts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hosts.map((host) => (
              <div
                key={host.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={host.photo}
                      alt={host.name}
                      className="w-20 h-20 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {host.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {host.role}
                      </p>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{host.bio}</p>
                  </div>
                  {host.socialLinks && (
                    <div className="mt-4 flex space-x-3">
                      {Object.entries(host.socialLinks).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          aria-label={`${host.name}'s ${platform}`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            {/* Platform-specific icon */}
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.199 4.6 3.22 1.39-.008 2.685-.56 3.567-1.474.602 1.705 1.805 2.919 3.197 3.517 1.772-1.75 2.847-4.085 2.877-6.687z" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Our mission is to create engaging, high-quality content that
              informs, inspires, and connects people. We believe in the power
              of conversation to bridge gaps, challenge assumptions, and spark
              new ideas.
            </p>
            <p className="text-lg">
              Through thoughtful discussions with experts from various fields,
              we aim to:
            </p>
            <ul>
              <li>Demystify complex topics for a broad audience</li>
              <li>Highlight innovative solutions to real-world problems</li>
              <li>Foster a community of curious, lifelong learners</li>
              <li>Provide a platform for underrepresented voices</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [hosts, metadata] = await Promise.all([
    getAllHosts(),
    getSiteMetadata(),
  ]);

  return {
    props: {
      hosts,
      metadata,
    },
  };
};
```

### 5. FAQ Page (`src/pages/faq.tsx`)

```typescript
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { getFAQs, getSiteMetadata } from '@/utils/data-loader';
import { FAQItem, SiteMetadata } from '@/types';

interface FAQPageProps {
  faqs: FAQItem[];
  metadata: SiteMetadata;
}

export default function FAQPage({ faqs, metadata }: FAQPageProps) {
  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <Layout metadata={metadata}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h1>

        {Object.entries(faqsByCategory).map(([category, categoryFAQs]) => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {category}
            </h2>
            <div className="space-y-6">
              {categoryFAQs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-200">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [faqs, metadata] = await Promise.all([
    getFAQs(),
    getSiteMetadata(),
  ]);

  return {
    props: {
      faqs,
      metadata,
    },
  };
};
```

### 6. 404 Page (`src/pages/404.tsx`)

```typescript
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { getSiteMetadata } from '@/utils/data-loader';
import { SiteMetadata } from '@/types';

interface NotFoundPageProps {
  metadata: SiteMetadata;
}

export default function NotFoundPage({ metadata }: NotFoundPageProps) {
  return (
    <Layout metadata={metadata}>
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const metadata = await getSiteMetadata();

  return {
    props: {
      metadata,
    },
  };
};
```

## Testing Setup

### 1. Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### 2. Configure Jest

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
```

### 3. Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Example Component Test

Create `src/components/AudioPlayer.test.tsx`:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from './AudioPlayer';

describe('AudioPlayer', () => {
  const mockSrc = '/audio/test.mp3';
  const mockTitle = 'Test Episode';

  it('renders without crashing', () => {
    render(<AudioPlayer src={mockSrc} title={mockTitle} />);
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it('shows play button initially', () => {
    render(<AudioPlayer src={mockSrc} title={mockTitle} />);
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
  });

  it('toggles play/pause when clicked', () => {
    render(<AudioPlayer src={mockSrc} title={mockTitle} />);

    const playButton = screen.getByLabelText('Play');
    fireEvent.click(playButton);
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();

    const pauseButton = screen.getByLabelText('Pause');
    fireEvent.click(pauseButton);
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
  });

  it('displays time formatting', () => {
    render(<AudioPlayer src={mockSrc} title={mockTitle} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });
});
```

## Deployment Preparation

### 1. Build the Static Site

```bash
npm run build
```

### 2. Export for Static Hosting

```bash
npm run export
```

### 3. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

   Follow the prompts to link your project and deploy.

### 4. Alternative: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Sample Data

Create sample data files in the appropriate directories following the data model structure.

### Example Episode (`src/data/episodes/ep-001.json`):

```json
{
  "id": "ep-001",
  "title": "The Future of AI in Podcasting",
  "description": "Exploring how artificial intelligence is changing the podcast industry.",
  "longDescription": "In this episode, we dive deep into the world of AI and its impact on podcasting. From automated transcription services to AI-powered editing tools, we explore how these technologies are making podcast production more accessible while also raising important questions about authenticity and creativity.\n\nOur guests include Dr. Sarah Chen, AI researcher at Stanford, and Mark Thompson, founder of PodcastAI, a company developing AI tools specifically for podcasters.\n\nKey topics covered:\n- How AI is changing podcast production workflows\n- The ethics of AI-generated content\n- What the future might hold for AI in audio storytelling\n- Practical tools you can use today to enhance your podcast",
  "coverImage": "/images/episodes/ep-001.jpg",
  "audioFile": "/audio/episodes/ep-001.mp3",
  "duration": "01:23:45",
  "publishDate": "2023-05-15",
  "isFeatured": true,
  "hosts": ["host-001", "host-002"],
  "tags": ["technology", "ai", "future"]
}
```

### Example Host (`src/data/hosts/host-001.json`):

```json
{
  "id": "host-001",
  "name": "Alex Rivera",
  "bio": "Alex is a technology enthusiast with over 10 years of experience in podcasting. Starting as a hobbyist in college, Alex has grown to become one of the most recognized voices in tech podcasting. With a background in computer science and a passion for making complex topics accessible, Alex brings a unique perspective to every conversation.",
  "photo": "/images/hosts/alex-rivera.jpg",
  "role": "Host",
  "socialLinks": {
    "twitter": "https://twitter.com/alexrivera",
    "linkedin": "https://linkedin.com/in/alexrivera"
  }
}
```

### Example FAQ (`src/data/faqs.json`):

```json
[
  {
    "id": "faq-001",
    "question": "How often are new episodes released?",
    "answer": "We release new episodes every Tuesday and Friday. Make sure to subscribe to your favorite podcast platform to get notified when new episodes drop!",
    "category": "General",
    "order": 1
  },
  {
    "id": "faq-002",
    "question": "How can I suggest a topic or guest for the podcast?",
    "answer": "We love hearing from our listeners! You can suggest topics or guests by emailing us at suggestions@podcastname.com or by reaching out to us on social media. Please include as much detail as possible about your suggestion.",
    "category": "General",
    "order": 2
  },
  {
    "id": "faq-003",
    "question": "Where can I find transcripts of episodes?",
    "answer": "Transcripts are available for most episodes. You can find them on each episode's detail page on our website. We're working to make all episodes fully transcribed for better accessibility.",
    "category": "Accessibility",
    "order": 1
  }
]
```

### Example Site Metadata (`src/data/site-metadata.json`):

```json
{
  "title": "TechTalk Podcast",
  "description": "Exploring the intersection of technology, culture, and the future. Join us for insightful conversations with experts and innovators.",
  "logo": "/images/logo.svg",
  "favicon": "/images/favicon.ico",
  "socialLinks": {
    "twitter": "https://twitter.com/techtalkpod",
    "instagram": "https://instagram.com/techtalkpod",
    "facebook": "https://facebook.com/techtalkpod",
    "youtube": "https://youtube.com/techtalkpod"
  },
  "copyright": "© 2023 TechTalk Podcast. All rights reserved."
}
```

## Performance Optimization

### 1. Image Optimization

Configure Next.js image optimization in `next.config.js`:

```javascript
module.exports = {
  // ... existing config
  images: {
    domains: ['your-cdn-domain.com'], // if using external images
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};
```

### 2. Font Optimization

Add font preloading in `_document.tsx`:

```typescript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/inter.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 3. Bundle Analysis

Add bundle analysis to check for optimization opportunities:

```bash
npm install --save-dev @next/bundle-analyzer
```

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... existing config
});
```

Run with:
```bash
ANALYZE=true npm run build
```

## Final Checks

1. **Responsiveness**: Test on various screen sizes (320px to 1920px)
2. **Performance**: Run Lighthouse audit (aim for 90+ scores)
3. **Accessibility**: Verify WCAG 2.1 AA compliance
4. **SEO**: Check meta tags and structured data
5. **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
6. **Validation**: Run HTML/CSS validation