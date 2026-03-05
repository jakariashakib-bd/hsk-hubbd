import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumb from "@/components/Breadcrumb";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft,
  Trophy, RotateCcw, Home, Volume2, BookOpen, Target, AlertTriangle,
} from "lucide-react";

/* ─── Types ─── */
interface Question {
  id: string;
  type: "listening" | "reading";
  section: string;
  question: string;
  options: string[];
  correctAnswer: string;
  chinese?: string;
  pinyin?: string;
}

interface ExamConfig {
  level: number;
  label: string;
  timeMinutes: number;
  listeningSections: { name: string; count: number; generator: string }[];
  readingSections: { name: string; count: number; generator: string }[];
}

const EXAM_CONFIGS: Record<number, ExamConfig> = {
  1: {
    level: 1, label: "HSK 1", timeMinutes: 40,
    listeningSections: [
      { name: "Match Picture", count: 5, generator: "picture_match" },
      { name: "True or False", count: 5, generator: "true_false" },
      { name: "Match Dialogue", count: 5, generator: "dialogue_match" },
      { name: "Choose Answer", count: 5, generator: "choose_answer" },
    ],
    readingSections: [
      { name: "Match Picture & Word", count: 5, generator: "word_picture" },
      { name: "Match Sentences", count: 5, generator: "sentence_match" },
      { name: "Q & A Matching", count: 5, generator: "qa_match" },
      { name: "Fill in Blanks", count: 5, generator: "fill_blank" },
    ],
  },
  2: {
    level: 2, label: "HSK 2", timeMinutes: 55,
    listeningSections: [
      { name: "True or False", count: 10, generator: "true_false" },
      { name: "Match Dialogue", count: 10, generator: "dialogue_match" },
      { name: "Choose Answer", count: 10, generator: "choose_answer" },
    ],
    readingSections: [
      { name: "Match Picture & Word", count: 10, generator: "word_picture" },
      { name: "Match Sentences", count: 10, generator: "sentence_match" },
      { name: "Fill in Blanks", count: 10, generator: "fill_blank" },
    ],
  },
  3: {
    level: 3, label: "HSK 3", timeMinutes: 90,
    listeningSections: [
      { name: "Match Dialogue", count: 10, generator: "dialogue_match" },
      { name: "True or False", count: 10, generator: "true_false" },
      { name: "Choose Answer", count: 20, generator: "choose_answer" },
    ],
    readingSections: [
      { name: "Match Sentences", count: 10, generator: "sentence_match" },
      { name: "Fill in Blanks", count: 10, generator: "fill_blank" },
      { name: "Reading Comprehension", count: 20, generator: "reading_comp" },
    ],
  },
  4: {
    level: 4, label: "HSK 4", timeMinutes: 105,
    listeningSections: [
      { name: "True or False", count: 10, generator: "true_false" },
      { name: "Match Dialogue", count: 15, generator: "dialogue_match" },
      { name: "Choose Answer", count: 20, generator: "choose_answer" },
    ],
    readingSections: [
      { name: "Fill in Blanks", count: 10, generator: "fill_blank" },
      { name: "Sentence Ordering", count: 15, generator: "sentence_match" },
      { name: "Reading Comprehension", count: 20, generator: "reading_comp" },
    ],
  },
  5: {
    level: 5, label: "HSK 5", timeMinutes: 120,
    listeningSections: [
      { name: "Match Dialogue", count: 15, generator: "dialogue_match" },
      { name: "Choose Answer", count: 30, generator: "choose_answer" },
    ],
    readingSections: [
      { name: "Fill in Blanks", count: 15, generator: "fill_blank" },
      { name: "Reading Comprehension", count: 30, generator: "reading_comp" },
    ],
  },
};

