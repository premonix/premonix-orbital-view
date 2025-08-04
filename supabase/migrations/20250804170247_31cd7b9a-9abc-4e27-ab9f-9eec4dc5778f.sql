-- Create automated ingestion schedule with pg_cron
-- First enable the extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the signal ingestion to run every 30 minutes
SELECT cron.schedule(
  'automated-threat-signal-ingestion',
  '*/30 * * * *', -- every 30 minutes
  $$
  SELECT
    net.http_post(
      url := 'https://eydehwbjzpanyzzshgyd.supabase.co/functions/v1/signal-ingestion',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZGVod2JqenBhbnl6enNoZ3lkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkxOTA1OCwiZXhwIjoyMDY0NDk1MDU4fQ.J0UNNbD16t3_BQAktjOHLqoGdUJ_vWZhGESwJLhF_iU"}'::jsonb,
      body := '{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Also schedule the main threat-feed-ingestion to run every hour
SELECT cron.schedule(
  'automated-threat-feed-ingestion',
  '0 * * * *', -- every hour at minute 0
  $$
  SELECT
    net.http_post(
      url := 'https://eydehwbjzpanyzzshgyd.supabase.co/functions/v1/threat-feed-ingestion',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZGVod2JqenBhbnl6enNoZ3lkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkxOTA1OCwiZXhwIjoyMDY0NDk1MDU4fQ.J0UNNbD16t3_BQAktjOHLqoGdUJ_vWZhGESwJLhF_iU"}'::jsonb,
      body := '{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);