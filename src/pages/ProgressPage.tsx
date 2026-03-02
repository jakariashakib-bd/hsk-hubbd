import Breadcrumb from "@/components/Breadcrumb";
import { Zap, Flame, Globe, Clock, Lock, Star, Trophy } from "lucide-react";

const trophies = [
  { title: "First Steps", desc: "Complete your first lesson", progress: 0 },
  { title: "Week Warrior", desc: "Reach a 7-day study streak", progress: 0 },
  { title: "Vocabulary Master", desc: "Learn 100 words", progress: 0 },
  { title: "Perfect Score", desc: "Get 100% on a mock test", progress: 0 },
  { title: "HSK 3 Expert", desc: "Complete HSK 3", progress: 0 },
  { title: "Scholar", desc: "Review 500 Flashcards", progress: 0 },
];

const weekDays = ["TUE", "WED", "THU", "FRI", "SAT", "SUN", "MON"];
const todayIdx = 2; // THU

const quests = [
  { title: "Complete 3 Lessons", xp: 50, progress: 2, total: 3 },
  { title: "Review 20 Flashcards", xp: 30, progress: 0, total: 20 },
];

const ProgressPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Achievements" }]} />

      {/* Profile Card */}
      <div className="brutalist-card rounded-2xl bg-card p-8 mb-8">
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full border-4 border-primary/30 flex items-center justify-center bg-card">
              <span className="text-4xl">🎓</span>
            </div>
            <span className="mt-2 retro-tag text-primary border-primary text-xs">Lvl. 1</span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              HSK Apprentice <span className="text-2xl">👑</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Your journey to mastery is just beginning. Keep pushing your limits.
            </p>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-primary font-medium">Current XP</span>
                <span className="text-muted-foreground font-mono">0 / 1000 XP</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full brutalist-border">
                <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { icon: Zap, value: "0", label: "Total XP", color: "text-gold" },
                { icon: Flame, value: "0", label: "Day Streak", color: "text-primary" },
                { icon: Globe, value: "0", label: "Words Mastered", color: "text-secondary" },
                { icon: Clock, value: "0.0", label: "Study Hours", color: "text-accent" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon size={20} className={s.color} />
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground font-mono uppercase">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trophy Case */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy size={20} className="text-gold" /> Trophy Case
            </h2>
            <span className="text-sm text-muted-foreground font-mono">0 / {trophies.length} Unlocked</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trophies.map((t) => (
              <div key={t.title} className="brutalist-card rounded-xl bg-card p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Lock size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground font-mono">Progress</span>
                    <span className="text-xs text-muted-foreground font-mono">{t.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-muted rounded-full mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quest Log */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            📈 Quest Log
          </h2>

          {/* Weekly Activity */}
          <div className="brutalist-card rounded-xl bg-card p-4 mb-4">
            <p className="font-bold text-sm mb-3">Weekly Activity</p>
            <div className="flex items-end gap-2 justify-between h-24">
              {weekDays.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-full rounded-md ${i === todayIdx ? "bg-secondary" : "bg-muted"}`}
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  />
                  <span className={`text-xs font-mono ${i === todayIdx ? "text-secondary font-bold" : "text-muted-foreground"}`}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Quests */}
          <div className="brutalist-card rounded-xl bg-card p-4">
            <p className="font-bold text-sm mb-3">Active Quests</p>
            <div className="space-y-3">
              {quests.map((q) => (
                <div key={q.title} className="flex items-center gap-3">
                  <Star size={18} className="text-gold flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full">
                        <div
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${(q.progress / q.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {q.progress}/{q.total}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gold">+{q.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
