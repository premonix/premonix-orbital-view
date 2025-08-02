-- Create user dashboard preferences table
CREATE TABLE public.user_dashboard_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dashboard_layout JSONB DEFAULT '{"widgets": [{"id": "threat-overview", "type": "threat-overview", "position": {"x": 0, "y": 0, "w": 6, "h": 4}}, {"id": "recent-alerts", "type": "recent-alerts", "position": {"x": 6, "y": 0, "w": 6, "h": 4}}, {"id": "threat-map", "type": "threat-map", "position": {"x": 0, "y": 4, "w": 12, "h": 6}}]}',
  location_preferences JSONB DEFAULT '{"monitored_locations": [], "radius_km": 100}',
  alert_preferences JSONB DEFAULT '{"categories": ["Military", "Cyber", "Economic"], "severity_threshold": "medium", "email_enabled": true, "push_enabled": false}',
  theme_preferences JSONB DEFAULT '{"theme": "dark", "compact_mode": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_dashboard_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own dashboard preferences" 
ON public.user_dashboard_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboard preferences" 
ON public.user_dashboard_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard preferences" 
ON public.user_dashboard_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user alerts table for personalized notifications
CREATE TABLE public.user_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  threat_signal_id UUID REFERENCES public.threat_signals(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('proximity', 'severity', 'category', 'custom')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for user alerts
CREATE POLICY "Users can view their own alerts" 
ON public.user_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
ON public.user_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user dashboard analytics table
CREATE TABLE public.user_dashboard_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  threats_viewed INTEGER DEFAULT 0,
  alerts_triggered INTEGER DEFAULT 0,
  dashboard_visits INTEGER DEFAULT 0,
  most_viewed_category TEXT,
  avg_session_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.user_dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Users can view their own analytics" 
ON public.user_dashboard_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage analytics" 
ON public.user_dashboard_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update dashboard analytics
CREATE OR REPLACE FUNCTION public.update_dashboard_analytics(
  p_user_id UUID,
  p_action TEXT,
  p_category TEXT DEFAULT NULL
)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some sample threat data for testing
INSERT INTO public.threat_signals (
  timestamp, latitude, longitude, country, region, category, severity, 
  title, summary, source_name, threat_score, confidence, escalation_potential, tags
) VALUES 
  (now() - interval '2 hours', 51.5074, -0.1278, 'United Kingdom', 'London', 'Cyber', 'high', 
   'Critical Infrastructure Cyber Attack', 'Sophisticated cyber attack targeting financial institutions in London', 
   'NCSC', 85, 92, 75, ARRAY['finance', 'infrastructure', 'nation-state']),
  (now() - interval '4 hours', 40.7128, -74.0060, 'United States', 'New York', 'Economic', 'medium', 
   'Market Volatility Alert', 'Significant market movements detected in financial sector', 
   'Bloomberg Terminal', 65, 78, 45, ARRAY['markets', 'volatility', 'finance']),
  (now() - interval '6 hours', 48.8566, 2.3522, 'France', 'Paris', 'Diplomatic', 'medium', 
   'Trade Negotiation Tensions', 'Ongoing trade disputes affecting European markets', 
   'Reuters', 55, 70, 35, ARRAY['trade', 'diplomacy', 'europe']),
  (now() - interval '8 hours', 35.6762, 139.6503, 'Japan', 'Tokyo', 'Supply Chain', 'high', 
   'Semiconductor Supply Disruption', 'Major disruption in semiconductor supply chain affecting global tech sector', 
   'Nikkei', 80, 88, 70, ARRAY['semiconductors', 'supply-chain', 'technology']),
  (now() - interval '12 hours', 52.5200, 13.4050, 'Germany', 'Berlin', 'Military', 'low', 
   'NATO Training Exercise', 'Routine NATO training exercises in Eastern Europe', 
   'Defense News', 25, 95, 10, ARRAY['nato', 'training', 'defense']);

-- Add triggers for timestamp updates
CREATE TRIGGER update_user_dashboard_preferences_updated_at
BEFORE UPDATE ON public.user_dashboard_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_dashboard_analytics_updated_at
BEFORE UPDATE ON public.user_dashboard_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();