/* ─── Helpers ─── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.8;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

/* ─── Question generators ─── */
function generateQuestions(
  vocab: { chinese: string; pinyin: string; english: string }[],
  config: ExamConfig,
): Question[] {
  const questions: Question[] = [];
  const pool = shuffle(vocab);
  let idx = 0;

  const pick = () => pool[idx++ % pool.length];
  const pickN = (n: number) => Array.from({ length: n }, pick);
  const wrongOptions = (correct: string, field: "chinese" | "english", n = 3) => {
    const others = shuffle(vocab.filter((v) => v[field] !== correct)).slice(0, n);
    return shuffle([correct, ...others.map((o) => o[field])]);
  };

  const makeSection = (
    sections: { name: string; count: number; generator: string }[],
    type: "listening" | "reading",
  ) => {
    sections.forEach((sec) => {
      const items = pickN(sec.count);
      items.forEach((word, i) => {
        let q: Question;
        switch (sec.generator) {
          case "true_false": {
            const isTrue = Math.random() > 0.5;
            const shown = isTrue ? word : shuffle(vocab.filter((v) => v.chinese !== word.chinese))[0];
            q = {
              id: `${type}-${sec.name}-${i}`,
              type,
              section: sec.name,
              question: `Does "${word.chinese}" (${word.pinyin}) mean "${shown.english}"?`,
              options: ["True ✓", "False ✗"],
              correctAnswer: isTrue ? "True ✓" : "False ✗",
              chinese: word.chinese,
              pinyin: word.pinyin,
            };
            break;
          }
          case "picture_match":
          case "word_picture":
          case "choose_answer":
          case "reading_comp": {
            q = {
              id: `${type}-${sec.name}-${i}`,
              type,
              section: sec.name,
              question: `What is the meaning of "${word.chinese}" (${word.pinyin})?`,
              options: wrongOptions(word.english, "english"),
              correctAnswer: word.english,
              chinese: word.chinese,
              pinyin: word.pinyin,
            };
            break;
          }
          case "dialogue_match":
          case "sentence_match":
          case "qa_match": {
            q = {
              id: `${type}-${sec.name}-${i}`,
              type,
              section: sec.name,
              question: `Which Chinese word means "${word.english}"?`,
              options: wrongOptions(word.chinese, "chinese"),
              correctAnswer: word.chinese,
              chinese: word.chinese,
              pinyin: word.pinyin,
            };
            break;
          }
          case "fill_blank": {
            q = {
              id: `${type}-${sec.name}-${i}`,
              type,
              section: sec.name,
              question: `Fill in: The pinyin "${word.pinyin}" corresponds to which character?`,
              options: wrongOptions(word.chinese, "chinese"),
              correctAnswer: word.chinese,
              chinese: word.chinese,
              pinyin: word.pinyin,
            };
            break;
          }
          default: {
            q = {
              id: `${type}-${sec.name}-${i}`,
              type,
              section: sec.name,
              question: `What is "${word.chinese}"?`,
              options: wrongOptions(word.english, "english"),
              correctAnswer: word.english,
              chinese: word.chinese,
              pinyin: word.pinyin,
            };
          }
        }
        questions.push(q);
      });
    });
  };

  makeSection(config.listeningSections, "listening");
  makeSection(config.readingSections, "reading");
  return questions;
}

