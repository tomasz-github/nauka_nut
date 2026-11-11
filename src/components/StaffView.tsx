import React from 'react';
import { ActiveNote, ClefType } from '../types';

interface StaffViewProps {
  note: ActiveNote | null;
  clef: ClefType;
  keySignature?: 'none' | 'F' | 'G' | 'Gm' | 'Am' | 'Em';
  status: 'idle' | 'correct' | 'wrong';
}

// Vector path for Treble Clef (𝄞) scaled to staff (Y: 45 to 105)
const TREBLE_CLEF_PATH =
  'M 60.7,82.4 C 59.2,82.8 57.8,83.8 56.5,85.3 C 55.2,86.8 54.6,88.4 54.6,90.2 C 54.6,91.3 54.9,92.6 55.7,94.0 C 56.4,95.3 57.5,96.3 59.0,96.9 C 59.5,97.0 59.7,97.3 59.7,97.7 C 59.7,97.8 59.5,97.9 59.1,98.0 C 56.8,97.4 54.9,96.2 53.4,94.3 C 51.9,92.5 51.2,90.3 51.1,87.9 C 51.2,85.3 52.0,82.8 53.5,80.6 C 55.0,78.3 56.9,76.7 59.3,75.8 L 57.6,66.8 C 53.7,70.0 50.5,73.4 48.0,77.0 C 45.6,80.5 44.3,84.3 44.2,88.5 C 44.2,90.3 44.6,92.1 45.3,93.8 C 46.0,95.6 47.1,97.2 48.5,98.6 C 51.4,101.5 55.1,103.0 59.7,103.1 C 61.2,103.0 62.9,102.8 64.7,102.3 L 60.7,82.4 z M 62.6,82.2 L 66.5,101.7 C 70.4,100.1 72.4,96.7 72.4,91.5 C 72.2,89.7 71.7,88.1 70.8,86.7 C 69.9,85.3 68.8,84.2 67.4,83.4 C 66.0,82.6 64.4,82.2 62.6,82.2 z M 57.3,55.7 C 58.2,55.2 59.2,54.3 60.2,53.1 C 61.2,51.9 62.3,50.4 63.2,48.8 C 64.2,47.2 65.0,45.5 65.6,43.8 C 66.2,42.1 66.4,40.5 66.4,39.0 C 66.4,38.4 66.4,37.8 66.3,37.2 C 66.2,36.3 65.9,35.6 65.4,35.1 C 64.9,34.6 64.3,34.4 63.5,34.4 C 62.0,34.4 60.7,35.3 59.4,37.2 C 58.5,38.8 57.7,40.8 57.1,42.9 C 56.6,45.2 56.2,47.3 56.2,49.5 C 56.3,52.1 56.7,54.1 57.3,55.7 z M 55.7,57.2 C 54.6,53.1 54.0,48.9 53.8,44.6 C 53.9,41.9 54.1,39.3 54.7,36.9 C 55.2,34.6 55.9,32.5 56.9,30.7 C 57.8,28.9 58.9,27.6 60.1,26.7 C 61.2,25.9 62.0,25.4 62.5,25.4 C 62.8,25.4 63.1,25.6 63.3,25.8 C 63.6,26.0 63.9,26.4 64.3,26.9 C 67.3,31.2 68.9,36.4 68.9,42.4 C 68.9,45.3 68.5,48.1 67.7,50.9 C 67.0,53.7 65.9,56.3 64.4,58.8 C 63.0,61.3 61.2,63.4 59.2,65.3 L 61.3,75.3 C 62.4,75.2 63.2,75.1 63.6,75.1 C 65.5,75.1 67.3,75.5 68.9,76.3 C 70.5,77.1 71.8,78.2 72.9,79.6 C 74.1,80.9 74.9,82.5 75.5,84.3 C 76.1,86.1 76.5,87.9 76.5,89.9 C 76.5,92.9 75.7,95.6 74.1,98.1 C 72.5,100.5 70.2,102.3 67.0,103.5 C 67.2,104.7 67.5,106.5 68.1,108.9 C 68.6,111.2 69.0,113.1 69.2,114.4 C 69.5,115.8 69.6,117.1 69.6,118.4 C 69.6,120.4 69.1,122.2 68.1,123.8 C 67.1,125.3 65.8,126.6 64.1,127.4 C 62.5,128.3 60.7,128.7 58.7,128.7 C 55.9,128.7 53.4,127.9 51.4,126.4 C 49.3,124.8 48.2,122.7 48.1,120.0 C 48.1,118.8 48.4,117.7 48.9,116.6 C 49.4,115.6 50.1,114.7 51.0,114.0 C 51.9,113.4 52.9,113.0 54.1,112.9 C 55.1,112.9 56.0,113.2 56.9,113.7 C 57.8,114.3 58.5,115.0 59.0,116.0 C 59.5,116.9 59.8,118.0 59.8,119.1 C 59.8,120.6 59.3,121.8 58.3,122.9 C 57.3,123.9 56.0,124.5 54.4,124.5 L 53.8,124.5 C 54.8,126.0 56.5,126.8 58.7,126.8 C 59.9,126.8 61.0,126.5 62.2,126.1 C 63.4,125.6 64.4,124.9 65.2,124.1 C 66.1,123.3 66.6,122.5 66.9,121.5 C 67.3,120.5 67.5,119.0 67.5,117.2 C 67.5,116.0 67.4,114.8 67.1,113.6 C 66.9,112.4 66.5,110.8 66.1,108.8 C 65.6,106.9 65.2,105.3 65.0,104.3 C 63.5,104.7 61.9,104.9 60.3,104.9 C 57.5,104.9 54.9,104.3 52.4,103.2 C 50.0,102.0 47.8,100.5 45.9,98.4 C 44.1,96.4 42.6,94.1 41.6,91.5 C 40.6,88.9 40.0,86.3 40.0,83.5 C 40.1,80.9 40.6,78.4 41.5,76.0 C 42.4,73.7 43.6,71.4 45.0,69.4 C 46.5,67.3 48.0,65.4 49.5,63.7 C 51.1,62.0 53.2,59.8 55.7,57.2 z';

