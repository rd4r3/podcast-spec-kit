import { render, screen } from '@testing-library/react'
import FAQPage from '@/pages/faq'
import { FAQItem } from '@/types'

const mockFAQs: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'How often do you release new episodes?',
    answer: 'We release new episodes every week on Mondays.',
    category: 'General',
    order: 0
  },
  {
    id: 'faq-002',
    question: 'Where can I listen to the podcast?',
    answer: 'You can listen on all major podcast platforms.',
    category: 'Listening',
    order: 0
  },
  {
    id: 'faq-003',
    question: 'How can I contact the hosts?',
    answer: 'You can reach us through our social media pages.',
    category: 'Contact',
    order: 0
  },
]

const mockCategories = ['General', 'Listening', 'Contact']

describe('FAQ Page', () => {
  it('renders the FAQ page without crashing', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
  })

  it('displays page heading', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
  })

  it('displays all FAQ questions', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    mockFAQs.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
    })
  })

  it('displays all FAQ questions with complete data', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    // Check that all questions are displayed
    mockFAQs.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
    })
  })

  it('displays category buttons', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('displays "All" button for category filter', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('has category buttons as clickable elements', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    const allButton = screen.getByRole('button', { name: 'All' })
    expect(allButton).toBeInTheDocument()
  })

  it('handles empty FAQ list', () => {
    render(<FAQPage faqs={[]} categories={mockCategories} />)
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
  })

  it('displays multiple FAQ items', () => {
    render(<FAQPage faqs={mockFAQs} categories={mockCategories} />)
    const questions = mockFAQs.map((faq) => faq.question)
    questions.forEach((question) => {
      expect(screen.getByText(question)).toBeInTheDocument()
    })
  })
})
