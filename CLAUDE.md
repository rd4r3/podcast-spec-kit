# Agent Knowledge: Podcast Website Project

**Last Updated**: 2026-04-05  
**Project**: Modern Podcast Website (Next.js + Static Export)  
**Maintained For**: Claude Haiku 4.5

---

## Project Summary

This is a **modern podcast website** built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It's a static site (no backend/database) that showcases 20 mocked podcast episodes with a featured episode, episode browsing, detailed episode pages with audio player, an About page for hosts, and a FAQ page.

The site is fully specification-driven, with all architecture documented in `specs/001-podcast-website/` and consolidated in `.specify/memory/`.

---

## Active Technologies

### Core Stack

- **Framework**: Next.js 14+ (React framework)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 3+
- **Runtime**: Node.js (build-time only)
- **Deployment**: Static export to any CDN (Vercel, Netlify, etc.)

### Frontend Libraries

- **React**: 18+ (functional components with hooks)
- **React DOM**: 18+
- **HTML5 Audio**: For podcast playback
- **React Context API**: For audio player state

### Testing & Quality

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing framework
- **ESLint**: Code linting (with React + TypeScript plugins)
- **Prettier**: Code formatting (optional)

### Development Tools

- **TypeScript**: Type safety (strict mode)
- **npm**: Package manager
- **next/image**: Image optimization (disabled for static export)

---

## Project Structure

**Repository Root**: `/home/ramon/Programming/podcast-spec-kit`

```
podcast-spec-kit/
├── .specify/                      # Specification framework
│   ├── memory/                    # Main project memory (consolidated specs)
│   │   ├── constitution.md        # Project principles & governance
│   │   ├── spec.md                # Consolidated functional specs
│   │   ├── plan.md                # Consolidated implementation plan
│   │   ├── changelog.md           # Merged features log
│   │   └── ...
│   ├── templates/                 # Document templates
│   ├── extensions/                # Custom extensions
│   └── scripts/                   # Utility scripts
├── podcast-website/               # APPLICATION SOURCE CODE
│   ├── src/
│   │   ├── pages/                 # Next.js pages (routing)
│   │   │   ├── index.tsx          # Landing page
│   │   │   ├── episodes.tsx       # Episode list
│   │   │   ├── episodes/[id].tsx  # Episode detail (dynamic)
│   │   │   ├── about.tsx          # About page
│   │   │   ├── faq.tsx            # FAQ page
│   │   │   ├── 404.tsx            # Not found
│   │   │   └── _app.tsx           # App wrapper
│   │   ├── components/            # Reusable React components
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── EpisodeCard.tsx
│   │   │   ├── HostCard.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── ...
│   │   ├── context/               # React Context
│   │   │   └── AudioContext.tsx   # Audio player state
│   │   ├── data/                  # JSON data files
│   │   │   ├── episodes/          # 20 episode files
│   │   │   │   ├── ep-001.json
│   │   │   │   ├── ep-002.json
│   │   │   │   └── ... (20 total)
│   │   │   ├── hosts/             # Host files
│   │   │   │   ├── host-001.json
│   │   │   │   ├── host-002.json
│   │   │   │   └── ...
│   │   │   ├── faqs.json          # FAQ items
│   │   │   └── site-metadata.json # Site config
│   │   ├── types/                 # TypeScript interfaces
│   │   │   └── index.ts           # Type definitions
│   │   ├── utils/                 # Utility functions
│   │   │   ├── formatters.ts      # Date/duration formatting
│   │   │   ├── loaders.ts         # Data loading
│   │   │   ├── validators.ts      # Data validation
│   │   │   └── hooks.ts           # Custom React hooks
│   │   └── styles/                # Global styles
│   │       └── globals.css        # Tailwind + resets
│   ├── public/                    # Static assets
│   │   ├── audio/episodes/        # Mocked MP3 files
│   │   ├── images/episodes/       # Episode cover images
│   │   ├── images/hosts/          # Host photos
│   │   └── ...
│   ├── next.config.js             # Next.js config (static export)
│   ├── tsconfig.json              # TypeScript config (strict)
│   ├── tailwind.config.js         # Tailwind theme config
│   ├── jest.config.js             # Jest test config
│   ├── cypress.config.js          # Cypress E2E config
│   ├── .eslintrc.json             # ESLint rules
│   ├── package.json               # Dependencies
│   └── README.md                  # App README
├── specs/001-podcast-website/     # FEATURE SPECIFICATION (archived)
│   ├── spec.md                    # Feature specification
│   ├── plan.md                    # Implementation plan
│   ├── data-model.md              # Data structure definitions
│   ├── research.md                # Technical research & decisions
│   ├── tasks.md                   # Completed tasks (82/82)
│   ├── quickstart.md              # Setup & onboarding guide
│   └── checklists/                # Phase-specific checklists
├── .github/                       # GitHub config
│   └── workflows/                 # CI/CD workflows (if any)
├── README.md                      # Project README
└── [.git, .gitignore, etc.]
```

