import { useState, useMemo } from "react";
import { ArrowLeft, RotateCcw, Trophy, Eye, EyeOff, ChevronLeft, ChevronRight, Check, X } from "lucide-react";

interface VocabWord {
  chinese: string;
  pinyin: string;
  english: string;
  bangla?: string;
}

interface Props {
  vocab: VocabWord[];
  batchSize: number | "ALL";
  onExit: () => void;
  levelLabel: string;
}

const FlashcardSession = ({ vocab, batchSize, onExit, levelLabel }: Props) => {
  const cards = useMemo(() => {
    const shuffled = [...vocab].sort(() => Math.random() - 0.5);
    const count = batchSize === "ALL" ? shuffled.length : Math.min(batchSize, shuffled.length);
    return shuffled.slice(0, count);
  }, [vocab, batchSize]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = cards[currentIdx];
  const total = cards.length;

  const markAndNext = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1);
    else setUnknown((u) => u + 1);

    if (currentIdx >= total - 1) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setKnown(0);
    setUnknown(0);
    setFinished(false);
  };

  if (cards.length === 0) {
    return (
      <div className="brutalist-card rounded-xl bg-card p-8 text-center">
        <p className="font-mono text-muted-foreground mb-4">No vocabulary available.</p>
        <button onClick={onExit} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-mono font-bold text-sm brutalist-border">Go Back</button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((known / total) * 100);
    return (
      <div className="brutalist-card rounded-xl bg-card p-8 text-center max-w-md mx-auto">
        <Trophy size={48} className="mx-auto text-accent mb-4" />
        <h2 className="text-3xl font-bold font-mono mb-2">SESSION COMPLETE</h2>
        <p className="text-muted-foreground font-mono text-sm mb-4">{levelLabel} • {total} Cards</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="brutalist-card rounded-lg bg-secondary/30 p-4">
            <p className="text-3xl font-bold font-mono text-secondary">{known}</p>
            <p className="text-xs font-mono text-muted-foreground">KNOWN</p>
          </div>
          <div className="brutalist-card rounded-lg bg-destructive/10 p-4">
            <p className="text-3xl font-bold font-mono text-destructive">{unknown}</p>
            <p className="text-xs font-mono text-muted-foreground">REVIEW</p>
          </div>
        </div>
        <div className="w-full h-3 bg-muted rounded-full brutalist-border overflow-hidden mb-6">
          <div className="h-full bg-secondary rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-2xl font-bold font-mono mb-4">{pct}% Mastery</p>
        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-mono font-bold text-sm brutalist-border">
            <RotateCcw size={14} /> Again
          </button>
          <button onClick={onExit} className="inline-flex items-center gap-2 bg-card text-foreground px-5 py-2.5 rounded-lg font-mono font-bold text-sm brutalist-border hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="text-sm font-mono text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft size={14} /> Exit
        </button>
        <div className="flex items-center gap-3 font-mono text-sm">
          <span className="text-secondary">{known} ✓</span>
          <span className="text-destructive">{unknown} ✗</span>
          <span className="text-muted-foreground">{currentIdx + 1}/{total}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full mb-6 brutalist-border overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((currentIdx + 1) / total) * 100}%` }} />
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="brutalist-card rounded-xl bg-card p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors select-none"
      >
        {!flipped ? (
          <>
            <p className="text-6xl font-bold mb-4">{current.chinese}</p>
            <p className="text-xs font-mono text-muted-foreground mt-2">Tap to reveal</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold mb-2">{current.chinese}</p>
            <p className="text-lg text-accent font-mono">/{current.pinyin}/</p>
            <p className="text-lg text-muted-foreground mt-2">{current.english}</p>
            {current.bangla && <p className="text-base text-accent mt-1">{current.bangla}</p>}
          </>
        )}
      </div>

      {/* Action buttons */}
      {flipped && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => markAndNext(false)}
            className="flex-1 brutalist-card rounded-xl bg-destructive/10 p-4 flex flex-col items-center gap-1 hover:bg-destructive/20 transition-colors"
          >
            <X size={24} className="text-destructive" />
            <span className="text-xs font-mono font-bold">DON'T KNOW</span>
          </button>
          <button
            onClick={() => markAndNext(true)}
            className="flex-1 brutalist-card rounded-xl bg-secondary/20 p-4 flex flex-col items-center gap-1 hover:bg-secondary/30 transition-colors"
          >
            <Check size={24} className="text-secondary" />
            <span className="text-xs font-mono font-bold">KNOW IT</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardSession;
