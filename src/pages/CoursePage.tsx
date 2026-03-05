import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useHskLevelCounts } from "@/hooks/useHskData";
import { useUserPlan } from "@/hooks/useUserPlan";
import UpgradeModal from "@/components/UpgradeModal";

const courses = [
  { level: 1, label: "Beginner", sublabel: "Beginner Level", defaultWords: 300, color: "bg-card-mint", icon: "🏯", active: true },
  { level: 2, label: "Basic", sublabel: "Elementary Level", defaultWords: 300, color: "bg-card-salmon", icon: "📦", active: true },
  { level: 3, label: "Intermediate", sublabel: "Intermediate Level", defaultWords: 600, color: "bg-card-gold", icon: "📖", active: true },
  { level: 4, label: "Advanced", sublabel: "Upper Intermediate", defaultWords: 1200, color: "bg-card-coral", icon: "🔥", active: true },
  { level: 5, label: "Fluent", sublabel: "Advanced Level", defaultWords: 2500, color: "bg-card-teal", icon: "✈️", active: true },
  { level: 6, label: "Native", sublabel: "Native Level", defaultWords: 5000, color: "bg-card-salmon", icon: "🔒", active: true },
];

const CoursePage = () => {
  const { data: levelCounts, isLoading } = useHskLevelCounts();
  const { canAccessLevel } = useUserPlan();
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Study" }]} />

      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-wider flex items-center gap-1">
            📚 Course Library
          </p>
          <h1 className="text-4xl font-bold mt-1">Select Your Level</h1>
          <p className="text-muted-foreground mt-1">
            Choose your proficiency level to begin your tailored learning journey.
          </p>
        </div>
        <div className="flex gap-1 brutalist-border rounded-full overflow-hidden">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground">HSK 2.0</button>
          <button className="px-4 py-2 text-sm font-medium bg-card text-foreground hover:bg-muted transition-colors">HSK 3.0</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {courses.map((c) => {
          const lessonCount = levelCounts?.[c.level] || 0;
          const hasLessons = lessonCount > 0;
          const isActive = c.active && hasLessons;
          const isLocked = !canAccessLevel(c.level);

          const handleClick = (e: React.MouseEvent) => {
            if (isLocked) {
              e.preventDefault();
              setShowUpgrade(true);
            }
          };

          return (
            <Link
              key={c.level}
              to={isActive ? `/course/hsk${c.level}` : "#"}
              onClick={handleClick}
              className={`${c.color} rounded-2xl p-6 brutalist-border hover:translate-x-[3px] hover:translate-y-[3px] transition-transform flex flex-col min-h-[280px] relative ${!isActive || isLocked ? "opacity-60" : ""}`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-foreground/5 rounded-2xl flex flex-col items-center justify-center z-10">
                  <Lock size={32} className="text-foreground/40 mb-2" />
                  <span className="text-xs font-mono text-foreground/50 text-center px-4">
                    Upgrade to Pro to unlock
                  </span>
                </div>
              )}
              {isActive && !isLocked && (
                <span className="absolute top-4 right-4 text-xs font-mono bg-foreground/10 px-2 py-1 rounded-full text-foreground/60 brutalist-border">
                  {lessonCount} LESSONS
                </span>
              )}
              {isLoading && (
                <span className="absolute top-4 right-4">
                  <Loader2 size={16} className="animate-spin text-foreground/40" />
                </span>
              )}
              <div className="mb-4">
                <h2 className="text-5xl font-bold text-foreground/80">HSK</h2>
                <h2 className="text-6xl font-bold text-foreground/80 -mt-2">{c.level}</h2>
                <p className="text-xs font-mono uppercase text-foreground/50 mt-1 tracking-wider">{c.label}</p>
              </div>

              <div className="mt-auto">
                {isActive && !isLocked ? (
                  <div className="text-5xl mb-3 opacity-50">{c.icon}</div>
                ) : (
                  <div className="flex justify-center mb-3">
                    <Lock size={48} className="text-foreground/30" />
                  </div>
                )}
                <p className="text-sm text-foreground/70">{c.sublabel}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="retro-tag text-foreground/60">{c.defaultWords} Words</span>
                  <span className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-sm text-foreground/60 brutalist-border">
                    {c.level}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-foreground/10 rounded-full mt-3">
                  <div className="h-full bg-foreground/30 rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

export default CoursePage;
