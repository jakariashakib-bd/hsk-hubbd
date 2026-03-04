import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { VocabWord, LessonData } from "@/data/hsk1-lessons";

// Fetch all lessons for a level with their vocabulary
export const useHskLessons = (level: number) => {
  return useQuery({
    queryKey: ["hsk-lessons", level],
    queryFn: async (): Promise<LessonData[]> => {
      const { data: lessons, error } = await supabase
        .from("hsk_lessons")
        .select("id, lesson_number, title_chinese, title_english")
        .eq("level", level)
        .order("lesson_number");

      if (error) throw error;
      if (!lessons || lessons.length === 0) return [];

      const lessonIds = lessons.map((l) => l.id);
      const { data: vocab, error: vocabError } = await supabase
        .from("vocabulary")
        .select("lesson_id, chinese, pinyin, english, word_type, sort_order")
        .in("lesson_id", lessonIds)
        .order("sort_order");

      if (vocabError) throw vocabError;

      const vocabMap = new Map<string, VocabWord[]>();
      (vocab || []).forEach((v) => {
        const arr = vocabMap.get(v.lesson_id) || [];
        arr.push({ chinese: v.chinese, pinyin: v.pinyin, english: v.english, type: v.word_type });
        vocabMap.set(v.lesson_id, arr);
      });

      return lessons.map((l) => ({
        id: l.lesson_number,
        chinese: l.title_chinese,
        english: l.title_english,
        vocab: vocabMap.get(l.id) || [],
        _dbId: l.id, // keep DB id for sub-queries
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch lesson count per level for CoursePage
export const useHskLevelCounts = () => {
  return useQuery({
    queryKey: ["hsk-level-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hsk_lessons")
        .select("level, id");

      if (error) throw error;

      const counts: Record<number, number> = {};
      (data || []).forEach((row) => {
        counts[row.level] = (counts[row.level] || 0) + 1;
      });
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Extended lesson data for LessonDetailPage
export interface GrammarPoint {
  structure: string;
  explanation: string;
  example_chinese: string;
  example_pinyin: string;
  example_english: string;
}

export interface DialogueLine {
  speaker: string;
  chinese: string;
  pinyin: string;
  english: string;
}

export interface ReadingPassage {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface Exercise {
  exercise_type: string;
  question: string;
  correct_answer: string;
  options: string[] | null;
}

export const useHskLessonDetail = (level: number, lessonNumber: number) => {
  return useQuery({
    queryKey: ["hsk-lesson-detail", level, lessonNumber],
    queryFn: async () => {
      // Get the lesson DB id
      const { data: lesson, error: lessonError } = await supabase
        .from("hsk_lessons")
        .select("id, lesson_number, title_chinese, title_english")
        .eq("level", level)
        .eq("lesson_number", lessonNumber)
        .maybeSingle();

      if (lessonError) throw lessonError;
      if (!lesson) return null;

      const lid = lesson.id;

      // Fetch all related data in parallel
      const [vocabRes, grammarRes, dialogueRes, readingRes, exerciseRes] = await Promise.all([
        supabase.from("vocabulary").select("*").eq("lesson_id", lid).order("sort_order"),
        supabase.from("grammar_points").select("*").eq("lesson_id", lid).order("sort_order"),
        supabase.from("dialogues").select("*").eq("lesson_id", lid).order("sort_order"),
        supabase.from("reading_practice").select("*").eq("lesson_id", lid),
        supabase.from("exercises").select("*").eq("lesson_id", lid).order("sort_order"),
      ]);

      return {
        id: lesson.lesson_number,
        chinese: lesson.title_chinese,
        english: lesson.title_english,
        vocab: (vocabRes.data || []).map((v) => ({
          chinese: v.chinese,
          pinyin: v.pinyin,
          english: v.english,
          type: v.word_type,
        })) as VocabWord[],
        grammar: (grammarRes.data || []).map((g) => ({
          structure: g.structure,
          explanation: g.explanation,
          example_chinese: g.example_chinese,
          example_pinyin: g.example_pinyin,
          example_english: g.example_english,
        })) as GrammarPoint[],
        dialogues: (dialogueRes.data || []).map((d) => ({
          speaker: d.speaker,
          chinese: d.chinese,
          pinyin: d.pinyin,
          english: d.english,
        })) as DialogueLine[],
        reading: (readingRes.data || []).map((r) => ({
          chinese: r.chinese,
          pinyin: r.pinyin,
          english: r.english,
        })) as ReadingPassage[],
        exercises: (exerciseRes.data || []).map((e) => ({
          exercise_type: e.exercise_type,
          question: e.question,
          correct_answer: e.correct_answer,
          options: e.options as string[] | null,
        })) as Exercise[],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
