"use client";

import Image from "next/image";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useGameStore, Player, Shot, Teams } from "../store/gameStore";
import ShotTracker from "../components/ShotTracker";
import NewGameModal from "../components/NewGameModal";
import { PlusIcon } from '@heroicons/react/24/solid';
import { getOrCreatePlayerByName, createGame, addPlayersToGame, getActiveGame, endGame, setAllGamesInactive, getPlayersForGame } from "../services/db";
import { useState } from "react";

export default function Home() {
  const teams = useGameStore((state) => state.teams);
  const selectedPlayer = useGameStore((state) => state.selectedPlayer);
  const shots = useGameStore((state) => state.shots);
  const setTeams = useGameStore((state) => state.setTeams);
  const setSelectedPlayer = useGameStore((state) => state.setSelectedPlayer);
  const addShot = useGameStore((state) => state.addShot);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [endGameConfirmOpen, setEndGameConfirmOpen] = useState(false);
  const currentGameId = useGameStore((state) => state.currentGameId);
  const setCurrentGameId = useGameStore((state) => state.setCurrentGameId);
  const resetShots = useGameStore((state) => state.resetShots);

  // On mount, load the active game (if any)
  useEffect(() => {
    (async () => {
      const activeGame = await getActiveGame();
      if (activeGame) {
        setCurrentGameId(activeGame.id);
        const players = await getPlayersForGame(activeGame.id);
        // For now, split into two teams by order (first half, second half)
        const mid = Math.ceil(players.length / 2);
        const teams: Teams = [players.slice(0, mid), players.slice(mid)];
        setTeams(teams);
        setSelectedPlayer(players[0] || null);
      }
    })();
  }, []);

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

  // REMOVE the useEffect that fetches all players and sets them in Zustand
  // REMOVE the useEffect that logs Zustand state updates (optional, for cleanliness)
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
      <main className="flex flex-col gap-[32px] items-center sm:items-start animate-fadein">
        <ShotTracker teams={teams} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
      </main>
      {/* Floating Action Button for mobile */}
      <button
        className="fixed bottom-6 left-6 z-50 bg-green-600 text-white rounded-full p-2.5 shadow-xl border-2 border-zinc-950 sm:hidden flex items-center justify-center hover:bg-green-500 transition-all duration-200"
        style={{
          bottom: 'max(env(safe-area-inset-bottom, 1rem), 1rem)',
          left: 'max(env(safe-area-inset-left, 1rem), 1rem)',
        }}
        onClick={handleNewGameClick}
        aria-label="Start New Game"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
      {/* Desktop New Game button is in Header, so only FAB here */}
      {modalOpen && (
        <NewGameModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onStart={async (teamsInput, gameName) => {
            await setAllGamesInactive();
            // Flatten and create players
            const allNames = teamsInput.flat();
            const players = await Promise.all(
              allNames.map(async (name) => await getOrCreatePlayerByName(name))
            );
            // Rebuild teams with player objects
            const teamSizes = teamsInput.map(t => t.length);
            let idx = 0;
            const teams: Teams = [
              players.slice(idx, idx + teamSizes[0]),
              players.slice(idx + teamSizes[0], idx + teamSizes[0] + teamSizes[1])
            ];
            const game = await createGame(gameName);
            await addPlayersToGame(game.id, players.map((p) => p.id));
            setTeams(teams);
            setCurrentGameId(game.id);
            resetShots();
            setSelectedPlayer(players[0]);
            setModalOpen(false);
          }}
        />
      )}
      {/* End Game button (if a game is active) */}
      {currentGameId && !modalOpen && !confirmOpen && (
        <>
          <button
            className="fixed bottom-6 right-6 z-50 bg-red-600 text-white rounded-full p-2.5 shadow-xl border-2 border-zinc-950 flex items-center justify-center hover:bg-red-500 transition-all duration-200"
            style={{
              bottom: 'max(env(safe-area-inset-bottom, 1rem), 1rem)',
              right: 'max(env(safe-area-inset-right, 1rem), 1rem)',
            }}
            onClick={() => setEndGameConfirmOpen(true)}
          >
            End Game
          </button>
          {endGameConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-auto relative animate-slideup">
                <div className="flex items-center gap-2 mb-4 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m0 2.25h.008v.008H12v-.008zm0 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold text-lg">End Game?</span>
                </div>
                <div className="mb-4 text-zinc-200 text-center">Are you sure you want to end the current game? This cannot be undone.</div>
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700 hover:bg-zinc-700 transition-colors" onClick={() => setEndGameConfirmOpen(false)}>Cancel</button>
                  <button className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-500 transition-colors" onClick={async () => {
                    setEndGameConfirmOpen(false);
                    await endGame(currentGameId);
                    setCurrentGameId("");
                    setTeams([[], []]);
                    setSelectedPlayer(undefined as any);
                    resetShots();
                    // Optionally reload the next active game
                    const activeGame = await getActiveGame();
                    if (activeGame) {
                      setCurrentGameId(activeGame.id);
                      const players = await getPlayersForGame(activeGame.id);
                      // For now, split into two teams by order (first half, second half)
                      const mid = Math.ceil(players.length / 2);
                      const teams: Teams = [players.slice(0, mid), players.slice(mid)];
                      setTeams(teams);
                      setSelectedPlayer(players[0] || null);
                    }
                  }}>End Game</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-auto relative animate-slideup">
            <div className="flex items-center gap-2 mb-4 text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m0 2.25h.008v.008H12v-.008zm0 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-lg">Game In Progress</span>
            </div>
            <div className="mb-4 text-zinc-200 text-center">A game is in progress. Start a new game?</div>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700 hover:bg-zinc-700 transition-colors" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-500 transition-colors" onClick={handleConfirm}>Start New Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
