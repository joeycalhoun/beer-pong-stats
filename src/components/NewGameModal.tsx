"use client";
import { useState } from "react";
import { XMarkIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

export default function NewGameModal({ open, onClose, onStart }: {
  open: boolean;
  onClose: () => void;
  onStart: (teams: string[][], gameName: string) => void;
}) {
  const [mode, setMode] = useState<'1v1' | '2v2'>('2v2');
  const [names, setNames] = useState(["", "", "", ""]);
  const [gameName, setGameName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 transition-all">
      <div className="w-full sm:w-auto max-w-md mx-auto bg-zinc-950 border-t-2 border-zinc-800 sm:border sm:rounded-2xl shadow-2xl p-6 pt-4 relative animate-slideup">
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
        <div className="flex items-center justify-center gap-2 mb-4">
          <UserPlusIcon className="w-6 h-6 text-green-400" />
          <span className="font-bold text-lg">Start New Game</span>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!gameName.trim()) return;
            if (mode === '1v1') {
              onStart([[names[0].trim()], [names[2].trim()]], gameName.trim());
            } else {
              onStart([[names[0].trim(), names[1].trim()], [names[2].trim(), names[3].trim()]], gameName.trim());
            }
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-2 justify-center mb-2">
            <button type="button" className={`px-4 py-1 rounded-full font-semibold border text-sm transition-colors ${mode === '1v1' ? 'bg-blue-600 text-white border-blue-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`} onClick={() => setMode('1v1')}>1v1</button>
            <button type="button" className={`px-4 py-1 rounded-full font-semibold border text-sm transition-colors ${mode === '2v2' ? 'bg-blue-600 text-white border-blue-700' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`} onClick={() => setMode('2v2')}>2v2</button>
          </div>
          <div className="relative">
            <PencilSquareIcon className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              className="pl-10 pr-3 py-2 w-full rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow"
              placeholder="Game Name (required)"
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-zinc-400 text-xs mb-1">Team 1</div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <UserPlusIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  className="pl-10 pr-3 py-2 w-full rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-green-500 focus:outline-none shadow"
                  placeholder="Player 1 name"
                  value={names[0]}
                  onChange={e => { const newNames = [...names]; newNames[0] = e.target.value; setNames(newNames); }}
                  required
                />
              </div>
              {mode === '2v2' && (
                <div className="relative flex-1">
                  <UserPlusIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className="pl-10 pr-3 py-2 w-full rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-green-500 focus:outline-none shadow"
                    placeholder="Player 2 name"
                    value={names[1]}
                    onChange={e => { const newNames = [...names]; newNames[1] = e.target.value; setNames(newNames); }}
                    required={mode === '2v2'}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="font-semibold text-zinc-400 text-xs mb-1">Team 2</div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <UserPlusIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  className="pl-10 pr-3 py-2 w-full rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-green-500 focus:outline-none shadow"
                  placeholder={mode === '2v2' ? "Player 3 name" : "Player 2 name"}
                  value={names[2]}
                  onChange={e => { const newNames = [...names]; newNames[2] = e.target.value; setNames(newNames); }}
                  required
                />
              </div>
              {mode === '2v2' && (
                <div className="relative flex-1">
                  <UserPlusIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className="pl-10 pr-3 py-2 w-full rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-green-500 focus:outline-none shadow"
                    placeholder="Player 4 name"
                    value={names[3]}
                    onChange={e => { const newNames = [...names]; newNames[3] = e.target.value; setNames(newNames); }}
                    required={mode === '2v2'}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button type="button" className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700 hover:bg-zinc-700 transition-colors scale-tap active:scale-95 focus:ring-2 focus:ring-zinc-400" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-500 transition-colors scale-tap active:scale-95 focus:ring-2 focus:ring-blue-400" disabled={!gameName.trim()}>Start Game</button>
          </div>
        </form>
      </div>
    </div>
  );
} 