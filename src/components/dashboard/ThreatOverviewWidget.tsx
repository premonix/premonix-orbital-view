import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Shield, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ThreatSignal {
  id: string;
  timestamp: string;
  category: string;
  severity: string;
  title: string;
  threat_score: number;
  confidence: number;
  country: string;
}

interface ThreatOverviewWidgetProps {
  threatSignals: ThreatSignal[];
  userId: string;
}

export const ThreatOverviewWidget = ({ threatSignals, userId }: ThreatOverviewWidgetProps) => {
  const last24h = threatSignals.filter(signal => 
    new Date(signal.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  const severityStats = {
    critical: last24h.filter(s => s.severity === 'critical').length,
    high: last24h.filter(s => s.severity === 'high').length,
    medium: last24h.filter(s => s.severity === 'medium').length,
    low: last24h.filter(s => s.severity === 'low').length,
  };

  const categoryStats = last24h.reduce((acc, signal) => {
    acc[signal.category] = (acc[signal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageThreatScore = last24h.length > 0 
    ? Math.round(last24h.reduce((sum, signal) => sum + signal.threat_score, 0) / last24h.length)
    : 0;

  const averageConfidence = last24h.length > 0
    ? Math.round(last24h.reduce((sum, signal) => sum + signal.confidence, 0) / last24h.length)
    : 0;

  const handleThreatClick = async (threatId: string, category: string) => {
    try {
      await supabase.rpc('update_dashboard_analytics', {
        p_user_id: userId,
        p_action: 'threat_viewed',
        p_category: category
      });
    } catch (error) {
      console.error('Error tracking threat view:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskLevel = () => {
    if (severityStats.critical > 0) return { level: 'CRITICAL', color: 'text-red-400', score: 90 };
    if (severityStats.high > 0) return { level: 'HIGH', color: 'text-orange-400', score: 70 };
    if (severityStats.medium > 0) return { level: 'MEDIUM', color: 'text-yellow-400', score: 50 };
    return { level: 'LOW', color: 'text-green-400', score: 20 };
  };

  const riskLevel = getRiskLevel();

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-starlink-white">
              <AlertTriangle className="w-5 h-5" />
              <span>Threat Overview</span>
            </CardTitle>
            <CardDescription className="text-starlink-grey-light">
              Past 24 hours • {last24h.length} total signals
            </CardDescription>
          </div>
          <div className={`text-right ${riskLevel.color}`}>
            <div className="text-lg font-bold">{riskLevel.level}</div>
            <div className="text-sm">Risk Level</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-starlink-grey-light">Overall Risk Score</span>
            <span className="text-starlink-white font-medium">{riskLevel.score}/100</span>
          </div>
          <Progress value={riskLevel.score} className="h-2" />
        </div>

        {/* Severity Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-starlink-white">Severity Breakdown</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(severityStats).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between p-2 rounded-lg bg-starlink-dark-secondary/50">
                <span className={`text-sm font-medium capitalize ${getSeverityColor(severity)}`}>
                  {severity}
                </span>
                <span className="text-starlink-white font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-starlink-white">Top Categories</h4>
          <div className="space-y-2">
            {Object.entries(categoryStats)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-starlink-grey-light text-sm">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Recent High-Priority Threats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-starlink-white">Recent High-Priority</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {last24h
              .filter(signal => signal.severity === 'critical' || signal.severity === 'high')
              .slice(0, 3)
              .map((signal) => (
                <div 
                  key={signal.id}
                  className="p-2 rounded-lg bg-starlink-dark-secondary/50 cursor-pointer hover:bg-starlink-dark-secondary transition-colors"
                  onClick={() => handleThreatClick(signal.id, signal.category)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-starlink-white truncate">
                        {signal.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={signal.severity === 'critical' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {signal.severity}
                        </Badge>
                        <span className="text-xs text-starlink-grey-light">{signal.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {last24h.filter(signal => signal.severity === 'critical' || signal.severity === 'high').length === 0 && (
              <p className="text-sm text-starlink-grey-light italic">No high-priority threats in the last 24 hours</p>
            )}
          </div>
        </div>

        {/* Intelligence Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-starlink-dark-secondary">
          <div className="text-center">
            <div className="text-lg font-bold text-starlink-white">{averageThreatScore}</div>
            <div className="text-xs text-starlink-grey-light">Avg Threat Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-starlink-white">{averageConfidence}%</div>
            <div className="text-xs text-starlink-grey-light">Avg Confidence</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};