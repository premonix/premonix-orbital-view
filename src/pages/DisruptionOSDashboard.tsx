import React, { useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Target, 
  Zap, 
  Brain, 
  Network, 
  FileText, 
  Building,
  Users,
  Globe,
  Settings,
  Activity,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Upload,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Eye,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

const DisruptionOSDashboard = () => {
  const [activeModule, setActiveModule] = useState('control');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [dssScore, setDssScore] = useState(72);

  const modules = [
    {
      id: 'control',
      icon: Shield,
      title: 'PREMONIX Control',
      subtitle: 'Disruption Preparedness Office',
      status: 'Active',
      users: 12,
      alerts: 3
    },
    {
      id: 'risklens',
      icon: Target,
      title: 'Risk Lens™',
      subtitle: 'Disruption Sensitivity Score',
      status: 'Monitoring',
      score: dssScore,
      trend: '+5%'
    },
    {
      id: 'opslens',
      icon: Building,
      title: 'OpsLens™',
      subtitle: 'Initiative Portfolio',
      status: 'Planning',
      initiatives: 8,
      riskLevel: 'Medium'
    },
    {
      id: 'futuresim',
      icon: Brain,
      title: 'Future Sim™',
      subtitle: 'Sandbox Engine',
      status: 'Ready',
      scenarios: 3,
      simulations: 15
    },
    {
      id: 'signalgraph',
      icon: Network,
      title: 'SignalGraph™',
      subtitle: 'Signal to Strategy',
      status: 'Processing',
      signals: 47,
      correlations: 12
    },
    {
      id: 'briefings',
      icon: FileText,
      title: 'Briefings™',
      subtitle: 'Governance Layer',
      status: 'Scheduled',
      reports: 5,
      nextBriefing: '2h 30m'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Monitoring': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
      case 'Processing': return 'bg-purple-500';
      case 'Scheduled': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getActiveModule = () => {
    return modules.find(m => m.id === activeModule) || modules[0];
  };

  const renderControlDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Active Users</p>
                <p className="text-2xl font-bold text-starlink-white">12</p>
              </div>
              <Users className="w-8 h-8 text-starlink-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Active Alerts</p>
                <p className="text-2xl font-bold text-starlink-orange">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-starlink-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">Escalations</p>
                <p className="text-2xl font-bold text-starlink-white">0</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-starlink-grey-light">System Status</p>
                <p className="text-sm font-semibold text-green-500">All Systems Go</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border-starlink-grey/30">
          <CardHeader>
            <CardTitle className="text-starlink-white">Threat Watchlist</CardTitle>
            <CardDescription className="text-starlink-grey-light">Active monitoring targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Supply Chain - Asia Pacific', 'Cyber - Financial Sector', 'Geopolitical - Eastern Europe'].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-starlink-slate/20 rounded-lg">
                  <span className="text-starlink-white">{item}</span>
                  <Badge className="bg-starlink-blue text-starlink-dark">High</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardHeader>
            <CardTitle className="text-starlink-white">Recent Activities</CardTitle>
            <CardDescription className="text-starlink-grey-light">Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', action: 'DSS score updated', value: '+5 points' },
                { time: '4 hours ago', action: 'New signal processed', value: 'Supply chain alert' },
                { time: '6 hours ago', action: 'Briefing generated', value: 'Executive summary' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-starlink-blue rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-starlink-white">{item.action}</p>
                    <p className="text-xs text-starlink-grey-light">{item.time} - {item.value}</p>
                  </div>
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
        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-starlink-grey-light mb-2">Current DSS Score</p>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-starlink-slate" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                    className="text-starlink-blue" strokeDasharray={`${dssScore * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-starlink-white">{dssScore}</span>
                </div>
              </div>
              <Badge className="bg-starlink-blue text-starlink-dark">Elevated</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardHeader>
            <CardTitle className="text-starlink-white text-lg">DSS Components</CardTitle>
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
                    <span className="text-starlink-white">{component.name}</span>
                    <span className="text-starlink-grey-light">{component.score}</span>
                  </div>
                  <Progress value={component.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardHeader>
            <CardTitle className="text-starlink-white text-lg">Trending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-starlink-white">7-day change</span>
                <span className="text-green-500 font-semibold">+5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-starlink-white">30-day change</span>
                <span className="text-red-500 font-semibold">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-starlink-white">Peak this month</span>
                <span className="text-starlink-grey-light">89</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white">DSS Builder</CardTitle>
          <CardDescription className="text-starlink-grey-light">Configure your disruption sensitivity parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-starlink-white">Primary Location</Label>
                <Input id="location" defaultValue="New York, NY" className="bg-starlink-slate border-starlink-grey/20 text-starlink-white" />
              </div>
              <div>
                <Label htmlFor="industry" className="text-starlink-white">Industry Sector</Label>
                <Input id="industry" defaultValue="Financial Services" className="bg-starlink-slate border-starlink-grey/20 text-starlink-white" />
              </div>
              <div>
                <Label htmlFor="dependencies" className="text-starlink-white">Key Dependencies</Label>
                <Textarea id="dependencies" placeholder="List critical dependencies..." className="bg-starlink-slate border-starlink-grey/20 text-starlink-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-size" className="text-starlink-white">Team Size</Label>
                <Input id="team-size" type="number" defaultValue="50" className="bg-starlink-slate border-starlink-grey/20 text-starlink-white" />
              </div>
              <div>
                <Label htmlFor="revenue" className="text-starlink-white">Annual Revenue</Label>
                <Input id="revenue" defaultValue="$10M - $50M" className="bg-starlink-slate border-starlink-grey/20 text-starlink-white" />
              </div>
              <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark w-full">
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
          <Card className="glass-panel border-starlink-grey/30">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-starlink-blue/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-8 h-8 text-starlink-blue" />
                </div>
                <h3 className="text-xl font-semibold text-starlink-white">Module In Development</h3>
                <p className="text-starlink-grey-light">This module is currently being developed and will be available soon.</p>
                <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark">
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Disruption<span className="text-starlink-blue">OS</span> Dashboard
              </h1>
              <p className="text-starlink-grey-light">Strategic disruption management command center</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="alerts" className="text-starlink-white">Alerts</Label>
                <Switch 
                  id="alerts" 
                  checked={alertsEnabled} 
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
              <Button variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Module Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className={`glass-panel cursor-pointer transition-all duration-300 ${
                    activeModule === module.id 
                      ? 'border-starlink-blue/50 bg-starlink-blue/10' 
                      : 'border-starlink-grey/30 hover:border-starlink-blue/30'
                  }`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-starlink-blue/20 rounded-lg">
                          <IconComponent className="w-5 h-5 text-starlink-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-starlink-white">{module.title}</h3>
                          <p className="text-xs text-starlink-grey-light">{module.subtitle}</p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`}></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-starlink-grey/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-starlink-grey-light">Status: {module.status}</span>
                        {module.users && <span className="text-starlink-white">{module.users} users</span>}
                        {module.score && <span className="text-starlink-blue">DSS: {module.score}</span>}
                        {module.initiatives && <span className="text-starlink-white">{module.initiatives} initiatives</span>}
                        {module.scenarios && <span className="text-starlink-white">{module.scenarios} scenarios</span>}
                        {module.signals && <span className="text-starlink-white">{module.signals} signals</span>}
                        {module.reports && <span className="text-starlink-white">{module.reports} reports</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Active Module Dashboard */}
          <Card className="glass-panel border-starlink-grey/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-starlink-blue/20 rounded-lg">
                    {React.createElement(getActiveModule().icon, { className: "w-6 h-6 text-starlink-blue" })}
                  </div>
                  <div>
                    <CardTitle className="text-starlink-white">{getActiveModule().title}</CardTitle>
                    <CardDescription className="text-starlink-blue">{getActiveModule().subtitle}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-starlink-blue text-starlink-dark">
                  {getActiveModule().status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderModuleDashboard()}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DisruptionOSDashboard;