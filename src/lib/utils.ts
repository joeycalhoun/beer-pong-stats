// Calculate shooting percentage
export function shootingPct(shots: { made: boolean }[]): number {
  if (!shots.length) return 0;
  return (shots.filter(s => s.made).length / shots.length) * 100;
}

// Calculate bounce shot percentage
export function bouncePct(shots: { type: string }[]): number {
  if (!shots.length) return 0;
  return (shots.filter(s => s.type === 'bounce').length / shots.length) * 100;
}

// Calculate cup hit frequency (returns a map of cup number to count)
export function cupHitFreq(shots: { cup_hit: number | null }[]): Record<number, number> {
  const freq: Record<number, number> = {};
  shots.forEach(s => {
    if (typeof s.cup_hit === 'number') {
      freq[s.cup_hit] = (freq[s.cup_hit] || 0) + 1;
    }
  });
  return freq;
} 