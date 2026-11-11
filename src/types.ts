export type ClefType = 'treble' | 'bass';

export interface NoteDefinition {
  id: string;
  name: string; // 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'H' | 'B'
  displayName?: string; // e.g. "Des", "Cis", "Es", "Fis", "B"
  polishFullName?: string; // e.g. "Des (D z bemolem)", "Cis (C z krzyżykiem)"
  step: number; // Stave vertical step
  displayAccidental?: '♯' | '♭' | null;
  pitchClass: number; // 0 to 11 (C=0, C#/Db=1, D=2, D#/Eb=3, E=4, F=5, F#/Gb=6, G=7, G#/Ab=8, A=9, B=10, H=11)
  freq: number;
  level: string;
  isBass?: boolean;
  octaveName?: string; // e.g. "razkreślna", "mała", "dwukreślna"
}

export interface ActiveNote extends NoteDefinition {
  weight: number;
  successCount: number; // 0, 1, or 2 (mastered at 2)
  totalAttempts: number;
  mistakes: number;
}

export interface LevelConfig {
  id: string;
  title: string;
  subtitle: string;
  category: 'podstawowy' | 'wiolinowy' | 'chromatyczny' | 'tonacje' | 'basowy';
  clef: ClefType;
  keySignature?: 'none' | 'F' | 'G' | 'Gm' | 'Em';
  description: string;
}
