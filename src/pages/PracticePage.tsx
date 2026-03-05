import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Code2, Headphones, BookOpen, Pen, Lock } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUserPlan } from "@/hooks/useUserPlan";
import UpgradeModal from "@/components/UpgradeModal";

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
  const { canAccessLevel } = useUserPlan();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const isLevelLocked = !canAccessLevel(activeLevel);

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
          {levels.map((lv) => {
            const locked = !canAccessLevel(lv);
            return (
              <button
                key={lv}
                onClick={() => {
                  if (locked) {
                    setShowUpgrade(true);
                  } else {
                    setActiveLevel(lv);
                  }
                }}
                className={`px-4 py-2 text-xs font-mono font-bold transition-colors ${
                  activeLevel === lv
                    ? "bg-primary text-primary-foreground"
                    : locked
                      ? "bg-card text-muted-foreground opacity-50"
                      : "bg-card text-foreground hover:bg-muted"
                }`}
              >
                {locked && <Lock size={10} className="inline mr-1" />}
                HSK {lv}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locked message */}
      {isLevelLocked && (
        <div className="brutalist-card rounded-xl bg-primary/5 p-8 text-center">
          <Lock size={32} className="mx-auto text-primary mb-3" />
          <h3 className="text-lg font-bold mb-1">Premium Content</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to Pro to access HSK {activeLevel} practice tools.
          </p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm brutalist-border"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Floppy Disk Cards */}
      {!isLevelLocked && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {practiceCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={`/course/hsk${activeLevel}/${card.path}`}
                className="brutalist-card rounded-xl bg-card overflow-hidden hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
              >
                <div className="bg-muted px-4 py-2 flex items-center justify-between border-b-2 border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-foreground/30" />
                  </div>
                  <div className="w-8 h-5 bg-foreground/20 rounded-sm brutalist-border" />
                </div>
                <div className="px-3 py-1 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>VOL-{String(practiceCards.indexOf(card) + 1).padStart(2, "0")}</span>
                  <span>1.44 MB</span>
                </div>
                <div className="bg-card-gold/30 p-6 flex flex-col items-center justify-center min-h-[120px]">
                  <Icon size={36} className="text-foreground/50 mb-2 group-hover:text-foreground/70 transition-colors" />
                  <p className="font-bold font-mono text-sm text-foreground/80">{card.label}</p>
                </div>
                <div className="px-3 py-2 flex items-center justify-between border-t-2 border-border">
                  <span className="text-xs font-mono bg-foreground/5 px-2 py-0.5 rounded text-foreground/60">{card.file}</span>
                  <div className="w-3 h-3 bg-foreground/20 rounded-sm" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

export default PracticePage;
