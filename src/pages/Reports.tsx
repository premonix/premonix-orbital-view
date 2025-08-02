
import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, Calendar, FileText, TrendingUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Reports = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const reports = [
    {
      title: "Global Threat Intelligence Summary",
      date: "2024-12-02",
      type: "Weekly Brief",
      category: "Global",
      severity: "High",
      description: "Comprehensive analysis of emerging threats across all regions and sectors",
      pages: 24,
      classification: "Restricted"
    },
    {
      title: "Cyber Warfare Trends Q4 2024",
      date: "2024-11-28",
      type: "Quarterly Report",
      category: "Cyber",
      severity: "Critical",
      description: "In-depth analysis of state-sponsored cyber activities and defensive recommendations",
      pages: 45,
      classification: "Confidential"
    },
    {
      title: "Supply Chain Disruption Forecast",
      date: "2024-11-25",
      type: "Analysis",
      category: "Economic",
      severity: "Medium",
      description: "Predictive analysis of potential supply chain vulnerabilities through 2025",
      pages: 32,
      classification: "Internal"
    },
    {
      title: "Geopolitical Risk Assessment - Asia Pacific",
      date: "2024-11-20",
      type: "Regional Brief",
      category: "Political",
      severity: "High",
      description: "Strategic assessment of political tensions and military movements in the Asia Pacific region",
      pages: 18,
      classification: "Restricted"
    },
    {
      title: "Critical Infrastructure Vulnerabilities",
      date: "2024-11-15",
      type: "Technical Report",
      category: "Infrastructure",
      severity: "Critical",
      description: "Assessment of vulnerabilities in power grids, water systems, and transportation networks",
      pages: 67,
      classification: "Confidential"
    },
    {
      title: "Emerging Technology Threats",
      date: "2024-11-10",
      type: "Technology Brief",
      category: "Technology",
      severity: "Medium",
      description: "Analysis of AI, quantum computing, and IoT security implications",
      pages: 29,
      classification: "Internal"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Confidential': return 'text-red-400';
      case 'Restricted': return 'text-orange-400';
      case 'Internal': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const handleViewReport = async (report: any) => {
    toast({
      title: "Opening Report",
      description: `Opening: ${report.title}`,
    });
    
    // Track view analytics
    try {
      await supabase.rpc('update_dashboard_analytics', {
        p_user_id: 'system', // Use system ID for public reports
        p_action: 'report_viewed',
        p_category: report.category
      });
    } catch (error) {
      console.error('Error tracking report view:', error);
    }
  };

  const handleDownloadReport = async (report: any) => {
    toast({
      title: "Downloading Report",
      description: `Preparing download for: ${report.title}`,
    });
    
    // Track download analytics
    try {
      await supabase.rpc('update_dashboard_analytics', {
        p_user_id: 'system',
        p_action: 'report_downloaded',
        p_category: report.category
      });
    } catch (error) {
      console.error('Error tracking report download:', error);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || report.category.toLowerCase() === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || report.severity.toLowerCase() === severityFilter;
      
      // Time filter logic
      let matchesTime = true;
      if (timeFilter !== 'all') {
        const reportDate = new Date(report.date);
        const now = new Date();
        switch (timeFilter) {
          case 'week':
            matchesTime = (now.getTime() - reportDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            matchesTime = (now.getTime() - reportDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            break;
          case 'quarter':
            matchesTime = (now.getTime() - reportDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
            break;
          case 'year':
            matchesTime = (now.getTime() - reportDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesSeverity && matchesTime;
    });
  }, [searchQuery, categoryFilter, severityFilter, timeFilter]);

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Intelligence Reports</h1>
            <p className="text-starlink-grey-light text-lg">
              Access comprehensive threat intelligence reports and analysis
            </p>
          </div>

          {/* Filters and Search */}
          <div className="glass-panel rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-starlink-grey w-4 h-4" />
                <Input 
                  placeholder="Search reports..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-starlink-slate border-starlink-grey/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="cyber">Cyber</SelectItem>
                  <SelectItem value="economic">Economic</SelectItem>
                  <SelectItem value="political">Political</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-starlink-slate border-starlink-grey/30">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent className="bg-starlink-slate border-starlink-grey/30">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Total Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-starlink-blue">156</div>
                <p className="text-xs text-starlink-grey-light">+12 this week</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">8</div>
                <p className="text-xs text-starlink-grey-light">+3 from last week</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Regions Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-starlink-orange">47</div>
                <p className="text-xs text-starlink-grey-light">Global coverage</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">2.4h</div>
                <p className="text-xs text-starlink-grey-light">Real-time updates</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-starlink-blue" />
                        <CardTitle className="text-starlink-white">{report.title}</CardTitle>
                        <Badge className={`${getSeverityColor(report.severity)} text-white text-xs`}>
                          {report.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-starlink-grey-light">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                        <span>{report.type}</span>
                        <span>{report.pages} pages</span>
                        <span className={getClassificationColor(report.classification)}>
                          {report.classification}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewReport(report)}
                        className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownloadReport(report)}
                        className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-starlink-grey-light">{report.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              Load More Reports
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reports;
