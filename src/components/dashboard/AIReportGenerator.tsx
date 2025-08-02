import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAIReportGeneration, ReportType } from '@/hooks/useAIReportGeneration';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  FileText, 
  Download, 
  Share, 
  Eye,
  BarChart3,
  Shield,
  Users,
  AlertTriangle,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface AIReportGeneratorProps {
  threatSignals?: any[];
  className?: string;
}

interface ReportTypeOption {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const AIReportGenerator = ({ threatSignals = [], className }: AIReportGeneratorProps) => {
  const { user } = useAuth();
  const { generateReport, downloadReport, shareReport, isGenerating, lastGeneratedReport } = useAIReportGeneration();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const reportTypes: ReportTypeOption[] = [
    {
      type: 'executive',
      title: 'Executive Intelligence Brief',
      description: 'Strategic overview and key insights for leadership',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      type: 'threat_analysis',
      title: 'Comprehensive Threat Analysis',
      description: 'Detailed technical analysis of current threats',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-500'
    },
    {
      type: 'resilience',
      title: 'Organizational Resilience Report',
      description: 'Assessment of organizational capabilities and gaps',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      type: 'analytics',
      title: 'Platform Analytics Report',
      description: 'Performance metrics and intelligence effectiveness',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      type: 'watchlist',
      title: 'Threat Watchlist Report',
      description: 'Analysis of monitored threats and correlations',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-orange-500'
    },
    {
      type: 'dss_assessment',
      title: 'DSS Assessment Report',
      description: 'Disruption Sensitivity Score analysis and recommendations',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-indigo-500'
    }
  ];

  const handleGenerateReport = async (reportType: ReportType) => {
    setSelectedReport(reportType);
    
    const reportOption = reportTypes.find(r => r.type === reportType);
    const report = await generateReport({
      type: reportType,
      title: `${reportOption?.title} - ${new Date().toLocaleDateString()}`,
      data: {
        threatSignals,
        userId: user?.id
      },
      time_period: 'current'
    });

    if (report) {
      setShowReportModal(true);
    }
  };

  const handleDownloadReport = (format: 'txt' | 'json' | 'html' = 'html') => {
    if (lastGeneratedReport) {
      downloadReport(lastGeneratedReport, format);
    }
  };

  const handleShareReport = () => {
    if (lastGeneratedReport) {
      shareReport(lastGeneratedReport);
    }
  };

  const formatContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Report Generator
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardTitle>
          <CardDescription>
            Generate intelligent, narrative-driven reports powered by AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((reportType) => (
              <Card 
                key={reportType.type} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleGenerateReport(reportType.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${reportType.color} text-white`}>
                      {reportType.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{reportType.title}</h4>
                      <p className="text-xs text-muted-foreground">{reportType.description}</p>
                      {isGenerating && selectedReport === reportType.type && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Brain className="w-3 h-3 mr-1 animate-pulse" />
                            Generating...
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {lastGeneratedReport && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Latest Generated Report
                </h4>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{lastGeneratedReport.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          Generated {new Date(lastGeneratedReport.metadata.generated_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lastGeneratedReport.metadata.report_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-4">
                      {formatContent(lastGeneratedReport.executive_summary)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => setShowReportModal(true)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadReport('html')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleShareReport}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Report Preview Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {lastGeneratedReport?.title}
            </DialogTitle>
          </DialogHeader>
          
          {lastGeneratedReport && (
            <div className="space-y-6">
              {/* Report Metadata */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Report Type: {lastGeneratedReport.metadata.report_type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Generated: {new Date(lastGeneratedReport.metadata.generated_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Time Period: {lastGeneratedReport.metadata.time_period}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleDownloadReport('txt')}>
                    Download TXT
                  </Button>
                  <Button size="sm" onClick={() => handleDownloadReport('html')}>
                    Download HTML
                  </Button>
                  <Button size="sm" onClick={() => handleDownloadReport('json')}>
                    Download JSON
                  </Button>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
                <p className="text-sm leading-relaxed">{lastGeneratedReport.executive_summary}</p>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
                <ul className="space-y-2">
                  {lastGeneratedReport.key_findings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-primary mt-0.5">{index + 1}.</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {lastGeneratedReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-green-600 mt-0.5">{index + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
                <p className="text-sm leading-relaxed">{lastGeneratedReport.risk_assessment}</p>
              </div>

              {/* Detailed Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {lastGeneratedReport.detailed_analysis}
                </div>
              </div>

              {/* Appendices */}
              {lastGeneratedReport.appendices && lastGeneratedReport.appendices.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Appendices</h3>
                  <ul className="space-y-2">
                    {lastGeneratedReport.appendices.map((appendix, index) => (
                      <li key={index} className="text-sm">
                        <strong>Appendix {index + 1}:</strong> {appendix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};