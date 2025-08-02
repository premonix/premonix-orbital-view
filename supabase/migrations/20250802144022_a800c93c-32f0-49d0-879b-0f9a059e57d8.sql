-- Create data source configurations table
CREATE TABLE public.data_sources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'api', 'rss', 'webhook', 'file'
    endpoint_url TEXT,
    api_key_name TEXT, -- Reference to Supabase secret name
    refresh_interval_minutes INTEGER NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT true,
    configuration JSONB NOT NULL DEFAULT '{}',
    last_fetch_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- Create policies for data sources (service role only)
CREATE POLICY "Service role can manage data sources" 
ON public.data_sources 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create data ingestion logs table
CREATE TABLE public.data_ingestion_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    data_source_id UUID NOT NULL REFERENCES public.data_sources(id),
    status TEXT NOT NULL, -- 'started', 'completed', 'failed'
    records_processed INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.data_ingestion_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for ingestion logs
CREATE POLICY "Service role can manage ingestion logs" 
ON public.data_ingestion_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create trigger for data sources updated_at
CREATE TRIGGER update_data_sources_updated_at
    BEFORE UPDATE ON public.data_sources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data sources configuration
INSERT INTO public.data_sources (name, source_type, endpoint_url, api_key_name, refresh_interval_minutes, configuration) VALUES
('NewsAPI Threat Feed', 'api', 'https://newsapi.org/v2/everything', 'NEWSAPI_KEY', 30, 
 '{"query": "cyber attack OR data breach OR ransomware OR threat intelligence", "language": "en", "sortBy": "publishedAt", "pageSize": 50}'::jsonb),
 
('MISP Threat Intelligence', 'api', 'https://www.circl.lu/doc/misp/automation/', 'MISP_API_KEY', 60,
 '{"format": "json", "type": "json", "last": "1d"}'::jsonb),

('AlienVault OTX', 'api', 'https://otx.alienvault.com/api/v1/pulses/subscribed', 'OTX_API_KEY', 45,
 '{"modified_since": "2024-01-01T00:00:00", "limit": 50}'::jsonb),

('Threat Connect API', 'api', 'https://api.threatconnect.com/api/rest/v2/indicators', 'THREATCONNECT_API_KEY', 90,
 '{"resultLimit": 100, "modifiedSince": "7 days ago"}'::jsonb),

('RSS Feed - Security Week', 'rss', 'https://www.securityweek.com/feed', NULL, 120,
 '{"category_mapping": {"cyber": "Cyber", "breach": "Cyber", "attack": "Military"}}'::jsonb),

('RSS Feed - Krebs on Security', 'rss', 'https://krebsonsecurity.com/feed/', NULL, 180,
 '{"category_mapping": {"fraud": "Economic", "malware": "Cyber", "breach": "Cyber"}}'::jsonb);