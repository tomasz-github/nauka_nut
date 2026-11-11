import React from 'react';
import { soundEngine } from '../utils/audio';

interface BlackKeyData {
  id: string;
  note: string;
  answerKey: string;
  freq: number;
}

interface WhiteKeyData {
  id: string;
  note: string;
  freq: number;
  blackKey?: BlackKeyData;
}

const PIANO_KEY_ITEMS: WhiteKeyData[] = [
  {
    id: 'C1',
    note: 'C',
    freq: 261.63,
    blackKey: {
      id: 'C#',
      note: 'C#',
      answerKey: 'C',
      freq: 277.18,
    },
  },
  {
    id: 'D1',
    note: 'D',
    freq: 293.66,
    blackKey: {
      id: 'D#',
      note: 'D#',
      answerKey: 'D',
      freq: 311.13,
    },
  },
  {
    id: 'E1',
    note: 'E',
    freq: 329.63,
  },
  {
    id: 'F1',
    note: 'F',
    freq: 349.23,
    blackKey: {
      id: 'F#',
      note: 'F#',
      answerKey: 'F',
      freq: 369.99,
    },
  },
  {
    id: 'G1',
    note: 'G',
    freq: 392.00,
    blackKey: {
      id: 'G#',
      note: 'G#',
      answerKey: 'G',
      freq: 415.30,
    },
  },
  {
    id: 'A1',
    note: 'A',
    freq: 440.00,
    blackKey: {
      id: 'B',
      note: 'B',
      answerKey: 'B',
      freq: 466.16, // Polish B = H♭
    },
  },
  {
    id: 'H1',
    note: 'H',
    freq: 493.88,
  },
  {
    id: 'C2',
    note: 'C',
    freq: 523.25,
  },
];

interface PianoKeyboardProps {
  onSelectNote: (noteName: string) => void;
  disabled?: boolean;
  highlightCorrectNote?: string | null;
  displayAccidental?: '♯' | '♭' | null;
  activeKey?: string | null;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onSelectNote,
  disabled = false,
  highlightCorrectNote = null,
  displayAccidental = null,
  activeKey = null,
}) => {
  const handleKeyPress = (e: React.MouseEvent, noteAnswer: string, freq: number) => {
    e.stopPropagation();
    if (disabled) return;
    soundEngine.playNote(freq, 0.7);
    onSelectNote(noteAnswer);
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
            // White key highlighting logic:
            // If the target has an accidental (like Cis or B), only highlight the white key if it is not an accidental note
            const isWhiteKeyTarget =
              highlightCorrectNote === item.note &&
              (displayAccidental === null || (item.note !== 'C' && item.note !== 'D' && item.note !== 'F' && item.note !== 'G'));
            const isWhiteKeyPressed = activeKey === item.note;

            // Black key highlighting logic:
            const bk = item.blackKey;
            const isBlackKeyTarget =
              bk &&
              ((highlightCorrectNote === 'B' && bk.note === 'B') ||
                (displayAccidental === '♯' && highlightCorrectNote === bk.answerKey));
            const isBlackKeyPressed = bk && activeKey === bk.answerKey;

            return (
              <div key={item.id} className="relative flex-shrink-0">
                {/* Clean White Key (no text labels) */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => handleKeyPress(e, item.note, item.freq)}
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
                    onClick={(e) => handleKeyPress(e, bk.answerKey, bk.freq)}
                    className={`absolute top-0 right-0 translate-x-1/2 w-6 sm:w-7 md:w-8 h-22 sm:h-28 md:h-30 rounded-b-lg flex flex-col justify-end items-center pb-3 transition-all duration-100 cursor-pointer z-20 border border-slate-950 ${
                      isBlackKeyTarget
                        ? 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 ring-4 ring-emerald-400 scale-[1.04] shadow-xl'
                        : isBlackKeyPressed
                        ? 'bg-gradient-to-b from-slate-700 to-slate-900 translate-y-1 text-sky-400 shadow-inner'
                        : 'bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-[0_5px_10px_rgba(0,0,0,0.7)] hover:brightness-125 active:translate-y-1 active:shadow-inner'
                    }`}
                    aria-label={`Czarny klawisz ${bk.note}`}
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
