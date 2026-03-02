import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Headphones, Play, BarChart3, Clock, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";

const dialogues = [
  { id: 1, title: "Hello", desc: "Basic greeting.", difficulty: "EASY", duration: "1:00", questions: 3 },
  { id: 2, title: "Polite Greeting", desc: "Greeting with respect.", difficulty: "EASY", duration: "1:00", questions: 3 },
  { id: 3, title: "Apologies", desc: "A student accidentally bumps into another person.", difficulty: "EASY", duration: "1:00", questions: 3 },
  { id: 4, title: "Introduction", desc: "Introducing yourself to classmates.", difficulty: "EASY", duration: "1:00", questions: 3 },
  { id: 5, title: "Numbers", desc: "Learning to count in Chinese.", difficulty: "EASY", duration: "1:30", questions: 4 },
  { id: 6, title: "Family", desc: "Talking about family members.", difficulty: "EASY", duration: "1:30", questions: 4 },
];

const ListeningPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Practice", to: "/practice" }, { label: "HSK1" }, { label: "Listening" }]} />

      <Link to="/" className="inline-flex items-center gap-2 mb-6 text-sm font-mono brutalist-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors">
        <ArrowLeft size={16} />
        SYS.RETURN
      </Link>

      <div className="w-full h-2 bg-foreground rounded-full mb-10 brutalist-border" />

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary brutalist-card rounded-2xl mb-4">
          <Headphones size={36} className="text-secondary-foreground" />
        </div>
        <h1 className="text-4xl font-bold font-mono">
          LISTENING <span className="text-accent">PRACTICE</span>
        </h1>
        <div className="brutalist-card rounded-lg bg-foreground text-primary-foreground p-4 mt-4 max-w-lg mx-auto">
          <p className="font-mono text-sm leading-relaxed">
            IMMERSE YOURSELF IN NATIVE CONVERSATIONS. LISTEN CAREFULLY AND ANSWER THE QUESTIONS TO TEST YOUR COMPREHENSION.
          </p>
        </div>
      </div>

      {/* Start Random */}
      <div className="flex justify-center mb-10">
        <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 font-mono font-bold text-sm rounded-lg brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase">
          <Shuffle size={18} />
          Start Random Practice
        </button>
      </div>

      {/* Dialogue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dialogues.map((d) => (
          <div key={d.id} className="brutalist-card rounded-xl bg-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="retro-tag text-secondary border-secondary text-xs">{d.difficulty}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <Clock size={12} /> {d.duration}
              </span>
            </div>
            <h3 className="font-bold font-mono text-sm uppercase">
              {String(d.id).padStart(2, "0")}. {d.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex-1">{d.desc}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-border">
              <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                <BarChart3 size={12} /> {d.questions} Questions
              </span>
              <button className="w-8 h-8 rounded bg-secondary flex items-center justify-center brutalist-border hover:opacity-80 transition-opacity">
                <Play size={14} className="text-secondary-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningPage;
