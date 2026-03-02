import { useParams, Link } from "react-router-dom";
import { Volume2, BookOpen, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const courseData: Record<string, {
  level: number;
  label: string;
  sublabel: string;
  color: string;
  words: number;
  lessons: { id: number; chinese: string; english: string; words: number; grammar: number }[];
}> = {
  hsk1: {
    level: 1, label: "BEGINNER LEVEL", sublabel: "Beginner", color: "bg-card-mint", words: 150,
    lessons: [
      { id: 1, chinese: "你好", english: "Hello", words: 8, grammar: 2 },
      { id: 2, chinese: "谢谢你", english: "Thank You", words: 4, grammar: 1 },
      { id: 3, chinese: "你叫什么名字", english: "What's your name", words: 11, grammar: 2 },
      { id: 4, chinese: "她是我的汉语老师", english: "She is my Chinese teacher", words: 10, grammar: 3 },
      { id: 5, chinese: "她女儿今年二十岁", english: "Her daughter is 20 years old this year", words: 9, grammar: 3 },
      { id: 6, chinese: "我会说汉语", english: "I can speak Chinese", words: 12, grammar: 2 },
      { id: 7, chinese: "今天几号", english: "What's the date today?", words: 10, grammar: 2 },
      { id: 8, chinese: "我想喝茶", english: "I'd like some tea", words: 15, grammar: 3 },
      { id: 9, chinese: "你儿子在哪儿工作", english: "Where does your son work?", words: 10, grammar: 3 },
      { id: 10, chinese: "我能坐这儿吗", english: "May I sit here?", words: 13, grammar: 3 },
      { id: 11, chinese: "现在几点", english: "What Time Is It Now", words: 11, grammar: 2 },
      { id: 12, chinese: "明天天气怎么样", english: "How Is the Weather Tomorrow", words: 10, grammar: 2 },
      { id: 13, chinese: "他在学做中国菜呢", english: "He is learning to cook Chinese food", words: 8, grammar: 3 },
      { id: 14, chinese: "她买了不少衣服", english: "She bought a lot of clothes", words: 11, grammar: 3 },
      { id: 15, chinese: "我是坐飞机来的", english: "I came by plane", words: 12, grammar: 2 },
    ],
  },
  hsk2: {
    level: 2, label: "ELEMENTARY LEVEL", sublabel: "Basic", color: "bg-card-salmon", words: 300,
    lessons: [
      { id: 1, chinese: "九月去北京旅游", english: "Travel to Beijing in September", words: 12, grammar: 3 },
      { id: 2, chinese: "我每天六点起床", english: "I get up at 6 every day", words: 10, grammar: 2 },
      { id: 3, chinese: "左边那个红色的", english: "The red one on the left", words: 11, grammar: 3 },
      { id: 4, chinese: "这个工作是他帮我介绍的", english: "He helped me find this job", words: 14, grammar: 3 },
      { id: 5, chinese: "就买这件吧", english: "Let's buy this one", words: 10, grammar: 2 },
      { id: 6, chinese: "你怎么不吃了", english: "Why did you stop eating?", words: 8, grammar: 2 },
      { id: 7, chinese: "你家离公司远吗", english: "Is your home far from the office?", words: 12, grammar: 3 },
      { id: 8, chinese: "让我想想再告诉你", english: "Let me think and tell you later", words: 11, grammar: 3 },
      { id: 9, chinese: "题太多了", english: "Too many questions", words: 9, grammar: 2 },
      { id: 10, chinese: "别找了", english: "Stop looking", words: 10, grammar: 2 },
    ],
  },
  hsk3: {
    level: 3, label: "INTERMEDIATE LEVEL", sublabel: "Intermediate", color: "bg-card-gold", words: 600,
    lessons: [
      { id: 1, chinese: "欢迎你来中国", english: "Welcome to China", words: 15, grammar: 4 },
      { id: 2, chinese: "我打算去旅游", english: "I plan to travel", words: 12, grammar: 3 },
      { id: 3, chinese: "桌子上放着很多饮料", english: "There are many drinks on the table", words: 14, grammar: 4 },
      { id: 4, chinese: "她总是笑着跟客人说话", english: "She always talks to customers with a smile", words: 16, grammar: 4 },
      { id: 5, chinese: "我想起来了", english: "I remember now", words: 11, grammar: 3 },
    ],
  },
  hsk4: {
    level: 4, label: "UPPER INTERMEDIATE", sublabel: "Advanced", color: "bg-card-coral", words: 1200,
    lessons: [
      { id: 1, chinese: "简单的爱情", english: "Simple Love", words: 20, grammar: 5 },
      { id: 2, chinese: "留个纪念", english: "Keep as a souvenir", words: 18, grammar: 4 },
      { id: 3, chinese: "不要担心", english: "Don't worry", words: 15, grammar: 4 },
    ],
  },
  hsk5: {
    level: 5, label: "ADVANCED LEVEL", sublabel: "Fluent", color: "bg-card-teal", words: 2500,
    lessons: [
      { id: 1, chinese: "爱的细节", english: "Details of Love", words: 25, grammar: 6 },
      { id: 2, chinese: "留住美好", english: "Preserve the Beautiful", words: 22, grammar: 5 },
    ],
  },
};

const CourseDetailPage = () => {
  const { level } = useParams();
  const course = courseData[level || "hsk1"] || courseData.hsk1;

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Study", to: "/course" }, { label: `HSK${course.level}` }]} />

      {/* Hero Banner */}
      <div className={`${course.color} rounded-2xl p-8 brutalist-border mb-8 relative overflow-hidden`}>
        <span className="retro-tag text-foreground/70 border-foreground/30 mb-3 inline-block">
          ● {course.label}
        </span>
        <h1 className="text-6xl font-bold text-foreground/20 font-mono lowercase">hsk{course.level}</h1>
        <p className="text-foreground/70 mt-2">
          Master the first {course.words} words and basic grammar structures.
        </p>
        {/* Decorative watermark */}
        <span className="absolute right-8 top-4 text-[8rem] font-bold text-foreground/5 font-mono leading-none select-none">
          漢
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Lesson List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BookOpen size={20} className="text-primary" /> Course Curriculum
            </h2>
            <span className="text-sm text-muted-foreground font-mono">0 / {course.lessons.length} Completed</span>
          </div>

          <div className="space-y-3">
            {course.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/course/${level}/lesson/${lesson.id}`}
                className="brutalist-card rounded-xl bg-card p-5 flex items-center gap-4 hover:bg-muted transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-mono text-sm brutalist-border shrink-0">
                  {lesson.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">
                    <span className="text-foreground/80">{lesson.chinese}</span>
                    <span className="text-muted-foreground ml-2">{lesson.english}</span>
                  </p>
                  <p className="text-xs font-mono text-muted-foreground uppercase mt-1">
                    {lesson.words} WORDS • {lesson.grammar} GRAMMAR
                  </p>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-5">
          {/* Mock Exam Card */}
          <div className="brutalist-card rounded-xl bg-secondary p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={20} className="text-secondary-foreground" />
              <h3 className="font-bold font-mono text-secondary-foreground">Mock Exam</h3>
            </div>
            <p className="text-xs text-secondary-foreground/70 uppercase font-mono mb-1">TEST READINESS</p>
            <p className="text-sm text-secondary-foreground/80 mt-2">
              Take a full-length simulated exam to evaluate your mastery of HSK {course.level}.
            </p>
            <Link
              to="/mock-test"
              className="block mt-4 text-center bg-card text-foreground font-bold text-sm py-2.5 rounded-lg brutalist-border hover:bg-muted transition-colors"
            >
              Start Exam
            </Link>
          </div>

          {/* Focus Areas */}
          <div className="brutalist-card rounded-xl bg-card p-6">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Volume2 size={16} className="text-primary" /> Focus Areas
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span>Vocabulary</span>
                  <span className="text-primary">15%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span>Grammar</span>
                  <span className="text-primary">0%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <Link to={`/course/${level}/vocabulary`} className="brutalist-border rounded-lg p-3 text-center hover:bg-muted transition-colors">
                <p className="text-2xl mb-1">🧠</p>
                <p className="text-xs font-mono">Flashcards</p>
              </Link>
              <Link to={`/course/${level}/grammar`} className="brutalist-border rounded-lg p-3 text-center hover:bg-muted transition-colors">
                <p className="text-2xl mb-1">📖</p>
                <p className="text-xs font-mono">Grammar</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
