# 🍺 Beer Pong Tournament Tracker – Architecture

## Overview

This is a **mobile-first**, single-page web app designed for quick interaction and real-time stat tracking during a beer pong game. Players’ shots are recorded (make/miss, method, cup hit), and a visual dashboard offers per-player and head-to-head stats comparison. No authentication is required.

---

## 🗂 File + Folder Structure

```
/beer-pong-tracker
├── public/
│   └── assets/            # Images/icons (e.g. cup icons, bounce icons)
├── src/
│   ├── app/
│   │   ├── layout.tsx     # App-wide layout
│   │   ├── page.tsx       # Main app entry (Home - shot tracking)
│   │   ├── stats/         # Stats dashboard route
│   │   │   └── page.tsx   # Dashboard UI
│   │   └── compare/       # Compare two players
│   │       └── page.tsx
│   ├── components/
│   │   ├── ShotTracker.tsx       # Main shot recording UI
│   │   ├── CupGrid.tsx           # Visual 10-cup layout component
│   │   ├── PlayerSelector.tsx    # Dropdown/tabs for current player
│   │   ├── ShotForm.tsx          # Shot type + result toggle
│   │   ├── StatCard.tsx          # Individual player stat card
│   │   ├── CompareChart.tsx      # Chart comparing two players
│   │   └── Header.tsx            # Sticky top header
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client instance
│   │   ├── types.ts              # TypeScript types (Player, Shot, Game)
│   │   └── utils.ts              # Stat calculators, formatters
│   ├── services/
│   │   └── db.ts                 # Database read/write helpers
│   ├── styles/
│   │   └── globals.css           # TailwindCSS and global styles
│   └── store/
│       └── gameStore.ts         # Zustand store for game state
├── .env.local                  # Supabase keys
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── README.md
```

---

## 🔧 What Each Part Does

### `app/`
- **`page.tsx`**: Main tracking UI. Renders `ShotTracker` with player state and game data.
- **`stats/`**: Shows individual player stats across games.
- **`compare/`**: User selects two players to visually compare stats.

### `components/`
- **ShotTracker.tsx**: Central interaction panel to select players, record shots.
- **CupGrid.tsx**: Tapable layout showing 10 cups, logs which cup was hit.
- **ShotForm.tsx**: Options for shot type (`throw` or `bounce`), result (`make` or `miss`).
- **PlayerSelector.tsx**: Tabs or dropdown UI to switch players.
- **StatCard.tsx**: Displays stats like shooting %, makes, bounces.
- **CompareChart.tsx**: Renders bar or radar charts comparing two players.
- **Header.tsx**: Top nav for switching between tracking and dashboard.

### `lib/`
- **supabase.ts**: Initializes and exports Supabase client using `.env.local`.
- **types.ts**: Contains TypeScript interfaces for `Player`, `Shot`, `Game`, etc.
- **utils.ts**: Helper functions to calculate shooting % or format data for display.

### `services/`
- **db.ts**:
  - `logShot(shot: Shot): Promise<void>`
  - `getShotsByPlayer(playerId): Promise<Shot[]>`
  - `getAllPlayers(): Promise<Player[]>`
  - Encapsulates raw Supabase calls to keep UI logic clean.

### `store/`
- **gameStore.ts**:
  - Built using Zustand.
  - Stores current game state: `players`, `selectedPlayer`, `shots`, `currentGameId`.
  - Allows shared state across UI without prop drilling.

---

## 🧠 Where State Lives + Service Flow

### ✅ Local UI State
- Shot form (`make/miss`, `cup`, `type`) uses local state (`useState`) for speed.
- Temporary shot results are immediately reflected in the UI for responsiveness.

### 🗃 Global Game State (Zustand Store)
- `gameStore.ts` holds:
  - `players`: all players in current game
  - `selectedPlayer`: current player taking the shot
  - `shots`: all shots in current game session
  - `addShot(shot)`: logs to store and optionally triggers Supabase write

### 🔗 Supabase (Database)
- Tables:
  - `players`: `{ id, name }`
  - `games`: `{ id, started_at }`
  - `shots`: `{ id, player_id, game_id, made: boolean, cup_hit: int|null, type: 'throw'|'bounce', timestamp }`

- On each shot, record to Supabase via `logShot()` in `services/db.ts`.

---

## 📊 Stats Dashboard + Comparison

- Fetches player stats and aggregates using Supabase queries or local calc.
- Uses TailwindCSS + chart library (e.g., Recharts or Chart.js).
- Charts: shooting percentage, heatmaps (cup accuracy), bounce effectiveness.

---

## 📱 Mobile-First UX Design

- **TailwindCSS** with responsive design:
  - Full-width tapable elements
  - Large buttons and readable fonts
  - Sticky headers for quick nav
  - Scrollable tabs for player switching
- Keep shot logging flow to 2–3 taps max

---

## 🚀 Optional Enhancements

- Cup heatmap: render accuracy over 10-cup layout
- Offline mode (via local storage cache)
- “Undo last shot” button
- Game history log with timestamps
