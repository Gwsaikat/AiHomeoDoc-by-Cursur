-- Create AI consultations table to store records of AI doctor consultations
CREATE TABLE IF NOT EXISTS public.ai_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  analysis_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own consultation records
CREATE POLICY "Users can view own consultations"
  ON public.ai_consultations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own consultation records
CREATE POLICY "Users can insert own consultations"
  ON public.ai_consultations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own consultation records
CREATE POLICY "Users can update own consultations"
  ON public.ai_consultations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_consultations_updated_at
BEFORE UPDATE ON public.ai_consultations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 