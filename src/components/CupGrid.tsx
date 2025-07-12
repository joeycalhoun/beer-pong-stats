"use client";
import { useState } from "react";

// Cup IDs: 1-10, row order: bottom to top (4,3,2,1)
const CUP_LAYOUT = [
  [1, 2, 3, 4],
  [5, 6, 7],
  [8, 9],
  [10],
];

export default function CupGrid() {
  const [selectedCup, setSelectedCup] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-1">
      {CUP_LAYOUT.map((row, i) => (
        <div key={i} className="flex flex-row justify-center gap-2">
          {row.map((cup) => (
            <button
              key={cup}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors
                ${selectedCup === cup ? 'bg-yellow-400 border-yellow-600 text-black' : 'bg-white border-gray-400 text-gray-700'}`}
              onClick={() => {
                setSelectedCup(cup);
                console.log("Selected cup:", cup);
              }}
            >
              {cup}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// Heat map version of CupGrid
export function CupGridHeatMap({ freq }: { freq: Record<number, number> }) {
  // Find max for color scaling
  const max = Math.max(1, ...Object.values(freq));
  // Interpolate between green (#22c55e) and orange (#f59e42)
  function interpolateColor(val: number) {
    // Dark green: #166534 (r=22, g=101, b=52)
    // Orange:     #f59e42 (r=245, g=158, b=66)
    const minColor = { r: 22, g: 101, b: 52 };
    const maxColor = { r: 245, g: 158, b: 66 };
    let pct = 0;
    if (max > 0) {
      pct = Math.max(0, Math.min(1, val / max));
    }
    const r = Math.round(minColor.r + (maxColor.r - minColor.r) * pct);
    const g = Math.round(minColor.g + (maxColor.g - minColor.g) * pct);
    const b = Math.round(minColor.b + (maxColor.b - minColor.b) * pct);
    const bg = `rgb(${r},${g},${b})`;
    const border = 'border-zinc-700';
    return { bg, border };
  }
  return (
    <div className="flex flex-col items-center gap-1">
      {CUP_LAYOUT.map((row, i) => (
        <div key={i} className="flex flex-row justify-center gap-2">
          {row.map((cup) => {
            // Always show 0 for cups with no makes, and always color (even if 0)
            const count = freq[cup] ?? 0;
            const { bg, border } = interpolateColor(count);
            // Font size: min text-xs (0), max text-2xl (max)
            let fontSize = 'text-xs';
            if (max > 0) {
              const pct = count / max;
              if (pct >= 0.95) fontSize = 'text-2xl';
              else if (pct >= 0.7) fontSize = 'text-xl';
              else if (pct >= 0.4) fontSize = 'text-lg';
              else if (pct >= 0.15) fontSize = 'text-base';
              else fontSize = 'text-xs';
            }
            return (
              <div
                key={cup}
                className={`w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center font-bold transition-colors ${border}`}
                style={{ backgroundColor: bg }}
              >
                <span className={`text-white font-bold ${fontSize}`}>{count}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
} 