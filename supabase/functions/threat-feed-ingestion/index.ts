import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataSource {
  id: string;
  name: string;
  source_type: string;
  endpoint_url: string;
  api_key_name: string | null;
  configuration: Record<string, any>;
  refresh_interval_minutes: number;
  is_active: boolean;
}

interface ThreatSignal {
  title: string;
  summary?: string;
  category: string;
  severity: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  threat_score: number;
  confidence: number;
  escalation_potential: number;
  source_name: string;
  source_url?: string;
  tags?: string[];
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting threat feed ingestion process');
    
    // Get all active data sources
    const { data: dataSources, error: sourcesError } = await supabase
      .from('data_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) {
      throw new Error(`Failed to fetch data sources: ${sourcesError.message}`);
    }

    console.log(`Found ${dataSources?.length || 0} active data sources`);

    const results = [];

    for (const source of dataSources || []) {
      try {
        console.log(`Processing source: ${source.name}`);
        
        // Create ingestion log entry
        const { data: logEntry } = await supabase
          .from('data_ingestion_logs')
          .insert({
            data_source_id: source.id,
            status: 'started'
          })
          .select()
          .single();

        const startTime = Date.now();
        let processedData: ThreatSignal[] = [];

        // Process based on source type
        switch (source.source_type) {
          case 'api':
            processedData = await processApiSource(source);
            break;
          case 'rss':
            processedData = await processRSSSource(source);
            break;
          default:
            throw new Error(`Unsupported source type: ${source.source_type}`);
        }

        // Insert threat signals
        let insertedCount = 0;
        if (processedData.length > 0) {
          const { data: insertedSignals, error: insertError } = await supabase
            .from('threat_signals')
            .insert(processedData)
            .select();

          if (insertError) {
            console.error(`Error inserting signals for ${source.name}:`, insertError);
          } else {
            insertedCount = insertedSignals?.length || 0;
            
            // Trigger AI analysis for new threats (async)
            if (insertedSignals && insertedSignals.length > 0) {
              console.log(`Triggering AI analysis for ${insertedSignals.length} new threats`);
              supabase.functions.invoke('ai-threat-analysis', {
                body: {
                  threats: insertedSignals.map(signal => ({
                    id: signal.id,
                    title: signal.title,
                    summary: signal.summary,
                    source_name: signal.source_name,
                    existing_category: signal.category,
                    existing_severity: signal.severity
                  }))
                }
              }).catch(error => {
                console.error('AI analysis trigger failed:', error);
              });

              // Broadcast new threats via real-time stream (async)
              for (const signal of insertedSignals) {
                fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/realtime-threat-stream`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                  },
                  body: JSON.stringify({
                    type: 'broadcast_new_threat',
                    threat: signal
                  })
                }).catch(error => {
                  console.error('Real-time broadcast failed:', error);
                });
              }
            }
          }
        }

        const executionTime = Date.now() - startTime;

        // Update ingestion log
        await supabase
          .from('data_ingestion_logs')
          .update({
            status: 'completed',
            records_processed: processedData.length,
            records_inserted: insertedCount,
            execution_time_ms: executionTime,
            completed_at: new Date().toISOString()
          })
          .eq('id', logEntry?.id);

        // Update data source last fetch time
        await supabase
          .from('data_sources')
          .update({
            last_fetch_at: new Date().toISOString(),
            last_error: null
          })
          .eq('id', source.id);

        results.push({
          source: source.name,
          status: 'success',
          processed: processedData.length,
          inserted: insertedCount,
          execution_time_ms: executionTime
        });

        console.log(`Completed ${source.name}: ${insertedCount}/${processedData.length} signals inserted`);

      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
        
        // Update with error
        await supabase
          .from('data_sources')
          .update({
            last_error: error.message,
            last_fetch_at: new Date().toISOString()
          })
          .eq('id', source.id);

        results.push({
          source: source.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Threat feed ingestion completed',
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Threat feed ingestion failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function processApiSource(source: DataSource): Promise<ThreatSignal[]> {
  const signals: ThreatSignal[] = [];
  
  // Get API key if specified
  let apiKey = null;
  if (source.api_key_name) {
    apiKey = Deno.env.get(source.api_key_name);
    if (!apiKey) {
      throw new Error(`API key ${source.api_key_name} not found in environment`);
    }
  }

  console.log(`Fetching from API: ${source.endpoint_url}`);

  // Build request headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'PREMONIX-ThreatIntel/1.0'
  };

  // Add API key based on common patterns
  if (apiKey) {
    if (source.name.toLowerCase().includes('newsapi')) {
      headers['X-API-Key'] = apiKey;
    } else if (source.name.toLowerCase().includes('otx')) {
      headers['X-OTX-API-KEY'] = apiKey;
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
  }

  // Build URL with query parameters
  let url = source.endpoint_url;
  if (source.configuration && Object.keys(source.configuration).length > 0) {
    const params = new URLSearchParams();
    
    // Handle NewsAPI specific parameters
    if (source.name.toLowerCase().includes('newsapi')) {
      params.append('q', source.configuration.query || 'threat intelligence');
      params.append('language', source.configuration.language || 'en');
      params.append('sortBy', source.configuration.sortBy || 'publishedAt');
      params.append('pageSize', source.configuration.pageSize || '50');
      params.append('from', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    } else {
      // Generic parameter handling
      for (const [key, value] of Object.entries(source.configuration)) {
        if (typeof value === 'string' || typeof value === 'number') {
          params.append(key, value.toString());
        }
      }
    }
    
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`API response received: ${JSON.stringify(data).substring(0, 200)}...`);

  // Process based on API type
  if (source.name.toLowerCase().includes('newsapi')) {
    return processNewsAPIData(data, source.name);
  } else if (source.name.toLowerCase().includes('otx')) {
    return processOTXData(data, source.name);
  } else {
    // Generic processing
    return processGenericAPIData(data, source.name);
  }
}

async function processRSSSource(source: DataSource): Promise<ThreatSignal[]> {
  const signals: ThreatSignal[] = [];
  
  console.log(`Fetching RSS feed: ${source.endpoint_url}`);
  
  const response = await fetch(source.endpoint_url);
  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();
  
  // Simple RSS parsing (in production, use a proper XML parser)
  const items = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
  
  for (const item of items.slice(0, 20)) { // Limit to 20 items
    try {
      const title = extractXMLTag(item, 'title') || 'Unknown Threat';
      const description = extractXMLTag(item, 'description') || '';
      const link = extractXMLTag(item, 'link') || '';
      const pubDate = extractXMLTag(item, 'pubDate') || new Date().toISOString();

      // Basic threat categorization based on keywords
      const category = categorizeThreat(title + ' ' + description);
      const severity = assessSeverity(title + ' ' + description);
      
      signals.push({
        title: title.substring(0, 200),
        summary: description.substring(0, 500),
        category,
        severity,
        country: 'Global', // RSS feeds are typically global
        region: 'Global',
        latitude: 0,
        longitude: 0,
        threat_score: calculateThreatScore(severity, category),
        confidence: 70, // Medium confidence for RSS feeds
        escalation_potential: 30,
        source_name: source.name,
        source_url: link,
        tags: extractTags(title + ' ' + description),
        timestamp: new Date(pubDate).toISOString()
      });
    } catch (error) {
      console.error('Error processing RSS item:', error);
    }
  }

  return signals;
}

function processNewsAPIData(data: any, sourceName: string): ThreatSignal[] {
  const signals: ThreatSignal[] = [];
  
  if (!data.articles || !Array.isArray(data.articles)) {
    return signals;
  }

  for (const article of data.articles.slice(0, 20)) {
    try {
      const title = article.title || 'Unknown Threat';
      const description = article.description || '';
      const content = article.content || '';
      const fullText = `${title} ${description} ${content}`;

      const category = categorizeThreat(fullText);
      const severity = assessSeverity(fullText);
      const location = extractLocation(fullText);

      signals.push({
        title: title.substring(0, 200),
        summary: description.substring(0, 500),
        category,
        severity,
        country: location.country,
        region: location.region,
        latitude: location.latitude,
        longitude: location.longitude,
        threat_score: calculateThreatScore(severity, category),
        confidence: 75,
        escalation_potential: calculateEscalationPotential(severity, category),
        source_name: sourceName,
        source_url: article.url,
        tags: extractTags(fullText),
        timestamp: new Date(article.publishedAt || Date.now()).toISOString()
      });
    } catch (error) {
      console.error('Error processing NewsAPI article:', error);
    }
  }

  return signals;
}

function processOTXData(data: any, sourceName: string): ThreatSignal[] {
  const signals: ThreatSignal[] = [];
  
  if (!data.results || !Array.isArray(data.results)) {
    return signals;
  }

  for (const pulse of data.results.slice(0, 15)) {
    try {
      const title = pulse.name || 'Unknown Threat';
      const description = pulse.description || '';
      
      signals.push({
        title: title.substring(0, 200),
        summary: description.substring(0, 500),
        category: 'Cyber', // OTX is primarily cyber threats
        severity: pulse.TLP || 'medium',
        country: 'Global',
        region: 'Global',
        latitude: 0,
        longitude: 0,
        threat_score: Math.min(90, (pulse.indicator_count || 1) * 10),
        confidence: 85, // High confidence for OTX
        escalation_potential: 60,
        source_name: sourceName,
        source_url: `https://otx.alienvault.com/pulse/${pulse.id}`,
        tags: pulse.tags || [],
        timestamp: new Date(pulse.modified || Date.now()).toISOString()
      });
    } catch (error) {
      console.error('Error processing OTX pulse:', error);
    }
  }

  return signals;
}

function processGenericAPIData(data: any, sourceName: string): ThreatSignal[] {
  // Generic processor for unknown API formats
  return [];
}

function categorizeThreat(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('cyber') || lowerText.includes('hack') || lowerText.includes('malware') || lowerText.includes('ransomware')) {
    return 'Cyber';
  } else if (lowerText.includes('military') || lowerText.includes('war') || lowerText.includes('conflict') || lowerText.includes('attack')) {
    return 'Military';
  } else if (lowerText.includes('economic') || lowerText.includes('market') || lowerText.includes('financial') || lowerText.includes('trade')) {
    return 'Economic';
  } else if (lowerText.includes('supply') || lowerText.includes('logistics') || lowerText.includes('disruption')) {
    return 'Supply Chain';
  } else if (lowerText.includes('diplomatic') || lowerText.includes('political') || lowerText.includes('sanction')) {
    return 'Diplomatic';
  }
  
  return 'Other';
}

function assessSeverity(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('critical') || lowerText.includes('severe') || lowerText.includes('major')) {
    return 'high';
  } else if (lowerText.includes('moderate') || lowerText.includes('significant') || lowerText.includes('important')) {
    return 'medium';
  }
  
