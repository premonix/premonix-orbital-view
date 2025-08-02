import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AIAnalysisResult {
  id: string;
  title: string;
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

export const AIThreatAnalysisWidget = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult[]>([]);
  const [analysisStats, setAnalysisStats] = useState({
    totalAnalyzed: 0,
    highConfidence: 0,
    immediateThreats: 0,
    avgThreatScore: 0
  });
  const [lastAnalysis, setLastAnalysis] = useState<string>('');

  useEffect(() => {
    loadRecentAnalyses();
  }, []);

  const loadRecentAnalyses = async () => {
    try {
      // This would be stored in a new table in production
      // For now, we'll simulate recent analyses
      console.log('Loading recent AI analyses...');
    } catch (error) {
      console.error('Error loading recent analyses:', error);
    }
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      console.log('Starting AI-powered threat analysis...');

      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to run personalized analysis');
        return;
      }

      // Get recent threats that need analysis
      const { data: threats, error: threatsError } = await supabase
        .from('threat_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (threatsError) throw threatsError;

      if (!threats || threats.length === 0) {
        toast.info('No recent threats found for analysis');
        return;
      }

      toast.info(`Analyzing ${threats.length} threats with personalized AI intelligence...`);

      // Call AI analysis edge function with user context
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('ai-threat-analysis', {
        body: {
          user_id: user.id,
          threats: threats.map(threat => ({
            id: threat.id,
            title: threat.title,
            summary: threat.summary,
            content: threat.summary, // Use summary as content for now
            source_name: threat.source_name,
            existing_category: threat.category,
            existing_severity: threat.severity
          }))
        }
      });

      if (analysisError) throw analysisError;

      if (analysisData && analysisData.analyses) {
        const validAnalyses = analysisData.analyses
          .filter((analysis: any) => analysis.ai_analysis)
          .map((analysis: any) => ({
            id: analysis.id,
            title: analysis.title,
            ...analysis.ai_analysis
          }));

        setAnalysisResults(validAnalyses);
        updateAnalysisStats(validAnalyses);
        setLastAnalysis(new Date().toISOString());

        toast.success(`AI analysis completed! Processed ${validAnalyses.length} threats`);
      }

    } catch (error: any) {
      console.error('AI Analysis failed:', error);
      toast.error(`AI analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateAnalysisStats = (analyses: AIAnalysisResult[]) => {
    const stats = {
      totalAnalyzed: analyses.length,
      highConfidence: analyses.filter(a => a.confidence_score >= 80).length,
      immediateThreats: analyses.filter(a => a.risk_assessment.immediate_threat).length,
      avgThreatScore: analyses.length > 0 
        ? Math.round(analyses.reduce((sum, a) => sum + a.threat_score, 0) / analyses.length)
        : 0
    };
    setAnalysisStats(stats);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Threat Analysis
            {isAnalyzing && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </div>
          <Button 
            size="sm" 
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analysisStats.totalAnalyzed}</div>
            <div className="text-sm text-muted-foreground">Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{analysisStats.highConfidence}</div>
            <div className="text-sm text-muted-foreground">High Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{analysisStats.immediateThreats}</div>
            <div className="text-sm text-muted-foreground">Immediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{analysisStats.avgThreatScore}</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </div>
        </div>

        {lastAnalysis && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last analysis: {formatTimeAgo(lastAnalysis)}
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              AI Analysis Results
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analysisResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{result.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.insights.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.risk_assessment.immediate_threat && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getSeverityColor(result.enhanced_severity)}>
                      {result.enhanced_severity}
                    </Badge>
                    <Badge variant="outline">{result.enhanced_category}</Badge>
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      Confidence: {result.confidence_score}%
                    </div>
                    <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      Score: {result.threat_score}
                    </div>
                  </div>

                  {result.risk_assessment.recommended_actions.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-sm">
                      <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Recommended Actions:
                      </div>
                      <ul className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                        {result.risk_assessment.recommended_actions.slice(0, 3).map((action, index) => (
                          <li key={index}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.predicted_trends.likelihood_increase > 70 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        {result.predicted_trends.likelihood_increase}% trend increase expected ({result.predicted_trends.timeframe})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isAnalyzing && analysisResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Run AI analysis to get intelligent threat insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};