
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Threat keywords and their categories
const threatKeywords = {
  'Military': ['military', 'war', 'conflict', 'attack', 'invasion', 'troops', 'missile', 'drone', 'naval', 'army', 'defense', 'warfare', 'combat', 'deployment'],
  'Cyber': ['cyber', 'hack', 'breach', 'malware', 'ransomware', 'phishing', 'ddos', 'cybersecurity', 'data breach', 'infrastructure attack'],
  'Diplomatic': ['diplomatic', 'sanctions', 'embassy', 'ambassador', 'treaty', 'negotiation', 'summit', 'alliance', 'foreign policy', 'international relations'],
  'Economic': ['trade war', 'tariff', 'embargo', 'economic sanctions', 'supply chain', 'market crash', 'recession', 'inflation', 'currency'],
  'Supply Chain': ['supply chain', 'logistics', 'shipping', 'port', 'cargo', 'trade route', 'blockade', 'shortage', 'disruption'],
  'Unrest': ['protest', 'riot', 'civil unrest', 'demonstration', 'uprising', 'violence', 'terrorism', 'extremist', 'insurgency']
};

// Country coordinates mapping
const countryCoordinates: Record<string, [number, number]> = {
  'US': [39.8283, -98.5795],
  'China': [35.8617, 104.1954],
  'Russia': [61.5240, 105.3188],
  'Ukraine': [48.3794, 31.1656],
  'Taiwan': [23.6978, 120.9605],
  'Iran': [32.4279, 53.6880],
  'North Korea': [40.3399, 127.5101],
  'South Korea': [35.9078, 127.7669],
  'Japan': [36.2048, 138.2529],
  'India': [20.5937, 78.9629],
  'Pakistan': [30.3753, 69.3451],
  'Israel': [31.0461, 34.8516],
  'Palestine': [31.9522, 35.2332],
  'Syria': [34.8021, 38.9968],
  'Afghanistan': [33.9391, 67.7100],
  'Iraq': [33.2232, 43.6793],
  'Yemen': [15.5527, 48.5164],
  'UK': [55.3781, -3.4360],
  'France': [46.6034, 1.8883],
  'Germany': [51.1657, 10.4515],
  'Poland': [51.9194, 19.1451],
  'Turkey': [38.9637, 35.2433],
  'Saudi Arabia': [23.8859, 45.0792],
  'Libya': [26.3351, 17.2283],
  'Sudan': [12.8628, 30.2176],
  'Ethiopia': [9.1450, 40.4897],
  'Nigeria': [9.0820, 8.6753],
  'South Africa': [-30.5595, 22.9375],
  'Brazil': [-14.2350, -51.9253],
  'Venezuela': [6.4238, -66.5897],
  'Mexico': [23.6345, -102.5528]
};

function categorizeNews(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(threatKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'Unrest'; // Default category
}

function calculateThreatScore(title: string, description: string, category: string): number {
  const text = `${title} ${description}`.toLowerCase();
  let score = 30; // Base score
  
  // High-impact keywords increase score
  const highImpactKeywords = ['war', 'attack', 'invasion', 'missile', 'bomb', 'critical', 'emergency', 'crisis'];
  const mediumImpactKeywords = ['conflict', 'tension', 'dispute', 'threat', 'concern', 'warning'];
  
  highImpactKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 20;
  });
  
  mediumImpactKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 10;
  });
  
  // Category-based modifiers
  if (category === 'Military') score += 15;
  if (category === 'Cyber') score += 10;
  
  return Math.min(100, Math.max(10, score));
}

function calculateSeverity(threatScore: number): string {
  if (threatScore >= 80) return 'critical';
  if (threatScore >= 60) return 'high';
  if (threatScore >= 40) return 'medium';
  return 'low';
}

function getCountryFromContent(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  for (const [country, _] of Object.entries(countryCoordinates)) {
    if (text.includes(country.toLowerCase())) {
      return country;
    }
  }
  
  // Check for country names in full
  const countryNames: Record<string, string> = {
    'ukraine': 'Ukraine', 'russia': 'Russia', 'china': 'China', 'taiwan': 'Taiwan',
    'iran': 'Iran', 'israel': 'Israel', 'syria': 'Syria', 'afghanistan': 'Afghanistan',
    'iraq': 'Iraq', 'yemen': 'Yemen', 'turkey': 'Turkey', 'libya': 'Libya',
    'sudan': 'Sudan', 'ethiopia': 'Ethiopia', 'nigeria': 'Nigeria', 'brazil': 'Brazil',
    'venezuela': 'Venezuela', 'mexico': 'Mexico'
  };
  
  for (const [searchTerm, countryCode] of Object.entries(countryNames)) {
    if (text.includes(searchTerm)) {
      return countryCode;
    }
  }
  
  return 'US'; // Default
}

async function fetchNewsData() {
  const newsApiKey = Deno.env.get('NEWSAPI_KEY');
  if (!newsApiKey) {
    throw new Error('NewsAPI key not found');
  }

  const queries = [
    'military conflict',
    'cyber attack',
    'diplomatic crisis',
    'supply chain disruption',
    'civil unrest',
    'terrorism threat',
    'naval buildup',
    'trade war',
    'sanctions'
  ];

  const allArticles: any[] = [];

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&language=en`,
        {
          headers: {
            'X-API-Key': newsApiKey
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        allArticles.push(...(data.articles || []));
      }
    } catch (error) {
      console.error(`Error fetching news for query "${query}":`, error);
    }
  }

  return allArticles;
}

async function processAndStoreSignals(articles: any[]) {
  const signals = [];

  for (const article of articles) {
    if (!article.title || !article.description) continue;

    const category = categorizeNews(article.title, article.description);
    const threatScore = calculateThreatScore(article.title, article.description, category);
    const severity = calculateSeverity(threatScore);
    const country = getCountryFromContent(article.title, article.description);
    const coordinates = countryCoordinates[country] || countryCoordinates['US'];

    // Add some randomness to coordinates for better visualization
    const lat = coordinates[0] + (Math.random() - 0.5) * 2;
    const lng = coordinates[1] + (Math.random() - 0.5) * 2;

    const signal = {
      title: article.title,
      summary: article.description,
      category,
      severity,
      threat_score: threatScore,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      latitude: lat,
      longitude: lng,
      country,
      region: 'Global',
      source_url: article.url,
      source_name: 'NewsAPI',
      escalation_potential: Math.floor(Math.random() * 40) + 20,
      tags: [category.toLowerCase(), severity, country.toLowerCase()],
      timestamp: new Date(article.publishedAt || new Date()).toISOString()
    };

    signals.push(signal);
  }

  // Insert signals into database
  if (signals.length > 0) {
    const { data, error } = await supabase
      .from('threat_signals')
      .insert(signals);

    if (error) {
      console.error('Error inserting signals:', error);
      throw error;
    }

    console.log(`Successfully inserted ${signals.length} threat signals`);
    return signals.length;
  }

  return 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting signal ingestion...');
    
    const articles = await fetchNewsData();
    console.log(`Fetched ${articles.length} articles from NewsAPI`);
    
    const signalCount = await processAndStoreSignals(articles);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${signalCount} threat signals`,
        articlesProcessed: articles.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in signal ingestion:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
