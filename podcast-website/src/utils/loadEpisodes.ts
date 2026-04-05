import fs from 'fs';
import path from 'path';

interface Episode {
  id: string;
  title: string;
  coverImage: string;
  duration: string;
  audioFile: string;
}

const episodesDir = path.join(process.cwd(), 'src', 'data', 'episodes');

export function loadAllEpisodes(): Episode[] {
  try {
    const files = fs.readdirSync(episodesDir)
      .filter(file => file.endsWith('.json'))
      .sort();

    return files.map(file => {
      const filePath = path.join(episodesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const episode = JSON.parse(content);
      
      return {
        id: episode.id,
        title: episode.title,
        coverImage: episode.coverImage,
        duration: episode.duration,
        audioFile: episode.audioFile || `/audio/episodes/${episode.id}.mp3`,
      };
    });
  } catch (error) {
    console.error('Failed to load episodes:', error);
    return [];
  }
}
