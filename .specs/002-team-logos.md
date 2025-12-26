# Feature: Team Logos & Enhanced Game Cards

**Created**: 2025-12-26
**Status**: Priority complete, Phase 1-3 Complete, Phase 4 in testing
**Goal**: Add team logos to the picks screen using ESPN's CDN

---

## Overview

Enhance the GameCard UI by adding team logos next to team names. Logos are sourced from ESPN's public CDN using a static mapping of team names to ESPN team IDs.

**ESPN Logo URL Pattern**:
```
https://a.espncdn.com/i/teamlogos/ncaa/500/{team_id}.png       # Standard
https://a.espncdn.com/i/teamlogos/ncaa/500-dark/{team_id}.png  # Dark mode
```

---

## PRIORITY: Score Display Fix ✓

**Problem**: Scores only display when not null. Games without scores show no number.
**Solution**: Always show score, defaulting to "0" when null.

### Tasks
- [x] Update `GameCard.tsx` to show `score ?? 0` instead of conditional render
- [x] Verify scores display as "0" for games that haven't started

### Test Checkpoint
- [x] Confirm all team buttons show a score (0 for unplayed games)

---

## Phase 1: Team Logo Mapping

Create a static mapping file for all 54 bowl game teams.

### Tasks
- [x] Create `src/lib/teamLogos.ts` with ESPN team ID mappings
- [x] Map all 54 teams currently in the database to ESPN IDs
- [x] Export helper function `getTeamLogoUrl(teamName: string): string | null`
- [x] Export helper function `getTeamDarkLogoUrl(teamName: string): string | null`

### Test Checkpoint
- [x] Verify mapping works by logging a few logo URLs in console
- [x] Manually open 3-5 logo URLs in browser to confirm they load

### Teams to Map (54 total)
```
Alabama, App State, Arizona, Arizona State, Army, BYU,
Central Michigan, Cincinnati, Clemson, Coastal Carolina,
Duke, East Carolina, FIU, Fresno State, Georgia, Georgia Southern,
Georgia Tech, Houston, Illinois, Indiana, Iowa, Louisiana Tech,
LSU, Miami, Miami (OH), Michigan, Minnesota, Mississippi State,
Missouri, Navy, Nebraska, New Mexico, North Texas, Northwestern,
Ohio State, Ole Miss, Oregon, Penn State, Pitt, Rice,
San Diego State, SMU, TCU, Tennessee, Texas, Texas State,
Texas Tech, UConn, USC, Utah, UTSA, Vanderbilt, Virginia, Wake Forest
```

---

## Phase 2: Update GameCard Component

Add logo images to the TeamButton component.

### Tasks
- [x] Import `getTeamLogoUrl` in `GameCard.tsx`
- [x] Add `<img>` element before team name in TeamButton
- [x] Set logo size to 24x24px with `object-contain`
- [x] Add `loading="lazy"` for performance
- [x] Handle missing logos gracefully (hide img if null)

### Test Checkpoint
- [ ] Run `npm run dev` and view picks screen
- [ ] Verify logos appear next to team names
- [ ] Verify layout looks good on mobile (small screens)
- [ ] Verify logos don't break when team has no mapping

---

## Phase 3: Error Handling & Loading States

Add robustness for image loading failures.

### Tasks
- [x] Add `onError` handler to hide broken images
- [ ] Consider adding a placeholder/fallback icon (optional)
- [ ] Add subtle fade-in animation on load (optional)
- [ ] Test with network throttling in DevTools

### Test Checkpoint
- [ ] Simulate a broken image URL and verify graceful fallback
- [ ] Verify no console errors for missing images

---

## Phase 4: Polish & Dark Mode

Final touches and dark mode support.

### Tasks
- [ ] Review spacing and alignment of logos
- [ ] Ensure logos look good in both light and dark modes
- [ ] Consider using dark mode logos for dark theme (optional enhancement)
- [x] Run production build to verify no issues: `npm run build`

### Test Checkpoint
- [ ] Test on real device (phone)
- [ ] Get user feedback on appearance
- [ ] Take before/after screenshots

---

## ESPN Team ID Reference

Key team IDs discovered from ESPN CDN:

| Team | ESPN ID | Logo URL |
|------|---------|----------|
| Alabama | 333 | `.../500/333.png` |
| Ohio State | 194 | `.../500/194.png` |
| Georgia | 61 | `.../500/61.png` |
| Michigan | 130 | `.../500/130.png` |
| Texas | 251 | `.../500/251.png` |
| Oregon | 2483 | `.../500/2483.png` |
| Penn State | 213 | `.../500/213.png` |
| Clemson | 228 | `.../500/228.png` |

*(Full mapping to be created in Phase 1)*

---

## Files Modified

| File | Changes |
|------|---------|
| `src/lib/teamLogos.ts` | NEW - Team name to ESPN ID mapping |
| `src/components/GameCard.tsx` | Add logo images to TeamButton, show 0 score placeholder |

---

## Rollback Plan

If issues arise:
1. Remove logo `<img>` elements from TeamButton
2. Delete `src/lib/teamLogos.ts`
3. No database changes required

---

## Future Enhancements (Not in Scope)

- [ ] Fetch logos dynamically from ESPN API
- [ ] Add team colors to cards
- [ ] Cache logos locally with service worker
- [ ] Add team record/ranking display
