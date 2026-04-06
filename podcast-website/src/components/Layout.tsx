'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StickyPlayer from './StickyPlayer/StickyPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

interface Episode {
  id: string;
  title: string;
  coverImage: string;
  duration: string;
  audioFile: string;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  // Initialize dark mode and load episodes on mount
  useEffect(() => {
    setMounted(true);
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    
    // Get current pathname
    setCurrentPath(window.location.pathname);

    // Load episodes from static JSON file
    fetch('/data/episodes.json')
      .then(res => res.json())
      .then(data => setEpisodes(data))
      .catch(err => console.error('Failed to load episodes:', err));
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Skip to main content link for keyboard navigation
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    mainContent?.focus();
  };

  const isCurrentPage = (path: string) => {
    return currentPath === path || (path === '/' && currentPath === '');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text flex flex-col">
        {/* Skip to main content link */}
        <a
          href="#main-content"
          onClick={skipToMain}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Skip to main content
        </a>

        {/* Header */}
        <header 
          className="bg-white dark:bg-dark-bg-secondary shadow"
          role="banner"
        >
          <nav 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg rounded"
                aria-label="Podcast - Home"
              >
                Podcast
              </Link>
              
              <div className="flex gap-6 items-center">
                <Link 
                  href="/" 
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg px-2 py-1 rounded"
                  aria-current={isCurrentPage('/') ? 'page' : undefined}
                >
                  Home
                </Link>
                <Link 
                  href="/episodes" 
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg px-2 py-1 rounded"
                  aria-current={isCurrentPage('/episodes') ? 'page' : undefined}
                >
                  Episodes
                </Link>
                <Link 
                  href="/about" 
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg px-2 py-1 rounded"
                  aria-current={isCurrentPage('/about') ? 'page' : undefined}
                >
                  About
                </Link>
                <Link 
                  href="/faq" 
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg px-2 py-1 rounded"
                  aria-current={isCurrentPage('/faq') ? 'page' : undefined}
                >
                  FAQ
                </Link>
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-dark-bg-tertiary hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={darkMode ? 'Light mode' : 'Dark mode'}
                >
                  {mounted && (darkMode ? '☀️' : '🌙')}
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full focus:outline-none pb-[64px]"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Footer */}
        <footer 
          className="bg-white dark:bg-dark-bg-secondary shadow mt-auto"
          role="contentinfo"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2024 Podcast Website. All rights reserved.</p>
              <p className="text-sm mt-2">
                <a 
                  href="#main-content"
                  className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                >
                  Back to top
                </a>
              </p>
            </div>
          </div>
        </footer>

        {/* Sticky Audio Player */}
        {mounted && episodes.length > 0 && <StickyPlayer episodes={episodes} />}
      </div>
    </div>
  );
}
