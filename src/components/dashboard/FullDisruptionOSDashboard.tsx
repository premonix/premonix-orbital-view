import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Target, 
  Building, 
  Brain, 
  Network, 
  FileText, 
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Calendar,
  Clock
} from "lucide-react";

interface FullDisruptionOSDashboardProps {
  userId: string;
}

export const FullDisruptionOSDashboard = ({ userId }: FullDisruptionOSDashboardProps) => {
  const [activeModule, setActiveModule] = useState('control');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [dssScore, setDssScore] = useState(72);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const modules = [
    {
      id: 'control',
      icon: Shield,
      title: 'PREMONIX Control',
      subtitle: 'Disruption Preparedness Office',
      status: 'Active',
      users: 12,
      alerts: 3,
      color: 'bg-green-500'
    },
    {
      id: 'risklens',
      icon: Target,
      title: 'Risk Lens™',
      subtitle: 'Disruption Sensitivity Score',
      status: 'Monitoring',
      score: dssScore,
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
    },
    {
      id: 'briefings',
      icon: FileText,
      title: 'Briefings™',
      subtitle: 'Governance Layer',
      status: 'Scheduled',
      reports: 5,
      nextBriefing: '2h 30m',
      color: 'bg-indigo-500'
    }
  ];

  const reportTypes = {
    executiveBriefing: {
      title: 'Executive Briefing - Strategic Overview',
      type: 'Executive Report',
      date: new Date().toLocaleDateString(),
      summary: 'Comprehensive analysis of current disruption landscape and strategic recommendations'
    },
    dssReport: {
      title: 'DSS Analysis Report - Sensitivity Deep Dive',
      type: 'Risk Assessment',
      date: new Date().toLocaleDateString(),
      summary: 'Detailed analysis of organizational disruption sensitivity factors and trend evolution',
      currentScore: 72
    },
    threatAnalysis: {
      title: 'Threat Intelligence Analysis',
      type: 'Intelligence Report',
      date: new Date().toLocaleDateString(),
      summary: 'Comprehensive analysis of current threat landscape and emerging risks'
    }
  };

  const ReportModal = ({ report, onClose }: { report: any; onClose: () => void }) => {
    if (!report) return null;
    
    return (
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <FileText className="w-6 h-6 mr-3 text-primary" />
            {report.title}
          </DialogTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Badge variant="secondary">{report.type}</Badge>
            <span>Generated: {report.date}</span>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{report.summary}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    );
  };

  const renderControlDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-amber-500">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escalations</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-sm font-semibold text-green-500">All Systems Go</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Threat Watchlist</CardTitle>
            <CardDescription>Active monitoring targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Supply Chain - Asia Pacific', 'Cyber - Financial Sector', 'Geopolitical - Eastern Europe'].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span>{item}</span>
                  <Badge variant="destructive">High</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedReport(reportTypes.executiveBriefing)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                </DialogTrigger>
                <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { 
                  time: '2 hours ago', 
                  action: 'Executive briefing generated', 
                  value: 'Strategic overview',
                  reportType: 'executiveBriefing'
                },
                { 
                  time: '4 hours ago', 
                  action: 'Threat analysis completed', 
                  value: 'Supply chain alert',
                  reportType: 'threatAnalysis'
                },
                { 
                  time: '6 hours ago', 
                  action: 'DSS report updated', 
                  value: '+5 points increase',
                  reportType: 'dssReport'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time} - {item.value}</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setSelectedReport(reportTypes[item.reportType as keyof typeof reportTypes])}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRiskLensDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current DSS Score</p>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                    className="text-primary" strokeDasharray={`${dssScore * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{dssScore}</span>
                </div>
              </div>
              <Badge variant="secondary">Elevated</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">DSS Components</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedReport(reportTypes.dssReport)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Report
                  </Button>
                </DialogTrigger>
                <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Geographic', score: 85, color: 'bg-red-500' },
                { name: 'Industry', score: 60, color: 'bg-yellow-500' },
                { name: 'Dependencies', score: 70, color: 'bg-orange-500' }
              ].map((component, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{component.name}</span>
                    <span className="text-muted-foreground">{component.score}</span>
                  </div>
                  <Progress value={component.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>7-day change</span>
                <span className="text-green-500 font-semibold">+5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>30-day change</span>
                <span className="text-red-500 font-semibold">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Peak this month</span>
                <span className="text-muted-foreground">89</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>DSS Builder</CardTitle>
          <CardDescription>Configure your disruption sensitivity parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Primary Location</Label>
                <Input id="location" defaultValue="New York, NY" />
              </div>
              <div>
                <Label htmlFor="industry">Industry Sector</Label>
                <Input id="industry" defaultValue="Financial Services" />
              </div>
              <div>
                <Label htmlFor="dependencies">Key Dependencies</Label>
                <Textarea id="dependencies" placeholder="List critical dependencies..." />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-size">Team Size</Label>
                <Input id="team-size" type="number" defaultValue="50" />
              </div>
              <div>
                <Label htmlFor="revenue">Annual Revenue</Label>
                <Input id="revenue" defaultValue="$10M - $50M" />
              </div>
              <Button className="w-full">
                Update DSS Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModuleDashboard = () => {
    switch (activeModule) {
      case 'control':
        return renderControlDashboard();
      case 'risklens':
        return renderRiskLensDashboard();
      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Module In Development</h3>
                <p className="text-muted-foreground">This module is currently being developed and will be available soon.</p>
                <Button>
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Disruption<span className="text-primary">OS</span> Dashboard
          </h2>
          <p className="text-muted-foreground">Strategic disruption management command center</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="alerts">Alerts</Label>
            <Switch 
              id="alerts" 
              checked={alertsEnabled} 
              onCheckedChange={setAlertsEnabled}
            />
          </div>
          <Badge variant="secondary">Enterprise Edition</Badge>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Card 
              key={module.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isActive ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setActiveModule(module.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${module.color}`} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline">{module.status}</Badge>
                  </div>
                  
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
                  
                  {module.users && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="font-semibold">{module.users}</span>
                    </div>
                  )}
                  
                  {module.initiatives && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Initiatives</span>
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
                      <span className="text-sm text-muted-foreground">Signals</span>
                      <span className="font-semibold">{module.signals}</span>
                    </div>
                  )}
                  
                  {module.reports && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reports</span>
                      <span className="font-semibold">{module.reports}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Active Module Dashboard */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          {modules.find(m => m.id === activeModule) && 
            React.createElement(modules.find(m => m.id === activeModule)!.icon, { className: "w-6 h-6 text-primary" })
          }
          <h3 className="text-2xl font-bold">
            {modules.find(m => m.id === activeModule)?.title}
          </h3>
        </div>
        
        {renderModuleDashboard()}
      </div>
    </div>
  );
};