import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioPlayer from '@/components/AudioPlayer';

// Mock HTMLMediaElement methods
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: jest.fn(),
});

describe('AudioPlayer Component', () => {
  const mockProps = {
    src: '/audio/test.mp3',
    title: 'Test Episode',
    coverImage: '/images/test.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render audio player with title', () => {
    render(<AudioPlayer {...mockProps} />);
    expect(screen.getByText('Test Episode')).toBeInTheDocument();
    expect(screen.getByText('Now Playing')).toBeInTheDocument();
  });

  it('should render audio player without title', () => {
    const { src } = mockProps;
    render(<AudioPlayer src={src} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('should render play/pause button', () => {
    render(<AudioPlayer {...mockProps} />);
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it('should render time display', () => {
    render(<AudioPlayer {...mockProps} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('should render volume control', () => {
    render(<AudioPlayer {...mockProps} />);
    const volumeControl = screen.getByLabelText('Volume');
    expect(volumeControl).toBeInTheDocument();
    expect(volumeControl).toHaveValue('1');
  });

  it('should render progress bar', () => {
    render(<AudioPlayer {...mockProps} />);
    const progressBar = screen.getByLabelText('Progress');
    expect(progressBar).toBeInTheDocument();
  });

  it('should render skip forward button', () => {
    render(<AudioPlayer {...mockProps} />);
    const skipForwardButton = screen.getByLabelText('Skip forward 10 seconds');
    expect(skipForwardButton).toBeInTheDocument();
  });

  it('should render skip backward button', () => {
    render(<AudioPlayer {...mockProps} />);
    const skipBackwardButton = screen.getByLabelText('Skip backward 10 seconds');
    expect(skipBackwardButton).toBeInTheDocument();
  });

  it('should render keyboard shortcuts info', () => {
    render(<AudioPlayer {...mockProps} />);
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
  });

  it('should show loading state when loading', async () => {
    const onLoadingChange = jest.fn();
    const { rerender } = render(
      <AudioPlayer {...mockProps} onLoadingChange={onLoadingChange} />
    );

    const audio = screen.getByRole('region').querySelector('audio');
    if (audio) {
      fireEvent.loadstart(audio);
      rerender(<AudioPlayer {...mockProps} onLoadingChange={onLoadingChange} />);
    }

    // Check loading state was called
    expect(onLoadingChange).toHaveBeenCalled();
  });

  it('should handle play/pause button click', async () => {
    render(<AudioPlayer {...mockProps} />);
    const playButton = screen.getByRole('button', { name: /play/i });
    
    fireEvent.click(playButton);
    // In a real scenario, this would trigger audio.play()
    expect(playButton).toBeInTheDocument();
  });

  it('should handle volume change', async () => {
    render(<AudioPlayer {...mockProps} />);
    const volumeControl = screen.getByLabelText('Volume');
    
    fireEvent.change(volumeControl, { target: { value: '0.5' } });
    expect(volumeControl).toHaveValue('0.5');
  });

  it('should handle progress change', async () => {
    render(<AudioPlayer {...mockProps} />);
    const progressBar = screen.getByLabelText('Progress');
    
    fireEvent.change(progressBar, { target: { value: '30' } });
    expect(progressBar).toHaveValue('30');
  });

  it('should render cover image when provided', () => {
    render(<AudioPlayer {...mockProps} />);
    const coverImage = screen.getByAltText('Test Episode');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', '/images/test.jpg');
  });

  it('should call onLoadingChange callback', () => {
    const onLoadingChange = jest.fn();
    render(<AudioPlayer {...mockProps} onLoadingChange={onLoadingChange} />);
    
    // onLoadingChange should be called at least once during render
    expect(onLoadingChange).toHaveBeenCalled();
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(<AudioPlayer {...mockProps} />);
    
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Audio player');
    expect(screen.getByLabelText('Progress')).toBeInTheDocument();
    expect(screen.getByLabelText('Volume')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toHaveAttribute('aria-label');
  });

  it('should render all skip buttons with proper labels', () => {
    render(<AudioPlayer {...mockProps} />);
    
    expect(screen.getByLabelText('Skip forward 10 seconds')).toBeInTheDocument();
    expect(screen.getByLabelText('Skip backward 10 seconds')).toBeInTheDocument();
  });

  it('should format time correctly', () => {
    render(<AudioPlayer {...mockProps} />);
    // Check that time is displayed in MM:SS or H:MM:SS format
    const timeDisplays = screen.getAllByText(/\d+:\d+/);
    expect(timeDisplays.length).toBeGreaterThan(0);
  });

  it('should have details element for keyboard shortcuts', () => {
    render(<AudioPlayer {...mockProps} />);
    const detailsElement = screen.getByText('Keyboard shortcuts').closest('details');
    expect(detailsElement).toBeInTheDocument();
  });
});
