# Data Model for Podcast Website

## Overview

This document serves as the single source of truth for all data model definitions in the Podcast Website project. It consolidates information previously found in spec.md and plan.md to ensure consistency across all project artifacts.

## Entities

### 1. Podcast Episode

**Description**: Represents an individual podcast episode with all relevant metadata.

**Fields**:
```typescript
interface PodcastEpisode {
  id: string;          // Unique identifier (e.g., "ep-001")
  title: string;       // Episode title (5-100 characters)
  description: string; // Brief description (20-300 characters)
  longDescription: string; // Full description/show notes
  coverImage: string;  // Relative path to cover image (e.g., "/images/episodes/ep-001.jpg")
  audioFile: string;   // Relative path to audio file (e.g., "/audio/episodes/ep-001.mp3")
  duration: string;    // Duration in "HH:MM:SS" format
  publishDate: string; // ISO date string (YYYY-MM-DD)
  isFeatured: boolean; // Whether this is the featured episode
  hosts: string[];     // Array of host IDs
  tags?: string[];     // Optional categories/tags
  transcript?: string; // Optional transcript text
}
```

**Validation Rules**:
- `id` must be unique and follow pattern "ep-[0-9]{3}"
- `title` must be between 5-100 characters
- `description` must be between 20-300 characters
- `audioFile` must point to a valid MP3 file
- `duration` must be in valid "HH:MM:SS" format
- `publishDate` must be a valid ISO date

**Example**:
```json
{
  "id": "ep-001",
  "title": "The Future of AI in Podcasting",
  "description": "Exploring how artificial intelligence is changing the podcast industry.",
  "longDescription": "In this episode, we dive deep into the world of AI and its impact on podcasting...",
  "coverImage": "/images/episodes/ep-001.jpg",
  "audioFile": "/audio/episodes/ep-001.mp3",
  "duration": "01:23:45",
  "publishDate": "2023-05-15",
  "isFeatured": true,
  "hosts": ["host-001", "host-002"],
  "tags": ["technology", "ai", "future"],
  "transcript": "Host: Welcome to today's episode..."
}
```

### 2. Podcast Host

**Description**: Represents a host of the podcast with biographical information.

**Fields**:
```typescript
interface PodcastHost {
  id: string;          // Unique identifier (e.g., "host-001")
  name: string;       // Full name
  bio: string;        // Biography (2-4 sentences)
  photo: string;       // Relative path to photo
  role: string;        // Role/title (e.g., "Host", "Co-host", "Producer")
  socialLinks?: Record<string, string>; // Optional social media links
}
```

**Validation Rules**:
- `id` must be unique and follow pattern "host-[0-9]{3}"
- `name` must be between 3-50 characters
- `bio` must be between 50-500 characters
- `photo` must point to a valid image file

**Example**:
```json
{
  "id": "host-001",
  "name": "Alex Rivera",
  "bio": "Alex is a technology enthusiast with over 10 years of experience in podcasting...",
  "photo": "/images/hosts/alex-rivera.jpg",
  "role": "Host",
  "socialLinks": {
    "twitter": "https://twitter.com/alexrivera",
    "linkedin": "https://linkedin.com/in/alexrivera"
  }
}
```

### 3. FAQ Item

**Description**: Represents a frequently asked question with its answer.

**Fields**:
```typescript
interface FAQItem {
  id: string;          // Unique identifier (e.g., "faq-001")
  question: string;    // The question
  answer: string;      // The answer
  category: string;    // Category for grouping (e.g., "Technical", "General")
  order: number;       // Display order
}
```

**Validation Rules**:
- `id` must be unique and follow pattern "faq-[0-9]{3}"
- `question` must be between 10-150 characters
- `answer` must be between 20-1000 characters
- `category` must be one of predefined categories

**Example**:
```json
{
  "id": "faq-001",
  "question": "How often are new episodes released?",
  "answer": "We release new episodes every Tuesday and Friday. Make sure to subscribe...",
  "category": "General",
  "order": 1
}
```

## Relationships

1. **Episodes to Hosts**: Many-to-Many relationship
   - Each episode can have multiple hosts
   - Each host can appear in multiple episodes
   - Implemented through host IDs array in episode

