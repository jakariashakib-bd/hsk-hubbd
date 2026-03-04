import { useParams, Link } from "react-router-dom";
import { useState, useCallback, useMemo } from "react";
import { Volume2, BookOpen, Headphones, Code2, Pen, Globe, Brain, Settings2, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useCompletedLessons } from "@/hooks/useCompletedLessons";
import { useHskLessons } from "@/hooks/useHskData";
import type { VocabWord, LessonData } from "@/data/hsk1-lessons";

const contentTabs = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "vocabulary", label: "Vocabulary", icon: BookOpen },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "listening", label: "Listening", icon: Headphones },
  { id: "grammar", label: "Grammar", icon: Code2 },
  { id: "characters", label: "Characters", icon: Pen },
  { id: "pronunciation", label: "Pronunciation", icon: Volume2 },
  { id: "culture", label: "Culture", icon: Globe },
  { id: "flashcards", label: "Flashcards", icon: Brain },
  { id: "exercises", label: "Exercises", icon: Settings2 },
];

const speakChinese = (text: string) => {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.8;
  speechSynthesis.speak(u);
};

const courseData: Record<string, { level: number; label: string; color: string; words: number }> = {
  hsk1: { level: 1, label: "BEGINNER LEVEL", color: "bg-card-mint", words: 150 },
  hsk2: { level: 2, label: "ELEMENTARY LEVEL", color: "bg-card-salmon", words: 300 },
  hsk3: { level: 3, label: "INTERMEDIATE LEVEL", color: "bg-card-gold", words: 600 },
  hsk4: { level: 4, label: "UPPER INTERMEDIATE", color: "bg-card-coral", words: 1200 },
  hsk5: { level: 5, label: "ADVANCED LEVEL", color: "bg-card-teal", words: 2500 },
  hsk6: { level: 6, label: "NATIVE LEVEL", color: "bg-card-purple", words: 5000 },
};

