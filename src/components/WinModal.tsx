import React from 'react';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  levelTitle: string;
  onNextLevel: () => void;
  onRestartLevel: () => void;
  hasNextLevel: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  levelTitle,
  onNextLevel,
  onRestartLevel,
  hasNextLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400">
          <Trophy className="w-14 h-14" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            Poziom opanowany!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Wspaniała robota! Wszystkie nuty z poziomu{' '}
            <strong className="text-sky-300">{levelTitle}</strong> zostały poprawnie odgadnięte co najmniej dwukrotnie i usunięte z puli ćwiczeń.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="flex-1 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Następny poziom</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onRestartLevel}
              className="flex-1 py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Zacznij od nowa</span>
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={onRestartLevel}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Powtórz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
