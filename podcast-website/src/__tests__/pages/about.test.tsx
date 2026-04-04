import React from 'react'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/pages/about'
import { PodcastHost, SiteMetadata } from '@/types'

const mockHosts: PodcastHost[] = [
  {
    id: 'host-001',
    name: 'Host One',
    role: 'Co-Host',
    bio: 'Experienced podcast host with 5+ years in the industry.',
    photo: '/images/hosts/host-001.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/host1',
      linkedin: 'https://linkedin.com/in/host1',
    },
  },
  {
    id: 'host-002',
    name: 'Host Two',
    role: 'Co-Host',
    bio: 'Creative content creator and podcast enthusiast.',
    photo: '/images/hosts/host-002.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/host2',
      linkedin: 'https://linkedin.com/in/host2',
    },
  },
]

const mockMetadata: SiteMetadata = {
  title: 'Test Podcast',
  description: 'A test podcast description',
  author: 'Test Author',
}

describe('About Page', () => {
  it('renders the about page without crashing', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    expect(screen.getByText('About Our Podcast')).toBeInTheDocument()
  })

  it('displays page heading', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    expect(screen.getByText('About Our Podcast')).toBeInTheDocument()
  })

  it('displays mission statement', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    expect(screen.getByText('Our Mission')).toBeInTheDocument()
    expect(screen.getByText(mockMetadata.description)).toBeInTheDocument()
  })

  it('displays hosts section', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    expect(screen.getByText('Meet Our Hosts')).toBeInTheDocument()
  })

  it('displays all host names', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    mockHosts.forEach((host) => {
      expect(screen.getByText(host.name)).toBeInTheDocument()
    })
  })

  it('displays host roles', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    const roles = screen.getAllByText('Co-Host')
    expect(roles.length).toBe(mockHosts.length)
  })

  it('displays host photos', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    const images = screen.getAllByAltText(/Host/)
    expect(images.length).toBe(mockHosts.length)
  })

  it('displays host bios', () => {
    render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    mockHosts.forEach((host) => {
      expect(screen.getByText(host.bio)).toBeInTheDocument()
    })
  })

  it('displays social media links', () => {
    const { container } = render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    const links = container.querySelectorAll('a[href*="twitter"]')
    expect(links.length).toBeGreaterThan(0)
  })

  it('applies host card styling', () => {
    const { container } = render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    const cards = container.querySelectorAll('.card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('renders host information in grid layout', () => {
    const { container } = render(<AboutPage hosts={mockHosts} metadata={mockMetadata} />)
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toBeInTheDocument()
  })
})