// ====== LESSONS TAB ======
const LessonsTab = ({ lessons, level }: { lessons: LessonData[]; level: string }) => {
  const { isCompleted, toggleComplete, completedCount } = useCompletedLessons();
  const done = completedCount(level, lessons.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <BookOpen size={20} className="text-primary" /> Course Curriculum
        </h2>
        <span className="text-sm text-muted-foreground font-mono">{done} / {lessons.length} Completed</span>
      </div>
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const completed = isCompleted(level, lesson.id);
          return (
            <div key={lesson.id} className="brutalist-card rounded-xl bg-card flex items-center gap-0 hover:bg-muted transition-colors group">
              <Link to={`/course/${level}/lesson/${lesson.id}`} className="flex-1 p-5 flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm brutalist-border shrink-0 ${completed ? "bg-green-500 text-white border-green-600" : "bg-primary/10 text-primary"}`}>
                  {completed ? <CheckCircle2 size={18} /> : lesson.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">
                    <span className={completed ? "text-muted-foreground line-through" : "text-foreground/80"}>{lesson.chinese}</span>
                    <span className="text-muted-foreground ml-2">{lesson.english}</span>
                  </p>
                  <p className="text-xs font-mono text-muted-foreground uppercase mt-1">
                    {lesson.vocab.length} WORDS {completed && "• ✓ DONE"}
                  </p>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); toggleComplete(level, lesson.id); }}
                className={`mr-3 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${completed ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "bg-muted hover:bg-foreground/10 text-muted-foreground"}`}
              >
                {completed ? "✓" : "○"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ====== VOCABULARY TAB ======
const AllVocabularyTab = ({ lessons, level }: { lessons: LessonData[]; level: string }) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);
  const displayLessons = activeLesson === 0 ? lessons : [lessons[activeLesson - 1]];
  const allVocab = displayLessons.flatMap(l => l.vocab.map(v => ({ ...v, lessonId: l.id, lessonTitle: l.chinese })));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold flex items-center gap-2"><BookOpen size={18} className="text-primary" /> Vocabulary ({allVocab.length} words)</h2>
        <button onClick={() => setShowPinyin(!showPinyin)} className="retro-tag text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors">{showPinyin ? "Hide" : "Show"} Pinyin</button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button onClick={() => setActiveLesson(0)} className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${activeLesson === 0 ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>All Lessons</button>
        {lessons.map(l => (
          <button key={l.id} onClick={() => setActiveLesson(l.id)} className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${activeLesson === l.id ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>L{l.id}: {l.chinese}</button>
        ))}
      </div>
      {displayLessons.map(lesson => (
        <div key={lesson.id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="retro-tag text-secondary border-secondary text-xs">Lesson {lesson.id}</span>
            <span className="text-sm font-bold">{lesson.chinese} - {lesson.english}</span>
          </div>
          <div className="brutalist-card rounded-xl bg-card overflow-hidden">
            {lesson.vocab.map((word, i) => (
              <div key={i} className={`flex items-center p-4 ${i !== lesson.vocab.length - 1 ? "border-b-2 border-border" : ""} hover:bg-muted/50 transition-colors`}>
                <span className="text-xs text-muted-foreground font-mono w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl font-bold">{word.chinese}</span>
                  {showPinyin && <span className="text-sm text-muted-foreground">{word.pinyin}</span>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm">{word.english}</p>
                  <p className="text-xs text-muted-foreground uppercase font-mono">{word.type}</p>
                </div>
                <button onClick={() => speakChinese(word.chinese)} className="ml-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors shrink-0"><Volume2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ====== READING TAB ======
const AllReadingTab = ({ lessons }: { lessons: LessonData[] }) => (
  <div>
    <h2 className="font-bold flex items-center gap-2 mb-4"><BookOpen size={18} className="text-primary" /> Reading Practice</h2>
    {lessons.map(lesson => {
      const sentences: { chinese: string; pinyin: string; english: string }[] = [];
      for (let i = 0; i < lesson.vocab.length - 1; i += 2) {
        const a = lesson.vocab[i], b = lesson.vocab[i + 1] || lesson.vocab[0];
        sentences.push({ chinese: `${a.chinese}${b.chinese}。`, pinyin: `${a.pinyin} ${b.pinyin}.`, english: `${a.english} / ${b.english}.` });
      }
      return (
        <div key={lesson.id} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="retro-tag text-secondary border-secondary text-xs">Lesson {lesson.id}</span>
            <span className="text-sm font-bold">{lesson.chinese} - {lesson.english}</span>
          </div>
          <div className="space-y-3">
            {sentences.map((s, i) => (
              <div key={i} className="brutalist-card rounded-xl bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-2xl font-bold mb-1">{s.chinese}</p>
                    <p className="text-sm text-muted-foreground">{s.pinyin}</p>
                    <p className="text-sm text-foreground/70 mt-2 italic">{s.english}</p>
                  </div>
                  <button onClick={() => speakChinese(s.chinese)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors shrink-0 mt-1"><Volume2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ====== LISTENING TAB ======
const AllListeningTab = ({ lessons }: { lessons: LessonData[] }) => {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const lesson = lessons[selectedLesson];
  const word = lesson?.vocab[currentIndex];
  if (!lesson || !word) return null;

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4"><Headphones size={18} className="text-primary" /> Listening Practice</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {lessons.map((l, i) => (
          <button key={l.id} onClick={() => { setSelectedLesson(i); setCurrentIndex(0); setShowAnswer(false); }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${selectedLesson === i ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>
            L{l.id}: {l.chinese}
          </button>
        ))}
      </div>
      <div className="brutalist-card rounded-xl bg-card p-8 text-center">
        <p className="text-xs font-mono text-muted-foreground uppercase mb-6">Listen and identify the word</p>
        <button onClick={() => speakChinese(word.chinese)} className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto hover:opacity-90 transition-opacity brutalist-border"><Volume2 size={32} /></button>
        <p className="text-sm text-muted-foreground mt-4 font-mono">Word {currentIndex + 1} / {lesson.vocab.length}</p>
        {showAnswer ? (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-3xl font-bold">{word.chinese}</p>
            <p className="text-sm text-muted-foreground">{word.pinyin}</p>
            <p className="text-sm font-medium mt-1">{word.english}</p>
          </div>
        ) : (
          <button onClick={() => setShowAnswer(true)} className="mt-6 retro-tag text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors">Reveal Answer</button>
        )}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setShowAnswer(false); }} disabled={currentIndex === 0} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors disabled:opacity-30"><ChevronLeft size={18} /></button>
          <button onClick={() => { setCurrentIndex(Math.floor(Math.random() * lesson.vocab.length)); setShowAnswer(false); }} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors"><Shuffle size={18} /></button>
          <button onClick={() => { setCurrentIndex(Math.min(lesson.vocab.length - 1, currentIndex + 1)); setShowAnswer(false); }} disabled={currentIndex === lesson.vocab.length - 1} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors disabled:opacity-30"><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

// ====== GRAMMAR TAB ======
const AllGrammarTab = ({ lessons }: { lessons: LessonData[] }) => (
  <div>
    <h2 className="font-bold flex items-center gap-2 mb-4"><Code2 size={18} className="text-primary" /> Grammar Points</h2>
    {lessons.map(lesson => {
      const vocab = lesson.vocab;
      const points: { title: string; pattern: string; example: string; explanation: string }[] = [];
      const verbs = vocab.filter(w => w.type === "verb");
      const nouns = vocab.filter(w => w.type === "noun");
      const particles = vocab.filter(w => w.type === "particle");
      if (verbs.length > 0) { const v = verbs[0]; points.push({ title: "Subject + Verb", pattern: "Subject + " + v.chinese, example: "我" + v.chinese + "。", explanation: `Use "${v.chinese}" (${v.pinyin}) "${v.english}" after a subject.` }); }
      if (particles.length > 0) { const p = particles[0]; points.push({ title: "Particle: " + p.chinese, pattern: "Sentence + " + p.chinese, example: "你好" + p.chinese + "？", explanation: `"${p.chinese}" (${p.pinyin}) is used ${p.english}.` }); }
      if (nouns.length >= 2) { points.push({ title: "Noun Phrases", pattern: nouns[0].chinese + " + " + nouns[1].chinese, example: nouns[0].chinese + nouns[1].chinese, explanation: `Combine "${nouns[0].chinese}" (${nouns[0].english}) with "${nouns[1].chinese}" (${nouns[1].english}).` }); }
      if (points.length === 0) { points.push({ title: "Basic Word Order", pattern: "Subject + Verb + Object", example: "我" + (vocab[0]?.chinese || "好") + "。", explanation: "Chinese uses SVO word order." }); }
      return (
        <div key={lesson.id} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="retro-tag text-secondary border-secondary text-xs">Lesson {lesson.id}</span>
            <span className="text-sm font-bold">{lesson.chinese} - {lesson.english}</span>
          </div>
          <div className="space-y-3">
            {points.map((gp, i) => (
              <div key={i} className="brutalist-card rounded-xl bg-card p-5">
                <h3 className="font-bold text-sm mb-2">{gp.title}</h3>
                <div className="p-2 bg-muted rounded-lg font-mono text-sm mb-2">Pattern: <span className="font-bold">{gp.pattern}</span></div>
                <div className="p-2 bg-primary/5 rounded-lg flex items-center justify-between">
                  <p className="text-lg font-bold">{gp.example}</p>
                  <button onClick={() => speakChinese(gp.example)} className="text-xs text-primary flex items-center gap-1 hover:underline"><Volume2 size={12} /> Listen</button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{gp.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ====== CHARACTERS TAB ======
const AllCharactersTab = ({ lessons }: { lessons: LessonData[] }) => (
  <div>
    <h2 className="font-bold flex items-center gap-2 mb-4"><Pen size={18} className="text-primary" /> Character Writing</h2>
    {lessons.map(lesson => (
      <div key={lesson.id} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="retro-tag text-secondary border-secondary text-xs">Lesson {lesson.id}</span>
          <span className="text-sm font-bold">{lesson.chinese}</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {lesson.vocab.map((word, i) => (
            <div key={i} className="brutalist-card rounded-xl bg-card p-4 text-center">
              <p className="text-4xl font-bold mb-2">{word.chinese}</p>
              <p className="text-xs text-muted-foreground">{word.pinyin}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{word.english}</p>
              <button onClick={() => speakChinese(word.chinese)} className="mt-2 w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors mx-auto"><Volume2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ====== PRONUNCIATION TAB ======
const AllPronunciationTab = ({ lessons }: { lessons: LessonData[] }) => {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const vocab = lessons[selectedLesson]?.vocab || [];
  const toneGroups = useMemo(() => {
    const groups: Record<string, VocabWord[]> = { "1st Tone (ā)": [], "2nd Tone (á)": [], "3rd Tone (ǎ)": [], "4th Tone (à)": [], "Neutral": [] };
    vocab.forEach(w => {
      const p = w.pinyin;
      if (/[āēīōūǖ]/.test(p)) groups["1st Tone (ā)"].push(w);
      else if (/[áéíóúǘ]/.test(p)) groups["2nd Tone (á)"].push(w);
      else if (/[ǎěǐǒǔǚ]/.test(p)) groups["3rd Tone (ǎ)"].push(w);
      else if (/[àèìòùǜ]/.test(p)) groups["4th Tone (à)"].push(w);
      else groups["Neutral"].push(w);
    });
    return Object.entries(groups).filter(([_, words]) => words.length > 0);
  }, [vocab]);

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4"><Volume2 size={18} className="text-primary" /> Pronunciation Guide</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {lessons.map((l, i) => (
          <button key={l.id} onClick={() => setSelectedLesson(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${selectedLesson === i ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>
            L{l.id}: {l.chinese}
          </button>
        ))}
      </div>
      <div className="brutalist-card rounded-xl bg-card p-5 mb-4">
        <div className="grid grid-cols-4 gap-3">
          {["1st: ā (flat)", "2nd: á (rising)", "3rd: ǎ (dip)", "4th: à (falling)"].map((t, i) => (
            <div key={i} className="p-3 bg-muted rounded-lg text-center">
              <p className="font-bold text-lg">{i + 1}</p>
              <p className="text-xs text-muted-foreground">{t}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {toneGroups.map(([tone, words]) => (
          <div key={tone} className="brutalist-card rounded-xl bg-card p-5">
            <h3 className="font-bold text-sm mb-3">{tone}</h3>
            <div className="flex flex-wrap gap-2">
              {words.map((w, i) => (
                <button key={i} onClick={() => speakChinese(w.chinese)} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-foreground/10 transition-colors">
                  <span className="font-bold">{w.chinese}</span>
                  <span className="text-xs text-muted-foreground">{w.pinyin}</span>
                  <Volume2 size={12} className="text-primary" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ====== CULTURE TAB ======
const AllCultureTab = ({ lessons }: { lessons: LessonData[] }) => (
  <div>
    <h2 className="font-bold flex items-center gap-2 mb-4"><Globe size={18} className="text-primary" /> Cultural Notes</h2>
    {lessons.map(lesson => {
      const vocab = lesson.vocab;
      const notes: { title: string; content: string; emoji: string }[] = [];
      if (vocab.some(w => ["你好", "再见", "谢谢", "对不起"].includes(w.chinese))) notes.push({ title: "Chinese Greetings", content: "In Chinese culture, greetings reflect social hierarchy. '您好' is more formal than '你好'.", emoji: "🙏" });
      if (vocab.some(w => ["妈妈", "爸爸", "女儿", "家"].includes(w.chinese))) notes.push({ title: "Family Values", content: "Family is the cornerstone of Chinese society with specific terms for every relative.", emoji: "👨‍👩‍👧‍👦" });
      if (vocab.some(w => ["茶", "米饭", "菜", "吃", "喝"].includes(w.chinese))) notes.push({ title: "Food Culture", content: "Tea has been consumed for thousands of years. Chinese cuisine varies greatly by region.", emoji: "🍵" });
      if (notes.length === 0) notes.push({ title: `Cultural Context: ${lesson.english}`, content: `This lesson covers concepts from Chinese daily life related to "${lesson.english}".`, emoji: "🏮" });
      return (
        <div key={lesson.id} className="mb-4">
          <div className="flex items-center gap-2 mb-2"><span className="retro-tag text-secondary border-secondary text-xs">Lesson {lesson.id}</span></div>
          {notes.map((note, i) => (
            <div key={i} className="brutalist-card rounded-xl bg-card p-5 mb-2">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{note.emoji}</span>
                <div><h3 className="font-bold text-sm">{note.title}</h3><p className="text-sm text-muted-foreground mt-1">{note.content}</p></div>
              </div>
            </div>
          ))}
        </div>
      );
    })}
  </div>
);

// ====== FLASHCARDS TAB ======
const AllFlashcardsTab = ({ lessons }: { lessons: LessonData[] }) => {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState<VocabWord[]>([]);
  const vocab = lessons[selectedLesson]?.vocab || [];
  const cards = shuffled.length > 0 ? shuffled : vocab;
  const card = cards[index];
  if (!card) return null;

  const shuffle = () => {
    setShuffled([...vocab].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4"><Brain size={18} className="text-primary" /> Flashcards</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {lessons.map((l, i) => (
          <button key={l.id} onClick={() => { setSelectedLesson(i); setIndex(0); setFlipped(false); setShuffled([]); }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${selectedLesson === i ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>
            L{l.id}: {l.chinese}
          </button>
        ))}
      </div>
      <div className="flex justify-center mb-4 gap-2">
        <button onClick={shuffle} className="retro-tag text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1"><Shuffle size={12} /> Shuffle</button>
        <button onClick={() => { setIndex(0); setFlipped(false); setShuffled([]); }} className="retro-tag text-muted-foreground border-muted-foreground cursor-pointer hover:bg-muted transition-colors flex items-center gap-1"><RotateCcw size={12} /> Reset</button>
      </div>
      <div onClick={() => setFlipped(!flipped)} className="brutalist-card rounded-xl bg-card p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[250px] flex flex-col items-center justify-center">
        {!flipped ? (
          <><p className="text-6xl font-bold mb-4">{card.chinese}</p><p className="text-sm text-muted-foreground font-mono">Click to reveal</p></>
        ) : (
          <><p className="text-4xl font-bold mb-2">{card.chinese}</p><p className="text-lg text-muted-foreground">{card.pinyin}</p><p className="text-lg font-medium mt-2">{card.english}</p><p className="text-xs text-muted-foreground uppercase font-mono mt-1">{card.type}</p></>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <button onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false); }} disabled={index === 0} className="w-10 h-10 rounded-lg bg-card brutalist-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"><ChevronLeft size={18} /></button>
        <span className="text-sm font-mono text-muted-foreground">{index + 1} / {cards.length}</span>
        <button onClick={() => { setIndex(Math.min(cards.length - 1, index + 1)); setFlipped(false); }} disabled={index === cards.length - 1} className="w-10 h-10 rounded-lg bg-card brutalist-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
};

// ====== EXERCISES TAB ======
const AllExercisesTab = ({ lessons }: { lessons: LessonData[] }) => {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const vocab = lessons[selectedLesson]?.vocab || [];
  const questions = useMemo(() => {
    return vocab.map((w, i) => {
      const wrongOptions = vocab.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english);
      const options = [...wrongOptions, w.english].sort(() => Math.random() - 0.5);
      return { chinese: w.chinese, pinyin: w.pinyin, correct: w.english, options };
    });
  }, [vocab]);
  if (questions.length === 0) return null;
  const q = questions[currentQ];
  const handleSelect = (option: string) => { if (selected) return; setSelected(option); setAnswered(answered + 1); if (option === q.correct) setScore(score + 1); };
  const next = () => { setSelected(null); setCurrentQ((currentQ + 1) % questions.length); };

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4"><Settings2 size={18} className="text-primary" /> Exercises</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {lessons.map((l, i) => (
          <button key={l.id} onClick={() => { setSelectedLesson(i); setCurrentQ(0); setSelected(null); setScore(0); setAnswered(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${selectedLesson === i ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>
            L{l.id}: {l.chinese}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-mono text-muted-foreground">Question {currentQ + 1} / {questions.length}</span>
        <span className="retro-tag text-secondary border-secondary text-xs">Score: {score}/{answered}</span>
      </div>
      <div className="brutalist-card rounded-xl bg-card p-8 text-center">
        <p className="text-xs font-mono text-muted-foreground uppercase mb-4">What does this mean?</p>
        <p className="text-5xl font-bold mb-2">{q.chinese}</p>
        <p className="text-sm text-muted-foreground mb-6">{q.pinyin}</p>
        <button onClick={() => speakChinese(q.chinese)} className="mb-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto hover:bg-foreground/10 transition-colors"><Volume2 size={16} /></button>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected}
              className={`p-3 rounded-lg text-sm font-medium transition-colors brutalist-border ${selected ? opt === q.correct ? "bg-green-100 border-green-500 text-green-800" : opt === selected ? "bg-red-100 border-red-500 text-red-800" : "bg-card" : "bg-card hover:bg-muted"}`}>
              {opt}
            </button>
          ))}
        </div>
        {selected && <button onClick={next} className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-mono text-sm font-bold hover:opacity-90 transition-opacity">Next →</button>}
      </div>
    </div>
  );
};

// ====== MAIN PAGE ======
const CourseDetailPage = () => {
  const { level } = useParams();
  const [activeTab, setActiveTab] = useState("lessons");
  const course = courseData[level || "hsk1"] || courseData.hsk1;
  const levelNum = parseInt((level || "hsk1").replace("hsk", ""));
  const { data: lessons = [], isLoading, error } = useHskLessons(levelNum);
  const hasData = lessons.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Study", to: "/course" }, { label: `HSK${course.level}` }]} />

      {/* Hero Banner */}
      <div className={`${course.color} rounded-2xl p-8 brutalist-border mb-6 relative overflow-hidden`}>
        <span className="retro-tag text-foreground/70 border-foreground/30 mb-3 inline-block">● {course.label}</span>
        <h1 className="text-6xl font-bold text-foreground/20 font-mono lowercase">hsk{course.level}</h1>
        <p className="text-foreground/70 mt-2">Master the first {course.words} words and basic grammar structures.</p>
        <span className="absolute right-8 top-4 text-[8rem] font-bold text-foreground/5 font-mono leading-none select-none">漢</span>
      </div>

      {/* Content Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {contentTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card brutalist-border hover:bg-muted"}`}>
              <Icon size={14} />{tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="brutalist-card rounded-xl bg-card p-12 text-center">
          <Loader2 size={32} className="animate-spin mx-auto text-primary mb-3" />
          <p className="font-bold">Loading lessons...</p>
        </div>
      ) : error ? (
        <div className="brutalist-card rounded-xl bg-card p-12 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-bold text-lg">Error loading data</p>
          <p className="text-muted-foreground text-sm mt-1">Please try again later.</p>
        </div>
      ) : !hasData ? (
        <div className="brutalist-card rounded-xl bg-card p-12 text-center">
          <p className="text-4xl mb-3">🚧</p>
          <p className="font-bold text-lg">HSK {course.level} Content Coming Soon</p>
          <p className="text-muted-foreground font-mono text-sm mt-1">Lessons are being prepared for this level.</p>
        </div>
      ) : (
        <>
          {activeTab === "lessons" && <LessonsTab lessons={lessons} level={level || "hsk1"} />}
          {activeTab === "vocabulary" && <AllVocabularyTab lessons={lessons} level={level || "hsk1"} />}
          {activeTab === "reading" && <AllReadingTab lessons={lessons} />}
          {activeTab === "listening" && <AllListeningTab lessons={lessons} />}
          {activeTab === "grammar" && <AllGrammarTab lessons={lessons} />}
          {activeTab === "characters" && <AllCharactersTab lessons={lessons} />}
          {activeTab === "pronunciation" && <AllPronunciationTab lessons={lessons} />}
          {activeTab === "culture" && <AllCultureTab lessons={lessons} />}
          {activeTab === "flashcards" && <AllFlashcardsTab lessons={lessons} />}
          {activeTab === "exercises" && <AllExercisesTab lessons={lessons} />}

          {activeTab !== "lessons" && (
            <div className="flex items-center justify-between mt-8 mb-4 brutalist-card rounded-xl bg-card p-3">
              {(() => {
                const idx = contentTabs.findIndex(t => t.id === activeTab);
                const prev = idx > 0 ? contentTabs[idx - 1] : null;
                const next = idx < contentTabs.length - 1 ? contentTabs[idx + 1] : null;
                return (
                  <>
                    {prev ? (
                      <button onClick={() => setActiveTab(prev.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono">
                        <ChevronLeft size={14} /><prev.icon size={14} className="text-primary" />{prev.label}
                      </button>
                    ) : <div />}
                    <span className="text-xs font-mono text-muted-foreground">{idx + 1} / {contentTabs.length}</span>
                    {next ? (
                      <button onClick={() => setActiveTab(next.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono">
                        <next.icon size={14} className="text-primary" />{next.label}<ChevronRight size={14} />
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}

      {activeTab === "lessons" && hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="brutalist-card rounded-xl bg-secondary p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={20} className="text-secondary-foreground" />
              <h3 className="font-bold font-mono text-secondary-foreground">Mock Exam</h3>
            </div>
            <p className="text-sm text-secondary-foreground/80 mt-2">Take a simulated exam to evaluate your HSK {course.level} mastery.</p>
            <Link to="/mock-test" className="block mt-4 text-center bg-card text-foreground font-bold text-sm py-2.5 rounded-lg brutalist-border hover:bg-muted transition-colors">Start Exam</Link>
          </div>
          <div className="brutalist-card rounded-xl bg-card p-6">
            <h3 className="font-bold text-sm flex items-center gap-2"><Volume2 size={16} className="text-primary" /> Focus Areas</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link to={`/course/${level}/vocabulary`} className="brutalist-border rounded-lg p-3 text-center hover:bg-muted transition-colors">
                <p className="text-2xl mb-1">🧠</p><p className="text-xs font-mono">Flashcards</p>
              </Link>
              <Link to={`/course/${level}/grammar`} className="brutalist-border rounded-lg p-3 text-center hover:bg-muted transition-colors">
                <p className="text-2xl mb-1">📖</p><p className="text-xs font-mono">Grammar</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {hasData && (
        <div className="flex items-center justify-between mt-8 mb-4 brutalist-card rounded-xl bg-card p-3">
          {course.level > 1 ? (
            <Link to={`/course/hsk${course.level - 1}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono">
              <ChevronLeft size={14} /> ← HSK {course.level - 1}
            </Link>
          ) : <div />}
          <span className="text-xs font-mono text-muted-foreground">Level {course.level} / 6</span>
          {course.level < 6 ? (
            <Link to={`/course/hsk${course.level + 1}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono">
              HSK {course.level + 1} → <ChevronRight size={14} />
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