/* ─── Component ─── */
const MockTestTakingPage = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const lvl = Number(level) || 1;
  const config = EXAM_CONFIGS[lvl] || EXAM_CONFIGS[1];

  const [phase, setPhase] = useState<"intro" | "test" | "result">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(config.timeMinutes * 60);
  const [submitted, setSubmitted] = useState(false);

  /* Fetch vocab */
  const { data: vocab, isLoading } = useQuery({
    queryKey: ["mock-vocab", lvl],
    queryFn: async () => {
      const { data: lessons } = await supabase
        .from("hsk_lessons")
        .select("id")
        .eq("level", lvl);
      if (!lessons?.length) return [];
      const ids = lessons.map((l) => l.id);
      const { data: words } = await supabase
        .from("vocabulary")
        .select("chinese, pinyin, english")
        .in("lesson_id", ids);
      return words || [];
    },
  });

  /* Timer */
  useEffect(() => {
    if (phase !== "test" || submitted) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setSubmitted(true);
          setPhase("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, submitted]);

  const startExam = useCallback(() => {
    if (!vocab?.length) return;
    const qs = generateQuestions(vocab, config);
    setQuestions(qs);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(config.timeMinutes * 60);
    setSubmitted(false);
    setPhase("test");
  }, [vocab, config]);

  const selectAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [current]: val }));
  };

  const submitExam = () => {
    setSubmitted(true);
    setPhase("result");
  };

  const retryExam = () => {
    setPhase("intro");
  };

  /* Results */
  const results = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    let listeningCorrect = 0;
    let readingCorrect = 0;
    let listeningTotal = 0;
    let readingTotal = 0;
    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      if (q.type === "listening") {
        listeningTotal++;
        if (isCorrect) listeningCorrect++;
      } else {
        readingTotal++;
        if (isCorrect) readingCorrect++;
      }
    });
    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 60;
    return { correct, total, percentage, passed, listeningCorrect, listeningTotal, readingCorrect, readingTotal };
  }, [submitted, questions, answers]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const isUrgent = timeLeft < 120;
  const q = questions[current];

  /* ─── INTRO ─── */
  if (phase === "intro") {
    const totalQ =
      config.listeningSections.reduce((a, s) => a + s.count, 0) +
      config.readingSections.reduce((a, s) => a + s.count, 0);

    return (
      <div className="max-w-3xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Mock Exams", to: "/mock-test" },
            { label: config.label },
          ]}
        />

        <div className="brutalist-card rounded-2xl bg-card p-8 mt-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-primary/10 brutalist-border rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl font-bold font-mono text-primary">{lvl}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{config.label} Mock Exam</h1>
            <p className="text-muted-foreground">Simulated exam based on official HSK format</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-background brutalist-border rounded-xl p-4 text-center">
              <Clock className="mx-auto mb-2 text-primary" size={24} />
              <p className="text-2xl font-bold font-mono">{config.timeMinutes}</p>
              <p className="text-xs text-muted-foreground font-mono">MINUTES</p>
            </div>
            <div className="bg-background brutalist-border rounded-xl p-4 text-center">
              <Target className="mx-auto mb-2 text-secondary" size={24} />
              <p className="text-2xl font-bold font-mono">{totalQ}</p>
              <p className="text-xs text-muted-foreground font-mono">QUESTIONS</p>
            </div>
            <div className="bg-background brutalist-border rounded-xl p-4 text-center">
              <Trophy className="mx-auto mb-2 text-accent" size={24} />
              <p className="text-2xl font-bold font-mono">60%</p>
              <p className="text-xs text-muted-foreground font-mono">PASS MARK</p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-background brutalist-border rounded-xl p-4">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Volume2 size={16} className="text-primary" /> Listening
              </h3>
              {config.listeningSections.map((s) => (
                <div key={s.name} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-mono font-bold">{s.count}Q</span>
                </div>
              ))}
            </div>
            <div className="bg-background brutalist-border rounded-xl p-4">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-secondary" /> Reading
              </h3>
              {config.readingSections.map((s) => (
                <div key={s.name} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-mono font-bold">{s.count}Q</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="bg-primary/5 brutalist-border rounded-xl p-4 mb-8">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
              <AlertTriangle size={14} className="text-primary" /> Exam Rules
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Timer starts once you begin — no pausing</li>
              <li>• You can navigate between questions freely</li>
              <li>• Unanswered questions count as incorrect</li>
              <li>• 60% is required to pass</li>
            </ul>
          </div>

          <Button
            onClick={startExam}
            disabled={isLoading || !vocab?.length}
            className="w-full h-14 text-lg font-bold brutalist-border rounded-xl"
          >
            {isLoading ? "Loading questions..." : "🚀 Start Exam"}
          </Button>
        </div>
      </div>
    );
  }

  /* ─── RESULT ─── */
  if (phase === "result" && results) {
    return (
      <div className="max-w-3xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Mock Exams", to: "/mock-test" },
            { label: `${config.label} — Results` },
          ]}
        />

        <div className="brutalist-card rounded-2xl bg-card p-8 mt-6 text-center">
          <div className={`w-24 h-24 mx-auto rounded-full brutalist-border flex items-center justify-center mb-4 ${results.passed ? "bg-secondary/20" : "bg-destructive/20"}`}>
            {results.passed ? <Trophy size={40} className="text-secondary" /> : <XCircle size={40} className="text-destructive" />}
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {results.passed ? "🎉 Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {results.passed ? "You passed the mock exam!" : "You didn't reach the 60% pass mark this time."}
          </p>

          {/* Score circle */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={results.passed ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - results.percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono">{results.percentage}%</span>
              <span className="text-xs text-muted-foreground font-mono">{results.correct}/{results.total}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
            <div className="bg-background brutalist-border rounded-xl p-4">
              <Volume2 size={18} className="mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold font-mono">
                {results.listeningCorrect}/{results.listeningTotal}
              </p>
              <p className="text-xs text-muted-foreground font-mono">LISTENING</p>
            </div>
            <div className="bg-background brutalist-border rounded-xl p-4">
              <BookOpen size={18} className="mx-auto mb-1 text-secondary" />
              <p className="text-xl font-bold font-mono">
                {results.readingCorrect}/{results.readingTotal}
              </p>
              <p className="text-xs text-muted-foreground font-mono">READING</p>
            </div>
          </div>

          {/* Review wrong answers */}
          <div className="text-left mb-8">
            <h3 className="font-bold mb-3">Review Incorrect Answers</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
              {questions.map((q, i) => {
                const userAns = answers[i];
                const isCorrect = userAns === q.correctAnswer;
                if (isCorrect) return null;
                return (
                  <div key={i} className="bg-destructive/5 brutalist-border rounded-lg p-3 text-sm">
                    <p className="font-medium mb-1">
                      <span className="font-mono text-muted-foreground mr-2">Q{i + 1}</span>
                      {q.question}
                    </p>
                    <div className="flex gap-4 text-xs mt-1">
                      <span className="text-destructive">Your: {userAns || "—"}</span>
                      <span className="text-secondary">Correct: {q.correctAnswer}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 brutalist-border" onClick={retryExam}>
              <RotateCcw size={16} className="mr-2" /> Retry
            </Button>
            <Button className="flex-1 brutalist-border" onClick={() => navigate("/mock-test")}>
              <Home size={16} className="mr-2" /> All Exams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── TEST ─── */
  if (!q) return null;

  // Section info
  const listeningQs = questions.filter((q) => q.type === "listening");
  const readingQs = questions.filter((q) => q.type === "reading");
  const isListening = q.type === "listening";
  const sectionLabel = isListening ? "Listening" : "Reading";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="retro-tag text-primary border-primary">{config.label}</span>
          <span className="retro-tag border-muted-foreground text-muted-foreground">
            {sectionLabel} • {q.section}
          </span>
        </div>
        <div className={`flex items-center gap-2 font-mono font-bold text-lg ${isUrgent ? "text-destructive animate-pulse" : "text-foreground"}`}>
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <Progress value={progressPct} className="h-2 brutalist-border rounded-full" />
        <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
          <span>{answeredCount} answered</span>
          <span>{totalQuestions - answeredCount} remaining</span>
        </div>
      </div>

      {/* Question card */}
      <div className="brutalist-card rounded-2xl bg-card p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-muted-foreground">
            Question {current + 1} of {totalQuestions}
          </span>
          {isListening && q.chinese && (
            <button
              onClick={() => speak(q.chinese!)}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Volume2 size={16} /> Play Audio
            </button>
          )}
        </div>

        {/* Chinese display */}
        {q.chinese && (
          <div className="bg-background brutalist-border rounded-xl p-4 text-center mb-4">
            <p className="text-3xl font-bold mb-1">{q.chinese}</p>
            {q.pinyin && <p className="text-sm text-muted-foreground font-mono">{q.pinyin}</p>}
          </div>
        )}

        <h2 className="text-lg font-bold mb-5">{q.question}</h2>

        {/* Options */}
        <RadioGroup value={answers[current] || ""} onValueChange={selectAnswer} className="space-y-3">
          {q.options.map((opt, oi) => {
            const letter = String.fromCharCode(65 + oi);
            const isSelected = answers[current] === opt;
            return (
              <Label
                key={oi}
                htmlFor={`opt-${oi}`}
                className={`flex items-center gap-3 p-4 rounded-xl brutalist-border cursor-pointer transition-all ${
                  isSelected ? "bg-primary/10 border-primary" : "bg-background hover:bg-muted"
                }`}
              >
                <RadioGroupItem value={opt} id={`opt-${oi}`} />
                <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {letter}
                </span>
                <span className="text-sm font-medium">{opt}</span>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Question navigator */}
      <div className="mt-4 brutalist-card rounded-xl bg-card p-4">
        <p className="text-xs font-mono text-muted-foreground mb-2">QUESTION NAVIGATOR</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => {
            const answered = answers[i] !== undefined;
            const isCurrent = i === current;
            // section boundary
            const isListeningQ = questions[i].type === "listening";
            const prevIsListening = i > 0 ? questions[i - 1].type === "listening" : true;
            const boundary = i > 0 && isListeningQ !== prevIsListening;

            return (
              <span key={i} className={boundary ? "ml-2" : ""}>
                <button
                  onClick={() => setCurrent(i)}
                  className={`w-8 h-8 rounded-md text-xs font-mono font-bold transition-all brutalist-border ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : answered
                      ? "bg-secondary/20 text-secondary"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <Button
          variant="outline"
          className="brutalist-border"
          disabled={current === 0}
          onClick={() => setCurrent((p) => p - 1)}
        >
          <ArrowLeft size={16} className="mr-1" /> Previous
        </Button>

        {current < totalQuestions - 1 ? (
          <Button
            className="brutalist-border"
            onClick={() => setCurrent((p) => p + 1)}
          >
            Next <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            className="brutalist-border bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={submitExam}
          >
            <CheckCircle2 size={16} className="mr-1" /> Submit Exam
          </Button>
        )}
      </div>

      {/* Submit early */}
      {answeredCount === totalQuestions && current < totalQuestions - 1 && (
        <div className="mt-3 text-center">
          <Button variant="link" className="text-secondary font-bold" onClick={submitExam}>
            All questions answered — Submit now?
          </Button>
        </div>
      )}
    </div>
  );
};

export default MockTestTakingPage;
