# Podcast Spec Kit

A fully production-ready **spec-driven development project** that demonstrates the implementation of a podcast application using the **[Spec Kit framework](https://github.com/github/spec-kit)**. The **Spec Kit methodology** enables authoritative specifications, embedded mock data, static site export, and comprehensive testing for robust, maintainable output.

## Project Structure

This repository is organized as a **specification-driven project** with integrated implementation:

```
podcast-spec-kit/
├── specs/                    # Specification documents (source of truth)
│   └── 001-podcast-website/  # Complete feature specification
│       ├── spec.md           # User stories and requirements
│       ├── plan.md           # Implementation phases and tasks
│       ├── data-model.md     # Authoritative data structure schemas
│       ├── quickstart.md     # Setup and initialization guide
│       ├── research.md       # Technical research and decisions
│       ├── tasks.md          # Dependency-ordered task breakdown
│       ├── checklists/       # Phase-specific implementation checklists
│       └── IMPLEMENTATION_STATUS.md  # Current progress tracking
│
└── podcast-website/          # Next.js implementation
    ├── src/                  # Application source code
    │   ├── components/       # Reusable React components
    │   ├── pages/            # Next.js routes
    │   ├── data/             # Embedded JSON data (episodes, hosts, FAQs)
    │   ├── types/            # TypeScript type definitions
    │   └── utils/            # Utility functions
    ├── public/               # Static assets (audio files, images)
    ├── cypress/              # End-to-end tests
    ├── package.json          # Dependencies and npm scripts
    └── tsconfig.json         # TypeScript configuration
```

## How to Use the Spec Kit

The specification files in this project were created using **Copilot CLI** with prompts located in the `.vibe/prompts` directory. These prompts provide structured guidance for generating comprehensive specifications, implementation plans, and task breakdowns.

### Workflow Demonstration

The development process typically follows a six-step sequence:

1. **Initialize**: Run `specify init` to set up the project structure (e.g., constitution.md, spec.md, plan.md).
2. **Constitution**: Define coding rules using `/speckit.constitution.md`, such as "TypeScript everywhere" or "No ORMs."
3. **Specify**: Describe the application using `/speckit.specify.md`, focusing on features rather than tech stack.
4. **Clarify**: Resolve ambiguities with `/speckit.clarify.md` (e.g., adding security or performance requirements).
5. **Plan**: Generate a technical architecture with `/speckit.plan.md` (e.g., Vite + vanilla JS, Node.js + Express).
6. **Task breakdown**: Break down the plan into tasks with `/speckit.tasks.md`.
7. **Implement**: Implement using `/speckit.implement.md`.

### 1. **Understanding the Specification** 📋

Start with the specification documents in `specs/001-podcast-website/`:

- **`spec.md`** — User stories, feature requirements, and acceptance criteria
- **`data-model.md`** — **AUTHORITATIVE REFERENCE** for all data structures (PodcastEpisode, PodcastHost, FAQItem, SiteMetadata) with validation rules and examples
- **`quickstart.md`** — Initial setup instructions and project initialization

### 2. **Planning & Task Breakdown** 🎯

Reference the implementation guide to understand scope and phases:

- **`plan.md`** — Overall implementation phases with dependencies and milestones
- **`tasks.md`** — Detailed, dependency-ordered task breakdown for execution
- **`checklists/`** — Phase-specific checklists to track progress

### 3. **Making Design Decisions** 🔍

Consult `research.md` for:
- Technology stack rationale
- Architecture patterns
- Design system specifications (colors, typography, spacing, animations)
- External tool integrations

### 4. **Implementing Features** 💻

When implementing:
1. **Read the relevant spec section** — Understand requirements before coding
2. **Check `data-model.md`** — Ensure your data structures match schemas
3. **Follow the design system** — Use Tailwind CSS with specified color palette and spacing
4. **Reference `tasks.md`** — Execute tasks in dependency order
5. **Update `IMPLEMENTATION_STATUS.md`** — Track completed work

### 5. **Validation & Quality** ✅

The specification defines:
- **Data validation rules** (in `data-model.md`)
- **Component testing standards** (in `spec.md`)
- **Performance targets** (in `research.md`)
- **Browser/device support** (in `spec.md`)

## Quick Start

```bash
# Navigate to the implementation directory
cd podcast-website

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Key Features

- ✅ **20 mocked podcast episodes** with searchable metadata
- ✅ **Audio player** with persistent playback state across navigation
- ✅ **Responsive design** (mobile-first, dark mode support)
- ✅ **Static site generation** (Next.js static export)
- ✅ **Full TypeScript support** with strict type checking
- ✅ **Comprehensive test coverage** (Jest + React Testing Library + Cypress)
- ✅ **Accessibility-focused** (WCAG compliance)

## Important Links

- **Data Model Reference**: `specs/001-podcast-website/data-model.md`
- **Implementation Phases**: `specs/001-podcast-website/plan.md`
- **Design System Details**: See Phase 2.5 in `specs/001-podcast-website/plan.md`
- **Testing Guide**: `podcast-website/TESTING_GUIDE.md`

## Notes

- All data is embedded in JSON files (`src/data/`) — no database or external APIs
- The site is configured for **static export** — suitable for hosting on any CDN
- Dark mode is a first-class feature, not an afterthought
- Audio player state persists across page navigation using React Context
- All 20 episodes must exist before the build completes successfully

## Contributing

When adding features or making changes:
1. Reference the spec to understand requirements
2. Validate data against `data-model.md` schemas
3. Follow the Tailwind design system
4. Add tests for new components
5. Update documentation if needed

---

**Last Updated**: 2026-04-04
