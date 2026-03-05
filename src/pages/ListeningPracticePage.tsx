import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Headphones, Play, BarChart3, Clock, Shuffle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useHskListening } from "@/hooks/useHskPracticeData";
import ListeningPlayer from "@/components/ListeningPlayer";

const ListeningPracticePage = () => {
  const { level } = useParams();
  const lvl = level || "hsk1";
  const levelNum = parseInt(lvl.replace("hsk", ""));
  const { data: dialogues, isLoading } = useHskListening(levelNum);
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);

  // Player mode
  if (activeDialogue && dialogues) {
    const d = dialogues.find((x) => x.lessonId === activeDialogue);
    if (d) {
      return (
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Dashboard", to: "/" },
              { label: "Practice", to: "/practice" },
              { label: lvl.toUpperCase(), to: `/course/${lvl}` },
              { label: "Listening" },
              { label: d.lessonTitle },
            ]}
          />
          <ListeningPlayer
            title={d.lessonTitle}
            lines={d.lines}
            onBack={() => setActiveDialogue(null)}
          />
        </div>
      );
    }
  }

  const handleRandom = () => {
    if (dialogues && dialogues.length > 0) {
      const rand = dialogues[Math.floor(Math.random() * dialogues.length)];
      setActiveDialogue(rand.lessonId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Practice", to: "/practice" },
          { label: lvl.toUpperCase(), to: `/course/${lvl}` },
          { label: "Listening" },
        ]}
      />

      <Link
        to="/practice"
        className="inline-flex items-center gap-2 mb-6 text-sm font-mono brutalist-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors"
      >
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
        <button
          onClick={handleRandom}
          disabled={!dialogues?.length}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 font-mono font-bold text-sm rounded-lg brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase disabled:opacity-50"
        >
          <Shuffle size={18} />
          Start Random Practice
        </button>
      </div>

      {/* Dialogue Cards */}
      {isLoading ? (
        <div className="text-center py-12 font-mono text-muted-foreground">Loading listening exercises...</div>
      ) : !dialogues || dialogues.length === 0 ? (
        <div className="brutalist-card rounded-xl bg-card p-8 text-center">
          <p className="font-mono text-muted-foreground">No listening exercises available for this level yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dialogues.map((d, idx) => (
            <div
              key={d.lessonId}
              className="brutalist-card rounded-xl bg-card p-5 flex flex-col cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setActiveDialogue(d.lessonId)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="retro-tag text-secondary border-secondary text-xs">EASY</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Clock size={12} /> {d.lines.length > 6 ? "2:00" : "1:00"}
                </span>
              </div>
              <h3 className="font-bold font-mono text-sm uppercase">
                {String(idx + 1).padStart(2, "0")}. {d.lessonTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 flex-1">
                {d.lines.length} dialogue lines
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-border">
                <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                  <BarChart3 size={12} /> {d.lines.length} Lines
                </span>
                <button className="w-8 h-8 rounded bg-secondary flex items-center justify-center brutalist-border hover:opacity-80 transition-opacity">
                  <Play size={14} className="text-secondary-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningPracticePage;
