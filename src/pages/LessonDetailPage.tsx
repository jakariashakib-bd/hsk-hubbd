import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Volume2, BookOpen, Headphones, Code2, Pen, Globe, Brain, Settings2, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const lessonVocab: Record<string, { chinese: string; pinyin: string; english: string; type: string }[]> = {
  "hsk1-1": [
    { chinese: "你", pinyin: "nǐ", english: "you", type: "pronoun" },
    { chinese: "好", pinyin: "hǎo", english: "good, well, fine", type: "adjective" },
    { chinese: "您", pinyin: "nín", english: "you (formal)", type: "pronoun" },
    { chinese: "你们", pinyin: "nǐmen", english: "you (plural)", type: "pronoun" },
    { chinese: "对不起", pinyin: "duìbuqǐ", english: "sorry", type: "phrase" },
    { chinese: "没关系", pinyin: "méi guānxi", english: "it's okay", type: "phrase" },
    { chinese: "老师", pinyin: "lǎoshī", english: "teacher", type: "noun" },
    { chinese: "你好", pinyin: "nǐ hǎo", english: "hello", type: "phrase" },
  ],
  "hsk1-2": [
    { chinese: "谢谢", pinyin: "xièxie", english: "thank you", type: "phrase" },
    { chinese: "不客气", pinyin: "bú kèqi", english: "you're welcome", type: "phrase" },
    { chinese: "再见", pinyin: "zàijiàn", english: "goodbye", type: "phrase" },
    { chinese: "请", pinyin: "qǐng", english: "please", type: "adverb" },
  ],
};

const lessonTitles: Record<string, { chinese: string; english: string }> = {
  "hsk1-1": { chinese: "你好", english: "HELLO" },
  "hsk1-2": { chinese: "谢谢你", english: "THANK YOU" },
  "hsk2-1": { chinese: "九月去北京旅游", english: "TRAVEL TO BEIJING" },
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

const LessonDetailPage = () => {
  const { level, lessonId } = useParams();
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [showPinyin, setShowPinyin] = useState(true);

  const key = `${level}-${lessonId}`;
  const vocab = lessonVocab[key] || lessonVocab["hsk1-1"] || [];
  const title = lessonTitles[key] || { chinese: "课文", english: "LESSON" };

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Study", to: "/course" },
          { label: (level || "hsk1").toUpperCase(), to: `/course/${level}` },
          { label: "LESSON" },
          { label: lessonId || "1" },
        ]}
      />

      {/* Lesson Header */}
      <div className="brutalist-card rounded-xl bg-card p-4 mb-6 flex items-center justify-between">
        <Link
          to={`/course/${level}`}
          className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="text-center">
          <p className="font-bold font-mono text-lg">第{lessonId}课</p>
          <p className="text-xs text-muted-foreground font-mono">
            {title.chinese} - {title.english}
          </p>
        </div>
        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-mono text-xs font-bold brutalist-border flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <CheckCircle2 size={14} /> Mark Complete
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
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

      {/* Tab Content */}
      {activeTab === "vocabulary" && (
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
              <div
                key={i}
                className={`flex items-center p-5 ${i !== vocab.length - 1 ? "border-b-2 border-border" : ""} hover:bg-muted/50 transition-colors`}
              >
                <span className="text-xs text-muted-foreground font-mono w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-3xl font-bold">{word.chinese}</span>
                  {showPinyin && (
                    <span className="text-sm text-muted-foreground">{word.pinyin}</span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm">{word.english}</p>
                  <p className="text-xs text-muted-foreground uppercase font-mono">{word.type}</p>
                </div>
                <button className="ml-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors shrink-0">
                  <Volume2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab !== "vocabulary" && (
        <div className="brutalist-card rounded-xl bg-card p-12 text-center">
          <p className="text-4xl mb-4">🚧</p>
          <p className="font-bold font-mono text-lg">COMING SOON</p>
          <p className="text-sm text-muted-foreground mt-1">
            This section is under development.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonDetailPage;
