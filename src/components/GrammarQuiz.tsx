import { useState, useMemo } from "react";
import { ArrowLeft, Check, X, ChevronRight, RotateCcw, Trophy } from "lucide-react";

interface GrammarPoint {
  id: string;
  structure: string;
  explanation: string;
  example_chinese: string;
  example_pinyin: string;
  example_english: string;
}

interface Props {
  grammarPoints: GrammarPoint[];
  onExit: () => void;
  levelLabel: string;
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  grammarId: string;
  type: "structure" | "example";
}

const GrammarQuiz = ({ grammarPoints, onExit, levelLabel }: Props) => {
  const questions = useMemo(() => {
    const qs: QuizQuestion[] = [];
    const shuffled = [...grammarPoints].sort(() => Math.random() - 0.5);

    shuffled.forEach((gp) => {
      // Q1: Given explanation, pick the correct structure
      const wrongStructures = shuffled
        .filter((g) => g.id !== gp.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((g) => g.structure);
      if (wrongStructures.length >= 2) {
        const opts = [gp.structure, ...wrongStructures.slice(0, 3)].sort(() => Math.random() - 0.5);
        qs.push({
          question: `Which structure matches: "${gp.explanation}"?`,
          correctAnswer: gp.structure,
          options: opts,
          grammarId: gp.id,
          type: "structure",
        });
      }

      // Q2: Given Chinese example, pick English translation
      const wrongEnglish = shuffled
        .filter((g) => g.id !== gp.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((g) => g.example_english);
      if (wrongEnglish.length >= 2) {
        const opts = [gp.example_english, ...wrongEnglish.slice(0, 3)].sort(() => Math.random() - 0.5);
        qs.push({
          question: `What does "${gp.example_chinese}" mean?`,
          correctAnswer: gp.example_english,
          options: opts,
          grammarId: gp.id,
          type: "example",
        });
      }
    });

    return qs.sort(() => Math.random() - 0.5).slice(0, 10);
  }, [grammarPoints]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIdx];

  const handleSelect = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === current.correctAnswer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx >= questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div className="brutalist-card rounded-xl bg-card p-8 text-center">
        <p className="font-mono text-muted-foreground mb-4">Not enough grammar points to generate a quiz.</p>
        <button onClick={onExit} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-mono font-bold text-sm brutalist-border">
          Go Back
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="brutalist-card rounded-xl bg-card p-8 text-center max-w-md mx-auto">
        <Trophy size={48} className="mx-auto text-accent mb-4" />
        <h2 className="text-3xl font-bold font-mono mb-2">QUIZ COMPLETE</h2>
        <p className="text-muted-foreground font-mono text-sm mb-4">{levelLabel} Grammar Quiz</p>
        <div className="brutalist-card rounded-lg bg-secondary p-6 mb-6">
          <p className="text-5xl font-bold font-mono text-secondary-foreground">{pct}%</p>
          <p className="text-sm font-mono text-secondary-foreground/80 mt-1">{score}/{questions.length} Correct</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRestart} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-mono font-bold text-sm brutalist-border">
            <RotateCcw size={14} /> Retry
          </button>
          <button onClick={onExit} className="inline-flex items-center gap-2 bg-card text-foreground px-5 py-2.5 rounded-lg font-mono font-bold text-sm brutalist-border hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="text-sm font-mono text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft size={14} /> Exit Quiz
        </button>
        <span className="font-mono text-sm">
          <span className="text-accent">{currentIdx + 1}</span>/{questions.length}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full mb-6 brutalist-border overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="brutalist-card rounded-xl bg-card p-6 mb-4">
        <span className="retro-tag text-accent border-accent inline-block mb-3">
          {current.type === "structure" ? "STRUCTURE" : "TRANSLATION"}
        </span>
        <h2 className="text-lg font-bold font-mono">{current.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((opt, i) => {
          let cls = "brutalist-card rounded-xl bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left w-full";
          if (answered) {
            if (opt === current.correctAnswer) cls = "brutalist-card rounded-xl bg-secondary/30 p-4 border-secondary text-left w-full";
            else if (opt === selected) cls = "brutalist-card rounded-xl bg-destructive/20 p-4 text-left w-full";
            else cls = "brutalist-card rounded-xl bg-card p-4 opacity-50 text-left w-full";
          } else if (opt === selected) {
            cls = "brutalist-card rounded-xl bg-muted p-4 text-left w-full";
          }
          return (
            <button key={i} onClick={() => handleSelect(opt)} className={cls} disabled={answered}>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg brutalist-border flex items-center justify-center font-mono font-bold text-xs bg-card shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-mono text-sm">{opt}</span>
                {answered && opt === current.correctAnswer && <Check size={18} className="ml-auto text-secondary" />}
                {answered && opt === selected && opt !== current.correctAnswer && <X size={18} className="ml-auto text-destructive" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next */}
      {answered && (
        <div className="flex justify-end mt-4">
          <button onClick={handleNext} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-lg font-mono font-bold text-sm brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            {currentIdx >= questions.length - 1 ? "Finish" : "Next"} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GrammarQuiz;
