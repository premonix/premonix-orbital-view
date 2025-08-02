import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAIReportGeneration } from '@/hooks/useAIReportGeneration';
import { 
  FileText, 
  Download, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Eye,
  BarChart3,
  Brain,
  Share,
  FileDown
} from "lucide-react";

interface ExecutiveBriefingWidgetProps {
  userId: string;
  threatSignals: any[];
}

export const ExecutiveBriefingWidget = ({ userId, threatSignals }: ExecutiveBriefingWidgetProps) => {
  const { generateReport, downloadReport, shareReport, isGenerating, lastGeneratedReport } = useAIReportGeneration();

  const handleGenerateReport = async () => {
    const report = await generateReport({
      type: 'executive',
      title: `Executive Intelligence Brief - ${new Date().toLocaleDateString()}`,
      data: {
        threatSignals,
        userId
      },
      time_period: 'current'
    });
  };

  const handleDownloadReport = () => {
    if (lastGeneratedReport) {
      downloadReport(lastGeneratedReport, 'html');
    }
  };

  const handleShareReport = () => {
    if (lastGeneratedReport) {
      shareReport(lastGeneratedReport);
    }
  };

  const recentActivities = [
    {
      time: '2 hours ago',
      action: 'Executive briefing generated',
      type: 'Strategic overview',
      status: 'ready',
      reportType: 'executive'
    },
    {
      time: '4 hours ago',
      action: 'Threat analysis completed',
      type: 'Supply chain alert',
      status: 'critical',
      reportType: 'threat'
    },
    {
      time: '6 hours ago',
      action: 'DSS report updated',
      type: '+5 points increase',
      status: 'monitoring',
      reportType: 'risk'
    },
    {
      time: '8 hours ago',
      action: 'Scenario simulation completed',
      type: 'Multi-domain disruption',
      status: 'completed',
      reportType: 'simulation'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'monitoring':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'ready':
        return <Eye className="w-4 h-4 text-green-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-destructive';
      case 'monitoring':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Executive Intelligence</span>
            </CardTitle>
            <CardDescription>
              AI-powered strategic briefings and critical insights
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {lastGeneratedReport && (
              <>
                <Button size="sm" variant="outline" onClick={handleDownloadReport}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={handleShareReport}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  AI Report
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold">67</div>
            <div className="text-xs text-muted-foreground">Global DSS Avg</div>
            <Badge variant="destructive" className="text-xs mt-1">+8%</Badge>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-amber-500">High</div>
            <div className="text-xs text-muted-foreground">Sector Risk</div>
            <Badge variant="secondary" className="text-xs mt-1">Stable</Badge>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold">{threatSignals.length}</div>
            <div className="text-xs text-muted-foreground">Active Threats</div>
            <Badge variant="destructive" className="text-xs mt-1">+12%</Badge>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Recent Activities */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Recent Intelligence Activities</span>
          </h4>
          
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activity.status)}
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{activity.time}</p>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)} mt-1 ml-auto`} />
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Strategic Recommendations Preview */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Strategic Recommendations</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">Enhance supply chain monitoring in APAC region</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">Increase cyber security budget allocation by 15%</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">Conduct scenario planning for multi-domain disruption</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};