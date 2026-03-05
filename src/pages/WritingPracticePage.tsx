import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pen, Undo2, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useHskWritingVocab } from "@/hooks/useHskPracticeData";

const WritingPracticePage = () => {
  const { level } = useParams();
  const lvl = level || "hsk1";
  const levelNum = parseInt(lvl.replace("hsk", ""));
  const { data: vocab, isLoading } = useHskWritingVocab(levelNum);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentWord = vocab?.[currentIndex];
  const total = vocab?.length || 0;

  // Draw on canvas
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    setStrokes((prev) => [...prev, [pos]]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    setStrokes((prev) => {
      const newStrokes = [...prev];
      newStrokes[newStrokes.length - 1] = [...newStrokes[newStrokes.length - 1], pos];
      return newStrokes;
    });
  };

  const endDraw = () => setIsDrawing(false);

  const undo = () => setStrokes((prev) => prev.slice(0, -1));
  const clear = () => setStrokes([]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    ctx.setLineDash([]);

    // Guide character
    if (showGuide && currentWord) {
      ctx.font = `${size * 0.7}px serif`;
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(currentWord.chinese, size / 2, size / 2);
    }

    // User strokes
    ctx.strokeStyle = "hsl(4, 72%, 63%)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }, [strokes, showGuide, currentWord]);

  const goNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      clear();
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      clear();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Practice", to: "/practice" },
          { label: lvl.toUpperCase(), to: `/course/${lvl}` },
          { label: "Writing" },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <Link
          to="/practice"
          className="inline-flex items-center gap-2 text-sm font-mono brutalist-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
          <Pen size={14} className="text-accent" />
          <span className="retro-tag text-accent border-accent ml-1">INK</span>
          WRITING PRACTICE
        </Link>
        <span className="font-mono text-sm brutalist-border px-3 py-1.5 rounded bg-card">
          <span className="text-accent">{currentIndex + 1}</span> / {total}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 font-mono text-muted-foreground">Loading vocabulary...</div>
      ) : !currentWord ? (
        <div className="brutalist-card rounded-xl bg-card p-8 text-center">
          <p className="font-mono text-muted-foreground">No vocabulary available for this level yet.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Canvas Area */}
          <div className="flex-1 w-full">
            <div className="brutalist-card rounded-xl bg-card p-2 inline-block w-full max-w-lg mx-auto">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full aspect-square bg-card-gold/20 rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <p className="text-center text-xs font-mono text-muted-foreground mt-2 mb-1">
                Start drawing...
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-72 space-y-4">
            {/* Character Info */}
            <div className="brutalist-card rounded-xl bg-card p-5 text-center">
              <span className="retro-tag text-accent border-accent inline-block mb-2">
                {currentIndex + 1} / {Math.min(total, 2)}
              </span>
              <p className="text-6xl font-bold my-3">{currentWord.chinese}</p>
              <div className="brutalist-border rounded-lg px-3 py-1.5 inline-block bg-accent/10 font-mono text-accent text-sm">
                {currentWord.pinyin}
              </div>
              <p className="mt-2 text-sm text-muted-foreground brutalist-border rounded-lg px-3 py-1.5 inline-block">
                {currentWord.english}
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="w-10 h-10 rounded brutalist-border flex items-center justify-center bg-card hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  disabled={currentIndex >= total - 1}
                  className="w-10 h-10 rounded brutalist-border flex items-center justify-center bg-card hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Tools */}
            <div className="brutalist-card rounded-xl bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-sm">TOOLS</span>
                <span className="retro-tag text-accent border-accent">PRACTICE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={undo}
                  className="brutalist-border rounded-lg p-3 bg-card hover:bg-muted transition-colors flex flex-col items-center gap-1"
                >
                  <Undo2 size={20} />
                  <span className="text-xs font-mono">UNDO</span>
                </button>
                <button
                  onClick={clear}
                  className="brutalist-border rounded-lg p-3 bg-card hover:bg-muted transition-colors flex flex-col items-center gap-1"
                >
                  <Trash2 size={20} />
                  <span className="text-xs font-mono">CLEAR</span>
                </button>
              </div>
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="w-full mt-3 brutalist-border rounded-lg p-3 bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-mono font-bold text-sm"
              >
                {showGuide ? <Eye size={16} /> : <EyeOff size={16} />}
                GUIDE {showGuide ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word list scrollbar at bottom */}
      {vocab && vocab.length > 0 && (
        <div className="mt-6 brutalist-card rounded-xl bg-card p-3">
          <div className="flex flex-wrap gap-1.5">
            {vocab.map((w, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); clear(); }}
                className={`px-2 py-1 text-sm rounded font-mono transition-colors ${
                  i === currentIndex
                    ? "bg-accent text-accent-foreground brutalist-border"
                    : "bg-muted text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {w.chinese}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingPracticePage;
