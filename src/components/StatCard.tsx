import React from 'react';

type StatColor = 'indigo' | 'emerald' | 'amber' | 'rose';

const colors: Record<StatColor, string> = {
  indigo: 'from-indigo-600 to-violet-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color?: StatColor;
}

export default function StatCard({ title, value, icon, color = 'indigo' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className={`bg-gradient-to-br ${colors[color]} px-5 py-4 text-white`}>
        <div className="text-2xl">{icon}</div>
        <div className="mt-2 text-3xl font-extrabold">{value}</div>
        <div className="text-sm text-white/80 mt-0.5">{title}</div>
      </div>
    </div>
  );
}
