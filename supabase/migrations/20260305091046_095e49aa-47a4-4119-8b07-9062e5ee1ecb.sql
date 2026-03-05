
CREATE TABLE public.mock_test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level integer NOT NULL,
  test_number integer NOT NULL DEFAULT 1,
  section text NOT NULL, -- 'listening', 'reading', 'writing'
  part text NOT NULL, -- e.g. 'Part 1', 'Part 2'
  question_number integer NOT NULL,
  question_type text NOT NULL, -- 'mcq', 'true_false', 'fill_blank', 'ordering', 'essay'
  passage text, -- dialogue or reading passage
  question text NOT NULL,
  options jsonb, -- ["A option", "B option", "C option", "D option"]
  correct_answer text NOT NULL,
  chinese_text text, -- Chinese character display
  pinyin_text text, -- Pinyin display
  explanation text, -- Answer explanation
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.mock_test_questions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin write access" ON public.mock_test_questions
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_mock_test_level_section ON public.mock_test_questions (level, test_number, section, sort_order);
