import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Brain } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useHskGrammar } from "@/hooks/useHskPracticeData";
import GrammarQuiz from "@/components/GrammarQuiz";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GrammarPracticePage = () => {
  const { level } = useParams();
  const lvl = level || "hsk1";
  const levelNum = parseInt(lvl.replace("hsk", ""));
  const { data: grammarPoints, isLoading } = useHskGrammar(levelNum);
  const [quizMode, setQuizMode] = useState(false);

  if (quizMode && grammarPoints && grammarPoints.length > 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Practice", to: "/practice" },
            { label: lvl.toUpperCase(), to: `/course/${lvl}` },
            { label: "Grammar Quiz" },
          ]}
        />
        <GrammarQuiz
          grammarPoints={grammarPoints}
          onExit={() => setQuizMode(false)}
          levelLabel={lvl.toUpperCase()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Practice", to: "/practice" },
          { label: lvl.toUpperCase(), to: `/course/${lvl}` },
          { label: "Grammar" },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <Link
          to="/practice"
          className="inline-flex items-center gap-2 text-sm font-mono brutalist-border px-3 py-1.5 rounded bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
          SYS.RETURN
        </Link>
        <button
          onClick={() => setQuizMode(true)}
          disabled={!grammarPoints?.length}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 font-mono font-bold text-sm rounded-lg brutalist-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase disabled:opacity-50"
        >
          <Brain size={16} />
          Start Quiz
        </button>
      </div>

      <div className="w-full h-2 bg-foreground rounded-full mb-8 brutalist-border" />

      {/* Hero Banner */}
      <div className="brutalist-card rounded-xl bg-secondary p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/10 rounded-bl-full" />
        <span className="retro-tag text-secondary-foreground border-secondary-foreground inline-block mb-2">
          DIRECTORY ACCESSED
        </span>
        <h1 className="text-3xl md:text-4xl font-bold font-mono text-secondary-foreground">
          &lt;{lvl.toUpperCase()}&gt; GRAMMAR POINTS
        </h1>
        <p className="text-secondary-foreground/80 mt-2 max-w-md">
          Master individual grammar structures to build meaningful sentences.
        </p>
        <button
          onClick={() => setQuizMode(true)}
          disabled={!grammarPoints?.length}
          className="mt-4 inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 font-mono font-bold text-sm rounded-lg brutalist-border hover:opacity-90 transition-opacity uppercase disabled:opacity-50"
        >
          <Brain size={16} />
          Take Quiz
        </button>
      </div>

      {/* Grammar Points Accordion */}
      {isLoading ? (
        <div className="text-center py-12 font-mono text-muted-foreground">Loading grammar points...</div>
      ) : !grammarPoints || grammarPoints.length === 0 ? (
        <div className="brutalist-card rounded-xl bg-card p-8 text-center">
          <p className="font-mono text-muted-foreground">No grammar points available for this level yet.</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
          {grammarPoints.map((gp, index) => (
            <AccordionItem
              key={gp.id}
              value={gp.id}
              className="brutalist-card rounded-xl bg-card overflow-hidden border-none"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-4 text-left">
                  <span className="w-10 h-10 rounded-lg brutalist-border flex items-center justify-center font-mono font-bold text-sm bg-card shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold font-mono text-sm uppercase">{gp.structure}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 line-clamp-1">{gp.explanation}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="border-t-2 border-border pt-4">
                  <p className="text-sm text-foreground/80 mb-4">{gp.explanation}</p>
                  <div className="bg-foreground text-primary-foreground rounded-lg p-3 font-mono text-sm mb-4 brutalist-border">
                    <span className="text-accent text-xs uppercase block mb-1">Sentence Structure</span>
                    {gp.structure}
                  </div>
                  <div className="bg-muted rounded-lg p-4 brutalist-border">
                    <span className="retro-tag text-accent border-accent inline-block mb-3">Example</span>
                    <p className="text-lg font-bold">{gp.example_chinese}</p>
                    <p className="text-sm text-accent font-mono mt-1">/{gp.example_pinyin}/</p>
                    <p className="text-sm text-muted-foreground mt-1">{gp.example_english}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default GrammarPracticePage;
