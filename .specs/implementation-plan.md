# Bowl Game Pick'em - Implementation Plan

## CURRENT STATUS (Dec 25, 2025)
- **Phase 1-4 COMPLETE** - Project builds successfully
- **Next up: Phase 5** - Pools & Leaderboard
- Run `bun run dev` to test locally
- Supabase project: `rhufeltyxswtidwgsmat` (27 games seeded, RLS enabled)

---

## Overview
Simple React app for college football bowl game picks with pools, leaderboards, and auto-updating results.

**Stack**: React 18 + TypeScript + Vite + shadcn/ui + Supabase + Tailwind
**Supabase Project**: `rhufeltyxswtidwgsmat`
**Hosting**: Railway
**Auth**: Magic Link (email)
**Theme**: Dark mode default

---

## Database Schema

### Tables
```sql
-- profiles: Auto-created on signup
profiles (id UUID PK, email TEXT, display_name TEXT, created_at)

-- pools: Pick'em pools with invite codes
pools (id UUID PK, name TEXT, invite_code TEXT UNIQUE, created_by UUID FK, created_at)

-- pool_members: Pool membership
pool_members (id UUID PK, pool_id UUID FK, user_id UUID FK, joined_at, UNIQUE(pool_id, user_id))

-- games: Bowl games (seeded from CSV)
games (id UUID PK, name TEXT, team1 TEXT, team2 TEXT, game_time TIMESTAMPTZ,
       location TEXT, winner TEXT, team1_score INT, team2_score INT, is_final BOOLEAN)

-- picks: User picks
picks (id UUID PK, user_id UUID FK, game_id UUID FK, picked_team TEXT, created_at, UNIQUE(user_id, game_id))
```

### Key RLS Rules
- Picks can only be inserted/updated before `2025-12-26 00:00:00-05` (midnight tonight)
- Users can only see other users' picks AFTER lock time AND if they're in the same pool
- Games viewable by all authenticated users

---

## File Structure

```
football-pool/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # cn() helper for shadcn
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state & magic link
│   │   ├── useGames.ts          # Games, picks, lock status
│   │   └── usePools.ts          # Pool CRUD, leaderboard
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── AuthForm.tsx         # Magic link login
│   │   ├── GameCard.tsx         # Game with pick buttons
│   │   ├── GameList.tsx         # All games by date
│   │   ├── PoolCard.tsx         # Pool with invite link
│   │   ├── Leaderboard.tsx      # Pool standings
│   │   └── Header.tsx           # Nav bar
│   └── pages/
│       ├── Home.tsx             # Main dashboard
│       ├── JoinPool.tsx         # /join/:code
│       └── AuthCallback.tsx     # /auth/callback
├── supabase/
│   └── functions/
│       └── update-results/
│           └── index.ts         # Scrape NCAA for results
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── components.json              # shadcn/ui config
└── .env
```

---

## Routes (3 total) - React Router
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Auth or main dashboard |
| `/join/:code` | JoinPool | Join pool via invite |
| `/auth/callback` | AuthCallback | Magic link redirect |

---

## Implementation Order

### Phase 1: Project Setup (~15 min)
1. `npm create vite@latest . -- --template react-ts`
2. Install deps: `@supabase/supabase-js`, `react-router-dom`, `tailwindcss`, `autoprefixer`, `postcss`
3. Init shadcn/ui: `npx shadcn@latest init`
4. Add components: `npx shadcn@latest add button card input table badge dialog tabs sonner avatar`
5. Configure dark mode in tailwind.config.js (class strategy, default dark)
6. Create `src/lib/supabase.ts`

### Phase 2: Database Setup (~20 min)
1. Create tables via Supabase SQL editor (or migrations)
2. Enable RLS on all tables
3. Create RLS policies (with lock time enforcement)
4. Create profile trigger for auto-creation on signup
5. Create `get_user_score()` function
6. Seed 27 bowl games from CSV data

### Phase 3: Authentication (~15 min)
1. Create `useAuth.ts` hook (useState, useEffect for session)
2. Build `AuthForm.tsx` (email input + send link)
3. Create `AuthCallback.tsx` (handle redirect, exchange code)
4. Wire up auth state in `App.tsx` with context provider

### Phase 4: Games & Picks (~30 min)
1. Create `useGames.ts` hook
2. Build `GameCard.tsx` (pick buttons, scores, status badges)
3. Build `GameList.tsx` (grouped by date with headers)
4. Add lock time banner and pick counter

### Phase 5: Pools & Leaderboard (~25 min)
1. Create `usePools.ts` hook
2. Build `PoolCard.tsx` with copy invite link button
3. Build create pool dialog (shadcn Dialog)
4. Create `JoinPool.tsx` page
5. Build `Leaderboard.tsx` with scores table

### Phase 6: Results Edge Function (~15 min)
1. Create `update-results` Supabase Edge Function
2. Use Firecrawl API to scrape NCAA.com/scoreboard
3. Parse and update game results in DB
4. Deploy function via Supabase CLI
5. Set up pg_cron for 30-min schedule

### Phase 7: Deploy to Railway (~10 min)
1. Link Railway project via CLI
2. Set env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
3. Deploy
4. Update Supabase redirect URLs for production domain

---

## Key Implementation Details

### Lock Time
```typescript
const LOCK_TIME = new Date('2025-12-26T00:00:00-05:00') // Midnight ET tonight
const isLocked = useMemo(() => new Date() >= LOCK_TIME, [])
```

### Invite Links
Format: `https://{app-url}/join/{invite_code}`
- `invite_code` is auto-generated 12-char hex string

### Dark Mode
Set `class="dark"` on `<html>` element in `index.html`:
```html
<html lang="en" class="dark">
```

### Edge Function Schedule
```sql
SELECT cron.schedule('update-bowl-results', '*/30 * * * *', ...);
```

---

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=https://rhufeltyxswtidwgsmat.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```

### Edge Function (Supabase Secrets)
```
FIRECRAWL_API_KEY=<key>
```

---

## Games to Seed (27 games: Dec 26 - Jan 2)
Use the CSV data gathered earlier. Key games include:
- Dec 26: GameAbove Sports Bowl, Rate Bowl, First Responder Bowl
- Dec 27: Military Bowl, Pinstripe Bowl, Fenway Bowl, Pop-Tarts Bowl, etc.
- Dec 31: CFP Quarterfinal (Cotton Bowl)
- Jan 1: CFP Quarterfinals (Orange, Rose, Sugar Bowls)
- Jan 2: Armed Forces, Liberty, Duke's Mayo, Holiday Bowls
