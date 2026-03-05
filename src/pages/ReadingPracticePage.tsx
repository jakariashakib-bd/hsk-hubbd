import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, FileText, Shuffle, HelpCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useHskReading } from "@/hooks/useHskPracticeData";

const ReadingPracticePage = () => {
  const { level } = useParams();
  const lvl = level || "hsk1";
  const levelNum = parseInt(lvl.replace("hsk", ""));
  const { data: readings, isLoading } = useHskReading(levelNum);
  const [activeReading, setActiveReading] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Practice", to: "/practice" },
          { label: lvl.toUpperCase(), to: `/course/${lvl}` },
          { label: "Reading" },
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent brutalist-card rounded-2xl mb-4">
          <BookOpen size={36} className="text-accent-foreground" />
        </div>
        <h1 className="text-4xl font-bold font-mono">
          READING <span className="text-accent">LIBRARY</span>
        </h1>
        <div className="brutalist-card rounded-lg bg-foreground text-primary-foreground p-4 mt-4 max-w-lg mx-auto">
          <p className="font-mono text-sm leading-relaxed">
            EXPLORE DIVERSE STORIES AND TEXTS. BUILD READING SPEED AND COMPREHENSION WITH OUR CURATED LIBRARY.
          </p>
        </div>
      </div>

      {/* Start Random */}
      <div className="flex justify-center mb-10">
        <button className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 font-mono font-bold text-sm rounded-lg brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase">
          <Shuffle size={18} />
          Start Random Practice
        </button>
      </div>

      {/* Reading Cards */}
      {isLoading ? (
        <div className="text-center py-12 font-mono text-muted-foreground">Loading reading passages...</div>
      ) : !readings || readings.length === 0 ? (
        <div className="brutalist-card rounded-xl bg-card p-8 text-center">
          <p className="font-mono text-muted-foreground">No reading passages available for this level yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {readings.map((r, idx) => (
              <div
                key={r.lessonId}
                className="brutalist-card rounded-xl bg-card p-5 flex flex-col cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setActiveReading(activeReading === r.lessonId ? null : r.lessonId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="retro-tag text-secondary border-secondary text-xs">EASY</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <FileText size={12} /> {r.passages.length} Lines
                  </span>
                </div>
                <h3 className="font-bold font-mono text-sm uppercase">
                  VOL {String(idx + 1).padStart(2, "0")}. {r.lessonTitle}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex-1">
                  第{idx + 1}课 课文
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-border">
                  <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    <HelpCircle size={12} /> {r.passages.length} Questions
                  </span>
                  <button className="w-8 h-8 rounded bg-accent flex items-center justify-center brutalist-border hover:opacity-80 transition-opacity">
                    <ChevronRight size={14} className="text-accent-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Reading Detail */}
          {activeReading && (() => {
            const r = readings.find((x) => x.lessonId === activeReading);
            if (!r) return null;
            return (
              <div className="brutalist-card rounded-xl bg-card p-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={20} className="text-accent" />
                  <h3 className="font-bold font-mono uppercase">{r.lessonTitle}</h3>
                </div>
                <div className="space-y-4">
                  {r.passages.map((p, i) => (
                    <div key={i} className="bg-muted rounded-lg p-4 brutalist-border">
                      <p className="text-lg font-bold leading-relaxed">{p.chinese}</p>
                      <p className="text-sm text-accent font-mono mt-2">/{p.pinyin}/</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.english}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
};

export default ReadingPracticePage;
