-- Fix security warnings: Update database functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.update_dashboard_analytics(p_user_id uuid, p_action text, p_category text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_dashboard_analytics (user_id, date, threats_viewed, alerts_triggered, dashboard_visits, most_viewed_category)
  VALUES (
    p_user_id,
    CURRENT_DATE,
    CASE WHEN p_action = 'threat_viewed' THEN 1 ELSE 0 END,
    CASE WHEN p_action = 'alert_triggered' THEN 1 ELSE 0 END,
    CASE WHEN p_action = 'dashboard_visit' THEN 1 ELSE 0 END,
    p_category
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    threats_viewed = user_dashboard_analytics.threats_viewed + CASE WHEN p_action = 'threat_viewed' THEN 1 ELSE 0 END,
    alerts_triggered = user_dashboard_analytics.alerts_triggered + CASE WHEN p_action = 'alert_triggered' THEN 1 ELSE 0 END,
    dashboard_visits = user_dashboard_analytics.dashboard_visits + CASE WHEN p_action = 'dashboard_visit' THEN 1 ELSE 0 END,
    most_viewed_category = CASE WHEN p_action = 'threat_viewed' AND p_category IS NOT NULL THEN p_category ELSE user_dashboard_analytics.most_viewed_category END,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = get_user_role.user_id 
  ORDER BY 
    CASE role
      WHEN 'enterprise' THEN 4
      WHEN 'business' THEN 3
      WHEN 'registered' THEN 2
      WHEN 'guest' THEN 1
    END DESC
  LIMIT 1;
$function$;

-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule signal ingestion to run every 30 minutes
SELECT cron.schedule(
  'signal-ingestion-job',
  '*/30 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://eydehwbjzpanyzzshgyd.supabase.co/functions/v1/signal-ingestion',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZGVod2JqenBhbnl6enNoZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTkwNTgsImV4cCI6MjA2NDQ5NTA1OH0.Z10WSK7wpShUcOPXK1Qa8qlITuf_CsMpdQnyNWvFCXI"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Create monitoring tables
CREATE TABLE IF NOT EXISTS public.system_health_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('healthy', 'warning', 'error')),
  response_time_ms integer,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  checked_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.data_pipeline_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('started', 'success', 'failed', 'retrying')),
  records_processed integer DEFAULT 0,
  error_message text,
  execution_time_ms integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on monitoring tables
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_pipeline_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage monitoring data
CREATE POLICY "Service role can manage health logs" 
ON public.system_health_logs 
FOR ALL 
USING (auth.role() = 'service_role'::text);

CREATE POLICY "Service role can manage pipeline logs" 
ON public.data_pipeline_logs 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_health_logs_service_time ON public.system_health_logs(service_name, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_pipeline_logs_pipeline_time ON public.data_pipeline_logs(pipeline_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_signals_timestamp ON public.threat_signals(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_threat_signals_location ON public.threat_signals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_threat_signals_category_severity ON public.threat_signals(category, severity);