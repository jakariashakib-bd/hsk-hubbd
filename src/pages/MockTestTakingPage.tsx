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
  Trophy, RotateCcw, Home, Volume2, BookOpen, Target, AlertTriangle, PenTool,
} from "lucide-react";

/* ─── Types ─── */
interface Question {
  id: string;
  type: "listening" | "reading" | "writing";
  section: string;
  question: string;
  options: string[];
  correctAnswer: string;
  chinese?: string;
  pinyin?: string;
  passage?: string;
  explanation?: string;
}

interface ExamConfig {
  level: number;
  label: string;
  timeMinutes: number;
  sections: { type: "listening" | "reading" | "writing"; icon: any; label: string }[];
}

const EXAM_CONFIGS: Record<number, ExamConfig> = {
  1: { level: 1, label: "HSK 1", timeMinutes: 40, sections: [{ type: "listening", icon: Volume2, label: "Listening" }, { type: "reading", icon: BookOpen, label: "Reading" }] },
  2: { level: 2, label: "HSK 2", timeMinutes: 55, sections: [{ type: "listening", icon: Volume2, label: "Listening" }, { type: "reading", icon: BookOpen, label: "Reading" }] },
  3: { level: 3, label: "HSK 3", timeMinutes: 90, sections: [{ type: "listening", icon: Volume2, label: "Listening" }, { type: "reading", icon: BookOpen, label: "Reading" }, { type: "writing", icon: PenTool, label: "Writing" }] },
  4: { level: 4, label: "HSK 4", timeMinutes: 105, sections: [{ type: "listening", icon: Volume2, label: "Listening" }, { type: "reading", icon: BookOpen, label: "Reading" }, { type: "writing", icon: PenTool, label: "Writing" }] },
  5: { level: 5, label: "HSK 5", timeMinutes: 120, sections: [{ type: "listening", icon: Volume2, label: "Listening" }, { type: "reading", icon: BookOpen, label: "Reading" }, { type: "writing", icon: PenTool, label: "Writing" }] },
  6: { level: 6, label: "HSK 6", timeMinutes: 140, sections: [{ type: "listening", icon: Volume2, label: "Listening" }, { type: "reading", icon: BookOpen, label: "Reading" }, { type: "writing", icon: PenTool, label: "Writing" }] },
};

