"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useGameStore, Teams } from "../store/gameStore";
import { getPlayersForGame } from "../services/db";
import { ChartBarIcon, UserGroupIcon, HomeIcon } from '@heroicons/react/24/outline';

const nav = [
  { name: "Track", href: "/" },
  { name: "Stats", href: "/stats" },
  { name: "Compare", href: "/compare" },
];

export default function Header() {
  const pathname = usePathname();
  const [animateKey, setAnimateKey] = useState(0);
  const setTeams = useGameStore((state) => state.setTeams);
  const currentGameId = useGameStore((state) => state.currentGameId);

  // Animated title logic
  const title = "Beer Pong Stat Tracker";
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
      })();
    }
  }, [pathname, currentGameId, setTeams]);

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
          const icon =
            item.name === "Track" ? <HomeIcon className="w-5 h-5 mr-1" /> :
            item.name === "Stats" ? <ChartBarIcon className="w-5 h-5 mr-1" /> :
            item.name === "Compare" ? <UserGroupIcon className="w-5 h-5 mr-1" /> :
            null;
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
      </nav>
    </header>
  );
}