import { Link } from "react-router-dom";
import { CheckCircle2, Clock, HelpCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const exams = [
  { level: 1, label: "Beginner", color: "bg-card-mint", icon: "🏯", time: "40 mins", questions: 40 },
  { level: 2, label: "Basic", color: "bg-card-salmon", icon: "📦", time: "55 mins", questions: 60 },
  { level: 3, label: "Intermediate", color: "bg-card-gold", icon: "📖", time: "90 mins", questions: 80 },
  { level: 4, label: "Advanced", color: "bg-card-coral", icon: "🔥", time: "105 mins", questions: 100 },
  { level: 5, label: "Fluent", color: "bg-card-teal", icon: "👑", time: "120 mins", questions: 45 },
];

const MockTestPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Mock Exams" }]} />

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto brutalist-card rounded-2xl bg-card flex items-center justify-center mb-4">
          <span className="text-3xl font-bold font-mono text-foreground/60">H</span>
        </div>
        <span className="retro-tag text-primary border-primary inline-block mb-3">📋 OFFICIAL FORMAT</span>
        <h1 className="text-5xl font-bold">
          MOCK<br />
          <span className="text-primary">EXAMS</span>
        </h1>
        <div className="brutalist-card rounded-lg bg-card p-4 mt-4 max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground">
            Simulate the real exam experience with timed conditions, official question types, and instant grading.
          </p>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 bg-card brutalist-border rounded-full px-4 py-2 text-sm font-medium">
            <CheckCircle2 size={14} className="text-secondary" /> Official Structure
          </span>
          <span className="inline-flex items-center gap-1.5 bg-card brutalist-border rounded-full px-4 py-2 text-sm font-medium">
            <Clock size={14} className="text-primary" /> Instant Results
          </span>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="bg-foreground text-primary-foreground py-2 brutalist-border overflow-hidden mb-10">
        <div className="animate-marquee whitespace-nowrap font-mono text-xs tracking-widest">
          *** EXAM PREPARATION *** MOCK TESTS LEVEL 1-5 *** HANYU SHUIPING KAOSHI *** EXAM PREPARATION *** MOCK TESTS LEVEL 1-5 *** HANYU SHUIPING KAOSHI *** EXAM PREPARATION *** MOCK TESTS LEVEL 1-5 ***
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.level}
            className={`${exam.color} brutalist-card rounded-2xl p-5 flex flex-col min-h-[300px]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground/80 font-mono">HSK{exam.level}</h2>
                <span className="retro-tag text-foreground/60 border-foreground/30 mt-1 inline-block">
                  {exam.label.toUpperCase()}
                </span>
              </div>
              <span className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center font-bold text-sm brutalist-border">
                {exam.level}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center my-4">
              <div className="w-16 h-16 bg-card brutalist-border rounded-xl flex items-center justify-center">
                <span className="text-3xl">{exam.icon}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-foreground/60 mb-3">
              <span className="flex items-center gap-1"><Clock size={12} /> {exam.time}</span>
              <span className="flex items-center gap-1"><HelpCircle size={12} /> {exam.questions} Q</span>
            </div>

            <Link
              to={`/mock-test/${exam.level}`}
              className="block text-center bg-card text-foreground font-bold text-sm py-2.5 rounded-lg brutalist-border hover:bg-muted transition-colors"
            >
              Start Exam
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTestPage;
