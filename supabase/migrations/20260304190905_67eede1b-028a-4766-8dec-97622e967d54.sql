
-- HSK Lessons table
CREATE TABLE public.hsk_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level integer NOT NULL CHECK (level >= 1 AND level <= 6),
  lesson_number integer NOT NULL,
  title_chinese text NOT NULL,
  title_english text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(level, lesson_number)
);

-- Vocabulary table
CREATE TABLE public.vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES public.hsk_lessons(id) ON DELETE CASCADE NOT NULL,
  chinese text NOT NULL,
  pinyin text NOT NULL,
  english text NOT NULL,
  word_type text NOT NULL DEFAULT 'noun',
  sort_order integer NOT NULL DEFAULT 0
);

-- Grammar points table
CREATE TABLE public.grammar_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES public.hsk_lessons(id) ON DELETE CASCADE NOT NULL,
  structure text NOT NULL,
  explanation text NOT NULL,
  example_chinese text NOT NULL,
  example_pinyin text NOT NULL,
  example_english text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Dialogues table
CREATE TABLE public.dialogues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES public.hsk_lessons(id) ON DELETE CASCADE NOT NULL,
  speaker text NOT NULL,
  chinese text NOT NULL,
  pinyin text NOT NULL,
  english text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Reading practice table
CREATE TABLE public.reading_practice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES public.hsk_lessons(id) ON DELETE CASCADE NOT NULL,
  chinese text NOT NULL,
  pinyin text NOT NULL,
  english text NOT NULL
);

-- Exercises table
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES public.hsk_lessons(id) ON DELETE CASCADE NOT NULL,
  exercise_type text NOT NULL,
  question text NOT NULL,
  options jsonb,
  correct_answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.hsk_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Public read access for all curriculum tables
CREATE POLICY "Public read access" ON public.hsk_lessons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.grammar_points FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.dialogues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.reading_practice FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.exercises FOR SELECT USING (true);

-- Admin write access for all curriculum tables
CREATE POLICY "Admin write access" ON public.hsk_lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write access" ON public.vocabulary FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write access" ON public.grammar_points FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write access" ON public.dialogues FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write access" ON public.reading_practice FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin write access" ON public.exercises FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
