"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import CompareChart from "../../components/CompareChart";
import StatCard from "../../components/StatCard";
import { ArrowTrendingUpIcon, UserCircleIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import type { Player, Shot } from "../../store/gameStore";

function CompareTitle() {
  return (
    <div className="flex items-center justify-center gap-3">
      <ArrowsRightLeftIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      <span className="font-extrabold tracking-tight text-white text-3xl sm:text-4xl text-center select-none">Compare Players</span>
    </div>
  );
}

function PlayerDropdown({ players, value, onChange, label, color, disabledIds, iconClass }: {
  players: Player[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  color: string;
  disabledIds: string[];
  iconClass: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = players.find(p => p.id === value);
  return (
    <div className="w-full max-w-xs relative">
      <label className="mb-1 text-xs text-zinc-400 font-semibold block">{label}</label>
      <button
        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 shadow transition-colors focus:ring-2 focus:ring-${color}-500 focus:outline-none ${open ? 'ring-2 ring-' + color + '-500' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <UserCircleIcon className={`w-6 h-6 ${iconClass} shrink-0`} />
        <span className="flex-1 text-left truncate">{selected ? selected.name : `Select ${label}`}</span>
        <svg className="w-4 h-4 ml-2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <ul
          className="absolute z-20 mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fadein"
          tabIndex={-1}
          role="listbox"
        >
          {players.map((p) => (
            <li
              key={p.id}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${disabledIds.includes(p.id) ? 'opacity-40 pointer-events-none' : 'hover:bg-zinc-800'} ${value === p.id ? `bg-${color}-900/60` : ''}`}
              onClick={() => { if (!disabledIds.includes(p.id)) { onChange(p.id); setOpen(false); } }}
              role="option"
              aria-selected={value === p.id}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' && !disabledIds.includes(p.id)) { onChange(p.id); setOpen(false); } }}
            >
              <UserCircleIcon className={`w-5 h-5 ${iconClass}`} />
              <span className="truncate">{p.name}</span>
              {value === p.id && <ArrowTrendingUpIcon className={`w-4 h-4 text-${color}-400 ml-auto`} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");
  const [shots1, setShots1] = useState<Shot[]>([]);
  const [shots2, setShots2] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    supabase.from("players").select("*").then(({ data }) => {
      setPlayers((data as Player[]) || []);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    if (player1) {
      supabase.from("shots").select("*").eq("player_id", player1).then(({ data }) => setShots1((data as Shot[]) || []));
    } else {
      setShots1([]);
    }
  }, [player1]);
  useEffect(() => {
    if (player2) {
      supabase.from("shots").select("*").eq("player_id", player2).then(({ data }) => setShots2((data as Shot[]) || []));
    } else {
      setShots2([]);
    }
  }, [player2]);
  const showChart = player1 && player2 && player1 !== player2;
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8 flex flex-col items-center">
        <CompareTitle />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center w-full">
        <PlayerDropdown
          players={players}
          value={player1}
          onChange={setPlayer1}
          label="Player 1"
          color="blue"
          disabledIds={player2 ? [player2] : []}
          iconClass="text-blue-400"
        />
        <PlayerDropdown
          players={players}
          value={player2}
          onChange={setPlayer2}
          label="Player 2"
          color="red"
          disabledIds={player1 ? [player1] : []}
          iconClass="text-red-400"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-6 mb-8 items-stretch justify-center w-full">
        {/* Stat cards with skeleton loaders */}
        <div className="flex-1">
          {loading || (player1 && shots1.length === 0) ? (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-lg p-4 animate-pulse h-40" />
          ) : player1 ? (
            (() => {
              const playerObj = players.find(p => p.id === player1);
              return playerObj ? <StatCard player={playerObj} shots={shots1} /> : null;
            })()
          ) : null}
        </div>
        <div className="flex-1">
          {loading || (player2 && shots2.length === 0) ? (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-lg p-4 animate-pulse h-40" />
          ) : player2 ? (
            (() => {
              const playerObj = players.find(p => p.id === player2);
              return playerObj ? <StatCard player={playerObj} shots={shots2} /> : null;
            })()
          ) : null}
        </div>
      </div>
      <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-lg p-6 animate-fadein">
        {showChart ? (
          (() => {
            const playerObj1 = players.find(p => p.id === player1);
            const playerObj2 = players.find(p => p.id === player2);
            return playerObj1 && playerObj2 ? (
              <CompareChart
                player1={playerObj1}
                player2={playerObj2}
                shots1={shots1.filter(s => s.type === 'throw' || s.type === 'bounce') as Array<{ made: boolean; type: 'throw' | 'bounce'; }>}
                shots2={shots2.filter(s => s.type === 'throw' || s.type === 'bounce') as Array<{ made: boolean; type: 'throw' | 'bounce'; }>}
              />
            ) : null;
          })()
        ) : (
          <div className="text-zinc-400 text-center py-12">Select two different players to compare their stats.</div>
        )}
      </div>
    </div>
  );
} 