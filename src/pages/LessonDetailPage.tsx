import { useParams, Link } from "react-router-dom";
import { useState, useCallback, useMemo } from "react";
import { ArrowLeft, Volume2, BookOpen, Headphones, Code2, Pen, Globe, Brain, Settings2, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff } from "lucide-react";
import { useCompletedLessons } from "@/hooks/useCompletedLessons";
import Breadcrumb from "@/components/Breadcrumb";
import { hsk1Lessons, type VocabWord, type LessonData } from "@/data/hsk1-lessons";
import { hsk2Lessons } from "@/data/hsk2-lessons";
import { hsk3Lessons } from "@/data/hsk3-lessons";
import { hsk4Lessons } from "@/data/hsk4-lessons";
import { hsk5Lessons } from "@/data/hsk5-lessons";
import { hsk6Lessons } from "@/data/hsk6-lessons";

const hskLessonMap: Record<string, LessonData[]> = {
  hsk1: hsk1Lessons,
  hsk2: hsk2Lessons,
  hsk3: hsk3Lessons,
  hsk4: hsk4Lessons,
  hsk5: hsk5Lessons,
  hsk6: hsk6Lessons,
};

const tabs = [
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

// Helper to speak Chinese text
const speakChinese = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
};

// ====== TAB COMPONENTS ======

