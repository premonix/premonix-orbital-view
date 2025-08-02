-- Create DSS score history table to track improvements over time
CREATE TABLE public.dss_score_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  assessment_data JSONB NOT NULL DEFAULT '{}',
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dss_score_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own DSS history" 
ON public.dss_score_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own DSS scores" 
ON public.dss_score_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dss_score_history_updated_at
BEFORE UPDATE ON public.dss_score_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on user queries
CREATE INDEX idx_dss_score_history_user_id_created_at 
ON public.dss_score_history (user_id, created_at DESC);