# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SvelteKit 5 web application** serving as a personal portfolio/demo site. It showcases modern Svelte 5 features including the new reactivity system with runes (`$props()`, `$state()`, `$derived()`), TypeScript integration, and interactive demonstrations.

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run preview         # Preview production build locally

# Code Quality
npm run check           # Run svelte-check for TypeScript and Svelte errors
npm run check:watch     # Watch mode for type checking
npm run sync            # Sync SvelteKit generated files
```

## Architecture

### File-based Routing Structure
- `src/routes/+layout.svelte` - Main application layout with navigation
- `src/routes/+page.svelte` - Home page with interactive grid demo
- `src/routes/about/` - Static about page
- `src/routes/sverdle/` - Complete Wordle clone with server-side game logic
- `src/routes/test-globe/` - Simple geographic data display
- `src/routes/world-map/` - Interactive 3D globe with canvas rendering

### Key Components
- `Header.svelte` - Navigation component used in layout
- `Counter.svelte` - Animated counter with spring physics
- Server routes use `+page.server.ts` for SSR logic (see sverdle example)

### Modern Svelte 5 Patterns
- Uses new rune-based reactivity: `$props()`, `$state()`, `$derived()`
- TypeScript integration throughout with strict type checking
- Server-side rendering with `prerender: 'auto'` strategy

## Configuration

### Runtime & Deployment
- **Vercel deployment** with Node.js 20.x runtime specified in `svelte.config.js`
- `vercel.json` should only contain `{"framework": "sveltekit"}` 
- Runtime configuration belongs in `svelte.config.js`, not `vercel.json`

### TypeScript Setup
- Extends SvelteKit's generated tsconfig with strict compiler options
- Use `npm run check` before commits to catch type errors
- Server-side code uses `.server.ts` extension for proper bundling

## Interactive Features

### 3D Globe (world-map route)
- Canvas-based rendering with geographic coordinate calculations
- Personal journey locations with smooth animations
- Responsive design with touch/mouse interaction support

### Sverdle Game
- Complete game state management with server-side logic
- Session-based game persistence
- Keyboard and click input handling with accessibility support

## Dependencies

- **Core**: SvelteKit 2.16.0, Svelte 5.0.0, Vite 6.0.0
- **Analytics**: Vercel Analytics for deployment metrics
- **Animation**: `@neoconfetti/svelte` for celebration effects
- **Typography**: Fira Mono font family via `@fontsource`

## Development Notes

- No testing framework currently configured - focus is on interactive demos
- Multiple package managers supported (npm, pnpm, bun lock files present)
- Code uses modern CSS with Grid, Flexbox, and CSS custom properties
- Accessibility considerations included (ARIA labels, semantic HTML, keyboard navigation)