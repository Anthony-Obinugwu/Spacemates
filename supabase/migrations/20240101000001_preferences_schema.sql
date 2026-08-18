-- Create preference questions table
CREATE TABLE public.preference_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANGE', 'BOOLEAN')),
  weight INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true
);

-- Create preference options table
CREATE TABLE public.preference_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.preference_questions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Create user preferences junction table
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.preference_questions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  importance INTEGER DEFAULT 1,
  is_dealbreaker BOOLEAN DEFAULT false,
  PRIMARY KEY (user_id, question_id)
);

-- Enable RLS
ALTER TABLE public.preference_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preference_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for public view access
CREATE POLICY "Preference questions are viewable by everyone."
  ON public.preference_questions FOR SELECT
  USING ( true );

CREATE POLICY "Preference options are viewable by everyone."
  ON public.preference_options FOR SELECT
  USING ( true );

-- Policies for user_preferences
CREATE POLICY "Users can view their own preferences."
  ON public.user_preferences FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own preferences."
  ON public.user_preferences FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own preferences."
  ON public.user_preferences FOR UPDATE
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- Seed Data for Preference Questions and Options
DO $$ 
DECLARE
  q_clean UUID := gen_random_uuid();
  q_sleep UUID := gen_random_uuid();
  q_pets UUID := gen_random_uuid();
  q_guests UUID := gen_random_uuid();
BEGIN
  -- Insert Questions
  INSERT INTO public.preference_questions (id, key, question, category, answer_type, weight) VALUES
    (q_clean, 'cleanliness', 'How clean do you keep your living space?', 'LIFESTYLE', 'SINGLE_CHOICE', 5),
    (q_sleep, 'sleep_schedule', 'What is your typical sleep schedule?', 'LIFESTYLE', 'SINGLE_CHOICE', 4),
    (q_pets, 'pets', 'Do you have or are you okay with pets?', 'LIFESTYLE', 'SINGLE_CHOICE', 5),
    (q_guests, 'guests', 'How often do you have guests over?', 'LIFESTYLE', 'SINGLE_CHOICE', 3);

  -- Insert Options: Cleanliness
  INSERT INTO public.preference_options (question_id, value, label, sort_order) VALUES
    (q_clean, 'NEAT_FREAK', 'Very clean and organized', 1),
    (q_clean, 'AVERAGE', 'Average cleanliness', 2),
    (q_clean, 'MESSY', 'A bit messy but manageable', 3);

  -- Insert Options: Sleep Schedule
  INSERT INTO public.preference_options (question_id, value, label, sort_order) VALUES
    (q_sleep, 'EARLY_BIRD', 'Early bird (before 10 PM)', 1),
    (q_sleep, 'NIGHT_OWL', 'Night owl (after midnight)', 2),
    (q_sleep, 'FLEXIBLE', 'Flexible / Varies', 3);

  -- Insert Options: Pets
  INSERT INTO public.preference_options (question_id, value, label, sort_order) VALUES
    (q_pets, 'HAVE_PETS', 'I have pets', 1),
    (q_pets, 'OKAY_WITH_PETS', 'I don''t have pets but I''m okay with them', 2),
    (q_pets, 'NO_PETS', 'No pets allowed / Allergic', 3);

  -- Insert Options: Guests
  INSERT INTO public.preference_options (question_id, value, label, sort_order) VALUES
    (q_guests, 'OFTEN', 'Often (several times a week)', 1),
    (q_guests, 'SOMETIMES', 'Sometimes (weekends mainly)', 2),
    (q_guests, 'RARELY', 'Rarely / Never', 3);
END $$;
