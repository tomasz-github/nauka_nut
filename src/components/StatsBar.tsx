import React from 'react';
import { Flame, CheckCircle2, Music2 } from 'lucide-react';

interface StatsBarProps {
  streak: number;
  remainingCount: number;
  initialCount: number;
  masteredCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  streak,
  remainingCount,
  initialCount,
  masteredCount,
}) => {
  const percentCompleted = initialCount > 0 ? (masteredCount / initialCount) * 100 : 0;

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold text-slate-300 gap-2">
        {/* Streak counter */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
          <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-slate-400">Seria:</span>
          <span className={`text-base font-bold ${streak > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {streak}
          </span>
        </div>

        {/* Mastered & Remaining */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Opanowane:</span>
            <span className="text-emerald-400 font-bold">{masteredCount}</span>
            <span className="text-slate-500 font-normal">/ {initialCount}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
            <Music2 className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400">W puli:</span>
            <span className="text-sky-400 font-bold">{remainingCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 shadow-inner">
        <div
          className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-400 ease-out shadow-sm"
          style={{ width: `${percentCompleted}%` }}
        />
      </div>
    </div>
  );
};
