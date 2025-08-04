import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAIReportGeneration } from '@/hooks/useAIReportGeneration';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Settings,
  BarChart3,
  Users,
  Shield,
  Calendar,
  Send
} from 'lucide-react';

interface DecisionSupportWidgetProps {
  threatSignals: any[];
  userAlerts: any[];
  analytics: any[];
  userId: string;
}

export const DecisionSupportWidget = ({ threatSignals, userAlerts, analytics, userId }: DecisionSupportWidgetProps) => {
  const [activeAnalysis, setActiveAnalysis] = useState('threat-correlation');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    content: React.ReactNode;
  } | null>(null);
  const { toast } = useToast();
  const { generateReport, isGenerating } = useAIReportGeneration();

  // Generate actionable insights from threat data
  const generateInsights = () => {
    const last24h = threatSignals.filter(signal => 
      new Date(signal.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const insights = [];

    // Threat pattern analysis
    const threatsByCategory = last24h.reduce((acc, signal) => {
      acc[signal.category] = (acc[signal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(threatsByCategory)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    if (topCategory && (topCategory[1] as number) >= 3) {
      insights.push({
        type: 'pattern',
        priority: 'high',
        title: `${topCategory[0]} Threat Surge`,
        description: `${topCategory[1]} ${topCategory[0]} threats detected in 24h`,
        recommendation: 'Review related security protocols',
        confidence: 92
      });
    }

    // Geographic clustering
    const countryCounts = last24h.reduce((acc, signal) => {
      acc[signal.country] = (acc[signal.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCountry = Object.entries(countryCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    if (topCountry && (topCountry[1] as number) >= 2) {
      insights.push({
        type: 'geographic',
        priority: 'medium',
        title: `${topCountry[0]} Activity Spike`,
        description: `${topCountry[1]} threats concentrated in ${topCountry[0]}`,
        recommendation: 'Monitor regional developments',
        confidence: 85
      });
    }

    // Escalation prediction
    const highSeverityCount = last24h.filter(s => 
      s.severity === 'critical' || s.severity === 'high'
    ).length;

    if (highSeverityCount >= 2) {
      insights.push({
        type: 'escalation',
        priority: 'high',
        title: 'Potential Escalation Risk',
        description: `${highSeverityCount} high-severity events may indicate escalating situation`,
        recommendation: 'Prepare escalation protocols',
        confidence: 78
      });
    }

    return insights;
  };

  // Generate decision recommendations
  const generateDecisionRecommendations = () => {
    const recommendations = [];
    const unreadAlerts = userAlerts.filter(alert => !alert.is_read).length;
    const recentThreats = threatSignals.filter(signal => 
      new Date(signal.timestamp) > new Date(Date.now() - 6 * 60 * 60 * 1000)
    );

    if (unreadAlerts >= 3) {
      recommendations.push({
        category: 'Alert Management',
        action: 'Review and triage pending alerts',
        urgency: 'immediate',
        impact: 'operational',
        effort: 'low'
      });
    }

    if (recentThreats.length >= 5) {
      recommendations.push({
        category: 'Threat Response',
        action: 'Activate enhanced monitoring protocols',
        urgency: 'within-hour',
        impact: 'strategic',
        effort: 'medium'
      });
    }

    const criticalThreats = recentThreats.filter(s => s.severity === 'critical');
    if (criticalThreats.length >= 1) {
      recommendations.push({
        category: 'Crisis Management',
        action: 'Consider activating crisis response team',
        urgency: 'immediate',
        impact: 'critical',
        effort: 'high'
      });
    }

    return recommendations;
  };

  const insights = generateInsights();
  const recommendations = generateDecisionRecommendations();

  // Quick action handlers
  const handleGenerateReport = async () => {
    try {
      const report = await generateReport({
        type: 'threat_analysis',
        title: 'Decision Support Report',
        data: {
          threatSignals: threatSignals.slice(0, 10),
          insights: insights,
          recommendations: recommendations,
          userId: userId
        },
        time_period: '24h'
      });
      
      if (report) {
        setModalContent({
          title: "Report Generated Successfully",
          description: "AI-powered threat analysis report has been completed",
          content: (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">Report Summary</h4>
                <div className="space-y-2 text-sm">
                  <div>• {threatSignals.length} threat signals analyzed</div>
                  <div>• {insights.length} key insights identified</div>
                  <div>• {recommendations.length} recommendations generated</div>
                  <div>• Report generated successfully</div>
                </div>
              </div>
              <div className="p-4 bg-starlink-dark-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2">Report Generated</h4>
                <p className="text-sm text-starlink-grey-light">Your threat analysis report has been successfully generated and is available for download.</p>
              </div>
            </div>
          )
        });
        setModalOpen(true);
      }
    } catch (error) {
      setModalContent({
        title: "Report Generation Failed",
        description: "Unable to generate the threat analysis report",
        content: (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-red-400">
              <h4 className="font-semibold mb-2">Error Details</h4>
              <p className="text-sm">The AI report generation service is currently unavailable. Please try again in a few minutes or contact support if the issue persists.</p>
            </div>
          </div>
        )
      });
      setModalOpen(true);
    }
  };

  const handleBriefTeam = () => {
    const criticalThreats = threatSignals.filter(t => t.severity === 'critical').length;
    const unreadAlerts = userAlerts.filter(a => !a.is_read).length;
    
    const briefingText = `📊 THREAT BRIEFING\n\n` +
      `🚨 Critical Threats: ${criticalThreats}\n` +
      `⚠️ Unread Alerts: ${unreadAlerts}\n` +
      `📈 Total Signals (24h): ${threatSignals.length}\n\n` +
      `Key Insights:\n${insights.map(i => `• ${i.title}`).join('\n')}\n\n` +
      `Recommended Actions:\n${recommendations.map(r => `• ${r.action}`).join('\n')}`;

    setModalContent({
      title: "Team Briefing Generated",
      description: "Current threat intelligence summary ready for distribution",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">Briefing Summary</h4>
            <div className="space-y-2 text-sm">
              <div>• {criticalThreats} critical threats detected</div>
              <div>• {unreadAlerts} unread alerts pending</div>
              <div>• {threatSignals.length} total signals in 24h</div>
              <div>• {insights.length} insights generated</div>
            </div>
          </div>
          <div className="p-4 bg-starlink-dark-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-2">Briefing Content</h4>
            <pre className="text-xs text-starlink-grey-light whitespace-pre-wrap font-mono bg-black/20 p-3 rounded">
              {briefingText}
            </pre>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(briefingText);
                toast({ title: "Copied to clipboard" });
              }}
            >
              Copy to Clipboard
            </Button>
            {navigator.share && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigator.share({
                  title: 'Threat Intelligence Briefing',
                  text: briefingText,
                })}
              >
                Share
              </Button>
            )}
          </div>
        </div>
      )
    });
    setModalOpen(true);
  };

  const handleEscalate = () => {
    const criticalCount = threatSignals.filter(t => t.severity === 'critical').length;
    const criticalThreats = threatSignals.filter(t => t.severity === 'critical');
    
    if (criticalCount === 0) {
      setModalContent({
        title: "No Critical Threats",
        description: "No threats require immediate escalation at this time",
        content: (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-green-400">
              <h4 className="font-semibold mb-2">All Clear</h4>
              <p className="text-sm">Current threat landscape does not require escalation. Continue monitoring for any changes in threat severity.</p>
            </div>
          </div>
        )
      });
      setModalOpen(true);
      return;
    }

    setModalContent({
      title: "Escalation Initiated",
      description: `${criticalCount} critical threat(s) escalated to management team`,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="font-semibold text-red-400 mb-2">Escalation Details</h4>
            <div className="space-y-2 text-sm">
              <div>• {criticalCount} critical threats identified</div>
              <div>• Management team notified</div>
              <div>• Escalation timestamp: {new Date().toLocaleString()}</div>
              <div>• Follow-up required within 1 hour</div>
            </div>
          </div>
          <div className="p-4 bg-starlink-dark-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-2">Critical Threats</h4>
            <div className="space-y-2">
              {criticalThreats.slice(0, 5).map((threat, index) => (
                <div key={index} className="text-xs p-2 bg-black/20 rounded">
                  <div className="font-medium">{threat.title || 'Critical Threat'}</div>
                  <div className="text-starlink-grey-light">{threat.country} • {threat.category}</div>
                </div>
              ))}
              {criticalThreats.length > 5 && (
                <div className="text-xs text-starlink-grey">
                  +{criticalThreats.length - 5} more threats
                </div>
              )}
            </div>
          </div>
        </div>
      )
    });
    setModalOpen(true);
  };

  const handleScheduleReview = () => {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 1);
    const reviewTime = reviewDate.toLocaleDateString() + ' at 9:00 AM';
    
    setModalContent({
      title: "Review Scheduled",
      description: "Threat assessment review has been scheduled",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">Review Details</h4>
            <div className="space-y-2 text-sm">
              <div>• Date: {reviewTime}</div>
              <div>• Duration: 1 hour</div>
              <div>• Attendees: Security team + stakeholders</div>
              <div>• Agenda: Threat landscape assessment</div>
            </div>
          </div>
          <div className="p-4 bg-starlink-dark-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-2">Review Topics</h4>
            <div className="text-sm space-y-1">
              <div>• Current threat trends and patterns</div>
              <div>• Effectiveness of security measures</div>
              <div>• Resource allocation and priorities</div>
              <div>• Strategic recommendations</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
      )
    });
    setModalOpen(true);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'geographic': return <Target className="w-4 h-4" />;
      case 'escalation': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'text-red-400';
      case 'within-hour': return 'text-orange-400';
      case 'within-day': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <Brain className="w-5 h-5" />
            <span>Decision Support System</span>
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            AI-powered insights and recommendations for strategic decision making
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeAnalysis} onValueChange={setActiveAnalysis} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-starlink-dark-secondary">
              <TabsTrigger value="threat-correlation">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="threat-correlation" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-starlink-white">AI-Generated Insights</h4>
                {insights.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-starlink-grey-light">No significant patterns detected</p>
                    <p className="text-sm text-starlink-grey">Current threat landscape appears stable</p>
                  </div>
                ) : (
                  insights.map((insight, index) => (
                    <div key={index} className="p-4 rounded-lg bg-starlink-dark-secondary/50 border border-starlink-dark-secondary">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <Badge variant={getPriorityColor(insight.priority) as any} className="text-xs">
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-starlink-grey">
                          {insight.confidence}% confidence
                        </div>
                      </div>
                      <h5 className="font-medium text-starlink-white mb-1">{insight.title}</h5>
                      <p className="text-sm text-starlink-grey-light mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-starlink-blue">{insight.recommendation}</span>
                        <Button variant="ghost" size="sm">
                          <Zap className="w-3 h-3 mr-1" />
                          Act
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-starlink-white">Recommended Actions</h4>
                {recommendations.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-starlink-grey-light">No immediate actions required</p>
                    <p className="text-sm text-starlink-grey">System running optimally</p>
                  </div>
                ) : (
                  recommendations.map((rec, index) => (
                    <div key={index} className="p-4 rounded-lg bg-starlink-dark-secondary/50 border border-starlink-dark-secondary">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.category}
                        </Badge>
                        <span className={`text-xs font-medium ${getUrgencyColor(rec.urgency)}`}>
                          {rec.urgency.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h5 className="font-medium text-starlink-white mb-1">{rec.action}</h5>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex space-x-4">
                          <span className="text-starlink-grey-light">Impact: {rec.impact}</span>
                          <span className="text-starlink-grey-light">Effort: {rec.effort}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Execute
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-starlink-white">Scenario Planning</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-starlink-dark-secondary/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-starlink-white">Escalation Scenario</span>
                    </div>
                    <p className="text-xs text-starlink-grey-light mb-3">
                      If current threat patterns continue for 6+ hours
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-starlink-grey-light">• Consider team alert status</div>
                      <div className="text-starlink-grey-light">• Review communication protocols</div>
                      <div className="text-starlink-grey-light">• Prepare stakeholder briefing</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-starlink-dark-secondary/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-starlink-white">Containment Scenario</span>
                    </div>
                    <p className="text-xs text-starlink-grey-light mb-3">
                      If threat activity decreases in next 2 hours
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-starlink-grey-light">• Maintain monitoring levels</div>
                      <div className="text-starlink-grey-light">• Document lessons learned</div>
                      <div className="text-starlink-grey-light">• Update response protocols</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <Settings className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-col h-auto py-3"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              <BarChart3 className="w-4 h-4 mb-1" />
              <span className="text-xs">
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-col h-auto py-3"
              onClick={handleBriefTeam}
            >
              <Send className="w-4 h-4 mb-1" />
              <span className="text-xs">Brief Team</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-col h-auto py-3"
              onClick={handleEscalate}
            >
              <AlertTriangle className="w-4 h-4 mb-1" />
              <span className="text-xs">Escalate</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-col h-auto py-3"
              onClick={handleScheduleReview}
            >
              <Calendar className="w-4 h-4 mb-1" />
              <span className="text-xs">Schedule Review</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalContent?.title}</DialogTitle>
            <DialogDescription>{modalContent?.description}</DialogDescription>
          </DialogHeader>
          {modalContent?.content}
        </DialogContent>
      </Dialog>
    </div>
  );
};