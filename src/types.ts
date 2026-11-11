export type ClefType = 'treble' | 'bass';

export interface NoteDefinition {
  id: string;
  name: string; // 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'H' | 'B'
  polishFullName?: string; // e.g. "Cis (C z krzyżykiem)", "B (H z bemolem)"
  step: number; // Stave vertical step
  displayAccidental?: '♯' | '♭' | null;
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
  keySignature?: 'none' | 'F' | 'G' | 'Gm' | 'Am' | 'Em';
  description: string;
}
