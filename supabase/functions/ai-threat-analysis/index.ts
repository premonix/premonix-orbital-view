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
  id?: string;
  title: string;
  summary?: string;
  content?: string;
  source_name: string;
  existing_category?: string;
  existing_severity?: string;
}

interface UserContext {
  user_id: string;
  organization: {
    sector: string;
    size: string;
    primary_region: string;
    locations: string[];
    employee_count?: number;
    supply_chain_complexity?: number;
    risk_tolerance?: number;
    existing_security_measures: string[];
    regulatory_requirements: string[];
  };
  dss_assessment: {
    overall_score: number;
    risk_level: string;
    category_scores: Record<string, number>;
    recommendations: string[];
  };
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

    const { threats, user_id }: { threats: ThreatAnalysisRequest[], user_id?: string } = await req.json();

    if (!threats || !Array.isArray(threats)) {
      throw new Error('Invalid request: threats array required');
    }

    console.log(`Processing ${threats.length} threats for AI analysis`);

    // Get user context for personalization if user_id provided
    let userContext: UserContext | null = null;
    if (user_id) {
      userContext = await getUserContext(user_id);
      console.log(`Retrieved user context for personalization: ${user_id}`);
    }

    const analyses = [];

    for (const threat of threats) {
      try {
        console.log(`Analyzing threat: ${threat.title}`);
        
        const analysis = await analyzeThreatWithAI(threat, userContext);
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

async function getUserContext(user_id: string): Promise<UserContext | null> {
  try {
    // Get organization profile
    const { data: orgProfile } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    // Get latest DSS assessment
    const { data: dssAssessment } = await supabase
      .from('dss_assessments')
      .select('*')
      .eq('user_id', user_id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (!orgProfile) {
      console.log(`No organization profile found for user: ${user_id}`);
      return null;
    }

    return {
      user_id,
      organization: {
        sector: orgProfile.sector || 'other',
        size: orgProfile.size || 'medium',
        primary_region: orgProfile.primary_region || 'global',
        locations: orgProfile.locations || [],
        employee_count: orgProfile.employee_count,
        supply_chain_complexity: orgProfile.supply_chain_complexity,
        risk_tolerance: orgProfile.risk_tolerance,
        existing_security_measures: orgProfile.existing_security_measures || [],
        regulatory_requirements: orgProfile.regulatory_requirements || []
      },
      dss_assessment: dssAssessment ? {
        overall_score: dssAssessment.overall_score,
        risk_level: dssAssessment.risk_level,
        category_scores: dssAssessment.category_scores || {},
        recommendations: dssAssessment.recommendations || []
      } : {
        overall_score: 50,
        risk_level: 'medium',
        category_scores: {},
        recommendations: []
      }
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

async function analyzeThreatWithAI(threat: ThreatAnalysisRequest, userContext?: UserContext | null): Promise<AIThreatAnalysis> {
  let contextPrompt = '';
  
  if (userContext) {
    contextPrompt = `

USER CONTEXT FOR PERSONALIZATION:
Organization Sector: ${userContext.organization.sector}
Organization Size: ${userContext.organization.size}
Primary Region: ${userContext.organization.primary_region}
Operational Locations: ${userContext.organization.locations.join(', ') || 'Not specified'}
Employee Count: ${userContext.organization.employee_count || 'Not specified'}
Supply Chain Complexity: ${userContext.organization.supply_chain_complexity || 'Not specified'}
Risk Tolerance: ${userContext.organization.risk_tolerance || 'Not specified'}
Existing Security Measures: ${userContext.organization.existing_security_measures.join(', ') || 'Not specified'}
Regulatory Requirements: ${userContext.organization.regulatory_requirements.join(', ') || 'Not specified'}

DSS Risk Assessment:
Overall Score: ${userContext.dss_assessment.overall_score}/100
Risk Level: ${userContext.dss_assessment.risk_level}
Category Scores: ${JSON.stringify(userContext.dss_assessment.category_scores)}
Current Recommendations: ${userContext.dss_assessment.recommendations.join(', ') || 'None'}

PERSONALIZATION INSTRUCTIONS:
- Adjust threat_score and relevance_score based on user's sector and regional exposure
- Weight recommendations based on organization size and existing security measures
- Consider DSS vulnerabilities when assessing immediate_threat status
- Factor in supply chain complexity for related threat assessment
- Align recommended actions with organization's capabilities and risk tolerance`;
  }

  const prompt = `You are an expert threat intelligence analyst. Analyze this threat data and provide a comprehensive assessment${userContext ? ' personalized for the specific user context' : ''}.

THREAT DATA:
Title: ${threat.title}
Summary: ${threat.summary || 'N/A'}
Content: ${threat.content || 'N/A'}
Source: ${threat.source_name}
Current Category: ${threat.existing_category || 'Unknown'}
Current Severity: ${threat.existing_severity || 'Unknown'}${contextPrompt}

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