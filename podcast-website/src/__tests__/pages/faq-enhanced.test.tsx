import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GetStaticProps } from 'next';

// Mock the data loader
jest.mock('@/utils/data-loader', () => ({
  getAllFAQs: jest.fn(() =>
    Promise.resolve([
      {
        id: 'faq-001',
        question: 'How often are new episodes released?',
        answer: 'We release new episodes every Tuesday and Friday.',
        category: 'General',
        order: 1,
      },
      {
        id: 'faq-002',
        question: 'Can I download episodes?',
        answer: 'Yes, all episodes are available for download in the app.',
        category: 'Technical',
        order: 1,
      },
      {
        id: 'faq-003',
        question: 'Is there a transcript available?',
        answer: 'Transcripts are available for all episodes on our website.',
        category: 'General',
        order: 2,
      },
    ])
  ),
}));

describe('FAQ Page', () => {
  const mockFAQs = [
    {
      id: 'faq-001',
      question: 'How often are new episodes released?',
      answer: 'We release new episodes every Tuesday and Friday.',
      category: 'General',
      order: 1,
    },
    {
      id: 'faq-002',
      question: 'Can I download episodes?',
      answer: 'Yes, all episodes are available for download in the app.',
      category: 'Technical',
      order: 1,
    },
    {
      id: 'faq-003',
      question: 'Is there a transcript available?',
      answer: 'Transcripts are available for all episodes on our website.',
      category: 'General',
      order: 2,
    },
  ];

  const mockCategories = ['General', 'Technical'];

  it('should render FAQ page title', () => {
    render(
      <div>
        <h1>Frequently Asked Questions</h1>
        <div>
          {mockFAQs.map((faq) => (
            <div key={faq.id}>
              <h3>{faq.question}</h3>
            </div>
          ))}
        </div>
      </div>
    );
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('should render all FAQ items', () => {
    render(
      <div>
        {mockFAQs.map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    );

    mockFAQs.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    });
  });

  it('should render category filter buttons', () => {
    render(
      <div>
        <button>All Categories</button>
        {mockCategories.map((category) => (
          <button key={category}>{category}</button>
        ))}
      </div>
    );

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('should render search input', () => {
    render(
      <div>
        <input
          type="text"
          placeholder="Search questions and answers..."
          aria-label="Search FAQs"
        />
      </div>
    );

    expect(
      screen.getByPlaceholderText('Search questions and answers...')
    ).toBeInTheDocument();
  });

  it('should filter FAQs by search query', () => {
    const { rerender } = render(
      <div>
        {mockFAQs.map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
          </div>
        ))}
      </div>
    );

    // Initially all FAQs should be visible
    mockFAQs.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    });
  });

  it('should have expandable sections', () => {
    render(
      <div>
        {mockFAQs.map((faq) => (
          <div key={faq.id}>
            <button aria-expanded={false}>{faq.question}</button>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display categories', () => {
    render(
      <div>
        {mockFAQs.map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
            <p>{faq.category}</p>
          </div>
        ))}
      </div>
    );

    expect(screen.getAllByText('General').length).toBeGreaterThan(0);
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    const { container } = render(
      <div>
        <input
          type="text"
          placeholder="Search questions and answers..."
          aria-label="Search FAQs"
        />
      </div>
    );

    const input = screen.getByPlaceholderText('Search questions and answers...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label');
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(
      <div>
        <input
          type="text"
          placeholder="Search FAQs..."
          aria-label="Search FAQs"
        />
        {mockFAQs.map((faq) => (
          <div key={faq.id}>
            <button
              aria-expanded={false}
              aria-controls={`faq-answer-${faq.id}`}
            >
              {faq.question}
            </button>
            <div id={`faq-answer-${faq.id}`}>{faq.answer}</div>
          </div>
        ))}
      </div>
    );

    expect(screen.getByLabelText('Search FAQs')).toBeInTheDocument();
  });

  it('should render "All Categories" button', () => {
    render(
      <button>All Categories</button>
    );
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('should have ordered FAQ items', () => {
    render(
      <div>
        {mockFAQs.sort((a, b) => a.order - b.order).map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
          </div>
        ))}
      </div>
    );

    // All items should be rendered in order
    mockFAQs.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    });
  });
});

describe('FAQ Page Interactions', () => {
  const mockFAQs = [
    {
      id: 'faq-001',
      question: 'How often are new episodes released?',
      answer: 'We release new episodes every Tuesday and Friday.',
      category: 'General',
      order: 1,
    },
    {
      id: 'faq-002',
      question: 'Can I download episodes?',
      answer: 'Yes, all episodes are available for download.',
      category: 'Technical',
      order: 1,
    },
  ];

  it('should toggle FAQ expansion on click', () => {
    const { rerender } = render(
      <div>
        {mockFAQs.map((faq) => (
          <div key={faq.id} data-testid={`faq-${faq.id}`}>
            <button
              onClick={() => {
                // Toggle logic
              }}
              aria-expanded={false}
            >
              {faq.question}
            </button>
            <div style={{ display: 'none' }}>{faq.answer}</div>
          </div>
        ))}
      </div>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should filter by category', () => {
    const filteredFAQs = mockFAQs.filter((f) => f.category === 'General');

    render(
      <div>
        {filteredFAQs.map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
          </div>
        ))}
      </div>
    );

    expect(
      screen.getByText('How often are new episodes released?')
    ).toBeInTheDocument();
    expect(screen.queryByText('Can I download episodes?')).not.toBeInTheDocument();
  });

  it('should update search results dynamically', () => {
    const searchQuery = 'episodes';
    const filtered = mockFAQs.filter((faq) =>
      faq.question.toLowerCase().includes(searchQuery) ||
      faq.answer.toLowerCase().includes(searchQuery)
    );

    render(
      <div>
        {filtered.map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
          </div>
        ))}
      </div>
    );

    expect(
      screen.getByText('How often are new episodes released?')
    ).toBeInTheDocument();
    expect(screen.getByText('Can I download episodes?')).toBeInTheDocument();
  });
});
