import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  Users, 
  PlayCircle, 
  Download, 
  ExternalLink,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import BusinessImpactAssessment from '@/components/resilience/BusinessImpactAssessment';
import CrisisResponsePlaybook from '@/components/resilience/CrisisResponsePlaybook';
import ThreatAwarenessTraining from '@/components/resilience/ThreatAwarenessTraining';
import UserProfileForm from '@/components/sowhat/UserProfileForm';
import ResilienceToolkitComponent from '@/components/sowhat/ResilienceToolkit';
import { UserProfile } from '@/types/sowhat';
import PermissionGate from '@/components/auth/PermissionGate';

interface ResilienceToolkitWidgetProps {
  userProfile?: UserProfile | any;
  threatSignals: any[];
  userId: string;
}

export const ResilienceToolkitWidget = ({ userProfile, threatSignals, userId }: ResilienceToolkitWidgetProps) => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(userProfile || null);

  const toolkitSections = [
    {
      category: "Assessment",
      tools: [
        {
          title: "Business Impact Assessment",
          description: "Evaluate potential disruption scenarios and their business impact",
          type: "Interactive Tool",
          icon: <FileText className="w-5 h-5" />,
          status: "available",
          requiredRole: 'business' as const,
          action: () => setActiveView('business-impact')
        },
        {
          title: "Supply Chain Risk Mapper",
          description: "Identify vulnerabilities in your supply chain network",
          type: "Analysis Tool",
          icon: <Zap className="w-5 h-5" />,
          status: "beta",
          requiredRole: 'business' as const,
          action: () => setActiveView('supply-chain')
        }
      ]
    },
    {
      category: "Planning",
      tools: [
        {
          title: "Crisis Response Playbook",
          description: "Step-by-step guidance for various threat scenarios",
          type: "Framework",
          icon: <Users className="w-5 h-5" />,
          status: "available",
          requiredRole: 'registered' as const,
          action: () => setActiveView('crisis-playbook')
        },
        {
          title: "Communication Templates",
          description: "Pre-drafted messages for stakeholder communication during crises",
          type: "Templates",
          icon: <FileText className="w-5 h-5" />,
          status: "available",
          requiredRole: 'registered' as const,
          action: () => setActiveView('communication')
        }
      ]
    },
    {
      category: "Training",
      tools: [
        {
          title: "Threat Awareness Training",
          description: "Interactive modules for team threat awareness",
          type: "Course",
          icon: <PlayCircle className="w-5 h-5" />,
          status: "available",
          requiredRole: 'registered' as const,
          action: () => setActiveView('training')
        },
        {
          title: "Scenario Simulation",
          description: "Practice responses to realistic threat scenarios",
          type: "Simulation",
          icon: <Users className="w-5 h-5" />,
          status: "coming-soon",
          requiredRole: 'enterprise' as const,
          action: () => {}
        }
      ]
    }
  ];

  const resources = [
    {
      title: "Global Threat Landscape 2024",
      type: "Report",
      size: "2.4 MB",
      downloads: "1,247",
      requiredRole: 'registered' as const
    },
    {
      title: "Cyber Resilience Checklist",
      type: "PDF",
      size: "580 KB",
      downloads: "3,156",
      requiredRole: 'registered' as const
    },
    {
      title: "Supply Chain Risk Framework",
      type: "Guide",
      size: "1.8 MB",
      downloads: "892",
      requiredRole: 'business' as const
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setCurrentUserProfile(profile);
    setActiveView('personalized-toolkit');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'business-impact':
        return (
          <PermissionGate permission="scenario_simulator" requiredRole="business">
            <BusinessImpactAssessment />
          </PermissionGate>
        );
      case 'crisis-playbook':
        return (
          <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
            <CrisisResponsePlaybook />
          </PermissionGate>
        );
      case 'training':
        return (
          <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
            <ThreatAwarenessTraining />
          </PermissionGate>
        );
      case 'profile-form':
        return (
          <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
            <UserProfileForm onComplete={handleProfileComplete} />
          </PermissionGate>
        );
      case 'personalized-toolkit':
        return currentUserProfile ? (
          <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
            <ResilienceToolkitComponent userProfile={currentUserProfile} />
          </PermissionGate>
        ) : null;
      case 'supply-chain':
        return (
          <PermissionGate permission="scenario_simulator" requiredRole="business">
            <Card className="glass-panel border-starlink-orange/50 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-starlink-orange">Supply Chain Risk Mapper</CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  This tool is currently in beta development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-starlink-grey-light mb-4">
                  Our supply chain risk mapping tool will help you visualize and assess vulnerabilities 
                  in your supply network. Features will include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-starlink-grey-light mb-6">
                  <li>Interactive supply chain visualization</li>
                  <li>Risk scoring for each supplier</li>
                  <li>Geographic risk assessment</li>
                  <li>Alternative sourcing recommendations</li>
                </ul>
                <Button 
                  onClick={() => setActiveView('overview')}
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                >
                  Back to Overview
                </Button>
              </CardContent>
            </Card>
          </PermissionGate>
        );
      case 'communication':
        return (
          <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
            <Card className="glass-panel border-starlink-blue/50 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-starlink-blue">Crisis Communication Templates</CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Pre-drafted communication templates for various crisis scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-panel border-starlink-grey/30">
                    <CardHeader>
                      <CardTitle className="text-starlink-white">Employee Notification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-starlink-grey-light text-sm mb-4">
                        Template for notifying employees about ongoing crisis situations
                      </p>
                      <Button size="sm" variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                        View Template
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-panel border-starlink-grey/30">
                    <CardHeader>
                      <CardTitle className="text-starlink-white">Customer Advisory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-starlink-grey-light text-sm mb-4">
                        Template for communicating service disruptions to customers
                      </p>
                      <Button size="sm" variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                        View Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="glass-panel border-starlink-grey/30">
                    <CardHeader>
                      <CardTitle className="text-starlink-white">Media Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-starlink-grey-light text-sm mb-4">
                        Template for official media statements during crisis
                      </p>
                      <Button size="sm" variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                        View Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="glass-panel border-starlink-grey/30">
                    <CardHeader>
                      <CardTitle className="text-starlink-white">Stakeholder Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-starlink-grey-light text-sm mb-4">
                        Template for updating stakeholders and investors
                      </p>
                      <Button size="sm" variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                        View Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={() => setActiveView('overview')}
                    className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                  >
                    Back to Overview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGate>
        );
      default:
        return null;
    }
  };

  if (activeView !== 'overview') {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Button 
            variant="outline"
            onClick={() => setActiveView('overview')}
            className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
          >
            ← Back to Toolkit
          </Button>
        </div>
        {renderActiveView()}
      </div>
    );
  }

  return (
    <Card className="glass-panel border-starlink-grey/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-starlink-white flex items-center">
              <Shield className="w-6 h-6 mr-2 text-starlink-blue" />
              Resilience Toolkit
            </CardTitle>
            <CardDescription className="text-starlink-grey-light">
              Comprehensive tools and resources to build organizational resilience
            </CardDescription>
          </div>
          <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30">
            Dashboard Tool
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="glass-panel border-starlink-grey/30">
            <TabsTrigger value="tools">Assessment Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            {toolkitSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-lg font-semibold mb-3 text-starlink-blue">{section.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.tools.map((tool, toolIndex) => (
                    <Card key={toolIndex} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-starlink-blue/20 rounded-lg">
                              {tool.icon}
                            </div>
                            <div>
                              <CardTitle className="text-starlink-white text-sm">{tool.title}</CardTitle>
                              <CardDescription className="text-starlink-grey-light text-xs">
                                {tool.type}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(tool.status)} text-white text-xs`}>
                            {tool.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-starlink-grey-light mb-3 text-sm">{tool.description}</p>
                        <PermissionGate 
                          permission={tool.requiredRole === 'business' ? 'scenario_simulator' : 'view_resilience_toolkit'}
                          requiredRole={tool.requiredRole}
                          fallback={
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-starlink-grey/40 text-starlink-grey-light cursor-not-allowed"
                              disabled
                            >
                              Requires {tool.requiredRole} plan
                            </Button>
                          }
                        >
                          <Button 
                            size="sm" 
                            className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                            disabled={tool.status === 'coming-soon'}
                            onClick={tool.action}
                          >
                            {tool.status === 'coming-soon' ? 'Coming Soon' : 'Launch Tool'}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </PermissionGate>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, index) => (
                <Card key={index} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-starlink-white flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2 text-starlink-blue" />
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-starlink-grey-light text-xs">
                      {resource.type} • {resource.size}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-starlink-grey-light">
                        {resource.downloads} downloads
                      </span>
                      <PermissionGate 
                        permission={resource.requiredRole === 'business' ? 'scenario_simulator' : 'view_resilience_toolkit'}
                        requiredRole={resource.requiredRole}
                        fallback={
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-starlink-grey/40 text-starlink-grey-light cursor-not-allowed text-xs"
                            disabled
                          >
                            Requires {resource.requiredRole}
                          </Button>
                        }
                      >
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </PermissionGate>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <div className="text-center py-6">
              <PlayCircle className="w-12 h-12 text-starlink-blue mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Interactive Training Modules</h3>
              <p className="text-starlink-grey-light mb-4 text-sm">
                Comprehensive training programs to enhance your team's threat awareness and response capabilities
              </p>
              <div className="flex space-x-3 justify-center">
                <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
                  <Button 
                    onClick={() => setActiveView('training')}
                    className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                  >
                    Start Training Program
                  </Button>
                </PermissionGate>
                <PermissionGate permission="view_resilience_toolkit" requiredRole="registered">
                  <Button 
                    onClick={() => setActiveView('profile-form')}
                    variant="outline"
                    className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                  >
                    Build Personalized Kit
                  </Button>
                </PermissionGate>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResilienceToolkitWidget;