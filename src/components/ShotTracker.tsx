"use client";
import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import PlayerSelector from "./PlayerSelector";
import type { Teams, Player } from "../store/gameStore";
import ShotForm from "./ShotForm";
import CupGrid from "./CupGrid";
import { logShot } from "../services/db";
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

export default function ShotTracker({ teams, selectedPlayer, setSelectedPlayer }: {
  teams: Teams;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player) => void;
}) {
  const currentGameId = useGameStore((state) => state.currentGameId);
  const addShot = useGameStore((state) => state.addShot);

  // Local state for shot type/result and cup
  const [type, setType] = useState<'throw' | 'bounce' | 'last_cup'>('throw');
  const [result, setResult] = useState<'make' | 'miss'>('miss');
  const [cup, setCup] = useState<number | null>(null);

  if (!currentGameId) {
    return (
      <div className="text-center text-gray-600 mt-8">
        Start a new game to begin tracking shots.
      </div>
    );
  }

  // Minimal ShotForm inline for now
  const handleType = (val: 'throw' | 'bounce' | 'last_cup') => {
    setType(val);
    if (val === 'last_cup') setCup(11);
    else if (cup === 11) setCup(null);
  };
  // If result is 'miss', cup selection is not required
  const cupRequired = result === 'make';

  const handleResult = (val: 'make' | 'miss') => {
    setResult(val);
    if (val === 'miss') setCup(null);
  };
  const handleCup = (val: number) => setCup(val);

  const handleLogShot = async () => {
    if (!selectedPlayer) return;
    if (cupRequired && cup === null) return;
    const shot = {
      id: Math.random().toString(36).slice(2),
      player_id: selectedPlayer.id,
      game_id: currentGameId,
      made: result === 'make',
      cup_hit: type === 'last_cup' ? 11 : (cupRequired ? cup : null),
      type,
      timestamp: new Date().toISOString(),
    };
    addShot(shot);
    console.log("Logged shot (local):", shot);
    try {
      await logShot(shot);
      console.log("Logged shot to Supabase");
    } catch (e) {
      // Already logged in logShot
    }
    setType('throw');
    setResult('miss');
    setCup(null);
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto bg-zinc-900/80 rounded-xl shadow-lg p-6 border border-zinc-800">
      <PlayerSelector teams={teams} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
      <div className="w-full">
        <div className="mb-2 font-semibold text-center">Shot Type</div>
        <div className="flex gap-2 justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${type === 'throw' ? 'bg-blue-600 text-white border-blue-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}
            onClick={() => handleType('throw')}
          >
            Throw
          </button>
          <button
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${type === 'bounce' ? 'bg-blue-600 text-white border-blue-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}
            onClick={() => handleType('bounce')}
          >
            Bounce
          </button>
          <button
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${type === 'last_cup' ? 'bg-orange-500 text-white border-orange-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}
            onClick={() => handleType('last_cup')}
          >
            Last Cup
          </button>
        </div>
        <div className="mb-2 font-semibold text-center">Result</div>
        <div className="flex gap-2 justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${result === 'make' ? 'bg-green-600 text-white border-green-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}
            onClick={() => handleResult('make')}
          >
            Make
          </button>
          <button
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${result === 'miss' ? 'bg-red-600 text-white border-red-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}
            onClick={() => handleResult('miss')}
          >
            Miss
          </button>
        </div>
      </div>
      {type !== 'last_cup' && (
        <div className="w-full">
          <div className="mb-2 font-semibold text-center">Cup Hit</div>
          <CupGridWrapper selectedCup={cup} onSelect={handleCup} disabled={!cupRequired} />
        </div>
      )}
      <button
        className="mt-4 px-6 py-2 rounded-full bg-blue-700 text-white font-semibold shadow disabled:opacity-50 hover:bg-blue-600 transition-colors scale-tap active:scale-95 focus:ring-2 focus:ring-blue-400"
        onClick={handleLogShot}
        disabled={!selectedPlayer || (cupRequired && cup === null)}
      >
        <ArrowUpCircleIcon className="w-5 h-5 inline-block mr-2 align-text-bottom" />
        Log Shot
      </button>
    </div>
  );
}

// Wrapper to control CupGrid selection from parent
function CupGridWrapper({ selectedCup, onSelect, disabled }: { selectedCup: number | null, onSelect: (cup: number) => void, disabled?: boolean }) {
  // Cup IDs: 1-10, row order: bottom to top (4,3,2,1)
  const CUP_LAYOUT = [
    [1, 2, 3, 4],
    [5, 6, 7],
    [8, 9],
    [10],
  ];
  return (
    <div className={`flex flex-col items-center gap-1 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      {CUP_LAYOUT.map((row: number[], i: number) => (
        <div key={i} className="flex flex-row justify-center gap-2">
          {row.map((cup: number) => (
            <button
              key={cup}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors
                ${selectedCup === cup ? 'bg-yellow-400 border-yellow-600 text-black' : 'bg-white border-gray-400 text-gray-700'}`}
              onClick={() => !disabled && onSelect(cup)}
              disabled={!!disabled}
            >
              {cup}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
} 