---

## Commands

### Development

```bash
cd podcast-website
npm install              # Install dependencies
npm run dev             # Start dev server on localhost:3000
npm start               # Run production build
```

### Building

```bash
npm run build            # Compile and generate static site
# Output: .next/ (build artifacts) and next export would output to /out
```

### Testing

```bash
npm test                        # Run all Jest tests
npm test -- --watch            # Watch mode
npm test -- <filename>         # Specific test file
npm test -- --coverage         # Coverage report
npm run test:e2e              # Run Cypress E2E tests
```

### Code Quality

```bash
npm run lint              # Run ESLint
npm run lint:fix          # Fix linting issues
npm run format            # Run Prettier (if configured)
```

### Deployment

```bash
# Vercel automatically detects Next.js + static export
vercel deploy

# Or export to static files:
npm run build && next export
# Output: /out directory with static HTML/CSS/JS
```

---

## Architecture Highlights

### 1. Static Site Generation

- All pages pre-generated at build time (`next export`)
- No server-side rendering (SSR)
- `getStaticProps` for data fetching
- `getStaticPaths` for dynamic routes (episodes)
- Trailing slashes enabled (`trailingSlash: true`)

### 2. Data Model

**Episode** (`PodcastEpisode`):
- `id`: "ep-001" through "ep-020"
- `title`, `description`, `longDescription`
- `coverImage`, `audioFile`
- `duration` ("HH:MM:SS"), `publishDate` (ISO 8601)
- `isFeatured` (boolean, exactly one per site)
- `hosts` (array of host IDs)
- `tags`, `transcript` (optional)

**Host** (`PodcastHost`):
- `id`: "host-001", "host-002", etc.
- `name`, `bio`, `photo`
- `role` ("Host", "Co-host", etc.)
- `socialLinks` (optional)

**FAQ Item** (`FAQItem`):
- `id`, `category`, `question`, `answer`, `order`
- Categorized for display

**Site Metadata** (`SiteMetadata`):
- Site title, description, author
- Theme colors (primary gradient: Blue → Purple)
- Social links

### 3. Audio Player

- **State**: Managed via React Context (`AudioContext`)
- **Persistence**: Player state survives page navigation
- **Features**: Play/pause, progress bar, volume, keyboard shortcuts
- **Loading**: Shows buffering state while audio loads
- **Accessibility**: Keyboard controls (spacebar, arrow keys), ARIA labels

### 4. Design System (Tailwind CSS)

