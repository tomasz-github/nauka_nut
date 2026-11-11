import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  Music,
  CheckCircle,
  XCircle,
  Volume1,
} from 'lucide-react';
import { ActiveNote, LevelConfig } from './types';
import { LEVELS, ALL_NOTES } from './data/notes';
import { soundEngine } from './utils/audio';
import { StaffView } from './components/StaffView';
import { PianoKeyboard } from './components/PianoKeyboard';
import { StatsBar } from './components/StatsBar';
import { WinModal } from './components/WinModal';

export default function App() {
  const [levelId, setLevelId] = useState<string>('0');
  const [pool, setPool] = useState<ActiveNote[]>([]);
  const [initialPoolSize, setInitialPoolSize] = useState<number>(0);
  const [currentNote, setCurrentNote] = useState<ActiveNote | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    noteName?: string;
    details?: string;
  }>({ type: null, text: '' });

  const [highlightCorrectKey, setHighlightCorrectKey] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState<boolean>(false);

  const okButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentLevelConfig: LevelConfig =
    LEVELS.find((l) => l.id === levelId) || LEVELS[0];

  // Initialize level
  const initLevel = useCallback((lvlId: string) => {
    setLevelId(lvlId);
    setStreak(0);
    setIsPaused(false);
    setVerificationStatus('idle');
    setHighlightCorrectKey(null);
    setFeedbackMessage({ type: null, text: '' });
    setIsWinModalOpen(false);

    let rawNotes = [];
    if (lvlId.startsWith('3_')) {
      // Level 3 uses base level 1 notes with key signatures
      rawNotes = ALL_NOTES.filter((n) => n.level === '1');
    } else {
      rawNotes = ALL_NOTES.filter((n) => n.level === lvlId);
    }

    const activeList: ActiveNote[] = rawNotes.map((n) => ({
      ...n,
      weight: 1.0,
      successCount: 0,
      totalAttempts: 0,
      mistakes: 0,
    }));

    setPool(activeList);
    setInitialPoolSize(activeList.length);

    // Pick first question from newly initialized pool
    if (activeList.length > 0) {
      const first = activeList[Math.floor(Math.random() * activeList.length)];
      setCurrentNote(first);
      // Play initial sound
      soundEngine.playNote(first.freq);
    } else {
      setCurrentNote(null);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    initLevel('0');
  }, [initLevel]);

  // Pick next question based on weights
  const nextQuestion = useCallback(
    (currentPool: ActiveNote[]) => {
      if (currentPool.length === 0) {
        setIsWinModalOpen(true);
        soundEngine.playVictoryFanfare();
        return;
      }

      setIsPaused(false);
      setVerificationStatus('idle');
      setHighlightCorrectKey(null);
      setFeedbackMessage({ type: null, text: '' });

      const totalWeight = currentPool.reduce((sum, item) => sum + item.weight, 0);
      let rnd = Math.random() * totalWeight;
      let selected: ActiveNote = currentPool[0];

      for (const item of currentPool) {
        rnd -= item.weight;
        if (rnd <= 0) {
          selected = item;
          break;
        }
      }

      setCurrentNote(selected);
      soundEngine.playNote(selected.freq);
    },
    []
  );

  // Verification logic
  const handleSelectNote = useCallback(
    (selectedNote: string) => {
      if (isPaused || !currentNote) return;

      setActiveKey(selectedNote);
      setTimeout(() => setActiveKey(null), 200);

      const isCorrect = selectedNote.toUpperCase() === currentNote.name.toUpperCase();

      if (isCorrect) {
        // CORRECT ANSWER
        soundEngine.playSuccessChime();
        const newStreak = streak + 1;
        setStreak(newStreak);
        setVerificationStatus('correct');

        const newSuccessCount = currentNote.successCount + 1;

        if (newSuccessCount >= 2) {
          // Mastered! Remove from pool
          const remaining = pool.filter((n) => n.id !== currentNote.id);
          setPool(remaining);
          setFeedbackMessage({
            type: 'correct',
            text: 'Świetnie! Nuta opanowana (2/2) i usunięta z zestawu! 🎉',
          });

          if (remaining.length === 0) {
            setTimeout(() => {
              setIsWinModalOpen(true);
              soundEngine.playVictoryFanfare();
            }, 500);
          } else {
            setTimeout(() => nextQuestion(remaining), 700);
          }
        } else {
          // Decreased weight by 10x relative to average weight
          const avgWeight = pool.reduce((acc, n) => acc + n.weight, 0) / pool.length;
          const newWeight = Math.max(0.05, avgWeight / 10);

          const updatedPool = pool.map((n) =>
            n.id === currentNote.id
              ? { ...n, weight: newWeight, successCount: newSuccessCount, totalAttempts: n.totalAttempts + 1 }
              : n
          );
          setPool(updatedPool);
          setFeedbackMessage({
            type: 'correct',
            text: 'Dobrze! Nuta poprawna (1/2) 🌟',
          });
          setTimeout(() => nextQuestion(updatedPool), 650);
        }
      } else {
        // WRONG ANSWER
        soundEngine.playErrorSound();
        setStreak(0);
        setIsPaused(true);
        setVerificationStatus('wrong');
        setHighlightCorrectKey(currentNote.name);

        // Double weight (2x more probable)
        const updatedPool = pool.map((n) =>
          n.id === currentNote.id
            ? { ...n, weight: n.weight * 2, mistakes: n.mistakes + 1, totalAttempts: n.totalAttempts + 1 }
            : n
        );
        setPool(updatedPool);

        setFeedbackMessage({
          type: 'wrong',
          text: `Błąd! Poprawna nuta to: ${currentNote.name}`,
          noteName: currentNote.name,
          details: currentNote.polishFullName
            ? `(${currentNote.polishFullName})`
            : currentNote.octaveName
            ? `(${currentNote.octaveName})`
            : undefined,
        });

        // Focus OK button for quick keyboard navigation
        setTimeout(() => {
          okButtonRef.current?.focus();
        }, 50);
      }
    },
    [isPaused, currentNote, streak, pool, nextQuestion]
  );

  // Resume after incorrect answer review
  const handleAcknowledgeMistake = useCallback(() => {
    if (pool.length > 0) {
      nextQuestion(pool);
    }
  }, [pool, nextQuestion]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if user is inside a select or input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (isPaused) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAcknowledgeMistake();
        }
        return;
      }

      const key = e.key.toUpperCase();
      const validNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'H', 'B'];

      if (validNotes.includes(key)) {
        e.preventDefault();
        handleSelectNote(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, handleSelectNote, handleAcknowledgeMistake]);

  // Replay current note sound
  const handleReplayNote = () => {
    if (currentNote) {
      soundEngine.playNote(currentNote.freq);
    }
  };

  // Toggle mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  // Move to next level
  const handleNextLevel = () => {
    const currentIndex = LEVELS.findIndex((l) => l.id === levelId);
    if (currentIndex >= 0 && currentIndex < LEVELS.length - 1) {
      initLevel(LEVELS[currentIndex + 1].id);
    } else {
      initLevel('0');
    }
  };

  const masteredCount = initialPoolSize - pool.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-3 sm:p-6 font-sans">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container Card */}
      <main className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col items-center gap-4 relative z-10 backdrop-blur-md">
        {/* Top Header & Level Bar */}
        <header className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl shadow-md text-white">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                Trener Nut
              </h1>
            </div>
          </div>

          {/* Quick action buttons & Level select */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'Włącz dźwięk' : 'Wycisz dźwięk'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => initLevel(levelId)}
              title="Zrestartuj ten poziom"
              className="p-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Level Selector Dropdown */}
            <select
              value={levelId}
              onChange={(e) => initLevel(e.target.value)}
              aria-label="Wybierz poziom trudności"
              className="bg-slate-950 text-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer max-w-[200px] sm:max-w-[240px]"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.title}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Stats & Progress Bar */}
        <StatsBar
          streak={streak}
          remainingCount={pool.length}
          initialCount={initialPoolSize}
          masteredCount={masteredCount}
        />

        {/* Level description */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
          <span>{currentLevelConfig.subtitle}</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">{currentLevelConfig.description}</span>
        </div>

        {/* Musical Stave View */}
        <div className="w-full relative">
          <StaffView
            note={currentNote}
            clef={currentLevelConfig.clef}
            keySignature={currentLevelConfig.keySignature}
            status={verificationStatus}
          />

          {/* Sound replay button overlay */}
          <button
            type="button"
            onClick={handleReplayNote}
            title="Odtwórz dźwięk nuty"
            className="absolute top-3 right-3 p-2 bg-slate-900/90 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700/80 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold backdrop-blur-sm"
          >
            <Volume1 className="w-4 h-4" />
            <span className="hidden sm:inline">Zagraj nutę</span>
          </button>
        </div>

        {/* Feedback / Error Message Box */}
        <div
          className={`w-full min-h-[58px] flex items-center justify-center rounded-2xl p-2.5 font-medium text-center transition-all duration-200 ${
            verificationStatus === 'correct'
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm'
              : verificationStatus === 'wrong'
              ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
              : 'bg-slate-950/40 border border-slate-800/80 text-slate-400'
          }`}
        >
          {verificationStatus === 'correct' && (
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg animate-in zoom-in-95">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {verificationStatus === 'wrong' && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-left">
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <div className="text-sm sm:text-base font-bold text-slate-100">
                    Błąd! Poprawna nuta to:{' '}
                    <span className="text-rose-400 text-lg font-extrabold ml-1">
                      {feedbackMessage.noteName}
                    </span>
                  </div>
                  {feedbackMessage.details && (
                    <div className="text-xs text-rose-300/80 font-medium">
                      {feedbackMessage.details}
                    </div>
                  )}
                </div>
              </div>

              <button
                ref={okButtonRef}
                type="button"
                onClick={handleAcknowledgeMistake}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl shadow-lg transition-all text-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dalej (Enter)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {verificationStatus === 'idle' && (
            <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
              <span>Wskaż nazwę wyświetlonej nuty na klawiaturze muzycznej</span>
            </div>
          )}
        </div>

        {/* Interactive Piano Keyboard */}
        <PianoKeyboard
          onSelectNote={handleSelectNote}
          disabled={isPaused}
          highlightCorrectNote={highlightCorrectKey}
          displayAccidental={currentNote?.displayAccidental}
          activeKey={activeKey}
        />
      </main>

      {/* Level Completion Win Modal */}
      <WinModal
        isOpen={isWinModalOpen}
        levelTitle={currentLevelConfig.title}
        onNextLevel={handleNextLevel}
        onRestartLevel={() => initLevel(levelId)}
        hasNextLevel={
          LEVELS.findIndex((l) => l.id === levelId) < LEVELS.length - 1
        }
      />
    </div>
  );
}
