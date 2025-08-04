import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ExternalLink, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  title: string;
  category: string;
  severity: string;
  time_period: string;
  description?: string;
  created_at: string;
  download_count: number;
}

interface ReportViewerProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (report: Report) => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!report) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Mock report content - in a real app, this would come from the database
  const generateReportContent = (report: Report) => {
    return {
      executiveSummary: `This ${report.severity.toLowerCase()} severity report covers ${report.category.toLowerCase()} threats observed during the ${report.time_period} period. The analysis identifies key risk factors and provides actionable intelligence for security teams.`,
      keyFindings: [
        `Increased ${report.category.toLowerCase()} activity detected in multiple regions`,
        "Emerging threat vectors require immediate attention",
        "Supply chain vulnerabilities identified in critical sectors",
        "Coordination between threat actors shows sophisticated planning"
      ],
      threatAnalysis: {
        overview: `The ${report.category.toLowerCase()} threat landscape has evolved significantly during this reporting period. Our analysis indicates a ${Math.floor(Math.random() * 40 + 10)}% increase in related incidents compared to the previous period.`,
        impactAssessment: "High-priority targets include financial institutions, government agencies, and critical infrastructure providers.",
        geographicDistribution: "Primary activity concentrated in North America and Europe, with emerging hotspots in Asia-Pacific region."
      },
      recommendations: [
        "Implement enhanced monitoring protocols for identified threat vectors",
        "Review and update incident response procedures",
        "Conduct threat hunting exercises focused on discovered TTPs",
        "Coordinate with industry partners for information sharing",
        "Deploy additional security controls in high-risk environments"
      ],
      indicators: [
        "IOC-001: Suspicious domain registrations following known patterns",
        "IOC-002: Malicious IP addresses associated with C&C infrastructure",
        "IOC-003: File hashes of known malware variants",
        "IOC-004: Email patterns used in phishing campaigns"
      ]
    };
  };

  const reportContent = generateReportContent(report);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold">{report.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(new Date(report.created_at), 'PPP')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor(report.severity)}>
                {report.severity}
              </Badge>
              <Badge variant="outline">
                <Tag className="w-3 h-3 mr-1" />
                {report.category}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6">
            {/* Executive Summary */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {reportContent.executiveSummary}
              </p>
            </section>

            <Separator />

            {/* Key Findings */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
              <ul className="space-y-2">
                {reportContent.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{finding}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Threat Analysis */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Threat Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Overview</h4>
                  <p className="text-muted-foreground text-sm">
                    {reportContent.threatAnalysis.overview}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Impact Assessment</h4>
                  <p className="text-muted-foreground text-sm">
                    {reportContent.threatAnalysis.impactAssessment}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Geographic Distribution</h4>
                  <p className="text-muted-foreground text-sm">
                    {reportContent.threatAnalysis.geographicDistribution}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Recommendations */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <ol className="space-y-2">
                {reportContent.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground text-sm">{rec}</span>
                  </li>
                ))}
              </ol>
            </section>

            <Separator />

            {/* Indicators of Compromise */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Indicators of Compromise</h3>
              <div className="space-y-2">
                {reportContent.indicators.map((indicator, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <code className="text-sm text-muted-foreground">{indicator}</code>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Downloaded {report.download_count} times
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                window.open(`/reports/${report.id}`, '_blank');
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
            <Button onClick={() => onDownload(report)}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};