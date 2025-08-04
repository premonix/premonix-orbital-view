-- Enable real-time updates for threat_signals table
ALTER TABLE public.threat_signals REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
BEGIN;
  -- Remove from publication if it exists (to avoid errors)
  SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'threat_signals';
  
  -- Add threat_signals to the realtime publication  
  ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_signals;
COMMIT;