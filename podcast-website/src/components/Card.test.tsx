import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders all variants', () => {
      const { rerender } = render(
        <Card variant="default">
          <div>Default</div>
        </Card>
      );
      expect(screen.getByText('Default').parentElement).toHaveClass('shadow-sm');

      rerender(
        <Card variant="elevated">
          <div>Elevated</div>
        </Card>
      );
      expect(screen.getByText('Elevated').parentElement).toHaveClass('shadow-lg');

      rerender(
        <Card variant="outlined">
          <div>Outlined</div>
        </Card>
      );
      expect(screen.getByText('Outlined').parentElement).toHaveClass('border');
    });

    it('applies base styling classes', () => {
      render(
        <Card>
          <div>Content</div>
        </Card>
      );
      const card = screen.getByText('Content').parentElement;
      expect(card).toHaveClass('rounded-base', 'bg-white', 'p-4', 'transition-all', 'duration-300');
    });
  });

  describe('hover effects', () => {
    it('applies hover classes by default', () => {
      render(
        <Card>
          <div>Hoverable</div>
        </Card>
      );
      const card = screen.getByText('Hoverable').parentElement;
      expect(card).toHaveClass('hover:shadow-lg', 'hover:scale-102');
    });

    it('disables hover effects when hover is false', () => {
      render(
        <Card hover={false}>
          <div>Not hoverable</div>
        </Card>
      );
      const card = screen.getByText('Not hoverable').parentElement;
      expect(card).not.toHaveClass('hover:shadow-lg');
    });
  });

  describe('dark mode support', () => {
    it('applies dark mode classes', () => {
      render(
        <Card>
          <div>Dark mode content</div>
        </Card>
      );
      const card = screen.getByText('Dark mode content').parentElement;
      expect(card).toHaveClass('dark:bg-dark-bg-secondary');
    });
  });

  describe('custom className support', () => {
    it('merges custom className with default classes', () => {
      render(
        <Card className="custom-class">
          <div>Content</div>
        </Card>
      );
      const card = screen.getByText('Content').parentElement;
      expect(card).toHaveClass('custom-class', 'rounded-base', 'bg-white');
    });
  });

  describe('HTML attributes', () => {
    it('supports data attributes', () => {
      render(
        <Card data-testid="card-element">
          <div>Content</div>
        </Card>
      );
      expect(screen.getByTestId('card-element')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card ref={ref}>
          <div>Content</div>
        </Card>
      );
      expect(ref.current).toBeInTheDocument();
      expect(ref.current).toHaveClass('rounded-base');
    });
  });
});
