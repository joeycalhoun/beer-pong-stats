# 🍺 Beer Pong Tracker MVP – Step-by-Step Build Plan

Each task below is atomic, testable, and laser-focused. Designed for an engineering LLM to execute sequentially with manual testing in between.

---

## 🔧 Project Initialization

### 1. **Initialize Next.js Project**
- Create a new Next.js app using `npx create-next-app@latest`
- Use TypeScript and TailwindCSS
- Confirm app loads with Tailwind styling

### 2. **Setup Supabase Client**
- Install `@supabase/supabase-js`
- Create `lib/supabase.ts`
- Connect to Supabase using `.env.local` vars
- Test: log a basic query to console from `page.tsx`

---

## 🧱 Schema + Backend Setup

### 3. **Create Supabase Tables**
- Tables: `players`, `games`, `shots`
- Match types from architecture spec
- Use Supabase Studio
- Test: manually insert dummy row into each

### 4. **Seed Sample Players**
- Add 2–3 players manually or with script
- Test: fetch them using Supabase client

---

## 🧪 Game State (Zustand)

### 5. **Create `gameStore.ts` with Zustand**
- Holds `players`, `selectedPlayer`, `shots`, `currentGameId`
- Include setter for `selectedPlayer` and `addShot`
- Test: write a page that logs state updates to console

---

## 🧩 UI Components – Player Selection

### 6. **Build `PlayerSelector.tsx`**
- Horizontal scroll tabs or dropdown
- Uses Zustand store to update selected player
- Test: log selected player when switching

---

## 🎯 UI Components – Shot Recording

### 7. **Build `ShotForm.tsx`**
- Toggle for shot type (`throw`/`bounce`)
- Toggle for shot result (`make`/`miss`)
- Test: ensure toggles reflect expected state

### 8. **Build `CupGrid.tsx`**
- Render 10-cup layout (e.g. 4-3-2-1 triangle)
- On click, highlight selected cup
- Test: log selected cup ID on click

---

## 🔃 Integration – Logging Shots

### 9. **Build `ShotTracker.tsx`**
- Combines `ShotForm`, `CupGrid`, and `PlayerSelector`
- Button: "Log Shot"
- On click, call `addShot()` in Zustand with all data
- Test: confirm shot appears in state

### 10. **Connect to Supabase**
- Write `logShot()` in `services/db.ts`
- Call on `Log Shot` click (after adding to store)
- Test: new row appears in `shots` table

---

## 📊 Stats Dashboard

### 11. **Create `stats/page.tsx`**
- Route to show stats per player
- Fetch all players and shots
- Test: print player names and # of shots

### 12. **Build `StatCard.tsx`**
- Inputs: player ID or object
- Shows shooting %, total shots, bounce %
- Test: use with mock data, check accuracy

---

## 🔍 Compare View

### 13. **Create `compare/page.tsx`**
- UI to select 2 players
- Fetch their shots from Supabase
- Test: log shots for both players

### 14. **Build `CompareChart.tsx`**
- Render bar chart for side-by-side stats
- Use mock data first
- Test: visible diff between players

---

## 🧼 Polish + Utility

### 15. **Add `Header.tsx` for Navigation**
- Links: Track | Stats | Compare
- Mobile sticky top
- Test: nav works

### 16. **Add `utils.ts` Helpers**
- Functions to calculate stats:
  - shooting %, cup hit freq, etc.
- Unit test these with mock data

---

## ✅ Final Testing Tasks

### 17. **Manual Shot Logging Test**
- Open app on mobile
- Track 5+ shots per player
- Validate shots stored correctly in Supabase

### 18. **Dashboard Accuracy Test**
- Match displayed stats to stored shot data

### 19. **Compare Two Players**
- Confirm chart reflects differences

### 20. **UI Responsiveness Audit**
- Confirm all UIs scale well on mobile

