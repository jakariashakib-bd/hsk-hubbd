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

const hsk3Bands = [
  { band: 1, label: "Foundation", vocab: 300, color: "from-blue-500 to-blue-600", barColor: "bg-pink-400" },
  { band: 2, label: "Foundation", vocab: 300, color: "from-blue-600 to-blue-700", barColor: "bg-rose-500" },
  { band: 3, label: "Foundation", vocab: 300, color: "from-indigo-500 to-indigo-600", barColor: "bg-orange-500" },
  { band: 4, label: "Intermediate", vocab: 600, color: "from-violet-500 to-violet-600", barColor: "bg-orange-400" },
  { band: 5, label: "Intermediate", vocab: 1200, color: "from-purple-500 to-purple-600", barColor: "bg-amber-500" },
  { band: 6, label: "Intermediate", vocab: 2500, color: "from-fuchsia-500 to-fuchsia-600", barColor: "bg-yellow-500" },
  { band: 7, label: "Advanced", vocab: 5000, color: "from-emerald-500 to-emerald-600", barColor: "bg-gray-600" },
  { band: 8, label: "Advanced", vocab: 8000, color: "from-teal-500 to-teal-600", barColor: "bg-gray-700" },
  { band: 9, label: "Advanced", vocab: 11000, color: "from-cyan-500 to-cyan-600", barColor: "bg-gray-800" },
];

const CoursePage = () => {
  const { data: levelCounts, isLoading } = useHskLevelCounts();
  const { canAccessLevel } = useUserPlan();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTab, setActiveTab] = useState<"2.0" | "3.0">("2.0");

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Study" }]} />

      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-wider flex items-center gap-1">
            📚 Course Library
          </p>
          <h1 className="text-4xl font-bold mt-1">
            {activeTab === "2.0" ? "Select Your Level" : "HSK 3.0 Standards"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeTab === "2.0"
              ? "Choose your proficiency level to begin your tailored learning journey."
              : "The new 9-band proficiency system. Select a band to begin."}
          </p>
        </div>
        <div className="flex gap-0 brutalist-border rounded-full overflow-hidden">
          <button
            onClick={() => setActiveTab("2.0")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "2.0" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"}`}
          >
            HSK 2.0
          </button>
          <button
            onClick={() => setActiveTab("3.0")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "3.0" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"}`}
          >
            HSK 3.0
          </button>
        </div>
      </div>

      {activeTab === "3.0" && (
        <div className="mt-4 mb-8">
          <div className="bg-amber-400 dark:bg-amber-500 brutalist-border rounded-xl p-4 flex items-start gap-3">
            <div className="bg-foreground text-background p-2 rounded-lg flex-shrink-0">
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-foreground uppercase tracking-wider">
                ● System Notice — Official Exam Schedule Update
              </p>
              <p className="text-sm text-foreground/80 mt-1">
                HSK 3.0 exams will not officially begin until <span className="underline font-semibold">after June</span>. We recommend prioritizing HSK 2.0 for current certification goals.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "2.0" ? (
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mt-8">
          {hsk3Bands.map((b) => (
            <div
              key={b.band}
              className="bg-card brutalist-border rounded-2xl p-4 flex flex-col items-center min-h-[200px] hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer group"
            >
              <div className="flex-1 flex items-center justify-center w-full">
                <div className={`w-2 h-20 ${b.barColor} rounded-full group-hover:h-24 transition-all`} />
              </div>
              <div className="mt-auto text-center">
                <p className="text-3xl font-bold text-foreground/30 group-hover:text-foreground/60 transition-colors">
                  {String(b.band).padStart(2, "0")}
                </p>
                <p className="text-[10px] font-mono uppercase text-muted-foreground mt-1 tracking-wider">
                  {b.label}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground/60">
                  {b.vocab} words
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

export default CoursePage;
