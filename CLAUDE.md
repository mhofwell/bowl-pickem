# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Keep this file updated.** When making significant changes to the codebase (new dependencies, architectural changes, new commands, database schema updates, or new patterns), update this file accordingly.

## Package Manager

**Always use `bun`** - never use `npm` or `yarn` in this project.

## Commands

```bash
bun run dev      # Start development server (Vite)
bun run build    # Type-check with tsc, then build with Vite
bun run lint     # Run ESLint
bun run preview  # Preview production build locally
bun run start    # Serve built app on port 3000 (for Railway deployment)
bun add <pkg>    # Add a dependency
bun add -d <pkg> # Add a dev dependency
```

## Architecture

This is a **Bowl Pick'em** web application built with React 19, TypeScript, Vite, and Supabase.

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Backend**: Supabase (auth, database, real-time)
- **Routing**: React Router v7

### Key Directories
- `src/hooks/` - Custom React hooks for data fetching and state management
- `src/components/ui/` - shadcn/ui primitives (Button, Card, Dialog, etc.)
- `src/components/` - Application components
- `src/pages/` - Route-level page components
- `src/lib/` - Utilities and Supabase client
- `src/types/` - TypeScript type definitions including Supabase database types

### Data Flow
The app uses three primary hooks that encapsulate all Supabase interactions:
- `useAuth` - Authentication state and magic link sign-in
- `useGames` - Bowl games, user picks, and scoring logic
- `usePools` - Pool management (create, join, leaderboard)

### Database Schema
Defined in `src/types/database.ts`:
- `profiles` - User profiles
- `pools` - Pick'em pools with invite codes
- `pool_members` - Pool membership junction table
- `games` - Bowl games with teams, times, scores, and winner
- `picks` - User picks for games (team1 or team2)

### Path Aliases
Use `@/` to import from `src/` (e.g., `import { supabase } from '@/lib/supabase'`).

### Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Pick Locking
Picks lock at midnight ET on Dec 26, 2025 (defined in `useGames.ts`). After this time, users cannot make or modify picks.
