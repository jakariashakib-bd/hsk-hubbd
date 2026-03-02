import { Link } from "react-router-dom";
import { Flame, Star, BookOpen, Headphones, Edit3, Play, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const courseCards = [
  { level: 1, label: "Beginner", words: 150, color: "bg-card-mint" },
  { level: 2, label: "Basic", words: 300, color: "bg-card-salmon" },
  { level: 3, label: "Intermediate", words: 600, color: "bg-card-gold" },
  { level: 4, label: "Advanced", words: 1200, color: "bg-card-coral" },
  { level: 5, label: "Fluent", words: 2500, color: "bg-card-teal" },
  { level: 6, label: "Native", words: 5000, color: "bg-card-purple" },
];

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      {/* Hero Greeting */}
      <div className="mb-8">
        <p className="text-primary font-mono text-sm">🐎 Spirit of the Horse</p>
        <h1 className="text-4xl font-bold mt-1">你好, Scholar!</h1>
        <p className="text-muted-foreground mt-1">{today}</p>
        <div className="flex gap-3 mt-4">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Start Learning <ArrowRight size={16} />
          </Link>
          <Link
            to="/progress"
            className="inline-flex items-center gap-2 bg-card text-foreground px-5 py-2.5 rounded-lg font-medium text-sm brutalist-border hover:bg-muted transition-colors"
          >
            View Stats
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 mb-8">
        <div className="brutalist-card rounded-xl p-4 bg-card flex items-center gap-3 min-w-[140px]">
          <Flame className="text-primary" size={24} />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase">Streak</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="brutalist-card rounded-xl p-4 bg-card flex items-center gap-3 min-w-[140px]">
          <Star className="text-gold" size={24} />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase">XP</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Today's Challenges */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Today's Challenges</h2>
        <p className="text-sm text-muted-foreground mb-3 font-mono">0/3 Completed</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/practice" className="brutalist-card rounded-xl p-5 bg-card hover:bg-muted transition-colors group">
            <Edit3 size={24} className="text-secondary mb-2" />
            <p className="font-bold text-sm">Review 15 Vocabulary</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">0 / 15 completed</p>
          </Link>
          <Link to="/course" className="brutalist-card rounded-xl p-5 bg-card hover:bg-muted transition-colors group">
            <BookOpen size={24} className="text-primary mb-2" />
            <p className="font-bold text-sm">Complete Lesson 1</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">0 / 1 completed</p>
          </Link>
          <Link to="/listening" className="brutalist-card rounded-xl p-5 bg-card hover:bg-muted transition-colors group">
            <Headphones size={24} className="text-accent mb-2" />
            <p className="font-bold text-sm">Listen to 1 Dialogue</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">0 / 1 completed</p>
          </Link>
        </div>
      </section>

      {/* Course Library */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} /> Course Library
          </h2>
          <Link to="/course" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {courseCards.map((c) => (
            <Link
              key={c.level}
              to="/course"
              className={`${c.color} rounded-xl p-4 brutalist-border hover:translate-x-[2px] hover:translate-y-[2px] transition-transform min-h-[140px] flex flex-col justify-between`}
            >
              <div>
                <p className="text-2xl font-bold text-foreground/90">HSK {c.level}</p>
                <p className="text-xs font-mono uppercase text-foreground/60 mt-1">{c.label}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-mono text-foreground/50">{c.words} Words</span>
                <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold text-foreground/60">
                  {c.level}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/course" className="brutalist-card rounded-xl p-5 bg-card hover:bg-muted transition-colors flex items-center gap-4">
            <Play size={20} className="text-secondary" />
            <div>
              <p className="font-bold text-sm">Resume Learning</p>
              <p className="text-xs text-muted-foreground font-mono">Lesson 1</p>
            </div>
          </Link>
          <Link to="/practice" className="brutalist-card rounded-xl p-5 bg-card hover:bg-muted transition-colors flex items-center gap-4">
            <Edit3 size={20} className="text-primary" />
            <div>
              <p className="font-bold text-sm">Study</p>
              <p className="text-xs text-muted-foreground font-mono">Flashcards</p>
            </div>
          </Link>
          <Link to="/listening" className="brutalist-card rounded-xl p-5 bg-card hover:bg-muted transition-colors flex items-center gap-4">
            <Headphones size={20} className="text-accent" />
            <div>
              <p className="font-bold text-sm">Listening</p>
              <p className="text-xs text-muted-foreground font-mono">Practice Drills</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Daily Wisdom */}
      <section className="brutalist-card rounded-xl p-6 bg-card">
        <p className="text-xs font-mono text-muted-foreground uppercase mb-2">📜 Daily Wisdom</p>
        <p className="text-2xl font-bold">"千里之行，始于足下"</p>
        <p className="text-muted-foreground text-sm mt-1 italic">
          (A journey of a thousand miles begins with a single step)
        </p>
        <p className="text-secondary font-mono text-sm mt-2">学习</p>
      </section>
    </div>
  );
};

export default Dashboard;
