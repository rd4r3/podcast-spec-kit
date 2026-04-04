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