  return 'low';
}

function calculateThreatScore(severity: string, category: string): number {
  let baseScore = 30;
  
  // Severity multiplier
  switch (severity) {
    case 'high': baseScore += 40; break;
    case 'medium': baseScore += 25; break;
    case 'low': baseScore += 10; break;
  }
  
  // Category modifier
  switch (category) {
    case 'Cyber': baseScore += 20; break;
    case 'Military': baseScore += 15; break;
    case 'Supply Chain': baseScore += 15; break;
    case 'Economic': baseScore += 10; break;
    case 'Diplomatic': baseScore += 5; break;
  }
  
  return Math.min(100, baseScore + Math.floor(Math.random() * 10));
}

function calculateEscalationPotential(severity: string, category: string): number {
  let potential = 20;
  
  if (severity === 'high') potential += 30;
  else if (severity === 'medium') potential += 15;
  
  if (category === 'Military') potential += 25;
  else if (category === 'Cyber') potential += 20;
  
  return Math.min(90, potential + Math.floor(Math.random() * 10));
}

function extractLocation(text: string): { country: string; region: string; latitude: number; longitude: number } {
  const lowerText = text.toLowerCase();
  
  // Simple location detection
  const locations = [
    { keywords: ['london', 'uk', 'britain', 'england'], country: 'United Kingdom', region: 'London', lat: 51.5074, lng: -0.1278 },
    { keywords: ['new york', 'ny', 'nyc'], country: 'United States', region: 'New York', lat: 40.7128, lng: -74.0060 },
    { keywords: ['paris', 'france'], country: 'France', region: 'Paris', lat: 48.8566, lng: 2.3522 },
    { keywords: ['tokyo', 'japan'], country: 'Japan', region: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { keywords: ['berlin', 'germany'], country: 'Germany', region: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { keywords: ['beijing', 'china'], country: 'China', region: 'Beijing', lat: 39.9042, lng: 116.4074 },
    { keywords: ['moscow', 'russia'], country: 'Russia', region: 'Moscow', lat: 55.7558, lng: 37.6176 }
  ];
  
  for (const location of locations) {
    if (location.keywords.some(keyword => lowerText.includes(keyword))) {
      return {
        country: location.country,
        region: location.region,
        latitude: location.lat,
        longitude: location.lng
      };
    }
  }
  
  return { country: 'Global', region: 'Global', latitude: 0, longitude: 0 };
}

function extractTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const tags = [];
  
  const tagKeywords = [
    'malware', 'ransomware', 'phishing', 'ddos', 'breach', 'vulnerability',
    'nation-state', 'apt', 'cybercrime', 'terrorism', 'conflict', 'sanctions',
    'trade-war', 'supply-chain', 'infrastructure', 'finance', 'banking'
  ];
  
  for (const keyword of tagKeywords) {
    if (lowerText.includes(keyword)) {
      tags.push(keyword);
    }
  }
  
  return tags.slice(0, 5); // Limit to 5 tags
}

function extractXMLTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim().replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : null;
}

serve(handler);