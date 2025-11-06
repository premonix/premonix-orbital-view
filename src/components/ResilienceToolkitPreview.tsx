import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Users, 
  PlayCircle, 
  Download, 
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import FeaturePreviewOverlay from './FeaturePreviewOverlay';
import CreateAccountForm from './CreateAccountForm';
import { useAuth } from '@/contexts/AuthContext';

const ResilienceToolkitPreview = () => {
  const { upgradeRole, user } = useAuth();

  const toolkitSections = [
    {
      category: "Assessment",
      description: "Evaluate your organization's vulnerabilities and readiness",
      tools: [
        {
          title: "Business Impact Assessment",
          description: "Evaluate potential disruption scenarios and their business impact",
          type: "Interactive Tool",
          icon: <FileText className="w-5 h-5" />,
          status: "available",
          requiredRole: 'business' as const,
          features: ["Risk scoring", "Scenario analysis", "Impact visualization", "Mitigation planning"]
        },
        {
          title: "Supply Chain Risk Mapper",
          description: "Identify vulnerabilities in your supply chain network",
          type: "Analysis Tool",
          icon: <Zap className="w-5 h-5" />,
          status: "beta",
          requiredRole: 'business' as const,
          features: ["Network visualization", "Risk assessment", "Alternative sourcing", "Dependency mapping"]
        }
      ]
    },
    {
      category: "Planning",
      description: "Develop comprehensive crisis response strategies",
      tools: [
        {
          title: "Crisis Response Playbook",
          description: "Step-by-step guidance for various threat scenarios",
          type: "Framework",
          icon: <Users className="w-5 h-5" />,
          status: "available",
          requiredRole: 'registered' as const,
          features: ["Scenario playbooks", "Response templates", "Communication plans", "Recovery procedures"]
        },
        {
          title: "Communication Templates",
          description: "Pre-drafted messages for stakeholder communication during crises",
          type: "Templates",
          icon: <FileText className="w-5 h-5" />,
          status: "available",
          requiredRole: 'registered' as const,
          features: ["Employee notifications", "Customer advisories", "Media statements", "Stakeholder updates"]
        }
      ]
    },
    {
      category: "Training",
      description: "Build organizational resilience through education and simulation",
      tools: [
        {
          title: "Threat Awareness Training",
          description: "Interactive modules for team threat awareness",
          type: "Course",
          icon: <PlayCircle className="w-5 h-5" />,
          status: "available",
          requiredRole: 'registered' as const,
          features: ["Interactive modules", "Progress tracking", "Certification", "Team analytics"]
        },
        {
          title: "Scenario Simulation",
          description: "Practice responses to realistic threat scenarios",
          type: "Simulation",
          icon: <Users className="w-5 h-5" />,
          status: "coming-soon",
          requiredRole: 'enterprise' as const,
          features: ["Live simulations", "Team coordination", "Performance metrics", "After-action reports"]
        }
      ]
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'registered': return 'text-blue-400 border-blue-400/30';
      case 'business': return 'text-green-400 border-green-400/30';
      case 'enterprise': return 'text-purple-400 border-purple-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-starlink-blue mr-3" />
          <h1 className="text-4xl font-bold text-starlink-white">Resilience Toolkit</h1>
        </div>
        <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
          Comprehensive tools and resources to build organizational resilience against emerging threats. 
          Transform from reactive monitoring to proactive preparedness.
        </p>
      </div>

      {/* Toolkit Sections */}
      <div className="space-y-12">
        {toolkitSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-starlink-blue mb-2">{section.category}</h2>
              <p className="text-starlink-grey-light">{section.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.tools.map((tool, toolIndex) => (
                <Card key={toolIndex} className="glass-panel border-starlink-grey/30 relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-starlink-blue/20 rounded-lg">
                          {tool.icon}
                        </div>
                        <div>
                          <CardTitle className="text-starlink-white">{tool.title}</CardTitle>
                          <CardDescription className="text-starlink-grey-light">
                            {tool.type}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`${getStatusColor(tool.status)} text-white`}>
                          {tool.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getRoleColor(tool.requiredRole)}`}>
                          {tool.requiredRole}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-starlink-grey-light">{tool.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-starlink-white mb-2">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {tool.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-starlink-blue flex-shrink-0" />
                              <span className="text-sm text-starlink-grey-light">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-starlink-grey/20">
                        {user ? (
                          <Button 
                            size="sm" 
                            className="w-full bg-starlink-blue/20 border border-starlink-blue/30 text-starlink-blue hover:bg-starlink-blue/30"
                            onClick={() => upgradeRole(tool.requiredRole)}
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Learn More - {tool.requiredRole} Plan
                          </Button>
                        ) : (
                          <CreateAccountForm variant="modal">
                            <Button 
                              size="sm" 
                              className="w-full bg-starlink-blue/20 border border-starlink-blue/30 text-starlink-blue hover:bg-starlink-blue/30"
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Sign Up to Access - {tool.requiredRole} Plan
                            </Button>
                          </CreateAccountForm>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Preview Overlay */}
                  <FeaturePreviewOverlay
                    featureName={tool.title}
                    description={`Access ${tool.title} and start building your organizational resilience today.`}
                    requiredRole={tool.requiredRole}
                    className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16">
        <Card className="glass-panel border-starlink-blue/50 bg-gradient-to-r from-starlink-blue/10 to-starlink-purple/10">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-starlink-blue mr-3" />
                <h3 className="text-2xl font-bold text-starlink-white">Ready to Build Resilience?</h3>
              </div>
              <p className="text-starlink-grey-light mb-6 max-w-2xl mx-auto">
                Join thousands of organizations using PREMONIX Resilience Toolkit to prepare for and respond to emerging threats.
                Access personalized tools, training, and resources in your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Button 
                      onClick={() => upgradeRole('individual')}
                      className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold px-8"
                    >
                      Access Dashboard
                    </Button>
                    <Button 
                      onClick={() => upgradeRole('team_admin')}
                      variant="outline"
                      className="border-starlink-blue/40 text-starlink-blue hover:bg-starlink-blue/10 px-8"
                    >
                      Upgrade to Business
                    </Button>
                  </>
                ) : (
                  <>
                    <CreateAccountForm variant="modal">
                      <Button 
                        className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold px-8"
                      >
                        Sign Up Free - Access Dashboard
                      </Button>
                    </CreateAccountForm>
                    <CreateAccountForm variant="modal">
                      <Button 
                        variant="outline"
                        className="border-starlink-blue/40 text-starlink-blue hover:bg-starlink-blue/10 px-8"
                      >
                        Sign Up - Business Plan
                      </Button>
                    </CreateAccountForm>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResilienceToolkitPreview;