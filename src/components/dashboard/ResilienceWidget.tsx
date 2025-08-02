import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Users,
  ArrowRight
} from 'lucide-react';

interface ResilienceWidgetProps {
  userProfile?: any;
  threatSignals: any[];
  userId: string;
}

export const ResilienceWidget = ({ userProfile, threatSignals, userId }: ResilienceWidgetProps) => {
  const [activeSection, setActiveSection] = useState('overview');

  // Calculate DSS (Disruption Sensitivity Score) based on user profile and threat data
  const calculateDSS = () => {
    if (!userProfile) return { score: 0, level: 'Unknown', factors: [] };

    let score = 0;
    const factors = [];

    // Geographic risk
    const locationThreats = threatSignals.filter(signal => 
      signal.country === userProfile.location
    ).length;
    if (locationThreats > 5) {
      score += 25;
      factors.push('High regional threat activity');
    } else if (locationThreats > 2) {
      score += 15;
      factors.push('Moderate regional threat activity');
    }

    // Business dependencies
    if (userProfile.dependencies?.length > 3) {
      score += 20;
      factors.push('Multiple critical dependencies');
    }

    // Critical infrastructure
    if (userProfile.hasCriticalInfrastructure) {
      score += 25;
      factors.push('Critical infrastructure exposure');
    }

    // Remote workers
    if (userProfile.hasRemoteWorkers) {
      score += 10;
      factors.push('Remote workforce complexity');
    }

    // Team size vulnerability
    if (userProfile.teamSize > 100) {
      score += 15;
      factors.push('Large organization coordination');
    }

    const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
    return { score: Math.min(score, 100), level, factors };
  };

  const dss = calculateDSS();

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

    if (dss.score >= 70) {
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
            <div className={`text-right ${getDSSColor(dss.level)}`}>
              <div className="text-2xl font-bold">{dss.score}/100</div>
              <div className="text-sm">{dss.level} Risk</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={dss.score} className="h-2" />
          
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

          <Button variant="outline" size="sm" className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Recalculate DSS
          </Button>
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