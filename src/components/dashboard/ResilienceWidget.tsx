import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { DSSAssessment } from './DSSAssessment';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  ArrowRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area 
} from 'recharts';

interface ResilienceWidgetProps {
  userProfile?: any;
  threatSignals: any[];
  userId: string;
}

interface DSSHistoryEntry {
  id: string;
  score: number;
  created_at: string;
  assessment_data: any;
}

export const ResilienceWidget = ({ userProfile, threatSignals, userId }: ResilienceWidgetProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isDSSDialogOpen, setIsDSSDialogOpen] = useState(false);
  const [currentDSSScore, setCurrentDSSScore] = useState(0);
  const [dssHistory, setDssHistory] = useState<DSSHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    loadDSSHistory();
  }, [userId]);

  const loadDSSHistory = async () => {
    try {
      setIsLoadingHistory(true);
      console.log('Loading DSS history for user:', userId);
      
      const { data, error } = await supabase
        .from('dss_score_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('DSS history query result:', { data, error });

      if (error) throw error;
      setDssHistory(data || []);
      
      // Set current score from most recent entry
      if (data && data.length > 0) {
        console.log('Setting current DSS score to:', data[0].score);
        setCurrentDSSScore(data[0].score);
      } else {
        console.log('No DSS history found, using calculated score');
      }
    } catch (error) {
      console.error('Error loading DSS history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Calculate DSS (Disruption Sensitivity Score) based on user profile and threat data
  const calculateDSS = () => {
    console.log('Calculating DSS with:', { userProfile, threatSignalsCount: threatSignals.length });
    
    // If no user profile, return a default base score
    if (!userProfile) {
      console.log('No user profile, returning base score of 35');
      return { score: 35, level: 'Low', factors: ['Complete assessment for accurate score'] };
    }

    let score = 0;
    const factors = [];

    // Geographic risk based on threat signals
    const locationThreats = threatSignals.filter(signal => 
      signal.country === userProfile.location
    ).length;
    
    console.log('Location threats found:', locationThreats);
    
    if (locationThreats > 5) {
      score += 25;
      factors.push('High regional threat activity');
    } else if (locationThreats > 2) {
      score += 15;
      factors.push('Moderate regional threat activity');
    } else {
      score += 5;
      factors.push('Low regional threat activity');
    }

    // Recent cyber threats
    const recentCyber = threatSignals.filter(signal => 
      signal.category === 'Cyber' && 
      new Date(signal.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    if (recentCyber > 3) {
      score += 20;
      factors.push('High cyber threat activity');
    } else if (recentCyber > 1) {
      score += 10;
      factors.push('Moderate cyber threat activity');
    }

    // Add base operational risk
    score += 15;
    factors.push('Standard operational risk baseline');

    const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
    const finalScore = Math.min(score, 100);
    
    console.log('Calculated DSS:', { score: finalScore, level, factors });
    return { score: finalScore, level, factors };
  };

  const dss = calculateDSS();
  
  // Use current score from history if available, otherwise use calculated score
  const displayScore = dssHistory.length > 0 ? currentDSSScore : dss.score;
  const displayLevel = displayScore >= 70 ? 'High' : displayScore >= 40 ? 'Medium' : 'Low';

  console.log('ResilienceWidget render state:', {
    userId,
    dssHistoryLength: dssHistory.length,
    currentDSSScore,
    dssCalculatedScore: dss.score,
    displayScore,
    displayLevel,
    isLoadingHistory,
    userProfile: userProfile ? 'exists' : 'null',
    threatSignalsCount: threatSignals.length
  });

  // Calculate trend from history
  const getDSSTrend = () => {
    if (dssHistory.length < 2) return { trend: 'stable', change: 0 };
    
    const latest = dssHistory[0].score;
    const previous = dssHistory[1].score;
    const change = latest - previous;
    
    if (change > 5) return { trend: 'improving', change };
    if (change < -5) return { trend: 'declining', change };
    return { trend: 'stable', change };
  };

  const trend = getDSSTrend();

  // Generate resilience recommendations based on threat data
  const getResilienceRecommendations = () => {
    const recentThreats = threatSignals.filter(signal => 
      new Date(signal.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const recommendations = [];

    const cyberThreats = recentThreats.filter(s => s.category === 'Cyber').length;
    const supplyThreats = recentThreats.filter(s => s.category === 'Supply Chain').length;
    const economicThreats = recentThreats.filter(s => s.category === 'Economic').length;

    if (cyberThreats >= 2) {
      recommendations.push({
        priority: 'High',
        title: 'Strengthen Cyber Defenses',
        action: 'Review and update cybersecurity protocols',
        type: 'immediate'
      });
    }

    if (supplyThreats >= 1) {
      recommendations.push({
        priority: 'Medium',
        title: 'Supply Chain Review',
        action: 'Audit supplier dependencies and backup plans',
        type: 'planning'
      });
    }

    if (economicThreats >= 2) {
      recommendations.push({
        priority: 'Medium',
        title: 'Financial Risk Assessment',
        action: 'Review financial exposure and hedging strategies',
        type: 'planning'
      });
    }

    if (displayScore >= 70) {
      recommendations.push({
        priority: 'High',
        title: 'Comprehensive Resilience Plan',
        action: 'Develop organization-wide business continuity plan',
        type: 'strategic'
      });
    }

    return recommendations;
  };

  const recommendations = getResilienceRecommendations();

  const resilienceTools = [
    {
      title: 'Business Impact Assessment',
      description: 'Evaluate disruption scenarios',
      status: 'available',
      progress: 85,
      action: 'Continue Assessment'
    },
    {
      title: 'Crisis Response Playbook',
      description: 'Incident response procedures',
      status: 'in-progress',
      progress: 60,
      action: 'Update Playbook'
    },
    {
      title: 'Threat Awareness Training',
      description: 'Team education modules',
      status: 'pending',
      progress: 25,
      action: 'Start Training'
    }
  ];

  const getDSSColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* DSS Overview Card */}
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-starlink-white">
                <Target className="w-5 h-5" />
                <span>Disruption Sensitivity Score (DSS)</span>
              </CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Your organization's exposure to disruption events
              </CardDescription>
            </div>
            <div className={`text-right ${getDSSColor(displayLevel)}`}>
              <div className="text-2xl font-bold">{displayScore}/100</div>
              <div className="text-sm">{displayLevel} Risk</div>
              {trend.trend !== 'stable' && (
                <div className="flex items-center justify-end mt-1">
                  {trend.trend === 'improving' ? (
                    <TrendingDown className="w-3 h-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-red-400 mr-1" />
                  )}
                  <span className={`text-xs ${trend.trend === 'improving' ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(trend.change)} pts
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={displayScore} className="h-2" />
          
          {dss.factors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-starlink-white">Risk Factors:</h4>
              <div className="space-y-1">
                {dss.factors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-starlink-grey-light">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Dialog open={isDSSDialogOpen} onOpenChange={setIsDSSDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Recalculate DSS
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>DSS Assessment</DialogTitle>
                <DialogDescription>
                  Complete the assessment to calculate your organization's Disruption Sensitivity Score
                </DialogDescription>
              </DialogHeader>
              <DSSAssessment 
                userId={userId} 
                onScoreUpdate={(score) => {
                  setCurrentDSSScore(score);
                  setIsDSSDialogOpen(false);
                  loadDSSHistory(); // Reload history after new assessment
                }}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* DSS History and Progress */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <BarChart3 className="w-5 h-5" />
            <span>DSS Progress Timeline</span>
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Track your resilience improvements over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dssHistory.length > 0 ? (
            <>
              {/* Chart Visualization */}
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dssHistory.slice().reverse().map(entry => ({
                    date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    score: entry.score,
                    level: entry.score >= 70 ? 'High' : entry.score >= 40 ? 'Medium' : 'Low'
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: any) => [`${value} Risk Score`, 'DSS']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Assessments List */}
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium text-starlink-white">Recent Assessments</h4>
                {dssHistory.slice(0, 3).map((entry, index) => {
                  const isLatest = index === 0;
                  const date = new Date(entry.created_at).toLocaleDateString();
                  const time = new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const level = entry.score >= 70 ? 'High' : entry.score >= 40 ? 'Medium' : 'Low';
                  
                  return (
                    <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg ${isLatest ? 'bg-primary/10 border border-primary/20' : 'bg-starlink-dark-secondary/50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-primary' : 'bg-starlink-grey'}`} />
                        <div>
                          <div className="text-sm font-medium text-starlink-white">
                            {date} at {time}
                            {isLatest && <Badge variant="outline" className="ml-2 text-xs">Latest</Badge>}
                          </div>
                          <div className="text-xs text-starlink-grey-light">
                            Assessment completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getDSSColor(level)}`}>
                          {entry.score}
                        </div>
                        <div className={`text-xs ${getDSSColor(level)}`}>
                          {level} Risk
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Statistics */}
              <div className="pt-4 border-t border-starlink-dark-secondary">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-starlink-white">
                      {dssHistory.length}
                    </div>
                    <div className="text-xs text-starlink-grey-light">Total Assessments</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${trend.trend === 'improving' ? 'text-green-400' : trend.trend === 'declining' ? 'text-red-400' : 'text-starlink-white'}`}>
                      {trend.trend === 'improving' ? '↓' : trend.trend === 'declining' ? '↑' : '→'}
                    </div>
                    <div className="text-xs text-starlink-grey-light">
                      {trend.trend === 'improving' ? 'Improving' : trend.trend === 'declining' ? 'Declining' : 'Stable'}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-starlink-white">
                      {Math.round(dssHistory.reduce((sum, entry) => sum + entry.score, 0) / dssHistory.length)}
                    </div>
                    <div className="text-xs text-starlink-grey-light">Average Score</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-starlink-grey mx-auto mb-4" />
              <p className="text-starlink-grey-light mb-2">No assessment history yet</p>
              <p className="text-sm text-starlink-grey mb-4">Complete your first DSS assessment to see progress over time</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsDSSDialogOpen(true)}
              >
                <Target className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resilience Recommendations */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <Shield className="w-5 h-5" />
            <span>Resilience Recommendations</span>
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Actionable steps based on current threat landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-starlink-grey-light">No immediate actions required</p>
                <p className="text-sm text-starlink-grey">Your current resilience posture looks good</p>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-starlink-dark-secondary/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getPriorityColor(rec.priority) as any} className="text-xs">
                        {rec.priority}
                      </Badge>
                      <span className="text-sm font-medium text-starlink-white">{rec.title}</span>
                    </div>
                    <p className="text-sm text-starlink-grey-light">{rec.action}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resilience Tools Progress */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <FileText className="w-5 h-5" />
            <span>Resilience Tools</span>
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Your progress across resilience planning tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resilienceTools.map((tool, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-starlink-white">{tool.title}</h4>
                    <p className="text-xs text-starlink-grey-light">{tool.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {tool.action}
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-starlink-grey-light">Progress</span>
                    <span className="text-starlink-white">{tool.progress}%</span>
                  </div>
                  <Progress value={tool.progress} className="h-1" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-starlink-dark-secondary">
            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Access Full Resilience Toolkit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};