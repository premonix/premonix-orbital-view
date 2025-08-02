import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThreatAnalysisRequest {
  title: string;
  summary?: string;
  content?: string;
  source_name: string;
  existing_category?: string;
  existing_severity?: string;
}

interface AIThreatAnalysis {
  enhanced_category: string;
  enhanced_severity: string;
  confidence_score: number;
  threat_score: number;
  escalation_potential: number;
  risk_assessment: {
    immediate_threat: boolean;
    affected_sectors: string[];
    geographic_scope: string;
    potential_impact: string;
    recommended_actions: string[];
  };
  insights: {
    summary: string;
    key_indicators: string[];
    context: string;
    relevance_score: number;
  };
  enhanced_tags: string[];
  predicted_trends: {
    likelihood_increase: number;
    timeframe: string;
    related_threats: string[];
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Threat Analysis function called');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { threats }: { threats: ThreatAnalysisRequest[] } = await req.json();

    if (!threats || !Array.isArray(threats)) {
      throw new Error('Invalid request: threats array required');
    }

    console.log(`Processing ${threats.length} threats for AI analysis`);

    const analyses = [];

    for (const threat of threats) {
      try {
        console.log(`Analyzing threat: ${threat.title}`);
        
        const analysis = await analyzeThreatWithAI(threat);
        analyses.push({
          ...threat,
          ai_analysis: analysis
        });

        console.log(`Completed analysis for: ${threat.title}`);
        
        // Small delay to avoid rate limiting
        if (threats.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (error) {
        console.error(`Error analyzing threat "${threat.title}":`, error);
        analyses.push({
          ...threat,
          ai_analysis: null,
          analysis_error: error.message
        });
      }
    }

    console.log(`AI analysis completed for ${analyses.length} threats`);

    return new Response(JSON.stringify({
      success: true,
      analyses,
      processed_count: analyses.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('AI Threat Analysis failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function analyzeThreatWithAI(threat: ThreatAnalysisRequest): Promise<AIThreatAnalysis> {
  const prompt = `You are an expert threat intelligence analyst. Analyze this threat data and provide a comprehensive assessment.

THREAT DATA:
Title: ${threat.title}
Summary: ${threat.summary || 'N/A'}
Content: ${threat.content || 'N/A'}
Source: ${threat.source_name}
Current Category: ${threat.existing_category || 'Unknown'}
Current Severity: ${threat.existing_severity || 'Unknown'}

Please provide a detailed analysis in the following JSON format (respond ONLY with valid JSON):

{
  "enhanced_category": "one of: Cyber, Military, Economic, Supply Chain, Diplomatic, Terrorism, Natural Disaster, Health, Environmental, Other",
  "enhanced_severity": "critical|high|medium|low",
  "confidence_score": "0-100 integer representing analysis confidence",
  "threat_score": "0-100 integer representing overall threat level",
  "escalation_potential": "0-100 integer representing likelihood of escalation",
  "risk_assessment": {
    "immediate_threat": "true/false - is this an immediate threat",
    "affected_sectors": ["array of affected business sectors"],
    "geographic_scope": "Local|Regional|National|Global",
    "potential_impact": "brief description of potential impact",
    "recommended_actions": ["array of 3-5 recommended actions"]
  },
  "insights": {
    "summary": "2-3 sentence summary of key insights",
    "key_indicators": ["array of 3-5 key threat indicators"],
    "context": "brief context about why this threat matters",
    "relevance_score": "0-100 integer representing relevance to businesses"
  },
  "enhanced_tags": ["array of 5-10 relevant tags"],
  "predicted_trends": {
    "likelihood_increase": "0-100 integer representing trend likelihood",
    "timeframe": "Short-term|Medium-term|Long-term",
    "related_threats": ["array of related threat types"]
  }
}

Focus on:
1. Accurate threat categorization based on content analysis
2. Realistic severity assessment considering impact and scope
3. Actionable intelligence for business decision-makers
4. Evidence-based confidence scoring
5. Forward-looking trend analysis`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class threat intelligence analyst with expertise in cybersecurity, geopolitics, economics, and risk assessment. Provide accurate, actionable threat analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;

  try {
    const analysis = JSON.parse(analysisText);
    
    // Validate the response structure
    if (!analysis.enhanced_category || !analysis.enhanced_severity) {
      throw new Error('Invalid AI response structure');
    }

    return analysis as AIThreatAnalysis;
    
  } catch (parseError) {
    console.error('Error parsing AI response:', parseError);
    console.error('Raw response:', analysisText);
    throw new Error('Failed to parse AI analysis response');
  }
}

serve(handler);