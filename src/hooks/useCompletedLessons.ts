import { useState, useCallback } from "react";

const STORAGE_KEY = "hsk-completed-lessons";

const getCompleted = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const useCompletedLessons = () => {
  const [completed, setCompleted] = useState<Record<string, boolean>>(getCompleted);

  const toggleComplete = useCallback((level: string, lessonId: number) => {
    const key = `${level}-${lessonId}`;
    setCompleted((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (level: string, lessonId: number) => !!completed[`${level}-${lessonId}`],
    [completed]
  );

  const completedCount = useCallback(
    (level: string, total: number) => {
      let count = 0;
      for (let i = 1; i <= total; i++) {
        if (completed[`${level}-${i}`]) count++;
      }
      return count;
    },
    [completed]
  );

  return { isCompleted, toggleComplete, completedCount };
};
