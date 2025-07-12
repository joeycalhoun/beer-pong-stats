"use client";
import { Player, Teams } from "../store/gameStore";

export default function PlayerSelector({ teams, selectedPlayer, setSelectedPlayer }: {
  teams: Teams;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player) => void;
}) {
  if (!teams || (teams[0].length === 0 && teams[1].length === 0)) return null;
  return (
    <div className="flex w-full justify-center gap-8 py-2">
      {[0, 1].map(teamIdx => (
        <div key={teamIdx} className="flex flex-col items-center gap-2">
          <div className={`font-bold text-xs mb-1 ${teamIdx === 0 ? 'text-blue-400' : 'text-red-400'}`}>{`Team ${teamIdx + 1}`}</div>
          {teams[teamIdx].map(player =>
            player ? (
              <button
                key={player.id}
                className={`px-4 py-2 rounded-full whitespace-nowrap border transition-colors text-sm font-medium w-28 ${selectedPlayer?.id === player.id ? (teamIdx === 0 ? "bg-blue-600 text-white border-blue-700" : "bg-red-600 text-white border-red-700") : "bg-gray-200 text-gray-800 border-zinc-300"}`}
                onClick={() => setSelectedPlayer(player)}
              >
                {player.name}
              </button>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
} 