// Vector path for Bass Clef (𝄢) scaled to staff (Y: 45 to 105)
const BASS_CLEF_PATH =
  'M 40.0,92.4 C 44.0,89.7 47.0,87.7 48.9,86.2 C 50.9,84.8 52.9,83.1 55.0,81.0 C 57.1,78.9 58.8,76.5 60.2,73.9 C 61.4,72.0 62.3,69.8 63.1,67.2 C 63.9,64.7 64.3,62.3 64.4,60.0 C 64.4,57.8 64.1,55.7 63.5,53.8 C 63.0,51.9 62.0,50.3 60.6,49.0 C 59.3,47.7 57.5,47.1 55.3,47.1 C 53.1,47.1 51.1,47.5 49.2,48.3 C 47.4,49.2 46.1,50.6 45.3,52.5 C 45.3,52.7 45.2,52.9 45.1,53.2 C 45.1,53.6 45.3,53.9 45.7,54.2 C 46.1,54.4 46.4,54.5 46.7,54.5 C 46.9,54.5 47.3,54.4 48.0,54.3 C 48.7,54.1 49.2,54.0 49.7,54.0 C 51.0,54.0 52.2,54.5 53.3,55.4 C 54.4,56.4 54.9,57.5 54.9,58.9 C 54.9,59.8 54.6,60.7 54.1,61.6 C 53.6,62.4 52.8,63.1 51.9,63.6 C 50.9,64.1 49.9,64.3 48.8,64.3 C 46.8,64.3 45.0,63.7 43.6,62.5 C 42.2,61.2 41.5,59.6 41.5,57.6 C 41.5,55.0 42.3,52.8 43.8,50.9 C 45.4,49.1 47.4,47.7 49.8,46.7 C 52.2,45.8 54.7,45.3 57.2,45.3 C 59.9,45.3 62.5,46.0 64.9,47.4 C 67.3,48.8 69.2,50.7 70.7,53.0 C 72.1,55.4 72.8,58.0 72.8,60.7 C 72.8,65.6 71.2,70.1 67.9,74.3 C 64.7,78.5 60.7,82.1 55.9,85.2 C 52.7,87.3 47.5,90.2 40.4,93.7 L 40.0,92.4 z M 75.3,53.1 C 75.3,52.2 75.6,51.5 76.3,50.8 C 76.9,50.2 77.7,49.9 78.6,49.9 C 79.4,49.9 80.2,50.3 80.9,50.9 C 81.6,51.6 81.9,52.4 81.9,53.3 C 81.9,54.2 81.6,55.0 80.9,55.6 C 80.2,56.2 79.4,56.5 78.5,56.5 C 77.6,56.5 76.8,56.2 76.2,55.5 C 75.6,54.9 75.3,54.1 75.3,53.1 z M 75.3,66.4 C 75.3,65.5 75.6,64.7 76.2,64.1 C 76.9,63.5 77.6,63.2 78.6,63.2 C 79.4,63.2 80.2,63.5 80.9,64.2 C 81.6,64.9 81.9,65.6 81.9,66.4 C 81.9,67.4 81.6,68.2 80.9,68.9 C 80.3,69.5 79.5,69.8 78.6,69.8 C 77.6,69.8 76.9,69.5 76.2,68.9 C 75.6,68.3 75.3,67.5 75.3,66.4 z';

