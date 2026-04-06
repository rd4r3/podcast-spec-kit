/**
 * Format seconds into a human-readable time string (HH:MM:SS or MM:SS)
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "5:30" or "1:05:30")
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}
