import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Share, 
  Plus,
  Clock,
  TrendingUp,
  AlertTriangle,
  Target,
  Shield,
  Globe,
  Calendar,
  Eye
} from "lucide-react";
import { useAIReportGeneration } from "@/hooks/useAIReportGeneration";

interface Briefing {
  id: string;
  title: string;
  type: 'executive' | 'tactical' | 'strategic' | 'sector' | 'regional';
  createdAt: Date;
  summary: string;
  keyInsights: string[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  status: 'draft' | 'published' | 'archived';
  audience: string;
}

interface EnhancedBriefingWidgetProps {
  userId: string;
  threatSignals?: any[];
}

export const EnhancedBriefingWidget = ({ userId, threatSignals = [] }: EnhancedBriefingWidgetProps) => {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);
  const [briefingType, setBriefingType] = useState<string>('executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const { lastGeneratedReport, generateReport, isGenerating: isGeneratingReport, downloadReport } = useAIReportGeneration();

  useEffect(() => {
    loadBriefings();
  }, []);

  const loadBriefings = () => {
    // Mock briefings data
    const mockBriefings: Briefing[] = [
      {
        id: '1',
        title: 'Weekly Executive Threat Overview',
        type: 'executive',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        summary: 'Global threat landscape remains elevated with increasing cyber activity and supply chain disruptions.',
        keyInsights: [
          'Cyber threats increased 23% week-over-week',
          'Eastern Europe tensions affecting energy markets',
          'Supply chain vulnerabilities in critical sectors'
        ],
        threatLevel: 'medium',
        recommendations: [
          'Enhance cybersecurity monitoring',
          'Review supplier diversification plans',
          'Update crisis communication protocols'
        ],
        status: 'published',
        audience: 'C-Suite, Senior Leadership'
      },
      {
        id: '2',
        title: 'Regional Security Assessment: APAC',
        type: 'regional',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        summary: 'Asia-Pacific region shows mixed security indicators with diplomatic progress offset by maritime tensions.',
        keyInsights: [
          'Trade route security concerns in South China Sea',
          'Diplomatic initiatives showing positive momentum',
          'Economic recovery patterns vary by country'
        ],
        threatLevel: 'medium',
        recommendations: [
          'Monitor shipping route alternatives',
          'Engage regional partners',
          'Assess market exposure'
        ],
        status: 'published',
        audience: 'Regional Teams, Operations'
      },
      {
        id: '3',
        title: 'Financial Sector Threat Analysis',
        type: 'sector',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        summary: 'Banking and financial services face heightened cyber threats and regulatory pressure.',
        keyInsights: [
          'Ransomware targeting increased 45%',
          'New regulatory compliance requirements',
          'Cross-border payment disruptions'
        ],
        threatLevel: 'high',
        recommendations: [
          'Implement zero-trust architecture',
          'Update incident response procedures',
          'Review compliance frameworks'
        ],
        status: 'published',
        audience: 'Financial Services Teams'
      }
    ];
    setBriefings(mockBriefings);
  };

  const handleGenerateBriefing = async () => {
    setIsGenerating(true);
    try {
      await generateReport({
        type: briefingType as any,
        data: threatSignals,
        title: `${briefingType.charAt(0).toUpperCase() + briefingType.slice(1)} Intelligence Briefing`
      });
      // Refresh briefings after generation
      loadBriefings();
    } catch (error) {
      console.error('Error generating briefing:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getBriefingIcon = (type: Briefing['type']) => {
    switch (type) {
      case 'executive': return <Shield className="w-4 h-4" />;
      case 'tactical': return <Target className="w-4 h-4" />;
      case 'strategic': return <TrendingUp className="w-4 h-4" />;
      case 'sector': return <FileText className="w-4 h-4" />;
      case 'regional': return <Globe className="w-4 h-4" />;
    }
  };

  const getThreatLevelColor = (level: Briefing['threatLevel']) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getStatusColor = (status: Briefing['status']) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'draft': return 'text-yellow-600';
      case 'archived': return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Intelligence Briefings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={briefingType} onValueChange={setBriefingType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="tactical">Tactical</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="sector">Sector</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              onClick={handleGenerateBriefing}
              disabled={isGenerating || isGeneratingReport}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          AI-generated intelligence briefings and strategic analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Briefings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Briefings</span>
                </div>
                <div className="text-lg font-semibold">{briefings.length}</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">This Week</span>
                </div>
                <div className="text-lg font-semibold">
                  {briefings.filter(b => 
                    b.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">High Priority</span>
                </div>
                <div className="text-lg font-semibold">
                  {briefings.filter(b => b.threatLevel === 'high' || b.threatLevel === 'critical').length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {briefings.map((briefing) => (
                <div key={briefing.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                     onClick={() => setSelectedBriefing(briefing)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getBriefingIcon(briefing.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{briefing.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {briefing.type}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getThreatLevelColor(briefing.threatLevel)}`} />
                          <span>{briefing.threatLevel} threat</span>
                          <span>•</span>
                          <span>{briefing.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${getStatusColor(briefing.status)}`}>
                        {briefing.status}
                      </span>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {briefing.summary}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    Audience: {briefing.audience}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Executive Summary', type: 'executive', description: 'High-level overview for leadership' },
                { name: 'Tactical Assessment', type: 'tactical', description: 'Operational threat analysis' },
                { name: 'Strategic Outlook', type: 'strategic', description: 'Long-term trend analysis' },
                { name: 'Sector Analysis', type: 'sector', description: 'Industry-specific intelligence' }
              ].map((template) => (
                <div key={template.name} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-4">Briefing Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Most Read Type</span>
                  <Badge>Executive</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Views</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Engagement Rate</span>
                  <span className="font-semibold">73%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Briefing Detail Dialog */}
        <Dialog open={!!selectedBriefing} onOpenChange={() => setSelectedBriefing(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedBriefing && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedBriefing.title}</span>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{selectedBriefing.type}</Badge>
                    <div className={`w-2 h-2 rounded-full ${getThreatLevelColor(selectedBriefing.threatLevel)}`} />
                    <span>{selectedBriefing.threatLevel} threat level</span>
                    <Calendar className="w-4 h-4" />
                    <span>{selectedBriefing.createdAt.toLocaleDateString()}</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Executive Summary</h3>
                    <p className="text-muted-foreground">{selectedBriefing.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Key Insights</h3>
                    <ul className="space-y-1">
                      {selectedBriefing.keyInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {selectedBriefing.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="text-xs text-muted-foreground">
                    Target Audience: {selectedBriefing.audience}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {briefings.length} briefings generated
          </p>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View All Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};