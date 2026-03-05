
-- Create plan enum
CREATE TYPE public.user_plan AS ENUM ('free', 'pro');

-- Create user_plans table
CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan public.user_plan NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Users can read their own plan
CREATE POLICY "Users can read own plan" ON public.user_plans
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all plans
CREATE POLICY "Admins can manage plans" ON public.user_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public can read (for checking plan without auth edge cases)
CREATE POLICY "Public read own plan" ON public.user_plans
  FOR SELECT TO anon
  USING (false);

-- Auto-assign free plan on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_plan()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_plans (user_id, plan)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_plan();

-- Update timestamp trigger
CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert free plan for existing users who don't have one
INSERT INTO public.user_plans (user_id, plan)
SELECT id, 'free' FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_plans);
