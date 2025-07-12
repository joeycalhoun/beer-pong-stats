"use client";

import { ArrowTrendingUpIcon, ArrowPathRoundedSquareIcon, TrophyIcon } from '@heroicons/react/24/solid';

export type StatCardProps = {
  player: { id: string; name: string };
  shots: Array<{
    made: boolean;
    type: 'throw' | 'bounce' | 'last_cup';
    player_id: string;
    game_id: string;
  }>;
  selectedGameIds?: string[];
};

export default function StatCard({ player, shots, selectedGameIds }: StatCardProps) {
  let playerShots = shots.filter((s) => s.player_id === player.id);
  if (selectedGameIds && selectedGameIds.length > 0) {
    playerShots = playerShots.filter((s) => selectedGameIds.includes(s.game_id));
  }
  const total = playerShots.length;

  const thrown = playerShots.filter((s) => s.type === 'throw');
  const thrownMade = thrown.filter((s) => s.made).length;
  const thrownPct = thrown.length ? ((thrownMade / thrown.length) * 100).toFixed(1) : '0.0';

  const bounced = playerShots.filter((s) => s.type === 'bounce');
  const bouncedMade = bounced.filter((s) => s.made).length;
  const bouncedPct = bounced.length ? ((bouncedMade / bounced.length) * 100).toFixed(1) : '0.0';

  const lastCup = playerShots.filter((s) => s.type === 'last_cup');
  const lastCupMade = lastCup.filter((s) => s.made).length;
  const lastCupPct = lastCup.length ? ((lastCupMade / lastCup.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-lg p-5 w-full max-w-xs mx-auto flex flex-col gap-2">
      <div className="font-extrabold text-xl text-white mb-1 tracking-tight flex items-center gap-2">
        <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400" />
        {player.name}
      </div>
      <div className="text-base text-zinc-300 mb-1 font-semibold flex items-center gap-2">
        <span className="text-zinc-400">Total Shots:</span> <span className="text-white font-bold">{total}</span>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center gap-2 text-sm">
          <ArrowTrendingUpIcon className="w-4 h-4 text-blue-400" />
          <span className="text-zinc-300">Thrown:</span>
          <span className="text-blue-300 font-bold">{thrownMade}</span>
          <span className="text-zinc-400">/</span>
          <span className="text-blue-200">{thrown.length}</span>
          <span className="ml-2 text-blue-400">({thrownPct}%) made</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowPathRoundedSquareIcon className="w-4 h-4 text-red-400" />
          <span className="text-zinc-300">Bounced:</span>
          <span className="text-red-300 font-bold">{bouncedMade}</span>
          <span className="text-zinc-400">/</span>
          <span className="text-red-200">{bounced.length}</span>
          <span className="ml-2 text-red-400">({bouncedPct}%) made</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrophyIcon className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-300">Final Cup:</span>
          <span className="text-amber-400 font-bold">{lastCupMade}</span>
          <span className="text-zinc-400">/</span>
          <span className="text-amber-300">{lastCup.length}</span>
          <span className="ml-2 text-amber-400">({lastCupPct}%) made</span>
        </div>
      </div>
    </div>
  );
} 