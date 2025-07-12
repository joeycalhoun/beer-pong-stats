import { create } from 'zustand';

// Minimal types for now
export type Player = {
  id: string;
  name: string;
};

export type Teams = [Player[], Player[]];

export type Shot = {
  id: string;
  player_id: string;
  game_id: string;
  made: boolean;
  cup_hit: number | null;
  type: 'throw' | 'bounce' | 'last_cup';
  timestamp: string;
};

interface GameStore {
  teams: Teams;
  selectedPlayer: Player | null;
  shots: Shot[];
  currentGameId: string | null;
  setTeams: (teams: Teams) => void;
  setSelectedPlayer: (player: Player) => void;
  addShot: (shot: Shot) => void;
  setCurrentGameId: (id: string) => void;
  resetShots: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  teams: [[], []],
  selectedPlayer: null,
  shots: [],
  currentGameId: null,
  setTeams: (teams) => set({ teams }),
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  addShot: (shot) => set((state) => ({ shots: [...state.shots, shot] })),
  setCurrentGameId: (id) => set({ currentGameId: id }),
  resetShots: () => set({ shots: [] }),
}));

// Helper to get team index for a player
export function getTeamForPlayer(teams: Teams, player: Player): 0 | 1 | null {
  if (teams[0].some(p => p.id === player.id)) return 0;
  if (teams[1].some(p => p.id === player.id)) return 1;
  return null;
} 