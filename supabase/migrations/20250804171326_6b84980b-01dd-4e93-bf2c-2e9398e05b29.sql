-- First add the unique constraint to fix the upsert conflict error in signal ingestion
ALTER TABLE threat_signals 
ADD CONSTRAINT threat_signals_source_url_timestamp_key 
UNIQUE (source_url, timestamp);

-- Add a unique constraint on name for data_sources to allow ON CONFLICT
ALTER TABLE data_sources 
ADD CONSTRAINT data_sources_name_key 
UNIQUE (name);

-- Now add VirusTotal as a new data source
INSERT INTO data_sources (name, source_type, endpoint_url, api_key_name, configuration, refresh_interval_minutes)
VALUES (
  'VirusTotal',
  'api',
  'https://www.virustotal.com/vtapi/v2',
  'VIRUSTOTAL_API_KEY',
  '{
    "endpoints": {
      "url_report": "/url/report",
      "file_report": "/file/report", 
      "domain_report": "/domain/report"
    },
    "categories_to_fetch": ["malicious_urls", "suspicious_domains", "malware_samples"],
    "threat_threshold": 5
  }'::jsonb,
  30
)
ON CONFLICT (name) DO UPDATE SET
  endpoint_url = EXCLUDED.endpoint_url,
  configuration = EXCLUDED.configuration,
  updated_at = now();