const VocabularyTab = ({ vocab, showPinyin, setShowPinyin }: { vocab: VocabWord[]; showPinyin: boolean; setShowPinyin: (v: boolean) => void }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold flex items-center gap-2">
        <BookOpen size={18} className="text-primary" /> Vocabulary ({vocab.length})
      </h2>
      <button
        onClick={() => setShowPinyin(!showPinyin)}
        className="retro-tag text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors"
      >
        {showPinyin ? "Hide" : "Show"} Pinyin
      </button>
    </div>
    <div className="brutalist-card rounded-xl bg-card overflow-hidden">
      {vocab.map((word, i) => (
        <div key={i} className={`flex items-center p-5 ${i !== vocab.length - 1 ? "border-b-2 border-border" : ""} hover:bg-muted/50 transition-colors`}>
          <span className="text-xs text-muted-foreground font-mono w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-3xl font-bold">{word.chinese}</span>
            {showPinyin && <span className="text-sm text-muted-foreground">{word.pinyin}</span>}
          </div>
          <div className="text-right shrink-0">
            <p className="font-medium text-sm">{word.english}</p>
            <p className="text-xs text-muted-foreground uppercase font-mono">{word.type}</p>
          </div>
          <button onClick={() => speakChinese(word.chinese)} className="ml-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors shrink-0">
            <Volume2 size={14} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const ReadingTab = ({ vocab, lessonTitle }: { vocab: VocabWord[]; lessonTitle: string }) => {
  const sentences = useMemo(() => {
    const s: { chinese: string; pinyin: string; english: string }[] = [];
    for (let i = 0; i < vocab.length - 1; i += 2) {
      const a = vocab[i], b = vocab[i + 1] || vocab[0];
      s.push({
        chinese: `${a.chinese}${b.chinese}。`,
        pinyin: `${a.pinyin} ${b.pinyin}.`,
        english: `${a.english} / ${b.english}.`,
      });
    }
    return s;
  }, [vocab]);

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-primary" /> Reading Practice
      </h2>
      <div className="brutalist-card rounded-xl bg-card p-6 mb-4">
        <p className="text-xs font-mono text-muted-foreground uppercase mb-2">Lesson Theme</p>
        <p className="text-2xl font-bold">{lessonTitle}</p>
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
              <button onClick={() => speakChinese(s.chinese)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors shrink-0 mt-1">
                <Volume2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ListeningTab = ({ vocab }: { vocab: VocabWord[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const word = vocab[currentIndex];

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <Headphones size={18} className="text-primary" /> Listening Practice
      </h2>
      <div className="brutalist-card rounded-xl bg-card p-8 text-center">
        <p className="text-xs font-mono text-muted-foreground uppercase mb-6">Listen and identify the word</p>
        <button onClick={() => speakChinese(word.chinese)} className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto hover:opacity-90 transition-opacity brutalist-border">
          <Volume2 size={32} />
        </button>
        <p className="text-sm text-muted-foreground mt-4 font-mono">Word {currentIndex + 1} / {vocab.length}</p>

        {showAnswer ? (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-3xl font-bold">{word.chinese}</p>
            <p className="text-sm text-muted-foreground">{word.pinyin}</p>
            <p className="text-sm font-medium mt-1">{word.english}</p>
          </div>
        ) : (
          <button onClick={() => setShowAnswer(true)} className="mt-6 retro-tag text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors">
            Reveal Answer
          </button>
        )}

        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setShowAnswer(false); }} disabled={currentIndex === 0} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors disabled:opacity-30">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => { setCurrentIndex(Math.floor(Math.random() * vocab.length)); setShowAnswer(false); }} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors">
            <Shuffle size={18} />
          </button>
          <button onClick={() => { setCurrentIndex(Math.min(vocab.length - 1, currentIndex + 1)); setShowAnswer(false); }} disabled={currentIndex === vocab.length - 1} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors disabled:opacity-30">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const GrammarTab = ({ vocab }: { vocab: VocabWord[] }) => {
  const grammarPoints = useMemo(() => {
    const points: { title: string; pattern: string; example: string; explanation: string }[] = [];
    const verbs = vocab.filter(w => w.type === "verb");
    const nouns = vocab.filter(w => w.type === "noun");
    const particles = vocab.filter(w => w.type === "particle");

    if (verbs.length > 0) {
      const v = verbs[0];
      points.push({
        title: "Subject + Verb Pattern",
        pattern: "Subject + " + v.chinese,
        example: "我" + v.chinese + "。",
        explanation: `Use "${v.chinese}" (${v.pinyin}) meaning "${v.english}" after a subject to form a basic sentence.`,
      });
    }
    if (particles.length > 0) {
      const p = particles[0];
      points.push({
        title: "Particle Usage: " + p.chinese,
        pattern: "Sentence + " + p.chinese,
        example: "你好" + p.chinese + "？",
        explanation: `The particle "${p.chinese}" (${p.pinyin}) is used ${p.english}.`,
      });
    }
    if (nouns.length >= 2) {
      points.push({
        title: "Noun Phrases",
        pattern: nouns[0].chinese + " + " + nouns[1].chinese,
        example: nouns[0].chinese + nouns[1].chinese,
        explanation: `Combine "${nouns[0].chinese}" (${nouns[0].english}) with "${nouns[1].chinese}" (${nouns[1].english}) to form compound expressions.`,
      });
    }
    if (verbs.length >= 2) {
      points.push({
        title: "Verb Series",
        pattern: "Subject + V1 + V2",
        example: "我" + verbs[0].chinese + verbs[1].chinese + "。",
        explanation: `Chinese allows verb serialization: "${verbs[0].chinese}" (${verbs[0].english}) + "${verbs[1].chinese}" (${verbs[1].english}).`,
      });
    }
    if (points.length === 0) {
      points.push({
        title: "Basic Word Order",
        pattern: "Subject + Verb + Object",
        example: vocab.length > 0 ? "我" + vocab[0].chinese + "。" : "我好。",
        explanation: "Chinese follows SVO (Subject-Verb-Object) word order, similar to English.",
      });
    }
    return points;
  }, [vocab]);

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <Code2 size={18} className="text-primary" /> Grammar Points
      </h2>
      <div className="space-y-4">
        {grammarPoints.map((gp, i) => (
          <div key={i} className="brutalist-card rounded-xl bg-card p-6">
            <div className="flex items-start gap-3">
              <span className="retro-tag text-secondary border-secondary text-xs shrink-0">RULE {i + 1}</span>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{gp.title}</h3>
                <div className="mt-3 p-3 bg-muted rounded-lg font-mono text-sm">
                  <p className="text-muted-foreground">Pattern: <span className="text-foreground font-bold">{gp.pattern}</span></p>
                </div>
                <div className="mt-2 p-3 bg-primary/5 rounded-lg">
                  <p className="text-lg font-bold">{gp.example}</p>
                  <button onClick={() => speakChinese(gp.example)} className="mt-1 text-xs text-primary flex items-center gap-1 hover:underline">
                    <Volume2 size={12} /> Listen
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{gp.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CharactersTab = ({ vocab }: { vocab: VocabWord[] }) => (
  <div>
    <h2 className="font-bold flex items-center gap-2 mb-4">
      <Pen size={18} className="text-primary" /> Character Writing
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {vocab.map((word, i) => (
        <div key={i} className="brutalist-card rounded-xl bg-card p-6 text-center">
          <p className="text-5xl font-bold mb-3">{word.chinese}</p>
          <p className="text-sm text-muted-foreground">{word.pinyin}</p>
          <p className="text-xs text-muted-foreground mt-1">{word.english}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="retro-tag text-xs border-muted-foreground/30 text-muted-foreground">{word.chinese.length} strokes est.</span>
            <button onClick={() => speakChinese(word.chinese)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors">
              <Volume2 size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PronunciationTab = ({ vocab }: { vocab: VocabWord[] }) => {
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
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <Volume2 size={18} className="text-primary" /> Pronunciation Guide
      </h2>
      <div className="brutalist-card rounded-xl bg-card p-6 mb-4">
        <p className="font-mono text-sm text-muted-foreground uppercase mb-2">Tone System</p>
        <div className="grid grid-cols-4 gap-3">
          {["1st: ā (flat)", "2nd: á (rising)", "3rd: ǎ (dip)", "4th: à (falling)"].map((t, i) => (
            <div key={i} className="p-3 bg-muted rounded-lg text-center">
              <p className="font-bold text-lg">{i + 1}</p>
              <p className="text-xs text-muted-foreground">{t}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
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

const CultureTab = ({ vocab, lessonTitle }: { vocab: VocabWord[]; lessonTitle: string }) => {
  const culturalNotes = useMemo(() => {
    const notes: { title: string; content: string; emoji: string }[] = [];
    const hasGreeting = vocab.some(w => ["你好", "再见", "谢谢", "对不起", "没关系"].includes(w.chinese));
    const hasFamily = vocab.some(w => ["妈妈", "爸爸", "女儿", "家"].includes(w.chinese));
    const hasFood = vocab.some(w => ["茶", "米饭", "菜", "水果", "吃", "喝"].includes(w.chinese));
    const hasTime = vocab.some(w => ["今天", "明天", "昨天", "星期", "月", "年"].includes(w.chinese));

    if (hasGreeting) notes.push({ title: "Chinese Greetings", content: "In Chinese culture, greetings are very important. '你好' (nǐ hǎo) is the most basic greeting. For elders or people of higher status, use '您好' (nín hǎo) to show respect.", emoji: "🙏" });
    if (hasFamily) notes.push({ title: "Family Values", content: "Family (家, jiā) is the cornerstone of Chinese society. Respect for elders is deeply ingrained. Family titles are very specific in Chinese, with different words for paternal and maternal relatives.", emoji: "👨‍👩‍👧‍👦" });
    if (hasFood) notes.push({ title: "Chinese Food Culture", content: "Food holds a sacred place in Chinese culture. Tea (茶, chá) has been consumed for thousands of years. Rice (米饭, mǐfàn) is the staple food. Chinese cuisine varies greatly by region.", emoji: "🍵" });
    if (hasTime) notes.push({ title: "Chinese Calendar", content: "China uses both the Gregorian calendar and the traditional lunar calendar. Major holidays like Spring Festival follow the lunar calendar. Time concepts emphasize cyclical patterns.", emoji: "📅" });
    if (notes.length === 0) notes.push({ title: "Chinese Language & Culture", content: `In this lesson about "${lessonTitle}", you'll encounter concepts that reflect Chinese daily life and communication patterns. Understanding cultural context helps with language acquisition.`, emoji: "🏮" });
    return notes;
  }, [vocab, lessonTitle]);

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <Globe size={18} className="text-primary" /> Cultural Notes
      </h2>
      <div className="space-y-4">
        {culturalNotes.map((note, i) => (
          <div key={i} className="brutalist-card rounded-xl bg-card p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{note.emoji}</span>
              <div>
                <h3 className="font-bold text-sm">{note.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{note.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlashcardsTab = ({ vocab }: { vocab: VocabWord[] }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState<VocabWord[]>([]);

  const cards = shuffled.length > 0 ? shuffled : vocab;
  const card = cards[index];

  const shuffle = useCallback(() => {
    setShuffled([...vocab].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  }, [vocab]);

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <Brain size={18} className="text-primary" /> Flashcards
      </h2>
      <div className="flex justify-center mb-4 gap-2">
        <button onClick={shuffle} className="retro-tag text-primary border-primary cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1">
          <Shuffle size={12} /> Shuffle
        </button>
        <button onClick={() => { setIndex(0); setFlipped(false); setShuffled([]); }} className="retro-tag text-muted-foreground border-muted-foreground cursor-pointer hover:bg-muted transition-colors flex items-center gap-1">
          <RotateCcw size={12} /> Reset
        </button>
      </div>
      <div
        onClick={() => setFlipped(!flipped)}
        className="brutalist-card rounded-xl bg-card p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[250px] flex flex-col items-center justify-center"
      >
        {!flipped ? (
          <>
            <p className="text-6xl font-bold mb-4">{card.chinese}</p>
            <p className="text-sm text-muted-foreground font-mono">Click to reveal</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold mb-2">{card.chinese}</p>
            <p className="text-lg text-muted-foreground">{card.pinyin}</p>
            <p className="text-lg font-medium mt-2">{card.english}</p>
            <p className="text-xs text-muted-foreground uppercase font-mono mt-1">{card.type}</p>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <button onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false); }} disabled={index === 0} className="w-10 h-10 rounded-lg bg-card brutalist-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-mono text-muted-foreground">{index + 1} / {cards.length}</span>
        <button onClick={() => { setIndex(Math.min(cards.length - 1, index + 1)); setFlipped(false); }} disabled={index === cards.length - 1} className="w-10 h-10 rounded-lg bg-card brutalist-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const ExercisesTab = ({ vocab }: { vocab: VocabWord[] }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const questions = useMemo(() => {
    return vocab.map((w, i) => {
      const wrongOptions = vocab.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english);
      const options = [...wrongOptions, w.english].sort(() => Math.random() - 0.5);
      return { chinese: w.chinese, pinyin: w.pinyin, correct: w.english, options };
    });
  }, [vocab]);

  const q = questions[currentQ];
  const isCorrect = selected === q.correct;

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setAnswered(answered + 1);
    if (option === q.correct) setScore(score + 1);
  };

  const next = () => {
    setSelected(null);
    setCurrentQ((currentQ + 1) % questions.length);
  };

  return (
    <div>
      <h2 className="font-bold flex items-center gap-2 mb-4">
        <Settings2 size={18} className="text-primary" /> Exercises
      </h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-mono text-muted-foreground">Question {currentQ + 1} / {questions.length}</span>
        <span className="retro-tag text-secondary border-secondary text-xs">Score: {score}/{answered}</span>
      </div>
      <div className="brutalist-card rounded-xl bg-card p-8 text-center">
        <p className="text-xs font-mono text-muted-foreground uppercase mb-4">What does this mean?</p>
        <p className="text-5xl font-bold mb-2">{q.chinese}</p>
        <p className="text-sm text-muted-foreground mb-6">{q.pinyin}</p>
        <button onClick={() => speakChinese(q.chinese)} className="mb-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto hover:bg-foreground/10 transition-colors">
          <Volume2 size={16} />
        </button>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`p-3 rounded-lg text-sm font-medium transition-colors brutalist-border ${
                selected
                  ? opt === q.correct
                    ? "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200"
                    : opt === selected
                      ? "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200"
                      : "bg-card"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {selected && (
          <button onClick={next} className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-mono text-sm font-bold hover:opacity-90 transition-opacity">
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

// ====== MAIN PAGE ======

const TabScrollNav = ({ activeTab, setActiveTab, tabsList }: { activeTab: string; setActiveTab: (t: string) => void; tabsList: { id: string; label: string; icon: any }[] }) => {
  const currentIndex = tabsList.findIndex(t => t.id === activeTab);
  const prev = currentIndex > 0 ? tabsList[currentIndex - 1] : null;
  const next = currentIndex < tabsList.length - 1 ? tabsList[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between mt-8 mb-4 brutalist-card rounded-xl bg-card p-3">
      {prev ? (
        <button onClick={() => setActiveTab(prev.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono">
          <ChevronLeft size={14} />
          <prev.icon size={14} className="text-primary" />
          {prev.label}
        </button>
      ) : <div />}
      <span className="text-xs font-mono text-muted-foreground">{currentIndex + 1} / {tabsList.length}</span>
      {next ? (
        <button onClick={() => setActiveTab(next.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono">
          <next.icon size={14} className="text-primary" />
          {next.label}
          <ChevronRight size={14} />
        </button>
      ) : <div />}
    </div>
  );
};

const LessonDetailPage = () => {
  const { level, lessonId } = useParams();
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [showPinyin, setShowPinyin] = useState(true);
  const { isCompleted, toggleComplete } = useCompletedLessons();

  const lvl = level || "hsk1";
  const lessonNum = parseInt(lessonId || "1");
  const allLessons = hskLessonMap[lvl] || hsk1Lessons;
  const lesson = allLessons.find(l => l.id === lessonNum) || allLessons[0];
  const vocab = lesson.vocab;
  const maxLesson = allLessons.length;
  const completed = isCompleted(lvl, lessonNum);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Study", to: "/course" },
          { label: lvl.toUpperCase(), to: `/course/${level}` },
          { label: "LESSON" },
          { label: lessonId || "1" },
        ]}
      />

      {/* Lesson Header */}
      <div className="brutalist-card rounded-xl bg-card p-4 mb-6 flex items-center justify-between">
        <Link to={`/course/${level}`} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="text-center">
          <p className="font-bold font-mono text-lg">第{lessonId}课</p>
          <p className="text-xs text-muted-foreground font-mono">{lesson.chinese} - {lesson.english.toUpperCase()}</p>
        </div>
        <button
          onClick={() => toggleComplete(lvl, lessonNum)}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold brutalist-border flex items-center gap-1.5 hover:opacity-90 transition-all ${
            completed
              ? "bg-green-500 text-white border-green-600"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <CheckCircle2 size={14} /> {completed ? "✓ Completed" : "Mark Complete"}
        </button>
      </div>

      {/* Tabs with scroll */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex gap-2 overflow-x-auto pb-2 px-2" style={{ scrollbarWidth: 'thin' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card brutalist-border hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "vocabulary" && <VocabularyTab vocab={vocab} showPinyin={showPinyin} setShowPinyin={setShowPinyin} />}
      {activeTab === "reading" && <ReadingTab vocab={vocab} lessonTitle={lesson.chinese} />}
      {activeTab === "listening" && <ListeningTab vocab={vocab} />}
      {activeTab === "grammar" && <GrammarTab vocab={vocab} />}
      {activeTab === "characters" && <CharactersTab vocab={vocab} />}
      {activeTab === "pronunciation" && <PronunciationTab vocab={vocab} />}
      {activeTab === "culture" && <CultureTab vocab={vocab} lessonTitle={lesson.english} />}
      {activeTab === "flashcards" && <FlashcardsTab vocab={vocab} />}
      {activeTab === "exercises" && <ExercisesTab vocab={vocab} />}

      {/* Tab Scroll Navigation */}
      <TabScrollNav activeTab={activeTab} setActiveTab={setActiveTab} tabsList={tabs} />

      {/* Lesson Navigation */}
      <div className="flex items-center justify-between mt-4 mb-4">
        {lessonNum > 1 ? (
          <Link to={`/course/${level}/lesson/${lessonNum - 1}`} className="retro-tag text-primary border-primary hover:bg-primary/10 transition-colors flex items-center gap-1">
            <ChevronLeft size={14} /> Lesson {lessonNum - 1}
          </Link>
        ) : <div />}
        {lessonNum < maxLesson ? (
          <Link to={`/course/${level}/lesson/${lessonNum + 1}`} className="retro-tag text-primary border-primary hover:bg-primary/10 transition-colors flex items-center gap-1">
            Lesson {lessonNum + 1} <ChevronRight size={14} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default LessonDetailPage;
