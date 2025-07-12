"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NewGameModal from "./NewGameModal";
import { useState, useEffect } from "react";
import { useGameStore, Teams } from "../store/gameStore";
import { getOrCreatePlayerByName, createGame, addPlayersToGame, getPlayersForGame } from "../services/db";
import { PlusIcon } from '@heroicons/react/24/solid';
import { BeakerIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon, UserGroupIcon, HomeIcon } from '@heroicons/react/24/outline';

const nav = [
  { name: "Track", href: "/" },
  { name: "Stats", href: "/stats" },
  { name: "Compare", href: "/compare" },
];

export default function Header() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const shots = useGameStore((state) => state.shots);
  const currentGameId = useGameStore((state) => state.currentGameId);
  const setTeams = useGameStore((state) => state.setTeams);
  const setCurrentGameId = useGameStore((state) => state.setCurrentGameId);
  const resetShots = useGameStore((state) => state.resetShots);
  const setSelectedPlayer = useGameStore((state) => state.setSelectedPlayer);

  // Animated title logic
  const title = "Beer Pong Stat Tracker";
  const [animateKey, setAnimateKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setAnimateKey((k) => k + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // On Track page load, if a current game exists, fetch its players from game_players
    if (pathname === "/" && currentGameId) {
      (async () => {
        const players = await getPlayersForGame(currentGameId);
        // Split into two teams by order
        const mid = Math.ceil(players.length / 2);
        const teams: Teams = [players.slice(0, mid), players.slice(mid)];
        setTeams(teams);
        setSelectedPlayer(players[0] || null);
      })();
    }
  }, [pathname, currentGameId, setTeams, setSelectedPlayer]);

  function handleNewGameClick() {
    if (currentGameId && shots.length > 0) {
      setConfirmOpen(true);
    } else {
      setModalOpen(true);
    }
  }

  function handleConfirm() {
    setConfirmOpen(false);
    setModalOpen(true);
  }

  return (
    <header className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 w-full shadow-sm">
      <div className="flex items-center justify-center gap-3 py-6 sm:py-8 relative">
        <span className="relative inline-block">
          <span className="font-extrabold tracking-tight text-white select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] block text-center whitespace-nowrap text-[clamp(1.5rem,6vw,2.75rem)] sm:text-[clamp(2.25rem,4vw,3.5rem)]">
            {title.split("").map((char, i) => (
              <span
                key={i + animateKey * 1000}
                className="inline-block animate-title-letter"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="absolute -bottom-2 -right-6 sm:-bottom-3 sm:-right-8 bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full border border-zinc-700 shadow-md select-none">
            1.0
          </span>
        </span>
      </div>
      <nav className="flex justify-center gap-4 py-3 items-center relative">
        {nav.map((item) => {
          let icon = null;
          if (item.name === "Track") icon = <HomeIcon className="w-5 h-5 mr-1" />;
          if (item.name === "Stats") icon = <ChartBarIcon className="w-5 h-5 mr-1" />;
          if (item.name === "Compare") icon = <UserGroupIcon className="w-5 h-5 mr-1" />;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center transition-colors
                ${pathname === item.href ? "bg-blue-600 text-white shadow" : "text-zinc-200 hover:bg-zinc-800/80"}`}
            >
              {icon}
              {item.name}
            </Link>
          );
        })}
        {/* Always reserve space for the New Game button, but only show it on Track page */}
        <span className="ml-6 w-[120px] hidden sm:inline-block" />
        {pathname === "/" && (
          <button
            className="ml-6 px-4 py-2 rounded-full bg-green-600 text-white font-semibold text-sm shadow hover:bg-green-500 transition-colors flex items-center gap-2 hidden sm:inline-flex"
            onClick={handleNewGameClick}
          >
            <PlusIcon className="w-5 h-5" />
            New Game
          </button>
        )}
      </nav>
      {modalOpen && (
        <NewGameModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onStart={async (teamsInput, gameName) => {
            // 1. Look up or create players
            const allNames = teamsInput.flat();
            const players = await Promise.all(
              allNames.map(async (name) => await getOrCreatePlayerByName(name))
            );
            // 2. Rebuild teams with player objects
            const teamSizes = teamsInput.map(t => t.length);
            let idx = 0;
            const teams: Teams = [
              players.slice(idx, idx + teamSizes[0]),
              players.slice(idx + teamSizes[0], idx + teamSizes[0] + teamSizes[1])
            ];
            // 3. Create new game with name
            const game = await createGame(gameName);
            // 4. Add players to game_players join table
            await addPlayersToGame(game.id, players.map((p) => p.id));
            // 5. Update Zustand
            setTeams(teams);
            setCurrentGameId(game.id);
            resetShots();
            setSelectedPlayer(players[0]);
            // 6. Close modal
            setModalOpen(false);
          }}
        />
      )}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <div className="mb-4 font-semibold">A game is in progress. Start a new game?</div>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold" onClick={handleConfirm}>Start New Game</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 