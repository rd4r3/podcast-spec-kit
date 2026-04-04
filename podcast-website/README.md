# Modern Podcast Website

A sleek, modern podcast website built with Next.js, React, TypeScript, and Tailwind CSS. The website features a beautiful design, responsive layout, and an integrated audio player.

## Features

- **Featured Episode Display**: Showcase your latest episode with an eye-catching featured section
- **Episode Browsing**: Browse all 20 episodes with cover art, titles, and descriptions
- **Episode Detail Pages**: Full episode pages with embedded audio player and show notes
- **Audio Player**: HTML5 audio player with standard controls
- **About Page**: Information about the podcast and hosts
- **FAQ Page**: Frequently asked questions with categorization and expandable sections
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Static Generation**: Pre-generated static HTML files for fast loading

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library, Cypress
- **Code Quality**: ESLint, Prettier
- **Data**: Embedded JSON files (no database required)

## Project Structure

```
podcast-website/
├── src/
│   ├── components/          # Reusable React components
│   ├── context/             # React Context providers (AudioContext)
│   ├── data/                # Embedded JSON data
│   │   ├── episodes/        # Episode JSON files (ep-001.json, etc.)
│   │   ├── hosts/           # Host JSON files
│   │   ├── faqs.json        # FAQ items
│   │   └── site-metadata.json
│   ├── pages/               # Next.js page routes
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
│   ├── audio/episodes/      # Episode audio files
│   └── images/              # Images
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
└── package.json
```

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

Build for production (generates static HTML):

```bash
npm run build
```

The output is generated in the `out/` directory, ready for deployment.

### Testing

Run unit tests:

```bash
npm test
```

Watch mode:

```bash
npm test --watch
```

Run end-to-end tests:

```bash
npm run test:e2e:run
```

### Linting & Formatting

Lint code:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

Format code:

```bash
npm run format
```

## Pages

- **Home** (`/`): Landing page with featured episode and recent episodes
- **Episodes** (`/episodes`): Browse all 20 episodes
- **Episode Detail** (`/episodes/[id]`): Individual episode page with audio player
- **About** (`/about`): About page with host information
- **FAQ** (`/faq`): Frequently asked questions with categories
- **404**: Not found page

## Data Structure

### Episode (PodcastEpisode)

```typescript
{
  id: string;              // e.g., "ep-001"
  title: string;           // Episode title
  description: string;     // Brief description
  longDescription: string; // Full description/show notes
  coverImage: string;      // Path to cover image
  audioFile: string;       // Path to audio file
  duration: string;        // Duration in "HH:MM:SS"
  publishDate: string;     // ISO date (YYYY-MM-DD)
  isFeatured: boolean;     // Whether featured on home page
  hosts: string[];         // Array of host IDs
  tags?: string[];         // Optional tags
}
```

### Host (PodcastHost)

```typescript
{
  id: string;              // e.g., "host-001"
  name: string;            // Host name
  bio: string;             // Biography
  photo: string;           // Path to photo
  role: string;            // e.g., "Host", "Co-Host"
  socialLinks?: Record<string, string>;
}
```

### FAQ Item (FAQItem)

```typescript
{
  id: string;    // Unique ID
  question: string;
  answer: string;
  category: string;
  order: number;
}
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Static Hosting

The `npm run build` command generates static files in the `out/` directory. Deploy these files to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

## Customization

### Add a New Episode

1. Create a new file in `src/data/episodes/` (e.g., `ep-021.json`)
2. Follow the `PodcastEpisode` schema from `src/types/index.ts`
3. Add corresponding audio file to `public/audio/episodes/`
4. Add cover image to `public/images/episodes/`
5. Run `npm run build` to regenerate

### Customize Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: '#3B82F6',   // Blue
  secondary: '#8B5CF6', // Purple
  dark: '#111827',      // Dark background
}
```

### Modify Dark Mode

The dark mode toggle is in the `Layout` component. Customize the theme colors in `tailwind.config.js` under the `dark` section.

## Performance

- **Static Generation**: All pages are pre-generated as static HTML
- **Image Optimization**: Images are unoptimized for static export (can be manually optimized)
- **Code Splitting**: Next.js automatically splits code for each page
- **Caching**: Static files are cached by CDNs and browsers

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Dark mode for reduced eye strain

## Security

- No external API calls
- No user authentication
- Static files only
- Safe from injection attacks

## License

MIT

## Contributing

Contributions are welcome! Please follow the code style and testing practices established in this project.

## Support

For issues or questions, please open an issue on the project repository.