export const StaffView: React.FC<StaffViewProps> = ({
  note,
  clef,
  keySignature = 'none',
  status,
}) => {
  // Stave line Y coordinates (5 horizontal lines from top to bottom)
  // Line 5 (top) = 45, Line 4 = 60, Line 3 = 75, Line 2 = 90, Line 1 (bottom) = 105
  const staffLines = [45, 60, 75, 90, 105];
  const isBass = clef === 'bass' || (note && note.isBass);

  // Position calculation
  // Base line (bottom line 1) = 105
  // Step distance = 7.5px (half line spacing of 15px)
  const line1Y = 105;
  const stepY = 7.5;
  const noteY = note ? line1Y - note.step * stepY : 75;
  const noteX = 220;

  // Ledger lines (Linie dodane)
  const extraLines: number[] = [];
  if (note) {
    // Below staff (Y > 105): steps -2 (120), -4 (135), etc.
    for (let y = 120; y <= noteY; y += 15) {
      extraLines.push(y);
    }
    // Above staff (Y < 45): steps 6 (30), 8 (15), etc.
    for (let y = 30; y >= noteY; y -= 15) {
      extraLines.push(y);
    }
  }

  // Note color based on verification status
  let noteColor = '#f8fafc'; // solid bright white
  let glowFilter = '';
  if (status === 'correct') {
    noteColor = '#34d399'; // emerald-400
    glowFilter = 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.9))';
  } else if (status === 'wrong') {
    noteColor = '#f43f5e'; // rose-500
    glowFilter = 'drop-shadow(0 0 10px rgba(244, 63, 94, 0.9))';
  }

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-3 sm:p-5 flex flex-col justify-center items-center relative overflow-hidden shadow-2xl backdrop-blur-sm select-none min-h-[200px]">
      {/* Musical Stave SVG */}
      <svg
        width="380"
        height="170"
        viewBox="0 0 380 170"
        className="w-full max-w-[420px] h-auto block overflow-visible"
        aria-label="Pięciolinia muzyczna"
      >
        {/* Left vertical bar line (zamykająca z lewej) */}
        <line
          x1="28"
          y1="45"
          x2="28"
          y2="105"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right vertical bar line (zamykająca z prawej) */}
        <line
          x1="352"
          y1="45"
          x2="352"
          y2="105"
          stroke="#cbd5e1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 5 Main Staff Lines - Solid high-contrast silver (#cbd5e1 / slate-300) */}
        {staffLines.map((y) => (
          <line
            key={y}
            x1="28"
            y1={y}
            x2="352"
            y2={y}
            stroke="#cbd5e1"
            strokeWidth="2.2"
            strokeLinecap="square"
          />
        ))}

        {/* Clefs (Rendered using precision vector SVG paths) */}
        {isBass ? (
          // Bass Clef (𝄢) vector path
          <path
            d={BASS_CLEF_PATH}
            fill="#38bdf8"
            className="transition-all duration-300"
          />
        ) : (
          // Treble Clef (𝄞) vector path
          <path
            d={TREBLE_CLEF_PATH}
            fill="#38bdf8"
            className="transition-all duration-300"
          />
        )}

        {/* Key Signatures (Znaki przykluczowe) */}
        {(keySignature === 'F' || keySignature === 'Gm') && (
          // B-flat on 3rd line (Y=75)
          <text
            x="100"
            y="81"
            fontFamily="Georgia, serif"
            fontSize="26"
            fill="#f1f5f9"
            fontWeight="bold"
          >
            ♭
          </text>
        )}
        {keySignature === 'Gm' && (
          // E-flat on 4th space (Y=52.5)
          <text
            x="115"
            y="58"
            fontFamily="Georgia, serif"
            fontSize="26"
            fill="#f1f5f9"
            fontWeight="bold"
          >
            ♭
          </text>
        )}
        {(keySignature === 'G' || keySignature === 'Em') && (
          // F-sharp on 5th line (Y=45)
          <text
            x="100"
            y="52"
            fontFamily="Georgia, serif"
            fontSize="26"
            fill="#f1f5f9"
            fontWeight="bold"
          >
            ♯
          </text>
        )}

        {/* Note rendering */}
        {note && (
          <g
            style={{ filter: glowFilter, transition: 'filter 0.25s ease' }}
            className="animate-in fade-in duration-200"
          >
            {/* Ledger lines (Linie dodane nad i pod pięciolinią) */}
            {extraLines.map((ey) => (
              <line
                key={ey}
                x1={noteX - 19}
                y1={ey}
                x2={noteX + 19}
                y2={ey}
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Display Accidental before note if present (# lub b) */}
            {note.displayAccidental && (
              <text
                x={noteX - 25}
                y={noteY + 8}
                fontFamily="Georgia, serif"
                fontSize="26"
                fontWeight="bold"
                fill={status === 'wrong' ? '#f43f5e' : '#fb7185'}
              >
                {note.displayAccidental}
              </text>
            )}

            {/* Note head (rotated ellipse) */}
            <ellipse
              cx={noteX}
              cy={noteY}
              rx="9.5"
              ry="7"
              fill={noteColor}
              transform={`rotate(-22 ${noteX} ${noteY})`}
              className="transition-colors duration-200"
            />

            {/* Note stem (Laseczka nuty) */}
            {note.step >= 4 ? (
              // Stem points down from left side
              <line
                x1={noteX - 8.5}
                y1={noteY}
                x2={noteX - 8.5}
                y2={noteY + 38}
                stroke={noteColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-colors duration-200"
              />
            ) : (
              // Stem points up from right side
              <line
                x1={noteX + 8.5}
                y1={noteY}
                x2={noteX + 8.5}
                y2={noteY - 38}
                stroke={noteColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-colors duration-200"
              />
            )}
          </g>
        )}
      </svg>

    </div>
  );
};
