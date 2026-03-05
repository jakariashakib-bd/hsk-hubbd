
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS bangla text;
ALTER TABLE public.grammar_points ADD COLUMN IF NOT EXISTS explanation_bangla text;
ALTER TABLE public.grammar_points ADD COLUMN IF NOT EXISTS example_bangla text;
ALTER TABLE public.dialogues ADD COLUMN IF NOT EXISTS bangla text;
ALTER TABLE public.reading_practice ADD COLUMN IF NOT EXISTS bangla text;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS question_bangla text;
