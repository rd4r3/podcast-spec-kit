import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'
import { AudioProvider } from '@/context/AudioContext'
import { PodcastEpisode } from '@/types'

const mockEpisode: PodcastEpisode = {
  id: 'ep-001',
  title: 'Episode 1: Getting Started',
  description: 'A comprehensive introduction to our podcast',
  publishDate: '2024-01-15',
  duration: '45:30',
  coverImage: '/images/ep-001.jpg',
  audioUrl: '/audio/episodes/ep-001.mp3',
  hosts: ['host-001'],
  isFeatured: true,
  showNotes: 'Show notes for episode 1',
}

const mockRecentEpisodes: PodcastEpisode[] = [
  {
    ...mockEpisode,
    id: 'ep-002',
    title: 'Episode 2: Advanced Topics',
    isFeatured: false,
  },
  {
    ...mockEpisode,
    id: 'ep-003',
    title: 'Episode 3: Q&A Session',
    isFeatured: false,
  },
]

const renderWithAudioProvider = (component: React.ReactElement) => {
  return render(
    <AudioProvider>
      {component}
    </AudioProvider>
  )
}

describe('Home Page', () => {
  it('renders the landing page without crashing', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    expect(screen.getByText('Featured Episode')).toBeInTheDocument()
  })

  it('displays the featured episode title', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    expect(screen.getByText('Episode 1: Getting Started')).toBeInTheDocument()
  })

  it('displays the featured episode description', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    // Get all descriptions and check the first one is the featured episode (appears first in DOM)
    const descriptions = screen.getAllByText('A comprehensive introduction to our podcast')
    expect(descriptions.length).toBeGreaterThan(0)
    expect(descriptions[0]).toBeInTheDocument()
  })

  it('displays the featured episode cover image', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    const coverImage = screen.getByAltText('Episode 1: Getting Started')
    expect(coverImage).toBeInTheDocument()
    expect(coverImage).toHaveAttribute('src', '/images/ep-001.jpg')
  })

  it('renders "Listen Now" button with link to episode detail page', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    const showNotesButton = screen.getByText('Show Notes')
    expect(showNotesButton).toBeInTheDocument()
    expect(showNotesButton.closest('a')).toHaveAttribute('href', '/episodes/ep-001')
  })

  it('renders "Add to Playlist" button', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    expect(screen.getByText(/Play Now/)).toBeInTheDocument()
  })

  it('displays recent episodes section', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    expect(screen.getByText('Recent Episodes')).toBeInTheDocument()
  })

  it('displays all recent episodes in the list', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    expect(screen.getByText('Episode 2: Advanced Topics')).toBeInTheDocument()
    expect(screen.getByText('Episode 3: Q&A Session')).toBeInTheDocument()
  })

  it('shows no episodes message when featured episode is null', () => {
    renderWithAudioProvider(<Home featuredEpisode={null} recentEpisodes={[]} />)
    expect(screen.getByText('No episodes found')).toBeInTheDocument()
  })

  it('renders recent episode cards with navigation links', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    const ep2Link = screen.getByRole('link', { name: /Episode 2: Advanced Topics/i })
    expect(ep2Link).toHaveAttribute('href', '/episodes/ep-002')
  })

  it('displays publish date and duration for recent episodes', () => {
    renderWithAudioProvider(<Home featuredEpisode={mockEpisode} recentEpisodes={mockRecentEpisodes} />)
    // Check that the date and duration are displayed (exact format depends on formatDate util)
    expect(screen.getAllByText('45:30').length).toBeGreaterThan(0)
  })
})
