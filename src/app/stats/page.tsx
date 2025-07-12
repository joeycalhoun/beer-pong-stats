"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import StatCard from "../../components/StatCard";
import { getGamesForPlayer } from "../../services/db";
import type { Player, Shot } from "../../store/gameStore";
import { FunnelIcon, XMarkIcon, CheckCircleIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { CupGridHeatMap } from "../../components/CupGrid";
import { cupHitFreq } from "../../lib/utils";

export default function StatsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [playerGames, setPlayerGames] = useState<Record<string, { id: string; started_at: string; name: string }[]>>({});
  const [selectedGames, setSelectedGames] = useState<Record<string, string[]>>({});
  const [filterModalPlayer, setFilterModalPlayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: playersData } = await supabase.from("players").select("*");
      const { data: shotsData } = await supabase.from("shots").select("*");
      setPlayers(playersData || []);
      setShots(shotsData || []);
      // Fetch games for each player
      if (playersData) {
        const gamesByPlayer: Record<string, { id: string; started_at: string; name: string }[]> = {};
        await Promise.all((playersData as Player[]).map(async (player) => {
          const games = await getGamesForPlayer(player.id);
          gamesByPlayer[player.id] = games;
        }));
        setPlayerGames(gamesByPlayer);
        console.log("Games by player:", gamesByPlayer);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGameSelect = (playerId: string, gameId: string) => {
    setSelectedGames((prev) => {
      const prevSelected = prev[playerId] || [];
      return {
        ...prev,
        [playerId]: prevSelected.includes(gameId)
          ? prevSelected.filter((id) => id !== gameId)
          : [...prevSelected, gameId],
      };
    });
  };

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Player Stats</h1>
      {/* If there are no games in the system, show a message instead of the player list */}
      {loading ? (
        <ul className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-lg p-4 animate-pulse">
              <div className="h-6 w-1/3 bg-zinc-800 rounded mb-4" />
              <div className="h-4 w-1/2 bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-2/3 bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-1/3 bg-zinc-800 rounded" />
            </li>
          ))}
        </ul>
      ) : (
      <ul className="space-y-6">
        {players.map((player, idx) => (
          <li
            key={player.id}
            className="bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-lg p-4 animate-fadein"
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg flex items-center gap-2">
                <span>{player.name}</span>
              </div>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-semibold shadow hover:bg-blue-600 transition-colors scale-tap active:scale-95 focus:ring-2 focus:ring-blue-400"
                onClick={() => setFilterModalPlayer(player.id)}
                aria-label="Filter games"
              >
                <FunnelIcon className="w-4 h-4" />
                Filter Games
              </button>
            </div>
            <StatCard
              player={player}
              shots={shots}
              selectedGameIds={selectedGames[player.id] || []}
            />
            {/* Heat map for made shots */}
            <div className="mt-4">
              <div className="text-xs text-zinc-400 font-semibold mb-1 text-center">Cup Hit Heat Map</div>
              <CupGridHeatMap freq={cupHitFreq(shots.filter(s => s.player_id === player.id && s.made && s.cup_hit != null && (!selectedGames[player.id] || selectedGames[player.id].length === 0 || selectedGames[player.id].includes(s.game_id))))} />
            </div>
            {/* Modal for game filter */}
            {filterModalPlayer === player.id && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 transition-all">
                <div className="w-full sm:w-auto max-w-md mx-auto bg-zinc-950 border-t-2 border-zinc-800 sm:border sm:rounded-2xl shadow-2xl p-6 pt-4 relative animate-slideup">
                  <button
                    className="absolute top-3 right-3 text-zinc-400 hover:text-white"
                    onClick={() => setFilterModalPlayer(null)}
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-7 h-7" />
                  </button>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Squares2X2Icon className="w-6 h-6 text-blue-400" />
                    <span className="font-bold text-lg">Filter Games</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-h-60 overflow-y-auto mb-2">
                    {(playerGames[player.id] || []).map((game) => {
                      const selected = (selectedGames[player.id] || []).includes(game.id);
                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => handleGameSelect(player.id, game.id)}
                          className={`px-3 py-2 rounded-full border text-xs font-semibold flex items-center gap-1 transition-all shadow-sm scale-tap active:scale-95 focus:ring-2 focus:ring-blue-400
                            ${selected ? 'bg-blue-600 border-blue-700 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'}`}
                        >
                          {selected && <CheckCircleIcon className="w-4 h-4 text-white" />}
                          {game.name ? game.name : `${new Date(game.started_at).toLocaleDateString()} ${new Date(game.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                        </button>
                      );
                    })}
                  </div>
                  {(playerGames[player.id] || []).length > 1 && (
                    <div className="flex justify-center gap-2 mb-2">
                      <button
                        className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-colors scale-tap active:scale-95 focus:ring-2 focus:ring-zinc-400"
                        onClick={() => setSelectedGames(prev => ({ ...prev, [player.id]: playerGames[player.id].map(g => g.id) }))}
                      >
                        Select All
                      </button>
                      <button
                        className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-colors scale-tap active:scale-95 focus:ring-2 focus:ring-zinc-400"
                        onClick={() => setSelectedGames(prev => ({ ...prev, [player.id]: [] }))}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  {(playerGames[player.id] || []).length === 0 && (
                    <div className="text-xs text-red-400 mt-2 text-center">No games found for this player.</div>
                  )}
                  <button
                    className="mt-4 w-full px-4 py-2 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-600 transition-colors text-lg scale-tap active:scale-95 focus:ring-2 focus:ring-blue-400"
                    onClick={() => setFilterModalPlayer(null)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
} 