2. **FAQ Items**: Standalone collection
   - Grouped by category for organization
   - Ordered by display order

## Data Storage Structure

```
data/
├── episodes/
│   ├── ep-001.json
│   ├── ep-002.json
│   └── ...
├── hosts/
│   ├── host-001.json
│   ├── host-002.json
│   └── ...
├── faqs.json
└── site-metadata.json
```

**site-metadata.json** contains:
```typescript
interface SiteMetadata {
  title: string;
  description: string;
  logo: string;
  favicon: string;
  socialLinks: Record<string, string>;
  copyright: string;
}
```

## Data Access Patterns

1. **Landing Page**:
   - Load featured episode (where isFeatured = true)
   - Load 3-5 most recent episodes
   - Load site metadata

2. **Episodes List Page**:
   - Load all episodes sorted by publishDate (newest first)
   - Load all hosts for display in episode cards

3. **Episode Detail Page**:
   - Load specific episode by ID
   - Load all related hosts
   - Load 3 related episodes (same tags or hosts)

4. **About Page**:
   - Load all hosts
   - Load site metadata

5. **FAQ Page**:
   - Load all FAQ items sorted by category and order

## Data Validation Rules

**Comprehensive Validation Rules for All Data Types:**

- Episode IDs must follow pattern "ep-[0-9]{3}"
- Host IDs must follow pattern "host-[0-9]{3}"
- FAQ IDs must follow pattern "faq-[0-9]{3}"
- All required fields must be present and meet length requirements
- Date fields must be valid ISO dates (YYYY-MM-DD)
- Duration must be in valid "HH:MM:SS" format
- Image and audio file paths must be valid relative paths

## Data Generation Approach

For the mock data implementation:
1. Create 20 episode JSON files with realistic podcast data
2. Create 2-3 host JSON files
3. Create 10-15 FAQ items in faqs.json
4. Populate site-metadata.json with brand information

**Mock Data Requirements**:
- Varied episode lengths (30-90 minutes)
- Different publish dates spanning several months
- Realistic titles and descriptions
- One clearly featured episode
- Hosts with distinct personalities/bios
- FAQs covering common podcast questions

## Data Usage in Components

**EpisodeCard Component**:
- Uses: title, description, coverImage, id (for navigation)
- Displayed on: Landing page (featured), Episode list page

**AudioPlayer Component**:
- Uses: audioFile, duration, title, coverImage
- Displayed on: Episode detail page
- Requires: State persistence across page navigation

**HostCard Component**:
- Uses: name, bio, photo, role, socialLinks
- Displayed on: About page, Episode detail page (for episode hosts)

**FAQSection Component**:
- Uses: question, answer, category
- Displayed on: FAQ page
- Requires: Categorization and ordering

## Data Flow Diagram

```
User Request → Next.js Page → Data Loader → JSON Files → Component Rendering
                                      ↓
                              Data Validation
                                      ↓
                              Error Handling
```

## Data Versioning Strategy

1. **Initial Implementation**: Version 1.0
   - Basic data structure with required fields
   - Manual JSON file creation

2. **Future Enhancements**:
   - Schema validation using JSON Schema
   - Automated data generation scripts
   - Versioned data migrations
   - Content management system integration

## Data Security Considerations

1. **Static Site Security**:
   - All data is pre-built and served as static files
   - No server-side processing or databases
   - No user authentication or personal data collection

2. **Content Protection**:
   - Audio files should be optimized for web delivery
   - Image files should be properly compressed
   - Consider adding .htaccess rules to prevent hotlinking

3. **Validation**:
   - Build-time validation of all data files
   - Error handling for missing or invalid data
   - Fallback content for missing assets

## Data Performance Optimization

1. **File Structure**:
   - Organize files by type (episodes, hosts, faqs)
   - Use consistent naming conventions
   - Keep file sizes small for faster loading

2. **Loading Strategies**:
   - Preload featured episode data for landing page
   - Implement lazy loading for episode lists
   - Use efficient data fetching in components

3. **Caching**:
   - Leverage Next.js static generation for data
   - Implement client-side caching for frequently accessed data
   - Use service workers for offline capabilities
