import { PodcastEpisode, PodcastHost, FAQItem, SiteMetadata } from '@/types';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');

export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  const episodesDir = path.join(dataDir, 'episodes');
  const files = fs.readdirSync(episodesDir).filter((f) => f.endsWith('.json'));
  
  const episodes: PodcastEpisode[] = files.map((file) => {
    const filePath = path.join(episodesDir, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as PodcastEpisode;
  });
  
  return episodes.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export async function getEpisodeById(id: string): Promise<PodcastEpisode | null> {
  try {
    const filePath = path.join(dataDir, 'episodes', `${id}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as PodcastEpisode;
  } catch {
    return null;
  }
}

export async function getAllHosts(): Promise<PodcastHost[]> {
  const hostsDir = path.join(dataDir, 'hosts');
  const files = fs.readdirSync(hostsDir).filter((f) => f.endsWith('.json'));
  
  return files.map((file) => {
    const filePath = path.join(hostsDir, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as PodcastHost;
  });
}

export async function getHostById(id: string): Promise<PodcastHost | null> {
  try {
    const filePath = path.join(dataDir, 'hosts', `${id}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as PodcastHost;
  } catch {
    return null;
  }
}

export async function getAllFAQs(): Promise<FAQItem[]> {
  try {
    const filePath = path.join(dataDir, 'faqs.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const faqs = JSON.parse(data) as FAQItem[];
    return faqs.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function getSiteMetadata(): Promise<SiteMetadata> {
  try {
    const filePath = path.join(dataDir, 'site-metadata.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as SiteMetadata;
  } catch {
    return {
      title: 'Podcast Website',
      description: 'A modern podcast website',
      logo: '/logo.png',
      favicon: '/favicon.ico',
      socialLinks: {},
      copyright: '© 2024 Podcast Website. All rights reserved.',
    };
  }
}
