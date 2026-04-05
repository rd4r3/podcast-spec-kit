import React from 'react'
import { render, screen } from '@testing-library/react'
import EpisodeDetailPage from '@/pages/episodes/[id]'
import { PodcastEpisode } from '@/types'

const mockEpisode: PodcastEpisode = {
  id: 'ep-001',
  title: 'Episode 1: Getting Started',
  description: 'Short description of the episode',
  publishDate: '2024-01-20',
  duration: '45:30',
  coverImage: '/images/episodes/ep-001.jpg',
  audioFile: '/audio/episodes/ep-001.mp3',
  hosts: ['host-001', 'host-002'],
  isFeatured: true,
  showNotes: 'Show notes for episode 1',
  longDescription: 'In this episode, we dive deep into getting started with the latest technologies and best practices.',
  tags: ['podcast', 'beginner', 'tutorial'],
}

const mockRelatedEpisodes: PodcastEpisode[] = [
  {
    id: 'ep-002',
    title: 'Episode 2: Advanced Topics',
    description: 'Short description of the episode',
    publishDate: '2024-01-19',
    duration: '52:15',
    coverImage: '/images/episodes/ep-002.jpg',
    audioFile: '/audio/episodes/ep-002.mp3',
    hosts: ['host-001', 'host-002'],
    isFeatured: false,
    showNotes: 'Show notes for episode 2',
    longDescription: 'Exploring advanced concepts and techniques',
    tags: ['podcast', 'advanced'],
  },
  {
    id: 'ep-003',
    title: 'Episode 3: Q&A Session',
    description: 'Short description of the episode',
    publishDate: '2024-01-18',
    duration: '38:45',
    coverImage: '/images/episodes/ep-003.jpg',
    audioFile: '/audio/episodes/ep-003.mp3',
    hosts: ['host-001', 'host-002'],
    isFeatured: false,
    showNotes: 'Show notes for episode 3',
    longDescription: 'Answering listener questions and discussing common topics',
    tags: ['podcast', 'qa'],
  },
]

describe('Episode Detail Page', () => {
  it('renders the episode detail page without crashing', () => {
    const { container } = render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(container).toBeInTheDocument()
    const headings = screen.getAllByText('Episode 1: Getting Started')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('displays the episode title', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    const heading = screen.getByRole('heading', { name: 'Episode 1: Getting Started' })
    expect(heading).toBeInTheDocument()
  })

  it('displays the episode long description', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('In this episode, we dive deep into getting started with the latest technologies and best practices.')).toBeInTheDocument()
  })

  it('displays episode metadata (duration)', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('45:30')).toBeInTheDocument()
  })

  it('renders the audio player', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    const audioElement = screen.getByRole('region', { name: /Audio player/i })
    expect(audioElement).toBeInTheDocument()
  })

  it('displays related episodes section', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('Related Episodes')).toBeInTheDocument()
  })

  it('displays all related episodes', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    mockRelatedEpisodes.forEach((relatedEpisode) => {
      expect(screen.getByText(relatedEpisode.title)).toBeInTheDocument()
    })
  })

  it('displays tags when present', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('Tags')).toBeInTheDocument()
    mockEpisode.tags?.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it('displays "About This Episode" sidebar', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('About This Episode')).toBeInTheDocument()
  })

  it('displays host information in sidebar', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('Hosts')).toBeInTheDocument()
  })

  it('renders back to episodes link', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    const backLink = screen.getByRole('link', { name: /Back to Episodes/ })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/episodes')
  })

  it('handles missing episode gracefully', () => {
    render(
      <EpisodeDetailPage episode={null} relatedEpisodes={[]} />
    )
    expect(screen.getByText('Episode not found')).toBeInTheDocument()
  })

  it('renders responsive layout with grid', () => {
    const { container } = render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    const mainGrid = container.querySelector('.grid')
    expect(mainGrid).toHaveClass('md:grid-cols-3')
  })

  it('displays show notes section', () => {
    render(
      <EpisodeDetailPage episode={mockEpisode} relatedEpisodes={mockRelatedEpisodes} />
    )
    expect(screen.getByText('Show Notes')).toBeInTheDocument()
  })
})
