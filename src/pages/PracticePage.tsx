import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const batchOptions = [
  { count: "10", label: "Quick Review" },
  { count: "20", label: "Recommended" },
  { count: "50", label: "Deep Dive" },
  { count: "ALL", label: "Full Course" },
];

const PracticePage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Practice", to: "/practice" }, { label: "HSK1" }, { label: "Flashcards" }]} />

      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 mb-6 text-sm font-mono brutalist-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors">
        <ArrowLeft size={16} />
        EXIT // BACK TO CENTER
      </Link>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-foreground rounded-full mb-12 brutalist-border" />

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left: Spaced Repetition Card */}
        <div className="brutalist-card rounded-xl bg-card p-8 max-w-md w-full">
          <h1 className="text-5xl font-bold italic bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent leading-tight">
            SPACED
          </h1>
          <h1 className="text-5xl font-bold italic bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent leading-tight -mt-1">
            REPETITION
          </h1>

          <div className="mt-4 inline-block retro-tag text-secondary border-secondary">
            LEVEL: HSK1 // STATUS: READY
          </div>

          <div className="grid grid-cols-2 gap-0 mt-6 brutalist-border rounded-lg overflow-hidden">
            <div className="p-4 bg-card border-r-2 border-foreground">
              <p className="text-3xl font-bold font-mono">160</p>
              <p className="text-xs font-mono text-primary uppercase mt-1">Total Words</p>
            </div>
            <div className="p-4 bg-card">
              <p className="text-3xl font-bold font-mono">0%</p>
              <p className="text-xs font-mono text-primary uppercase mt-1">Mastery</p>
            </div>
          </div>
        </div>

        {/* Right: Start Session */}
        <div className="bg-secondary brutalist-card rounded-xl p-6 max-w-sm w-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
            <h2 className="font-mono font-bold text-lg text-secondary-foreground">START SESSION _</h2>
          </div>

          <p className="font-mono text-xs uppercase bg-foreground/10 text-secondary-foreground inline-block px-2 py-1 rounded mb-4">
            Select Batch Size
          </p>

          <div className="grid grid-cols-2 gap-3">
            {batchOptions.map((opt) => (
              <button
                key={opt.count}
                className="brutalist-card bg-card rounded-lg p-4 text-left hover:bg-muted transition-colors"
              >
                <p className="text-2xl font-bold font-mono text-foreground">{opt.count}</p>
                <p className="text-xs font-mono text-muted-foreground uppercase mt-1">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
