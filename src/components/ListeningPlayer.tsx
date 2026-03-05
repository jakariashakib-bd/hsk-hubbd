import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Play, Pause, Square, EyeOff, Eye, Volume2, SkipForward } from "lucide-react";

interface DialogueLine {
  speaker: string;
  chinese: string;
  pinyin: string;
  english: string;
}

interface Props {
  title: string;
  lines: DialogueLine[];
  onBack: () => void;
}

const ListeningPlayer = ({ title, lines, onBack }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [showText, setShowText] = useState(true);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const totalEstimatedTime = lines.length * 4; // ~4s per line estimate

  const stopAll = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const speakLine = useCallback((index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (index >= lines.length || !playingRef.current) {
        resolve();
        return;
      }

      setCurrentLine(index);

      const utterance = new SpeechSynthesisUtterance(lines[index].chinese);
      utterance.lang = "zh-CN";
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utteranceRef.current = utterance;

      utterance.onend = () => {
        if (!playingRef.current) {
          resolve();
          return;
        }
        // Small pause between lines
        setTimeout(() => resolve(), 800);
      };

      utterance.onerror = (e) => {
        if (e.error === "canceled") resolve();
        else reject(e);
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [lines]);

  const playAll = useCallback(async (startFrom: number = 0) => {
    playingRef.current = true;
    setIsPlaying(true);
    startTimeRef.current = Date.now() - (startFrom > 0 ? (startFrom / lines.length) * totalEstimatedTime * 1000 : 0);

    // Timer for progress
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedTime(elapsed);
      setProgress(Math.min((elapsed / totalEstimatedTime) * 100, 100));
    }, 100);

    try {
      for (let i = startFrom; i < lines.length; i++) {
        if (!playingRef.current) break;
        await speakLine(i);
      }
    } catch (e) {
      console.error("Speech error:", e);
    }

    stopAll();
    setCurrentLine(-1);
    setProgress(100);
  }, [lines, speakLine, stopAll, totalEstimatedTime]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAll();
    } else {
      playAll(currentLine > 0 ? currentLine : 0);
    }
  };

  const handleStop = () => {
    stopAll();
    setCurrentLine(-1);
    setProgress(0);
    setElapsedTime(0);
  };

  const handleSkip = () => {
    window.speechSynthesis.cancel();
    // The promise in speakLine will resolve and move to next
  };

  const speakSingleLine = (index: number) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lines[index].chinese);
    utterance.lang = "zh-CN";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { stopAll(); onBack(); }}
            className="w-10 h-10 rounded brutalist-border flex items-center justify-center bg-card hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="retro-tag text-accent border-accent">TRK</span>
          <h2 className="font-bold font-mono uppercase text-sm md:text-base">{title}</h2>
        </div>
        <button
          onClick={() => setShowText(!showText)}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 font-mono font-bold text-sm rounded-lg brutalist-border hover:opacity-90 transition-opacity"
        >
          {showText ? <EyeOff size={16} /> : <Eye size={16} />}
          {showText ? "HIDE TEXT" : "SHOW TEXT"}
        </button>
      </div>

      <div className="w-full h-1 bg-foreground mb-6" />

      {/* Audio Player Area */}
      <div className="brutalist-card rounded-xl bg-secondary p-6 md:p-8 mb-6 relative overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full border-2 border-secondary-foreground/30" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-secondary-foreground/30" />
        <div className="absolute top-4 left-8 right-8 border-t-2 border-dashed border-secondary-foreground/20" />

        {/* Speaker icon */}
        <div className="flex justify-center my-6">
          <div className="w-24 h-24 brutalist-card rounded-2xl bg-card flex items-center justify-center">
            <div className={`w-10 h-10 bg-foreground rounded-md ${isPlaying ? "animate-pulse" : ""}`} />
          </div>
        </div>

        {/* Playing status */}
        <div className="brutalist-card rounded-lg bg-secondary/80 p-4 max-w-md mx-auto backdrop-blur-sm">
          <p className="font-mono font-bold text-center text-secondary-foreground text-sm mb-3">
            {isPlaying ? "PLAYING CONVERSATION" : currentLine >= 0 ? "PAUSED" : "READY TO PLAY"}
          </p>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-secondary-foreground/80 brutalist-border px-2 py-0.5 rounded bg-card/20 min-w-[40px] text-center">
              {formatTime(elapsedTime)}
            </span>
            <div className="flex-1 h-3 bg-foreground rounded-full brutalist-border overflow-hidden relative">
              <div
                className="h-full bg-card rounded-full transition-all duration-200 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-sm brutalist-border" />
              </div>
            </div>
            <span className="font-mono text-xs text-secondary-foreground/80 brutalist-border px-2 py-0.5 rounded bg-card/20 min-w-[40px] text-center">
              {formatTime(totalEstimatedTime)}
            </span>
          </div>
        </div>

        {/* Equalizer bars */}
        <div className="flex items-end justify-center gap-1 mt-4 h-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="w-2 bg-secondary-foreground/20 rounded-t transition-all"
              style={{
                height: isPlaying
                  ? `${Math.random() * 100}%`
                  : "20%",
                transition: isPlaying ? "height 0.15s" : "height 0.5s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={handleStop}
          className="w-12 h-12 rounded-lg brutalist-card bg-card flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Square size={20} />
        </button>
        <button
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-xl brutalist-card bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button
          onClick={handleSkip}
          disabled={!isPlaying}
          className="w-12 h-12 rounded-lg brutalist-card bg-card flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Transcript */}
      <div className="brutalist-card rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 size={20} className="text-accent" />
          <h3 className="font-bold font-mono uppercase">TRANSCRIPT</h3>
        </div>
        <div className="w-full h-0.5 bg-border mb-4" />

        <div className="space-y-3">
          {lines.map((line, i) => (
            <div
              key={i}
              onClick={() => speakSingleLine(i)}
              className={`rounded-lg p-4 brutalist-border cursor-pointer transition-all ${
                i === currentLine
                  ? "bg-secondary/20 border-secondary scale-[1.01]"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`retro-tag text-xs ${i === currentLine ? "text-accent border-accent" : "text-muted-foreground border-muted-foreground"}`}>
                  {line.speaker}
                </span>
                {i === currentLine && isPlaying && (
                  <span className="flex gap-0.5">
                    <span className="w-1 h-3 bg-accent rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  </span>
                )}
              </div>
              <p className="text-lg font-bold">{line.chinese}</p>
              {showText && (
                <>
                  <p className="text-sm text-accent font-mono mt-1">/{line.pinyin}/</p>
                  <p className="text-sm text-muted-foreground">{line.english}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListeningPlayer;
