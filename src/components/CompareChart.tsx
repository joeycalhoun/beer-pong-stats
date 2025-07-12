"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export type CompareChartProps = {
  player1: { id: string; name: string };
  player2: { id: string; name: string };
  shots1: Array<{ made: boolean; type: 'throw' | 'bounce'; }>;
  shots2: Array<{ made: boolean; type: 'throw' | 'bounce'; }>;
};

export default function CompareChart({ player1, player2, shots1, shots2 }: CompareChartProps) {
  // Calculate stats
  const stats = [
    {
      name: "Shooting %",
      [player1.name]: shots1.length ? (shots1.filter(s => s.made).length / shots1.length * 100).toFixed(1) : 0,
      [player2.name]: shots2.length ? (shots2.filter(s => s.made).length / shots2.length * 100).toFixed(1) : 0,
    },
    {
      name: "Bounce %",
      [player1.name]: shots1.length ? (shots1.filter(s => s.type === 'bounce').length / shots1.length * 100).toFixed(1) : 0,
      [player2.name]: shots2.length ? (shots2.filter(s => s.type === 'bounce').length / shots2.length * 100).toFixed(1) : 0,
    },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={v => `${v}%`} />
          <Legend />
          <Bar dataKey={player1.name} fill="#2563eb" />
          <Bar dataKey={player2.name} fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 