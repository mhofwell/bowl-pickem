# Feature: Live Score Updates

**Created**: 2025-12-26
**Status**: ✅ Complete
**Goal**: Update scores for in-progress games and show "last updated" timestamp

---

## Overview

Currently the edge function only updates games when ESPN marks them as final. This change will:
1. Also update scores for in-progress games
2. Track when scores were last synced
3. Display "last updated" in the UI

Edge function runs every 30 minutes via cron (existing schedule).

---

## Phase 1: Add Metadata Table

Create a simple table to track sync timestamps.

### Tasks
- [x] Create `app_metadata` table with `key` and `value` columns
- [x] Insert initial row: `key='last_scores_update'`, `value=null`
- [x] Add RLS policy for public read access

### Schema
```sql
CREATE TABLE app_metadata (
  key TEXT PRIMARY KEY,
  value TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Allow anyone to read
ALTER TABLE app_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON app_metadata FOR SELECT USING (true);

-- Insert initial row
INSERT INTO app_metadata (key, value) VALUES ('last_scores_update', null);
```

---

## Phase 2: Update Edge Function

Modify `update-scores` to handle in-progress games and update metadata.

### Tasks
- [x] Remove `if (!espn.is_final) continue` restriction
- [x] Add logic to update scores for games that have started (game_time < now)
- [x] Only set `is_final: true` when ESPN reports final
- [x] Update `app_metadata.last_scores_update` after successful sync
- [x] Return the timestamp in response

### Logic Change
```
Before: Only update if ESPN game is_final === true
After:  Update any game where:
        - ESPN has score data
        - Game has started (game_time < now)
        - Set is_final only if ESPN says final
```

---

## Phase 3: Frontend Display

Show "last updated" timestamp in the UI.

### Tasks
- [x] Create `useAppMetadata` hook to fetch last_scores_update
- [x] Add "Scores updated X ago" text to picks page header
- [x] Format as relative time (e.g., "5 min ago", "1 hour ago")
- [ ] Optional: Add manual refresh button (skipped)

### Placement
Display near the top of the picks page, subtle styling:
```
Scores updated 12 min ago  [↻]
```

---

## Phase 4: Update Types

### Tasks
- [x] Add `app_metadata` to `database.ts` types
- [ ] Update CLAUDE.md if needed (not needed)

---

## Files Modified

| File | Changes |
|------|---------|
| Database | New `app_metadata` table |
| Edge function `update-scores` | Update in-progress games, write timestamp |
| `src/hooks/useAppMetadata.ts` | NEW - Fetch metadata |
| `src/pages/Home.tsx` | Use useAppMetadata, pass to GameList |
| `src/components/GameList.tsx` | Display last updated timestamp |
| `src/types/database.ts` | Add app_metadata type |

---

## Testing

- [x] Build passes: `bun run build`
- [ ] Manually trigger edge function, verify in-progress scores update
- [ ] Verify `app_metadata.last_scores_update` gets updated
- [ ] Verify UI shows correct relative time
- [ ] Verify final games still get marked as final correctly

---

## Rollback Plan

1. Revert edge function to previous version
2. Drop `app_metadata` table
3. Remove UI timestamp display
