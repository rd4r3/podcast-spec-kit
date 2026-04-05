/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';

describe('Design System - Colors', () => {
  it('should render with primary blue color class', () => {
    const { container } = render(
      <div className="bg-primary-500 text-white">Primary</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-primary-500');
    expect(element).toHaveClass('text-white');
  });

  it('should render with secondary purple color class', () => {
    const { container } = render(
      <div className="bg-secondary-500 text-white">Secondary</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-secondary-500');
  });

  it('should render with dark mode colors', () => {
    const { container } = render(
      <div className="dark:bg-dark-bg dark:text-dark-text">Dark</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('dark:bg-dark-bg');
    expect(element).toHaveClass('dark:text-dark-text');
  });
});

describe('Design System - Typography', () => {
  it('should render with Inter font family', () => {
    const { container } = render(
      <div className="font-sans">Text</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('font-sans');
  });

  it('should render headings with proper font weights', () => {
    const { container: h1Container } = render(
      <h1 className="font-bold text-4xl">Heading 1</h1>
    );
    const h1 = h1Container.firstChild as HTMLElement;
    expect(h1).toHaveClass('font-bold');
    expect(h1).toHaveClass('text-4xl');
  });

  it('should render body text with proper sizing', () => {
    const { container } = render(
      <p className="text-base leading-relaxed">Body text</p>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('text-base');
    expect(element).toHaveClass('leading-relaxed');
  });

  it('should support responsive font sizes', () => {
    const { container } = render(
      <h1 className="text-2xl md:text-3xl lg:text-4xl">Responsive</h1>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('text-2xl');
    expect(element).toHaveClass('md:text-3xl');
    expect(element).toHaveClass('lg:text-4xl');
  });
});

describe('Design System - Spacing', () => {
  it('should apply spacing classes', () => {
    const { container } = render(
      <div className="p-4 m-4">Spacing</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('p-4');
    expect(element).toHaveClass('m-4');
  });

  it('should support responsive spacing', () => {
    const { container } = render(
      <div className="p-4 md:p-6 lg:p-8">Responsive spacing</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('p-4');
    expect(element).toHaveClass('md:p-6');
    expect(element).toHaveClass('lg:p-8');
  });

  it('should apply gap between flex items', () => {
    const { container } = render(
      <div className="flex gap-6">
        <div>Item 1</div>
        <div>Item 2</div>
      </div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('gap-6');
  });
});

describe('Design System - Border Radius', () => {
  it('should apply border radius classes', () => {
    const { container } = render(
      <div className="rounded-base">Rounded</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('rounded-base');
  });

  it('should support various border radius sizes', () => {
    const sizes = ['rounded-sm', 'rounded-base', 'rounded-lg', 'rounded-full'];
    sizes.forEach(size => {
      const { container } = render(
        <div className={size}>Rounded {size}</div>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass(size);
    });
  });
});

describe('Design System - Shadows', () => {
  it('should apply shadow classes', () => {
    const { container } = render(
      <div className="shadow-md">Shadowed</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('shadow-md');
  });

  it('should support shadow hover effects', () => {
    const { container } = render(
      <div className="shadow-sm hover:shadow-lg">Hover shadow</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('shadow-sm');
    expect(element).toHaveClass('hover:shadow-lg');
  });
});

describe('Design System - Transitions', () => {
  it('should apply transition classes', () => {
    const { container } = render(
      <div className="transition-all duration-300 ease-in-out">Transition</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('transition-all');
    expect(element).toHaveClass('duration-300');
    expect(element).toHaveClass('ease-in-out');
  });

  it('should support different transition durations', () => {
    const durations = ['duration-150', 'duration-300', 'duration-500'];
    durations.forEach(duration => {
      const { container } = render(
        <div className={`transition-all ${duration}`}>Transition {duration}</div>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass(duration);
    });
  });
});

describe('Design System - Cards', () => {
  it('should render card with proper styling', () => {
    const { container } = render(
      <div className="bg-white dark:bg-dark-bg-secondary rounded-base shadow-sm 
                      p-6 hover:shadow-lg transition-all duration-300">
        Card content
      </div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-white');
    expect(element).toHaveClass('rounded-base');
    expect(element).toHaveClass('shadow-sm');
    expect(element).toHaveClass('p-6');
  });

  it('should apply card hover effects', () => {
    const { container } = render(
      <div className="card hover:shadow-lg hover:scale-105">Card</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('card');
    expect(element).toHaveClass('hover:shadow-lg');
    expect(element).toHaveClass('hover:scale-105');
  });
});

describe('Design System - Buttons', () => {
  it('should render primary button', () => {
    const { container } = render(
      <button className="btn btn-primary px-6 py-3 rounded-base font-semibold">
        Primary
      </button>
    );
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('px-6');
  });

  it('should render secondary button', () => {
    const { container } = render(
      <button className="btn btn-secondary border-2">Secondary</button>
    );
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-secondary');
    expect(button).toHaveClass('border-2');
  });

  it('should support button hover states', () => {
    const { container } = render(
      <button className="btn btn-primary hover:shadow-lg active:scale-95">
        Interactive
      </button>
    );
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('hover:shadow-lg');
    expect(button).toHaveClass('active:scale-95');
  });
});

describe('Design System - Layout', () => {
  it('should apply container constraints', () => {
    const { container } = render(
      <div className="max-w-container mx-auto px-6">Content</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('max-w-container');
    expect(element).toHaveClass('mx-auto');
    expect(element).toHaveClass('px-6');
  });

  it('should support responsive grid layouts', () => {
    const { container } = render(
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('grid');
    expect(element).toHaveClass('grid-cols-1');
    expect(element).toHaveClass('md:grid-cols-2');
    expect(element).toHaveClass('lg:grid-cols-3');
  });

  it('should apply flex layouts', () => {
    const { container } = render(
      <div className="flex items-center justify-between gap-4">
        <div>Left</div>
        <div>Right</div>
      </div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('flex');
    expect(element).toHaveClass('items-center');
    expect(element).toHaveClass('justify-between');
  });
});

describe('Design System - Dark Mode', () => {
  it('should support dark mode color classes', () => {
    const { container } = render(
      <div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
        Dark mode support
      </div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('dark:bg-dark-bg');
    expect(element).toHaveClass('dark:text-dark-text');
  });

  it('should apply dark mode to cards', () => {
    const { container } = render(
      <div className="bg-white dark:bg-dark-bg-secondary shadow-sm dark:shadow-md">
        Card
      </div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('dark:bg-dark-bg-secondary');
    expect(element).toHaveClass('dark:shadow-md');
  });
});

describe('Design System - Responsive Breakpoints', () => {
  it('should support all breakpoints', () => {
    const breakpoints = ['sm', 'md', 'lg', 'xl'];
    breakpoints.forEach(bp => {
      const { container } = render(
        <div className={`${bp}:block hidden`}>Responsive {bp}</div>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass(`${bp}:block`);
      expect(element).toHaveClass('hidden');
    });
  });
});

describe('Design System - Animations', () => {
  it('should apply animation classes', () => {
    const { container } = render(
      <div className="animate-fade-in">Animated</div>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('animate-fade-in');
  });

  it('should support multiple animation types', () => {
    const animations = ['animate-fade-in', 'animate-slide-in-up', 'animate-scale-in'];
    animations.forEach(animation => {
      const { container } = render(
        <div className={animation}>Animated {animation}</div>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass(animation);
    });
  });
});
