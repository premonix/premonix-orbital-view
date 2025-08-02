import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface AnalyticsData {
  date: string;
  threats_viewed: number;
  alerts_triggered: number;
  dashboard_visits: number;
  most_viewed_category: string;
  avg_session_duration: number;
}

interface ThreatSignal {
  id: string;
  timestamp: string;
  category: string;
  severity: string;
  threat_score: number;
}

interface AnalyticsWidgetProps {
  analytics: AnalyticsData[];
  threatSignals: ThreatSignal[];
  userId: string;
}

export const AnalyticsWidget = ({ analytics, threatSignals, userId }: AnalyticsWidgetProps) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const getAnalyticsForDate = (date: string) => {
    return analytics.find(a => a.date === date) || {
      date,
      threats_viewed: 0,
      alerts_triggered: 0,
      dashboard_visits: 0,
      most_viewed_category: '',
      avg_session_duration: 0
    };
  };

  const weeklyData = last7Days.map(date => getAnalyticsForDate(date));
  
  const totalThreatsViewed = weeklyData.reduce((sum, day) => sum + day.threats_viewed, 0);
  const totalAlertsTriggered = weeklyData.reduce((sum, day) => sum + day.alerts_triggered, 0);
  const totalDashboardVisits = weeklyData.reduce((sum, day) => sum + day.dashboard_visits, 0);
  const avgSessionDuration = weeklyData.length > 0 
    ? Math.round(weeklyData.reduce((sum, day) => sum + day.avg_session_duration, 0) / weeklyData.length)
    : 0;

  const categoryStats = threatSignals.reduce((acc, signal) => {
    acc[signal.category] = (acc[signal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityTrend = last7Days.map(date => {
    const daySignals = threatSignals.filter(signal => 
      signal.timestamp.startsWith(date)
    );
    return {
      date,
      critical: daySignals.filter(s => s.severity === 'critical').length,
      high: daySignals.filter(s => s.severity === 'high').length,
      medium: daySignals.filter(s => s.severity === 'medium').length,
      low: daySignals.filter(s => s.severity === 'low').length,
    };
  });

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = data.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, data.length - 3);
    return ((recent - previous) / Math.max(1, previous)) * 100;
  };

  const alertsTrend = calculateTrend(weeklyData.map(d => d.alerts_triggered));
  const visitsTrend = calculateTrend(weeklyData.map(d => d.dashboard_visits));

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Threats Viewed</p>
                <p className="text-2xl font-bold text-starlink-white">{totalThreatsViewed}</p>
              </div>
              <Activity className="w-8 h-8 text-starlink-blue" />
            </div>
            <p className="text-xs text-starlink-grey mt-2">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Alerts Triggered</p>
                <p className="text-2xl font-bold text-starlink-white">{totalAlertsTriggered}</p>
              </div>
              <div className="flex items-center">
                {alertsTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                )}
                <span className={`text-xs ml-1 ${alertsTrend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {Math.abs(alertsTrend).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-starlink-grey mt-2">vs previous period</p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Dashboard Visits</p>
                <p className="text-2xl font-bold text-starlink-white">{totalDashboardVisits}</p>
              </div>
              <div className="flex items-center">
                {visitsTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ml-1 ${visitsTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(visitsTrend).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-starlink-grey mt-2">vs previous period</p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Avg Session</p>
                <p className="text-2xl font-bold text-starlink-white">{formatDuration(avgSessionDuration)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-starlink-blue" />
            </div>
            <p className="text-xs text-starlink-grey mt-2">Time on dashboard</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-starlink-white">Activity Timeline</CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Your engagement over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-16 text-xs text-starlink-grey-light">
                  {format(new Date(day.date), 'MMM dd')}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-starlink-dark-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-starlink-blue transition-all duration-300"
                      style={{ width: `${Math.min(100, (day.dashboard_visits / Math.max(1, Math.max(...weeklyData.map(d => d.dashboard_visits)))) * 100)}%` }}
                    />
                  </div>
                  <div className="flex space-x-1">
                    {day.threats_viewed > 0 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {day.threats_viewed}T
                      </Badge>
                    )}
                    {day.alerts_triggered > 0 && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        {day.alerts_triggered}A
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Engagement */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-starlink-white">Category Engagement</CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Threat categories you interact with most
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categoryStats)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-starlink-white">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-starlink-dark-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-starlink-blue transition-all duration-300"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(categoryStats))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-starlink-grey-light w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Threat Severity Trend */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-starlink-white">Threat Severity Trend</CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Daily breakdown of threat severities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {severityTrend.map((day) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-16 text-xs text-starlink-grey-light">
                  {format(new Date(day.date), 'MMM dd')}
                </div>
                <div className="flex-1 flex items-center space-x-1 h-4">
                  {day.critical > 0 && (
                    <div 
                      className="bg-red-500 h-full rounded-sm"
                      style={{ width: `${(day.critical / Math.max(1, day.critical + day.high + day.medium + day.low)) * 100}%` }}
                      title={`${day.critical} critical`}
                    />
                  )}
                  {day.high > 0 && (
                    <div 
                      className="bg-orange-500 h-full rounded-sm"
                      style={{ width: `${(day.high / Math.max(1, day.critical + day.high + day.medium + day.low)) * 100}%` }}
                      title={`${day.high} high`}
                    />
                  )}
                  {day.medium > 0 && (
                    <div 
                      className="bg-yellow-500 h-full rounded-sm"
                      style={{ width: `${(day.medium / Math.max(1, day.critical + day.high + day.medium + day.low)) * 100}%` }}
                      title={`${day.medium} medium`}
                    />
                  )}
                  {day.low > 0 && (
                    <div 
                      className="bg-green-500 h-full rounded-sm"
                      style={{ width: `${(day.low / Math.max(1, day.critical + day.high + day.medium + day.low)) * 100}%` }}
                      title={`${day.low} low`}
                    />
                  )}
                  {day.critical + day.high + day.medium + day.low === 0 && (
                    <div className="flex-1 bg-starlink-dark-secondary h-full rounded-sm" />
                  )}
                </div>
                <div className="text-xs text-starlink-grey-light w-8 text-right">
                  {day.critical + day.high + day.medium + day.low}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};