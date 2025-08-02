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

interface ReportRequest {
  type: 'executive' | 'threat_analysis' | 'resilience' | 'analytics' | 'watchlist' | 'dss_assessment';
  user_id: string;
  title?: string;
  data?: any;
  time_period?: string;
  format?: 'markdown' | 'html' | 'json';
}

interface ReportData {
  title: string;
  executive_summary: string;
  key_findings: string[];
  detailed_analysis: string;
  recommendations: string[];
  risk_assessment: string;
  appendices?: string[];
  metadata: {
    generated_at: string;
    report_type: string;
    time_period: string;
    author: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Report Generation function called');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const reportRequest: ReportRequest = await req.json();
    console.log(`Generating ${reportRequest.type} report for user ${reportRequest.user_id}`);

    // Gather contextual data for the report
    const reportContext = await gatherReportContext(reportRequest);
    
    // Generate the report using OpenAI
    const report = await generateReportWithAI(reportRequest, reportContext);
    
    // Store the report in the database
    const { data: savedReport, error: saveError } = await supabase
      .from('reports')
      .insert({
        title: report.title,
        category: reportRequest.type,
        severity: 'medium', // Default, can be determined by AI
        time_period: reportRequest.time_period || 'current',
        description: report.executive_summary,
        file_url: null, // We'll store content in description for now
        created_by: reportRequest.user_id,
        status: 'active'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving report:', saveError);
    }

    console.log(`Report generated successfully: ${report.title}`);

    return new Response(JSON.stringify({
      success: true,
      report,
      report_id: savedReport?.id,
      generated_at: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Report Generation failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function gatherReportContext(request: ReportRequest): Promise<any> {
  const context: any = {
    user_profile: null,
    organization: null,
    dss_assessment: null,
    threats: [],
    alerts: [],
    analytics: []
  };

  try {
    // Get user profile and organization
    const { data: orgProfile } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('user_id', request.user_id)
      .single();

    context.organization = orgProfile;

    // Get latest DSS assessment
    const { data: dssAssessment } = await supabase
      .from('dss_assessments')
      .select('*')
      .eq('user_id', request.user_id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    context.dss_assessment = dssAssessment;

    // Get relevant threats based on report type
    const threatLimit = request.type === 'threat_analysis' ? 50 : 20;
    const { data: threats } = await supabase
      .from('threat_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(threatLimit);

    context.threats = threats || [];

    // Get user alerts
    const { data: alerts } = await supabase
      .from('user_alerts')
      .select('*, threat_signals(*)')
      .eq('user_id', request.user_id)
      .order('triggered_at', { ascending: false })
      .limit(30);

    context.alerts = alerts || [];

    // Get analytics data if available
    const { data: analytics } = await supabase
      .from('user_dashboard_analytics')
      .select('*')
      .eq('user_id', request.user_id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    context.analytics = analytics || [];

    // Get watchlist if relevant
    if (request.type === 'watchlist') {
      const { data: watchlist } = await supabase
        .from('threat_watchlist')
        .select('*, threat_signals(*)')
        .eq('user_id', request.user_id)
        .order('created_at', { ascending: false });

      context.watchlist = watchlist || [];
    }

    return context;
    
  } catch (error) {
    console.error('Error gathering report context:', error);
    return context;
  }
}

async function generateReportWithAI(request: ReportRequest, context: any): Promise<ReportData> {
  const reportPrompts = {
    executive: generateExecutivePrompt,
    threat_analysis: generateThreatAnalysisPrompt,
    resilience: generateResiliencePrompt,
    analytics: generateAnalyticsPrompt,
    watchlist: generateWatchlistPrompt,
    dss_assessment: generateDSSPrompt
  };

  const promptGenerator = reportPrompts[request.type];
  if (!promptGenerator) {
    throw new Error(`Unsupported report type: ${request.type}`);
  }

  const prompt = promptGenerator(request, context);

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
          content: 'You are an expert threat intelligence analyst and report writer. Generate comprehensive, professional reports with clear analysis and actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const reportContent = data.choices[0].message.content;

  try {
    const report = JSON.parse(reportContent);
    
    // Validate report structure
    if (!report.title || !report.executive_summary) {
      throw new Error('Invalid report structure from AI');
    }

    return {
      ...report,
      metadata: {
        generated_at: new Date().toISOString(),
        report_type: request.type,
        time_period: request.time_period || 'current',
        author: 'AI Intelligence System'
      }
    };
    
  } catch (parseError) {
    console.error('Error parsing AI report response:', parseError);
    throw new Error('Failed to parse AI report response');
  }
}

function generateExecutivePrompt(request: ReportRequest, context: any): string {
  return `Generate a comprehensive executive intelligence report based on the following data.

ORGANIZATION CONTEXT:
${context.organization ? `
- Sector: ${context.organization.sector}
- Size: ${context.organization.size}
- Region: ${context.organization.primary_region}
- Employee Count: ${context.organization.employee_count || 'N/A'}
- Key Assets: ${(context.organization.key_assets || []).join(', ') || 'N/A'}
` : 'Organization profile not available'}

DSS ASSESSMENT:
${context.dss_assessment ? `
- Overall Score: ${context.dss_assessment.overall_score}/100
- Risk Level: ${context.dss_assessment.risk_level}
- Key Vulnerabilities: ${(context.dss_assessment.recommendations || []).slice(0, 3).join(', ')}
` : 'DSS assessment not available'}

THREAT LANDSCAPE:
- Total Active Threats: ${context.threats.length}
- Critical Threats: ${context.threats.filter((t: any) => t.severity === 'critical').length}
- High Priority Threats: ${context.threats.filter((t: any) => t.severity === 'high').length}
- Most Common Categories: ${getMostCommonCategories(context.threats)}

RECENT ALERTS:
- Total Alerts: ${context.alerts.length}
- Unread Alerts: ${context.alerts.filter((a: any) => !a.is_read).length}

Generate a professional executive report in the following JSON format:
{
  "title": "Executive Threat Intelligence Brief - [Date]",
  "executive_summary": "2-3 paragraph strategic overview",
  "key_findings": ["5-7 bullet point findings"],
  "detailed_analysis": "Comprehensive analysis section with multiple paragraphs",
  "recommendations": ["5-8 strategic recommendations"],
  "risk_assessment": "Current risk posture assessment paragraph",
  "appendices": ["Additional technical details", "Methodology notes"]
}

Focus on strategic insights, business impact, and actionable recommendations for executive leadership.`;
}

function generateThreatAnalysisPrompt(request: ReportRequest, context: any): string {
  return `Generate a comprehensive threat analysis report based on current threat intelligence data.

THREAT DATA SUMMARY:
- Total Threats Analyzed: ${context.threats.length}
- Critical: ${context.threats.filter((t: any) => t.severity === 'critical').length}
- High: ${context.threats.filter((t: any) => t.severity === 'high').length}
- Medium: ${context.threats.filter((t: any) => t.severity === 'medium').length}
- Low: ${context.threats.filter((t: any) => t.severity === 'low').length}

THREAT CATEGORIES:
${getDetailedThreatBreakdown(context.threats)}

ORGANIZATION CONTEXT:
${context.organization ? `
- Sector: ${context.organization.sector} (Focus on sector-specific threats)
- Operating Regions: ${(context.organization.locations || []).join(', ')}
- Risk Profile: ${context.dss_assessment?.risk_level || 'Unknown'}
` : 'Use general threat analysis approach'}

Generate a technical threat analysis report in JSON format:
{
  "title": "Comprehensive Threat Intelligence Analysis - [Date]",
  "executive_summary": "Technical overview for security professionals",
  "key_findings": ["7-10 technical findings"],
  "detailed_analysis": "Multi-paragraph technical analysis with threat actor details, TTPs, and indicators",
  "recommendations": ["8-12 tactical security recommendations"],
  "risk_assessment": "Technical risk assessment with threat scoring methodology",
  "appendices": ["IOCs list", "MITRE ATT&CK mappings", "Source reliability notes"]
}

Focus on technical details, threat actor analysis, indicators of compromise, and tactical security measures.`;
}

function generateResiliencePrompt(request: ReportRequest, context: any): string {
  return `Generate a comprehensive organizational resilience report.

DSS ASSESSMENT RESULTS:
${context.dss_assessment ? `
- Overall Score: ${context.dss_assessment.overall_score}/100
- Risk Level: ${context.dss_assessment.risk_level}
- Category Scores: ${JSON.stringify(context.dss_assessment.category_scores || {})}
- Recommendations: ${(context.dss_assessment.recommendations || []).join('\n- ')}
` : 'No DSS assessment available'}

ORGANIZATION PROFILE:
${context.organization ? `
- Sector: ${context.organization.sector}
- Size: ${context.organization.size}
- Supply Chain Complexity: ${context.organization.supply_chain_complexity}/10
- Risk Tolerance: ${context.organization.risk_tolerance}/10
- Existing Security Measures: ${(context.organization.existing_security_measures || []).join(', ')}
` : 'Organization profile incomplete'}

RECENT THREAT EXPOSURE:
- Sector-Relevant Threats: ${context.threats.filter((t: any) => isSectorRelevant(t, context.organization?.sector)).length}
- Geographic Threats: ${context.threats.filter((t: any) => isGeographicallyRelevant(t, context.organization?.locations)).length}

Generate a resilience assessment report in JSON format:
{
  "title": "Organizational Resilience Assessment Report - [Date]",
  "executive_summary": "Resilience posture and capability overview",
  "key_findings": ["6-8 resilience findings"],
  "detailed_analysis": "Comprehensive resilience analysis covering people, process, technology, and governance",
  "recommendations": ["8-10 resilience improvement recommendations"],
  "risk_assessment": "Resilience gaps and vulnerability assessment",
  "appendices": ["Maturity model assessment", "Benchmark comparisons", "Implementation roadmap"]
}

Focus on organizational capabilities, maturity assessment, gap analysis, and improvement roadmap.`;
}

function generateAnalyticsPrompt(request: ReportRequest, context: any): string {
  return `Generate a comprehensive analytics and performance report.

DASHBOARD ANALYTICS:
${context.analytics.length > 0 ? `
- Data Points: ${context.analytics.length}
- Average Daily Threats Viewed: ${getAverage(context.analytics, 'threats_viewed')}
- Average Daily Alerts: ${getAverage(context.analytics, 'alerts_triggered')}
- Dashboard Engagement: ${getAverage(context.analytics, 'dashboard_visits')}
- Most Viewed Category: ${getMostViewedCategory(context.analytics)}
` : 'Limited analytics data available'}

THREAT INTELLIGENCE METRICS:
- Total Threats Processed: ${context.threats.length}
- Response Time Metrics: Based on alert data
- Coverage Analysis: Geographic and sector coverage

USER ENGAGEMENT:
- Alert Response Rate: ${calculateAlertResponseRate(context.alerts)}
- Platform Utilization: Based on dashboard analytics

Generate a performance analytics report in JSON format:
{
  "title": "Intelligence Platform Analytics Report - [Date]",
  "executive_summary": "Platform performance and intelligence effectiveness overview",
  "key_findings": ["6-8 analytics insights"],
  "detailed_analysis": "Comprehensive analysis of platform utilization, intelligence quality, and operational metrics",
  "recommendations": ["6-8 optimization recommendations"],
  "risk_assessment": "Performance gaps and intelligence coverage assessment",
  "appendices": ["Detailed metrics", "Trend analysis", "Benchmark data"]
}

Focus on quantitative analysis, trend identification, performance optimization, and intelligence effectiveness.`;
}

function generateWatchlistPrompt(request: ReportRequest, context: any): string {
  return `Generate a comprehensive threat watchlist report.

WATCHLIST DATA:
${context.watchlist ? `
- Total Watchlist Items: ${context.watchlist.length}
- Active Items: ${context.watchlist.filter((w: any) => w.status === 'active').length}
- High Priority Items: ${context.watchlist.filter((w: any) => w.priority === 'high').length}
- Categories Monitored: ${getWatchlistCategories(context.watchlist)}
` : 'No watchlist data available'}

RELATED THREAT INTELLIGENCE:
- Matching Threats Found: ${countMatchingThreats(context.watchlist, context.threats)}
- Recent Updates: Based on threat signal correlation

Generate a watchlist intelligence report in JSON format:
{
  "title": "Threat Watchlist Intelligence Report - [Date]",
  "executive_summary": "Watchlist status and threat correlation overview",
  "key_findings": ["5-7 watchlist insights"],
  "detailed_analysis": "Analysis of monitored threats, correlation with intelligence feeds, and emerging patterns",
  "recommendations": ["6-8 watchlist optimization recommendations"],
  "risk_assessment": "Priority threat assessment and monitoring effectiveness",
  "appendices": ["Watchlist items detail", "Correlation methodology", "Threat attribution"]
}

Focus on watchlist effectiveness, threat correlation, priority assessment, and monitoring optimization.`;
}

function generateDSSPrompt(request: ReportRequest, context: any): string {
  return `Generate a comprehensive DSS (Disruption Sensitivity Score) assessment report.

DSS ASSESSMENT DATA:
${context.dss_assessment ? `
- Overall DSS Score: ${context.dss_assessment.overall_score}/100
- Risk Level: ${context.dss_assessment.risk_level}
- Assessment Version: ${context.dss_assessment.version}
- Category Breakdown: ${JSON.stringify(context.dss_assessment.category_scores || {})}
- Key Recommendations: ${(context.dss_assessment.recommendations || []).join('\n- ')}
` : 'DSS assessment not completed'}

ORGANIZATION CONTEXT:
${context.organization ? `
- Sector Risk Profile: ${context.organization.sector}
- Operational Scale: ${context.organization.size}
- Geographic Exposure: ${context.organization.primary_region}
- Supply Chain Complexity: ${context.organization.supply_chain_complexity}/10
` : 'Organization profile needed for comprehensive assessment'}

Generate a DSS assessment report in JSON format:
{
  "title": "Disruption Sensitivity Score Assessment Report - [Date]",
  "executive_summary": "DSS methodology and organizational vulnerability overview",
  "key_findings": ["6-8 DSS-specific findings"],
  "detailed_analysis": "Comprehensive DSS analysis covering all assessment categories and scoring methodology",
  "recommendations": ["8-12 vulnerability mitigation recommendations"],
  "risk_assessment": "Disruption risk assessment and vulnerability prioritization",
  "appendices": ["DSS methodology", "Scoring rationale", "Peer benchmarking"]
}

Focus on vulnerability assessment, scoring methodology, comparative analysis, and mitigation strategies.`;
}

// Helper functions
function getMostCommonCategories(threats: any[]): string {
  const categories = threats.map(t => t.category).filter(Boolean);
  const counts = categories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat, count]) => `${cat} (${count})`)
    .join(', ');
}

function getDetailedThreatBreakdown(threats: any[]): string {
  const breakdown = threats.reduce((acc, threat) => {
    const category = threat.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(threat);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(breakdown)
    .map(([category, items]) => `- ${category}: ${items.length} threats`)
    .join('\n');
}

function getAverage(data: any[], field: string): number {
  if (data.length === 0) return 0;
  return Math.round(data.reduce((sum, item) => sum + (item[field] || 0), 0) / data.length);
}

function getMostViewedCategory(analytics: any[]): string {
  const categories = analytics.map(a => a.most_viewed_category).filter(Boolean);
  return categories.length > 0 ? categories[categories.length - 1] : 'N/A';
}

function calculateAlertResponseRate(alerts: any[]): string {
  if (alerts.length === 0) return '0%';
  const readAlerts = alerts.filter(a => a.is_read).length;
  return `${Math.round((readAlerts / alerts.length) * 100)}%`;
}

function getWatchlistCategories(watchlist: any[]): string {
  const categories = watchlist.map(w => w.threat_signals?.category).filter(Boolean);
  return [...new Set(categories)].join(', ') || 'N/A';
}

function countMatchingThreats(watchlist: any[], threats: any[]): number {
  if (!watchlist || !threats) return 0;
  const watchlistThreatIds = new Set(watchlist.map(w => w.threat_signal_id).filter(Boolean));
  return threats.filter(t => watchlistThreatIds.has(t.id)).length;
}

function isSectorRelevant(threat: any, sector?: string): boolean {
  if (!sector || !threat.category) return false;
  const sectorMappings: Record<string, string[]> = {
    'financial_services': ['Financial', 'Economic', 'Cyber'],
    'healthcare': ['Health', 'Medical', 'Cyber'],
    'technology': ['Cyber', 'Technology'],
    'government_public_sector': ['Political', 'Military', 'Governance'],
    'energy_utilities': ['Energy', 'Infrastructure'],
    'manufacturing': ['Supply Chain', 'Industrial'],
    'transportation_logistics': ['Transportation', 'Supply Chain']
  };
  const relevantCategories = sectorMappings[sector] || [];
  return relevantCategories.some(cat => threat.category.includes(cat));
}

function isGeographicallyRelevant(threat: any, locations?: string[]): boolean {
  if (!locations || !threat.country) return false;
  return locations.includes(threat.country) || locations.includes(threat.region);
}

serve(handler);