/* ─── Helpers ─── */
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

  /* Fetch questions from DB */
  const { data: dbQuestions, isLoading } = useQuery({
    queryKey: ["mock-test-questions", lvl],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mock_test_questions")
        .select("*")
        .eq("level", lvl)
        .eq("test_number", 1)
        .order("sort_order");
      if (error) throw error;
      return data || [];
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
    if (!dbQuestions?.length) return;
    const qs: Question[] = dbQuestions.map((q) => ({
      id: q.id,
      type: q.section as "listening" | "reading" | "writing",
      section: q.part,
      question: q.question,
      options: (q.options as string[]) || [],
      correctAnswer: q.correct_answer,
      chinese: q.chinese_text || undefined,
      pinyin: q.pinyin_text || undefined,
      passage: q.passage || undefined,
      explanation: q.explanation || undefined,
    }));
    setQuestions(qs);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(config.timeMinutes * 60);
    setSubmitted(false);
    setPhase("test");
  }, [dbQuestions, config]);

  const selectAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [current]: val }));
  };

  const submitExam = () => {
    setSubmitted(true);
    setPhase("result");
  };

  const retryExam = () => setPhase("intro");

  /* Results */
  const results = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    const sectionScores: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const sec = q.type;
      if (!sectionScores[sec]) sectionScores[sec] = { correct: 0, total: 0 };
      sectionScores[sec].total++;
      if (answers[i] === q.correctAnswer) {
        correct++;
        sectionScores[sec].correct++;
      }
    });
    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage, passed: percentage >= 60, sectionScores };
  }, [submitted, questions, answers]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const isUrgent = timeLeft < 120;
  const q = questions[current];

  /* ─── INTRO ─── */
  if (phase === "intro") {
    const totalQ = dbQuestions?.length || 0;
    const sectionCounts: Record<string, number> = {};
    dbQuestions?.forEach((q) => {
      sectionCounts[q.section] = (sectionCounts[q.section] || 0) + 1;
    });

    return (
      <div className="max-w-3xl mx-auto">
        <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Mock Exams", to: "/mock-test" }, { label: config.label }]} />
        <div className="brutalist-card rounded-2xl bg-card p-8 mt-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-primary/10 brutalist-border rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl font-bold font-mono text-primary">{lvl}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{config.label} Mock Exam</h1>
            <p className="text-muted-foreground">Simulated exam based on official HSK format</p>
          </div>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {config.sections.map((sec) => (
              <div key={sec.type} className="bg-background brutalist-border rounded-xl p-4">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <sec.icon size={16} className="text-primary" /> {sec.label}
                </h3>
                <p className="text-2xl font-bold font-mono">{sectionCounts[sec.type] || 0}Q</p>
              </div>
            ))}
          </div>

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

          <Button onClick={startExam} disabled={isLoading || !totalQ} className="w-full h-14 text-lg font-bold brutalist-border rounded-xl">
            {isLoading ? "Loading questions..." : totalQ === 0 ? "No questions available yet" : "🚀 Start Exam"}
          </Button>
        </div>
      </div>
    );
  }

  /* ─── RESULT ─── */
  if (phase === "result" && results) {
    return (
      <div className="max-w-3xl mx-auto">
        <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Mock Exams", to: "/mock-test" }, { label: `${config.label} — Results` }]} />
        <div className="brutalist-card rounded-2xl bg-card p-8 mt-6 text-center">
          <div className={`w-24 h-24 mx-auto rounded-full brutalist-border flex items-center justify-center mb-4 ${results.passed ? "bg-secondary/20" : "bg-destructive/20"}`}>
            {results.passed ? <Trophy size={40} className="text-secondary" /> : <XCircle size={40} className="text-destructive" />}
          </div>
          <h1 className="text-4xl font-bold mb-1">{results.passed ? "🎉 Congratulations!" : "Keep Practicing!"}</h1>
          <p className="text-muted-foreground mb-6">{results.passed ? "You passed the mock exam!" : "You didn't reach the 60% pass mark this time."}</p>

          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={results.passed ? "hsl(var(--secondary))" : "hsl(var(--destructive))"} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - results.percentage / 100)}`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono">{results.percentage}%</span>
              <span className="text-xs text-muted-foreground font-mono">{results.correct}/{results.total}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            {Object.entries(results.sectionScores).map(([sec, scores]) => (
              <div key={sec} className="bg-background brutalist-border rounded-xl p-4">
                <p className="text-xl font-bold font-mono">{scores.correct}/{scores.total}</p>
                <p className="text-xs text-muted-foreground font-mono uppercase">{sec}</p>
              </div>
            ))}
          </div>

          <div className="text-left mb-8">
            <h3 className="font-bold mb-3">Review Incorrect Answers</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
              {questions.map((q, i) => {
                if (answers[i] === q.correctAnswer) return null;
                return (
                  <div key={i} className="bg-destructive/5 brutalist-border rounded-lg p-3 text-sm">
                    <p className="font-medium mb-1"><span className="font-mono text-muted-foreground mr-2">Q{i + 1}</span>{q.question}</p>
                    <div className="flex gap-4 text-xs mt-1">
                      <span className="text-destructive">Your: {answers[i] || "—"}</span>
                      <span className="text-secondary">Correct: {q.correctAnswer}</span>
                    </div>
                    {q.explanation && <p className="text-xs text-muted-foreground mt-1">💡 {q.explanation}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 brutalist-border" onClick={retryExam}><RotateCcw size={16} className="mr-2" /> Retry</Button>
            <Button className="flex-1 brutalist-border" onClick={() => navigate("/mock-test")}><Home size={16} className="mr-2" /> All Exams</Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── TEST ─── */
  if (!q) return null;
  const sectionLabel = q.type === "listening" ? "Listening" : q.type === "reading" ? "Reading" : "Writing";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="retro-tag text-primary border-primary">{config.label}</span>
          <span className="retro-tag border-muted-foreground text-muted-foreground">{sectionLabel} • {q.section}</span>
        </div>
        <div className={`flex items-center gap-2 font-mono font-bold text-lg ${isUrgent ? "text-destructive animate-pulse" : "text-foreground"}`}>
          <Clock size={18} />{formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-2">
        <Progress value={progressPct} className="h-2 brutalist-border rounded-full" />
        <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
          <span>{answeredCount} answered</span>
          <span>{totalQuestions - answeredCount} remaining</span>
        </div>
      </div>

      <div className="brutalist-card rounded-2xl bg-card p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-muted-foreground">Question {current + 1} of {totalQuestions}</span>
          {q.type === "listening" && q.chinese && (
            <button onClick={() => speak(q.chinese!)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Volume2 size={16} /> Play Audio
            </button>
          )}
        </div>

        {/* Passage */}
        {q.passage && (
          <div className="bg-background brutalist-border rounded-xl p-4 mb-4">
            <p className="text-sm whitespace-pre-line leading-relaxed">{q.passage}</p>
          </div>
        )}

        {/* Chinese display */}
        {q.chinese && !q.passage && (
          <div className="bg-background brutalist-border rounded-xl p-4 text-center mb-4">
            <p className="text-3xl font-bold mb-1">{q.chinese}</p>
            {q.pinyin && <p className="text-sm text-muted-foreground font-mono">{q.pinyin}</p>}
          </div>
        )}

        <h2 className="text-lg font-bold mb-5">{q.question}</h2>

        <RadioGroup value={answers[current] || ""} onValueChange={selectAnswer} className="space-y-3">
          {q.options.map((opt, oi) => {
            const letter = String.fromCharCode(65 + oi);
            const isSelected = answers[current] === opt;
            return (
              <Label key={oi} htmlFor={`opt-${oi}`} className={`flex items-center gap-3 p-4 rounded-xl brutalist-border cursor-pointer transition-all ${isSelected ? "bg-primary/10 border-primary" : "bg-background hover:bg-muted"}`}>
                <RadioGroupItem value={opt} id={`opt-${oi}`} />
                <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center font-mono font-bold text-sm shrink-0">{letter}</span>
                <span className="text-sm font-medium">{opt}</span>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Navigator */}
      <div className="mt-4 brutalist-card rounded-xl bg-card p-4">
        <p className="text-xs font-mono text-muted-foreground mb-2">QUESTION NAVIGATOR</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => {
            const answered = answers[i] !== undefined;
            const isCurrent = i === current;
            return (
              <button key={i} onClick={() => setCurrent(i)} className={`w-8 h-8 rounded-md text-xs font-mono font-bold transition-all brutalist-border ${isCurrent ? "bg-primary text-primary-foreground" : answered ? "bg-secondary/20 text-secondary" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 gap-3">
        <Button variant="outline" className="brutalist-border" disabled={current === 0} onClick={() => setCurrent((p) => p - 1)}>
          <ArrowLeft size={16} className="mr-1" /> Previous
        </Button>
        {current < totalQuestions - 1 ? (
          <Button className="brutalist-border" onClick={() => setCurrent((p) => p + 1)}>Next <ArrowRight size={16} className="ml-1" /></Button>
        ) : (
          <Button className="brutalist-border bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={submitExam}>
            <CheckCircle2 size={16} className="mr-1" /> Submit Exam
          </Button>
        )}
      </div>

      {answeredCount === totalQuestions && current < totalQuestions - 1 && (
        <div className="mt-3 text-center">
          <Button variant="link" className="text-secondary font-bold" onClick={submitExam}>All questions answered — Submit now?</Button>
        </div>
      )}
    </div>
  );
};

export default MockTestTakingPage;