- **Colors**: Blue (#3B82F6) to Purple (#8B5CF6) gradient
- **Typography**: Inter font, responsive sizing
- **Spacing**: 1rem (16px) base unit
- **Animations**: 300ms ease-in-out transitions
- **Dark Mode**: Full support with dark variants
- **Responsive**: Mobile-first, breakpoints at 640/768/1024/1280px

### 5. Component Hierarchy

```
<Layout>
  <Navigation /> (header with dark mode toggle)
  <main>
    <Page>
      (content, may include AudioPlayer, EpisodeCard, etc.)
    </Page>
  </main>
  <AudioPlayer /> (persistent at bottom)
</Layout>
```

---

## Recent Changes

### [001-podcast-website] — 2026-04-05

**Merged into main memory** (spec.md, plan.md, changelog.md):
- Complete podcast website with 20 episodes
- Audio player with state persistence
- Responsive design with dark mode
- Full test coverage (82 tests, 100% pass)
- Documentation and data model

---

## Known Issues & Gotchas

### ⚠️ Image Optimization Disabled

**Issue**: Next.js Image optimization is disabled for static export.  
**Root Cause**: Static export (`next export`) doesn't support Next.js Image component optimization.  
**Prevention Rule**: Manually optimize images before committing:
- Use tools like TinyPNG, ImageOptim, or ffmpeg
- Aim for <100KB per image, compressed formats
- Test in build: `npm run build` and check image sizes

### ⚠️ Dynamic Routes Must Be Pre-enumerated

**Issue**: Dynamic routes like `/episodes/[id].tsx` require all IDs to be known at build time.  
**Root Cause**: Static export has no runtime, so all paths must be pre-generated.  
**Prevention Rule**: Before adding a new episode:
1. Create the JSON file in `src/data/episodes/ep-NNN.json`
2. Verify `getStaticPaths` includes the new ID
3. Build and test: `npm run build`

### ⚠️ No Server-Side Features

**Issue**: Cannot use API routes, cookies, sessions, or authentication in static export.  
**Root Cause**: Static sites are 100% frontend; no backend runtime.  
**Prevention Rule**: Keep all logic in React components or utilities. For future features:
- User accounts → Use third-party auth (Auth0, Supabase)
- Comments → Use third-party service (Disqus, Commento)
- Analytics → Use client-side library (Google Analytics, Plausible)

### ⚠️ Audio Files Must Exist at Build Time

**Issue**: Audio files referenced in episode JSON must exist in `public/audio/episodes/`.  
**Root Cause**: Static export bundles all files; missing files cause broken links.  
**Prevention Rule**: Verify audio files before build:
```bash
npm run build  # Will fail or warn if files missing
```

### ⚠️ State Lost on Page Reload

**Issue**: Audio player context state is lost on hard refresh or back-forward navigation.  
**Root Cause**: React Context is in-memory; not persisted across sessions.  
**Prevention Rule**: If persistence is needed, use localStorage:
```typescript
useEffect(() => {
  localStorage.setItem('audioState', JSON.stringify(state));
}, [state]);
```

### ⚠️ Build Time Increases with Data

**Issue**: Large JSON data files can slow down build times and increase memory usage.  
**Root Cause**: All data is loaded and processed at build time.  
**Prevention Rule**: Keep individual episode files small (<50KB). Monitor build performance:
```bash
npm run build  # Check console for timing
```

---

## Architecture Decisions (from research.md)

### Why Next.js Static Export?

✅ Optimal performance (no server latency)  
✅ Simple deployment (any CDN)  
✅ Cost-effective (no backend infrastructure)  
✅ Great DX (built-in TypeScript, routing, CSS support)  

### Why JSON for Data?

✅ No database needed  
✅ Version control friendly  
✅ Easy to validate with TypeScript  
✅ Simple to maintain  

### Why React Context for Audio?

✅ No external state library needed  
✅ Integrated with React lifecycle  
✅ Lightweight for single shared state  
✅ Good for this use case (not overly complex)  

### Why Tailwind CSS?

✅ Rapid development with utility classes  
✅ Consistent design system  
✅ Excellent responsive support  
✅ Automatic dark mode  
✅ Small bundle when purged  

---

## Development Workflow

### Making Changes

1. **Edit source** in `podcast-website/src/`
2. **Run dev server**: `npm run dev`
3. **Test locally**: Browser at localhost:3000
4. **Write tests**: Ensure coverage ≥80%
5. **Lint & format**: `npm run lint:fix`
6. **Build & verify**: `npm run build`
7. **Commit**: Include related spec updates if needed

### Adding a New Episode

1. Create `src/data/episodes/ep-NNN.json` (validate against data-model.md)
2. Add audio file to `public/audio/episodes/ep-NNN.mp3`
3. Add cover image to `public/images/episodes/ep-NNN.jpg` (optimized)
4. Verify `getStaticPaths` in `pages/episodes/[id].tsx` includes new ID
5. Build and test: `npm run build && npm run dev`

### Adding a New Page

1. Create component in `src/pages/new-page.tsx`
2. Import data loader utility if needed
3. Style with Tailwind classes
4. Write tests in `src/pages/new-page.test.tsx`
5. Add navigation link in `Navigation.tsx`
6. Update spec.md and plan.md if architectural impact

---

## Constitution Compliance Checklist

This project adheres to the constitution defined in `.specify/memory/constitution.md`:

✅ **Type Safety & Code Quality**
- All code in TypeScript with strict mode
- ESLint enforces consistency
- No `any` types (use explicit types)
- Meaningful PascalCase/camelCase naming

✅ **Component Testing**
- Jest + React Testing Library for unit tests
- Cypress for E2E tests
- Coverage target: ≥80%
- All 82 tests passing

✅ **Design System Adherence**
- Tailwind utility-first styling
- Blue/Purple gradient primary color
- Consistent spacing (1rem base)
- 300ms animations
- Dark mode support

✅ **Static Site Generation Best Practices**
- All pages pre-generated at build time
- `getStaticPaths` for dynamic routes
- `getStaticProps` for data loading
- Trailing slashes enabled
- Build validation: All pages generated

✅ **Audio Player State Management**
- React Context for state persistence
- Keyboard shortcuts (spacebar, arrow keys)
- Visual feedback during playback
- Accessibility support (ARIA labels)

---

## Helpful References

**Authoritative Docs**:
- `.specify/memory/spec.md` — Consolidated specifications
- `.specify/memory/plan.md` — Implementation plan
- `.specify/memory/constitution.md` — Project principles
- `specs/001-podcast-website/data-model.md` — Data structures
- `specs/001-podcast-website/research.md` — Technical decisions

**Key Files**:
- `podcast-website/src/types/index.ts` — TypeScript interfaces
- `podcast-website/src/context/AudioContext.tsx` — Audio state
- `podcast-website/tailwind.config.js` — Design system
- `podcast-website/next.config.js` — Build configuration

**External Docs**:
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Archived & Maintained**: 2026-04-05  
**For Agent**: Claude Haiku 4.5  
**Confidence Level**: High (full feature implementation completed)
