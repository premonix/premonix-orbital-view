import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Shield, 
  Target, 
  Building, 
  Brain, 
  Network, 
  FileText, 
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  Eye,
  Play,
  Pause,
  ExternalLink
} from "lucide-react";
import { OpsLensWidget } from "./OpsLensWidget";
import { SignalGraphWidget } from "./SignalGraphWidget";
import { EnhancedBriefingWidget } from "./EnhancedBriefingWidget";
import { DSSAssessment } from "./DSSAssessment";

interface DisruptionOSModulesWidgetProps {
  userId: string;
}

export const DisruptionOSModulesWidget = ({ userId }: DisruptionOSModulesWidgetProps) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const modules = [
    {
      id: 'risklens',
      icon: Target,
      title: 'Risk Lens™',
      subtitle: 'Disruption Sensitivity Score',
      status: 'Monitoring',
      score: 72,
      trend: '+5%',
      color: 'bg-blue-500'
    },
    {
      id: 'opslens',
      icon: Building,
      title: 'OpsLens™',
      subtitle: 'Initiative Portfolio',
      status: 'Planning',
      initiatives: 8,
      riskLevel: 'Medium',
      color: 'bg-yellow-500'
    },
    {
      id: 'futuresim',
      icon: Brain,
      title: 'Future Sim™',
      subtitle: 'Sandbox Engine',
      status: 'Ready',
      scenarios: 3,
      simulations: 15,
      color: 'bg-purple-500'
    },
    {
      id: 'signalgraph',
      icon: Network,
      title: 'SignalGraph™',
      subtitle: 'Signal to Strategy',
      status: 'Processing',
      signals: 47,
      correlations: 12,
      color: 'bg-orange-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>DisruptionOS Modules</span>
        </CardTitle>
        <CardDescription>
          Enterprise-grade disruption preparedness tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div 
                key={module.id} 
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedModule(module.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{module.title}</h4>
                      <p className="text-xs text-muted-foreground">{module.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {module.status}
                    </Badge>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {module.score && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">DSS Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{module.score}</span>
                        <Badge variant="secondary" className="text-xs">
                          {module.trend}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {module.initiatives && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Initiatives</span>
                      <span className="font-semibold">{module.initiatives}</span>
                    </div>
                  )}
                  
                  {module.scenarios && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Scenarios</span>
                      <span className="font-semibold">{module.scenarios}</span>
                    </div>
                  )}
                  
                  {module.signals && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Signals</span>
                      <span className="font-semibold">{module.signals}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Enterprise features powered by DisruptionOS™
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Full Suite
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              Launch Modules
            </Button>
          </div>
        </div>

        {/* Module Detail Modals */}
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedModule === 'risklens' && (
                  <>
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Risk Lens™ - Disruption Sensitivity Assessment</span>
                  </>
                )}
                {selectedModule === 'opslens' && (
                  <>
                    <Building className="w-5 h-5 text-yellow-500" />
                    <span>OpsLens™ - Initiative Portfolio Management</span>
                  </>
                )}
                {selectedModule === 'futuresim' && (
                  <>
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>Future Sim™ - Strategic Scenario Modeling</span>
                  </>
                )}
                {selectedModule === 'signalgraph' && (
                  <>
                    <Network className="w-5 h-5 text-orange-500" />
                    <span>SignalGraph™ - Signal to Strategy Analysis</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {selectedModule === 'risklens' && (
                <DSSAssessment userId={userId} />
              )}
              {selectedModule === 'opslens' && (
                <OpsLensWidget userId={userId} />
              )}
              {selectedModule === 'futuresim' && (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-xl font-semibold mb-2">Future Sim™ Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced scenario modeling and strategic simulation capabilities are in development.
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="p-3 border rounded">
                      <h4 className="font-semibold text-sm">Scenario Builder</h4>
                      <p className="text-xs text-muted-foreground">Create custom scenarios</p>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-semibold text-sm">Impact Modeling</h4>
                      <p className="text-xs text-muted-foreground">Simulate outcomes</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedModule === 'signalgraph' && (
                <SignalGraphWidget userId={userId} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};