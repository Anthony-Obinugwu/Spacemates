-- Create conversations table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation_participants table
CREATE TABLE public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reports table (Trust & Safety)
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('USER', 'LISTING', 'MESSAGE')),
  target_id UUID NOT NULL, -- Generic target ID
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for messages
-- This allows clients to listen to changes on the messages table via WebSockets
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Conversations Policies
CREATE POLICY "Participants can view their conversations"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = id AND cp.user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Conversation Participants Policies
CREATE POLICY "Participants can view other participants in their conversation"
  ON public.conversation_participants FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()) OR user_id = auth.uid()
  );

CREATE POLICY "Authenticated users can join conversations"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Participants can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid())
  );

CREATE POLICY "Participants can insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()) AND sender_id = auth.uid()
  );

-- Reports Policies
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Data Retention (pg_cron)
-- Schedule the hard deletion job to strictly enforce data retention
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA extensions;

  -- Deletes profiles where account_status is 'DELETED' and hasn't been updated in 30 days.
  -- Cascade constraints handle the deletion of their messages, properties, etc.
  PERFORM cron.schedule(
    'enforce-data-retention-30d',
    '0 0 * * *', -- Everyday at midnight
    $cron$
      DELETE FROM public.profiles 
      WHERE account_status = 'DELETED' 
      AND updated_at < NOW() - INTERVAL '30 days';
    $cron$
  );
EXCEPTION
  WHEN undefined_object THEN
    RAISE NOTICE 'pg_cron extension not available. Skipping cron job scheduling.';
END $$;
