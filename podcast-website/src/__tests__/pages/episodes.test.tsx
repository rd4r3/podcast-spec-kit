import { render, screen } from '@testing-library/react'
import EpisodesPage from '@/pages/episodes'
import { PodcastEpisode } from '@/types'

const mockEpisodes: PodcastEpisode[] = Array.from({ length: 20 }, (_, i) => ({
  id: `ep-${String(i + 1).padStart(3, '0')}`,
  title: `Episode ${i + 1}: ${['Industry Insights', 'Advanced Topics', 'Q&A Session', 'Behind the Scenes', 'Interview Special'][i % 5]}`,
  description: 'Exploring fascinating topics with our expert guests. This episode covers important developments in the industry.',
  publishDate: `2024-01-${String(20 - i).padStart(2, '0')}`,
  duration: `${String(Math.floor(Math.random() * 60) + 30).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  coverImage: `/images/episodes/ep-${String(i + 1).padStart(3, '0')}.jpg`,
  audioFile: `/audio/episodes/ep-${String(i + 1).padStart(3, '0')}.mp3`,
  hosts: ['host-001', 'host-002'],
  isFeatured: i === 0,
  showNotes: `Show notes for episode ${i + 1}`,
  longDescription: 'In this episode, we dive deep into important topics and explore various perspectives. Our hosts discuss the latest developments and share insights from industry experts.',
  tags: ['podcast', 'discussion', 'insights'],
}))

describe('Episodes Page', () => {
  it('renders the episodes page without crashing', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    expect(screen.getByText('All Episodes')).toBeInTheDocument()
  })

  it('displays the page title', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    expect(screen.getByText('All Episodes')).toBeInTheDocument()
  })

  it('displays all 20 episodes', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    mockEpisodes.forEach((episode) => {
      expect(screen.getByText(episode.title)).toBeInTheDocument()
    })
  })

  it('renders episode cards with cover images', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    const images = screen.getAllByAltText(/Episode/)
    expect(images.length).toBe(20)
  })

  it('displays episode descriptions', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    const descriptions = screen.getAllByText(/Exploring fascinating topics/)
    expect(descriptions.length).toBeGreaterThan(0)
  })

  it('displays publish dates and duration for episodes', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    // Check that spans with time content exist (the duration)
    const spans = screen.getAllByText(/\d{2}:\d{2}/)
    expect(spans.length).toBeGreaterThan(0)
  })

  it('renders episode cards as clickable links', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    const firstEpisodeLink = screen.getAllByRole('link').find(link => link.getAttribute('href') === '/episodes/ep-001')
    expect(firstEpisodeLink).toBeInTheDocument()
    expect(firstEpisodeLink).toHaveAttribute('href', '/episodes/ep-001')
  })

  it('renders all episodes with correct navigation links', () => {
    render(<EpisodesPage episodes={mockEpisodes} />)
    const allLinks = screen.getAllByRole('link')
    mockEpisodes.forEach((episode) => {
      const link = allLinks.find(l => l.getAttribute('href') === `/episodes/${episode.id}`)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', `/episodes/${episode.id}`)
    })
  })

  it('uses responsive grid layout classes', () => {
    const { container } = render(<EpisodesPage episodes={mockEpisodes} />)
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('applies card styling to episode cards', () => {
    const { container } = render(<EpisodesPage episodes={mockEpisodes} />)
    const cards = container.querySelectorAll('.card')
    expect(cards.length).toBe(20)
  })

  it('applies hover effects to cards', () => {
    const { container } = render(<EpisodesPage episodes={mockEpisodes} />)
    const cards = container.querySelectorAll('.card')
    cards.forEach((card) => {
      expect(card).toHaveClass('hover:shadow-xl', 'hover:scale-105')
    })
  })

  it('handles empty episodes list gracefully', () => {
    render(<EpisodesPage episodes={[]} />)
    expect(screen.getByText('All Episodes')).toBeInTheDocument()
  })
})
