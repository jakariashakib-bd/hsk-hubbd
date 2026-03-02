import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Code2, Headphones, BookOpen, Pen } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const levels = [1, 2, 3, 4, 5, 6];

const practiceCards = [
  { id: "flashcards", label: "FLASHCARDS", file: "VOCAB.EXE", icon: Brain, path: "vocabulary" },
  { id: "grammar", label: "GRAMMAR", file: "RULES.SYS", icon: Code2, path: "grammar" },
  { id: "listening", label: "LISTENING", file: "AUDIO.WAV", icon: Headphones, path: "listening" },
  { id: "reading", label: "READING", file: "TEXT.DOC", icon: BookOpen, path: "reading" },
  { id: "writing", label: "WRITING", file: "DRAW.BMP", icon: Pen, path: "writing" },
];

const PracticePage = () => {
  const [activeLevel, setActiveLevel] = useState(1);

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Practice" }]} />

      {/* Header with Level Selector */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="retro-tag text-secondary border-secondary inline-block mb-2">
            SYSTEM.BOOT // COLLECTION
          </span>
          <h1 className="text-5xl font-bold italic">
            START <span className="text-primary">PRACTICE</span>
          </h1>
        </div>

        {/* HSK Level Tabs */}
        <div className="flex gap-0 brutalist-border rounded-lg overflow-hidden">
          {levels.map((lv) => (
            <button
              key={lv}
              onClick={() => setActiveLevel(lv)}
              className={`px-4 py-2 text-xs font-mono font-bold transition-colors ${
                activeLevel === lv
                  ? "bg-primary text-primary-foreground"
                  : lv === 6
                    ? "bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                    : "bg-card text-foreground hover:bg-muted"
              }`}
              disabled={lv === 6}
            >
              HSK {lv}
            </button>
          ))}
        </div>
      </div>

      {/* Floppy Disk Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {practiceCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              to={`/course/hsk${activeLevel}/${card.path}`}
              className="brutalist-card rounded-xl bg-card overflow-hidden hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
            >
              {/* Floppy disk top */}
              <div className="bg-muted px-4 py-2 flex items-center justify-between border-b-2 border-border">
                <div className="flex items-center gap-2">
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-foreground/30" />
                </div>
                <div className="w-8 h-5 bg-foreground/20 rounded-sm brutalist-border" />
              </div>

              {/* Label */}
              <div className="px-3 py-1 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>VOL-{String(practiceCards.indexOf(card) + 1).padStart(2, "0")}</span>
                <span>1.44 MB</span>
              </div>

              {/* Main content */}
              <div className="bg-card-gold/30 p-6 flex flex-col items-center justify-center min-h-[120px]">
                <Icon size={36} className="text-foreground/50 mb-2 group-hover:text-foreground/70 transition-colors" />
                <p className="font-bold font-mono text-sm text-foreground/80">{card.label}</p>
              </div>

              {/* Bottom file label */}
              <div className="px-3 py-2 flex items-center justify-between border-t-2 border-border">
                <span className="text-xs font-mono bg-foreground/5 px-2 py-0.5 rounded text-foreground/60">{card.file}</span>
                <div className="w-3 h-3 bg-foreground/20 rounded-sm" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PracticePage;
