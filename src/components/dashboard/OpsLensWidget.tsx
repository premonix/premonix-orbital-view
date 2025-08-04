import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building, 
  Plus, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign
} from "lucide-react";

interface Initiative {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: 'low' | 'medium' | 'high';
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  owner: string;
  team: string[];
}

interface OpsLensWidgetProps {
  userId: string;
}

export const OpsLensWidget = ({ userId }: OpsLensWidgetProps) => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([
    {
      id: '1',
      title: 'Supply Chain Resilience Program',
      description: 'Diversify supplier base and establish backup supply routes',
      status: 'in-progress',
      priority: 'high',
      riskLevel: 'medium',
      progress: 65,
      budget: 250000,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      owner: 'Sarah Chen',
      team: ['Operations', 'Procurement', 'Risk Management']
    },
    {
      id: '2',
      title: 'Cybersecurity Infrastructure Upgrade',
      description: 'Implement zero-trust architecture and enhanced monitoring',
      status: 'planning',
      priority: 'critical',
      riskLevel: 'high',
      progress: 15,
      budget: 500000,
      startDate: '2024-03-01',
      endDate: '2024-12-15',
      owner: 'Michael Rodriguez',
      team: ['IT Security', 'Infrastructure', 'Compliance']
    },
    {
      id: '3',
      title: 'Crisis Communication Framework',
      description: 'Develop comprehensive internal and external communication protocols',
      status: 'completed',
      priority: 'medium',
      riskLevel: 'low',
      progress: 100,
      budget: 75000,
      startDate: '2023-10-01',
      endDate: '2024-01-31',
      owner: 'Emma Thompson',
      team: ['Communications', 'Legal', 'HR']
    }
  ]);

  const [isAddingInitiative, setIsAddingInitiative] = useState(false);

  const getStatusIcon = (status: Initiative['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'planning': return <Target className="w-4 h-4 text-yellow-500" />;
      case 'on-hold': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: Initiative['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getRiskColor = (risk: Initiative['riskLevel']) => {
    switch (risk) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const totalBudget = initiatives.reduce((sum, init) => sum + init.budget, 0);
  const avgProgress = initiatives.reduce((sum, init) => sum + init.progress, 0) / initiatives.length;
  const highRiskCount = initiatives.filter(init => init.riskLevel === 'high').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-primary" />
            <span>OpsLens™ - Initiative Portfolio</span>
          </div>
          <Dialog open={isAddingInitiative} onOpenChange={setIsAddingInitiative}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Initiative
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Initiative</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Initiative Title" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Description" className="col-span-2" />
                <Input placeholder="Owner" />
                <Input placeholder="Budget" type="number" />
                <Input placeholder="Start Date" type="date" />
                <Input placeholder="End Date" type="date" />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingInitiative(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingInitiative(false)}>
                  Create Initiative
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Strategic initiatives and portfolio management
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Portfolio Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Budget</span>
            </div>
            <div className="text-lg font-semibold">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg Progress</span>
            </div>
            <div className="text-lg font-semibold">
              {Math.round(avgProgress)}%
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">High Risk</span>
            </div>
            <div className="text-lg font-semibold">
              {highRiskCount} initiatives
            </div>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Initiatives List */}
        <div className="space-y-4">
          {initiatives.map((initiative) => (
            <div key={initiative.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(initiative.status)}
                    <h4 className="font-semibold">{initiative.title}</h4>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(initiative.priority)}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {initiative.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Owner: {initiative.owner}</span>
                    <span>Budget: ${initiative.budget.toLocaleString()}</span>
                    <span className={getRiskColor(initiative.riskLevel)}>
                      Risk: {initiative.riskLevel}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {initiative.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{initiative.progress}%</span>
                </div>
                <Progress value={initiative.progress} className="h-2" />
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {initiative.team.map((member, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {initiatives.length} active initiatives
          </p>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Portfolio Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};