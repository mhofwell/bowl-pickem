# Feature: View Other Users' Picks

**Created**: 2025-12-27
**Status**: Complete
**Goal**: Allow users to click on a pool member in the leaderboard and view their picks

---

## Overview

From the leaderboard, clicking a user's name navigates to a page showing that user's picks. The picks display the same GameCard UI but in read-only mode with correct/incorrect status indicators.

---

## User Flow

1. User opens Leaderboard modal for a pool
2. Clicks on a pool member's name
3. Modal closes, navigates to `/pool/:poolId/user/:userId`
4. Sees that user's picks with game results highlighted
5. Can navigate back to pool/home

---

## Phase 1: New Route & Page

### Tasks
- [x] Add route `/pool/:poolId/user/:userId` to App.tsx
- [x] Create `src/pages/UserPicks.tsx` page component
- [x] Fetch user profile and their picks
- [x] Display header with user name and "Back" button

### Route Structure
```typescript
<Route path="/pool/:poolId/user/:userId" element={<UserPicks />} />
```

---

## Phase 2: Display User's Picks

### Tasks
- [x] Create `useUserPicks` hook to fetch another user's picks
- [x] Reuse GameList/GameCard components in read-only mode
- [x] Show picked team highlighted (not as a button)
- [x] Display ✅/❌/⏳ status for each game

### Pick Status Logic
```
✅ Correct: game.is_final && pick.picked_team === game.winner
❌ Wrong:   game.is_final && pick.picked_team !== game.winner
⏳ Pending: !game.is_final (game not finished yet)
```

---

## Phase 3: Make Leaderboard Clickable

### Tasks
- [x] Import `useNavigate` in Leaderboard component
- [x] Wrap user name/row in clickable element
- [x] On click: close modal, navigate to user picks page
- [x] Add hover/cursor styles for clickability

---

## Phase 4: Read-Only GameCard Mode

### Tasks
- [x] Add `readOnly` prop to GameCard
- [x] Add `viewingPick` prop (the pick to display)
- [x] When readOnly: show pick as highlighted, not as buttons
- [x] Show result status badge (✅/❌/⏳)

### GameCard Props Addition
```typescript
interface GameCardProps {
  // ... existing props
  readOnly?: boolean
  viewingPick?: Pick | null
}
```

---

## Files to Modify/Create

| File | Changes |
|------|---------|
| `src/App.tsx` | Add new route |
| `src/pages/UserPicks.tsx` | NEW - User picks page |
| `src/hooks/useUserPicks.ts` | NEW - Fetch user's picks |
| `src/components/Leaderboard.tsx` | Make names clickable, navigate |
| `src/components/GameCard.tsx` | Add readOnly mode |
| `src/components/GameList.tsx` | Pass through readOnly prop |

---

## UI Mockup

```
┌─────────────────────────────────────┐
│ ← Back to Pool    Dad's Picks       │
│                   Score: 12/27      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ GameAbove Sports Bowl      ✅  │ │
│ │ Dec 26 • Detroit MI             │ │
│ │ ┌───────────┐ ┌───────────────┐ │ │
│ │ │ CM   14   │ │ NW  ✓  21     │ │ │
│ │ └───────────┘ └───────────────┘ │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Rate Bowl                  ❌  │ │
│ │ Dec 26 • Phoenix AZ             │ │
│ │ ┌───────────────┐ ┌───────────┐ │ │
│ │ │ NM  ✓  24     │ │ MN   17   │ │ │
│ │ └───────────────┘ └───────────┘ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Testing

- [x] Click user in leaderboard navigates correctly
- [x] Back button returns to previous page
- [x] Picks display correctly for the viewed user
- [x] Correct/incorrect status shows properly
- [ ] Works on mobile (manual test needed)
- [x] Build passes: `bun run build`

---

## Future Enhancements (Not in Scope)

- [ ] "Compare to my picks" toggle
- [ ] Side-by-side comparison view
- [ ] Per-pool picks architecture
