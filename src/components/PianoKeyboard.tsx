import React from 'react';
import { soundEngine } from '../utils/audio';

export interface BlackKeyData {
  id: string;
  pitchClass: number; // 1, 3, 6, 8, 10
  freq: number;
  label: string;
}

export interface WhiteKeyData {
  id: string;
  note: string;
  pitchClass: number; // 0, 2, 4, 5, 7, 9, 11
  freq: number;
  blackKey?: BlackKeyData;
}

export const PIANO_KEY_ITEMS: WhiteKeyData[] = [
  {
    id: 'C1',
    note: 'C',
    pitchClass: 0,
    freq: 261.63,
    blackKey: {
      id: 'Db1_Cs1',
      pitchClass: 1, // Cis / Des
      freq: 277.18,
      label: 'Cis / Des',
    },
  },
  {
    id: 'D1',
    note: 'D',
    pitchClass: 2,
    freq: 293.66,
    blackKey: {
      id: 'Eb1_Ds1',
      pitchClass: 3, // Dis / Es
      freq: 311.13,
      label: 'Dis / Es',
    },
  },
  {
    id: 'E1',
    note: 'E',
    pitchClass: 4,
    freq: 329.63,
  },
  {
    id: 'F1',
    note: 'F',
    pitchClass: 5,
    freq: 349.23,
    blackKey: {
      id: 'Gb1_Fs1',
      pitchClass: 6, // Fis / Ges
      freq: 369.99,
      label: 'Fis / Ges',
    },
  },
  {
    id: 'G1',
    note: 'G',
    pitchClass: 7,
    freq: 392.00,
    blackKey: {
      id: 'Ab1_Gs1',
      pitchClass: 8, // Gis / As
      freq: 415.30,
      label: 'Gis / As',
    },
  },
  {
    id: 'A1',
    note: 'A',
    pitchClass: 9,
    freq: 440.00,
    blackKey: {
      id: 'Bb1_As1',
      pitchClass: 10, // Ais / B (Polish B = H♭)
      freq: 466.16,
      label: 'Ais / B',
    },
  },
  {
    id: 'H1',
    note: 'H',
    pitchClass: 11,
    freq: 493.88,
  },
  {
    id: 'C2',
    note: 'C',
    pitchClass: 0,
    freq: 523.25,
  },
];

interface PianoKeyboardProps {
  onSelectKey: (pitchClass: number, baseNoteName: string, keyId: string) => void;
  disabled?: boolean;
  highlightPitchClass?: number | null;
  targetStep?: number | null;
  activeKeyId?: string | null;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onSelectKey,
  disabled = false,
  highlightPitchClass = null,
  targetStep = null,
  activeKeyId = null,
}) => {
  const isBlackPitchClass = (pc: number | null): boolean => {
    return pc !== null && [1, 3, 6, 8, 10].includes(pc);
  };

  const handlePress = (
    e: React.MouseEvent,
    pitchClass: number,
    baseNoteName: string,
    keyId: string,
    freq: number
  ) => {
    e.stopPropagation();
    if (disabled) return;
    soundEngine.playNote(freq, 0.7);
    onSelectKey(pitchClass, baseNoteName, keyId);
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2">
      {/* Keyboard wrapper */}
      <div
        className={`relative inline-flex bg-slate-950 p-2 sm:p-4 rounded-3xl border border-slate-800 shadow-2xl transition-all duration-200 ${
          disabled ? 'opacity-70' : 'opacity-100'
        }`}
      >
        <div className="flex relative rounded-b-2xl border-t-4 border-slate-800 bg-slate-900 shadow-inner">
          {PIANO_KEY_ITEMS.map((item) => {
            // White key target logic:
            // Highlight only if the target is NOT a black key (1, 3, 6, 8, 10) and pitch class matches.
            // For C (pitchClass 0), differentiate C1 vs C2 if targetStep is available.
            const matchesPitch = highlightPitchClass === item.pitchClass;
            const targetIsBlack = isBlackPitchClass(highlightPitchClass);
            let isWhiteKeyTarget = matchesPitch && !targetIsBlack;

            if (isWhiteKeyTarget && item.pitchClass === 0 && targetStep !== null) {
              if (targetStep >= 5) {
                isWhiteKeyTarget = item.id === 'C2';
              } else {
                isWhiteKeyTarget = item.id === 'C1';
              }
            }

            const isWhiteKeyPressed = activeKeyId === item.id;

            // Black key target logic:
            const bk = item.blackKey;
            const isBlackKeyTarget =
              bk !== undefined && highlightPitchClass === bk.pitchClass;
            const isBlackKeyPressed = bk !== undefined && activeKeyId === bk.id;

            return (
              <div key={item.id} className="relative flex-shrink-0">
                {/* Clean White Key (no text labels) */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => handlePress(e, item.pitchClass, item.note, item.id, item.freq)}
                  className={`relative w-10 sm:w-12 md:w-14 h-36 sm:h-44 md:h-48 rounded-b-xl flex flex-col justify-end items-center pb-4 transition-all duration-100 cursor-pointer border border-slate-300/80 -mr-[1px] last:mr-0 z-0 ${
                    isWhiteKeyTarget
                      ? 'bg-gradient-to-b from-emerald-100 via-emerald-200 to-emerald-400 ring-4 ring-emerald-400 shadow-lg scale-[1.01] z-10'
                      : isWhiteKeyPressed
                      ? 'bg-gradient-to-b from-slate-200 to-slate-400 translate-y-1 shadow-inner'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] hover:brightness-105 active:translate-y-1 active:shadow-inner'
                  }`}
                  aria-label={`Biały klawisz ${item.note}`}
                >
                  {/* Subtle key bottom lip shadow */}
                  <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-slate-400/30 to-transparent rounded-b-xl pointer-events-none" />

                  {/* Pulsing indicator when highlighted */}
                  {isWhiteKeyTarget && (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping mb-2" />
                  )}
                </button>

                {/* Clean Black Key (no text labels, mathematically centered on seam) */}
                {bk && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={(e) => handlePress(e, bk.pitchClass, item.note, bk.id, bk.freq)}
                    className={`absolute top-0 right-0 translate-x-1/2 w-6 sm:w-7 md:w-8 h-22 sm:h-28 md:h-30 rounded-b-lg flex flex-col justify-end items-center pb-3 transition-all duration-100 cursor-pointer z-20 border border-slate-950 ${
                      isBlackKeyTarget
                        ? 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 ring-4 ring-emerald-400 scale-[1.04] shadow-xl'
                        : isBlackKeyPressed
                        ? 'bg-gradient-to-b from-slate-700 to-slate-900 translate-y-1 text-sky-400 shadow-inner'
                        : 'bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-[0_5px_10px_rgba(0,0,0,0.7)] hover:brightness-125 active:translate-y-1 active:shadow-inner'
                    }`}
                    aria-label={`Czarny klawisz ${bk.label}`}
                  >
                    {/* Gloss top highlight */}
                    <div className="absolute inset-x-1 top-1 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-sm pointer-events-none" />

                    {/* Pulsing indicator when highlighted */}
                    {isBlackKeyTarget && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mb-1" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
