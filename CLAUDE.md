# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SvelteKit 5 web application** serving as a personal portfolio/demo site. It showcases modern Svelte 5 features including the new reactivity system with runes (`$props()`, `$state()`, `$derived()`), TypeScript integration, and interactive demonstrations.

## Development Commands

```bash
# Development
pnpm dev                # Start development server
pnpm build              # Production build
pnpm preview            # Preview production build locally

# Code Quality
pnpm check              # Run svelte-check for TypeScript and Svelte errors
pnpm check:watch        # Watch mode for type checking
pnpm sync               # Sync SvelteKit generated files
```

## Architecture

### File-based Routing Structure
- `src/routes/+layout.svelte` - Main application layout with navigation
- `src/routes/+page.svelte` - Home page with interactive grid demo
- `src/routes/chat/` - AI chatbot powered by Groq (Llama), with streaming responses
- `src/routes/tomcat/` - Voice-enabled chat variant with Web Speech API (speech recognition + synthesis)
- `src/routes/admin/` - Admin panel for viewing chat conversations (password-protected)
- `src/routes/sverdle/` - Complete Wordle clone with server-side game logic
- `src/routes/test-globe/` - Simple geographic data display
- `src/routes/world-map/` - Interactive 3D globe with canvas rendering

### Key Components
- `Header.svelte` - Navigation component with links to Home, Wordle, Map, Chat, and external sites (CarDeals, Yumoo)
- `Counter.svelte` - Animated counter with spring physics
- `src/lib/database.ts` - Neon PostgreSQL connection with in-memory fallback for chat conversation persistence
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
- Use `pnpm check` before commits to catch type errors
- Server-side code uses `.server.ts` extension for proper bundling

## Interactive Features

### AI Chat (chat route)
- Groq SDK with Llama model, streaming responses via server endpoint (`chat/+server.ts`)
- Conversation persistence in Neon PostgreSQL with automatic in-memory fallback when DB is unavailable
- Requires `GROQ_API_KEY` and `DATABASE_URL` (or `POSTGRES_URL`) environment variables

### Tomcat Voice Chat (tomcat route)
- Voice-enabled variant of the chat using Web Speech API for speech recognition and synthesis
- Text processing with intelligent speech segmentation

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
- **AI**: `groq-sdk` for LLM chat completions
- **Database**: `@neondatabase/serverless` for PostgreSQL (chat persistence)
- **Analytics**: `@vercel/analytics` + `@vercel/speed-insights`
- **Animation**: `@neoconfetti/svelte` for celebration effects
- **Typography**: Fira Mono font family via `@fontsource`

## Development Notes

- **Package manager**: pnpm (specified in `packageManager` field)
- No testing framework currently configured — focus is on interactive demos
- Code uses modern CSS with Grid, Flexbox, and CSS custom properties
- Accessibility considerations included (ARIA labels, semantic HTML, keyboard navigation)