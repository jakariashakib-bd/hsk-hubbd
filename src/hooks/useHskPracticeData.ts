import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Grammar points for a level
export const useHskGrammar = (level: number) => {
  return useQuery({
    queryKey: ["hsk-grammar", level],
    queryFn: async () => {
      // Get all lesson IDs for this level
      const { data: lessons, error: lErr } = await supabase
        .from("hsk_lessons")
        .select("id")
        .eq("level", level);
      if (lErr) throw lErr;
      if (!lessons?.length) return [];

      const ids = lessons.map((l) => l.id);
      const { data, error } = await supabase
        .from("grammar_points")
        .select("*")
        .in("lesson_id", ids)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Dialogues grouped by lesson for listening practice
export const useHskListening = (level: number) => {
  return useQuery({
    queryKey: ["hsk-listening", level],
    queryFn: async () => {
      const { data: lessons, error: lErr } = await supabase
        .from("hsk_lessons")
        .select("id, lesson_number, title_english")
        .eq("level", level)
        .order("lesson_number");
      if (lErr) throw lErr;
      if (!lessons?.length) return [];

      const ids = lessons.map((l) => l.id);
      const { data: dialogues, error } = await supabase
        .from("dialogues")
        .select("*")
        .in("lesson_id", ids)
        .order("sort_order");
      if (error) throw error;

      // Group by lesson
      const map = new Map<string, { speaker: string; chinese: string; pinyin: string; english: string }[]>();
      (dialogues || []).forEach((d) => {
        const arr = map.get(d.lesson_id) || [];
        arr.push({ speaker: d.speaker, chinese: d.chinese, pinyin: d.pinyin, english: d.english });
        map.set(d.lesson_id, arr);
      });

      return lessons
        .filter((l) => map.has(l.id))
        .map((l) => ({
          lessonId: l.id,
          lessonNumber: l.lesson_number,
          lessonTitle: l.title_english,
          lines: map.get(l.id) || [],
        }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Reading passages grouped by lesson
export const useHskReading = (level: number) => {
  return useQuery({
    queryKey: ["hsk-reading", level],
    queryFn: async () => {
      const { data: lessons, error: lErr } = await supabase
        .from("hsk_lessons")
        .select("id, lesson_number, title_english")
        .eq("level", level)
        .order("lesson_number");
      if (lErr) throw lErr;
      if (!lessons?.length) return [];

      const ids = lessons.map((l) => l.id);
      const { data: readings, error } = await supabase
        .from("reading_practice")
        .select("*")
        .in("lesson_id", ids);
      if (error) throw error;

      const map = new Map<string, { chinese: string; pinyin: string; english: string }[]>();
      (readings || []).forEach((r) => {
        const arr = map.get(r.lesson_id) || [];
        arr.push({ chinese: r.chinese, pinyin: r.pinyin, english: r.english });
        map.set(r.lesson_id, arr);
      });

      return lessons
        .filter((l) => map.has(l.id))
        .map((l) => ({
          lessonId: l.id,
          lessonNumber: l.lesson_number,
          lessonTitle: l.title_english,
          passages: map.get(l.id) || [],
        }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// All vocabulary for writing practice
export const useHskWritingVocab = (level: number) => {
  return useQuery({
    queryKey: ["hsk-writing-vocab", level],
    queryFn: async () => {
      const { data: lessons, error: lErr } = await supabase
        .from("hsk_lessons")
        .select("id")
        .eq("level", level);
      if (lErr) throw lErr;
      if (!lessons?.length) return [];

      const ids = lessons.map((l) => l.id);
      const { data, error } = await supabase
        .from("vocabulary")
        .select("chinese, pinyin, english, bangla")
        .in("lesson_id", ids)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
