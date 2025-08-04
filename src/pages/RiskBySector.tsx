
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield,
  Search,
  Filter,
  Download,
  FileText,
  Globe,
  Target,
  BarChart3,
  Settings
} from "lucide-react";
import { SectorRiskChart } from "@/components/risk-by-sector/SectorRiskChart";
import { SectorThreatIntelligence } from "@/components/risk-by-sector/SectorThreatIntelligence";
import { SectorComparison } from "@/components/risk-by-sector/SectorComparison";

const RiskBySector = () => {
  const [selectedSector, setSelectedSector] = useState<string>("Energy & Utilities");
  const [timeRange, setTimeRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced sector data with detailed risk metrics
  const sectorData = [
    {
      sector: "Energy & Utilities",
      riskScore: 85,
      overallRisk: 85,
      cyberRisk: 92,
      physicalRisk: 88,
      economicRisk: 75,
      reputationalRisk: 70,
      operationalRisk: 85,
      riskLevel: "critical" as const,
      trend: "up" as const,
      keyMetrics: {
        cyberThreats: 92,
        physicalRisks: 88,
        economicImpact: 75,
        reputationalRisk: 70
      },
      recentIncidents: 23,
      industryRanking: 1,
      totalSectors: 12,
      threats: [
        "Grid infrastructure cyber attacks",
        "Geopolitical supply disruptions", 
        "Physical security breaches",
        "Ransomware targeting SCADA systems",
        "Nation-state sponsored espionage"
      ],
      impact: "Critical infrastructure dependency affects entire economy"
    },
    {
      sector: "Financial Services",
      riskScore: 78,
      overallRisk: 78,
      cyberRisk: 95,
      physicalRisk: 45,
      economicRisk: 90,
      reputationalRisk: 85,
      operationalRisk: 75,
      riskLevel: "high" as const,
      trend: "up" as const,
      keyMetrics: {
        cyberThreats: 95,
        physicalRisks: 45,
        economicImpact: 90,
        reputationalRisk: 85
      },
      recentIncidents: 31,
      industryRanking: 2,
      totalSectors: 12,
      threats: [
        "Advanced persistent threats",
        "Digital currency volatility",
        "Regulatory compliance risks",
        "API security vulnerabilities",
        "Insider threat incidents"
      ],
      impact: "Systemic risk to global financial stability"
    },
    {
      sector: "Healthcare",
      riskScore: 72,
      overallRisk: 72,
      cyberRisk: 88,
      physicalRisk: 65,
      economicRisk: 60,
      reputationalRisk: 75,
      operationalRisk: 80,
      riskLevel: "high" as const,
      trend: "stable" as const,
      keyMetrics: {
        cyberThreats: 88,
        physicalRisks: 65,
        economicImpact: 60,
        reputationalRisk: 75
      },
      recentIncidents: 18,
      industryRanking: 3,
      totalSectors: 12,
      threats: [
        "Patient data breaches",
        "Medical device vulnerabilities",
        "Supply chain attacks on pharmaceuticals",
        "Ransomware targeting hospitals",
        "IoT medical device compromises"
      ],
      impact: "Direct threat to public health and safety"
    },
    {
      sector: "Technology",
      riskScore: 65,
      overallRisk: 65,
      cyberRisk: 85,
      physicalRisk: 40,
      economicRisk: 70,
      reputationalRisk: 65,
      operationalRisk: 60,
      riskLevel: "medium" as const,
      trend: "down" as const,
      keyMetrics: {
        cyberThreats: 85,
        physicalRisks: 40,
        economicImpact: 70,
        reputationalRisk: 65
      },
      recentIncidents: 15,
      industryRanking: 4,
      totalSectors: 12,
      threats: [
        "Intellectual property theft",
        "Supply chain attacks",
        "Zero-day exploits",
        "Cloud infrastructure threats",
        "AI/ML model poisoning"
      ],
      impact: "Innovation disruption and competitive disadvantage"
    },
    {
      sector: "Manufacturing",
      riskScore: 58,
      overallRisk: 58,
      cyberRisk: 70,
      physicalRisk: 75,
      economicRisk: 55,
      reputationalRisk: 45,
      operationalRisk: 65,
      riskLevel: "medium" as const,
      trend: "stable" as const,
      keyMetrics: {
        cyberThreats: 70,
        physicalRisks: 75,
        economicImpact: 55,
        reputationalRisk: 45
      },
      recentIncidents: 12,
      industryRanking: 5,
      totalSectors: 12,
      threats: [
        "Industrial IoT vulnerabilities",
        "Supply chain disruptions",
        "Industrial espionage",
        "Equipment sabotage",
        "Quality control system attacks"
      ],
      impact: "Production delays and quality control issues"
    },
    {
      sector: "Transportation",
      riskScore: 52,
      overallRisk: 52,
      cyberRisk: 60,
      physicalRisk: 70,
      economicRisk: 45,
      reputationalRisk: 40,
      operationalRisk: 55,
      riskLevel: "medium" as const,
      trend: "down" as const,
      keyMetrics: {
        cyberThreats: 60,
        physicalRisks: 70,
        economicImpact: 45,
        reputationalRisk: 40
      },
      recentIncidents: 8,
      industryRanking: 6,
      totalSectors: 12,
      threats: [
        "GPS jamming and spoofing",
        "Port security vulnerabilities",
        "Autonomous vehicle hacking",
        "Logistics network disruptions",
        "Fleet management system attacks"
      ],
      impact: "Supply chain bottlenecks and delivery delays"
    }
  ];

  // Enhanced threat intelligence data
  const threatIntelligence = {
    "Energy & Utilities": [
      {
        id: "eu-001",
        title: "Advanced Persistent Threat Targeting Power Grid SCADA Systems",
        description: "Nation-state actors deploying sophisticated malware specifically designed to infiltrate and maintain persistence in industrial control systems managing electrical grid operations.",
        severity: "critical" as const,
        confidence: 95,
        region: "North America & Europe",
        lastUpdated: "2 hours ago",
        trend: "increasing" as const,
        indicators: [
          "Suspicious network traffic to critical infrastructure IPs",
          "Custom malware signatures targeting Schneider Electric systems",
          "Spear phishing campaigns against utility executives",
          "Lateral movement patterns consistent with APT groups",
          "Anomalous authentication attempts on HMI systems"
        ],
        mitigations: [
          "Implement network segmentation between IT and OT systems",
          "Deploy specialized ICS/SCADA monitoring solutions",
          "Conduct regular security assessments of control systems",
          "Enhance multi-factor authentication for critical access",
          "Establish incident response procedures for OT environments"
        ]
      },
      {
        id: "eu-002", 
        title: "Supply Chain Attacks on Smart Grid Components",
        description: "Compromised firmware and hardware components being distributed through legitimate supply chains, creating backdoors in smart grid infrastructure.",
        severity: "high" as const,
        confidence: 87,
        region: "Global",
        lastUpdated: "6 hours ago",
        trend: "stable" as const,
        indicators: [
          "Anomalous behavior in newly installed smart meters",
          "Unauthorized communication channels in grid components",
          "Supply chain vendors with compromised security",
          "Hardware modifications detected in field inspections",
          "Firmware versions not matching official releases"
        ],
        mitigations: [
          "Implement hardware integrity verification processes",
          "Establish trusted supplier certification programs",
          "Deploy supply chain risk assessment frameworks",
          "Conduct regular firmware authenticity checks",
          "Create vendor security requirement standards"
        ]
      }
    ],
    "Financial Services": [
      {
        id: "fs-001",
        title: "Sophisticated Banking Trojan Targeting Mobile Payment Systems",
        description: "New variant of banking malware specifically designed to intercept and manipulate mobile banking transactions, bypassing multi-factor authentication.",
        severity: "critical" as const,
        confidence: 92,
        region: "Global",
        lastUpdated: "1 hour ago",
        trend: "increasing" as const,
        indicators: [
          "Malicious apps mimicking legitimate banking applications",
          "SMS interception and manipulation techniques",
          "Overlay attacks on mobile banking interfaces",
          "Unauthorized access to device camera and microphone",
          "Abnormal transaction patterns and amounts"
        ],
        mitigations: [
          "Enhance mobile application security controls",
          "Implement behavioral analytics for transaction monitoring",
          "Deploy advanced threat protection for mobile devices",
          "Strengthen customer authentication mechanisms",
          "Establish real-time fraud detection systems"
        ]
      }
    ],
    "Healthcare": [
      {
        id: "hc-001",
        title: "Ransomware Campaign Targeting Hospital Information Systems",
        description: "Coordinated ransomware attacks specifically targeting healthcare facilities during peak operational periods to maximize impact and pressure for payment.",
        severity: "critical" as const,
        confidence: 89,
        region: "United States",
        lastUpdated: "4 hours ago",
        trend: "increasing" as const,
        indicators: [
          "Phishing emails targeting healthcare staff",
          "Exploitation of unpatched medical device vulnerabilities",
          "Lateral movement through hospital networks",
          "Encryption of patient records and imaging systems",
          "Disruption of critical care monitoring equipment"
        ],
        mitigations: [
          "Implement comprehensive backup and recovery procedures",
          "Segment medical device networks from IT infrastructure",
          "Deploy endpoint detection and response solutions",
          "Conduct regular security awareness training",
          "Establish emergency response protocols for system outages"
        ]
      }
    ]
  };

  const getCurrentSectorData = () => {
    return sectorData.find(s => s.sector === selectedSector) || sectorData[0];
  };

  const getCurrentThreats = () => {
    return threatIntelligence[selectedSector as keyof typeof threatIntelligence] || [];
  };

  const handleViewThreatDetails = (threatId: string) => {
    console.log("Viewing threat details for:", threatId);
    // Implementation for threat details modal
  };

  const filteredSectors = sectorData.filter(sector =>
    sector.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Risk by Sector Intelligence</h1>
                <p className="text-starlink-grey-light text-lg">
                  Comprehensive threat assessment and risk analysis across critical infrastructure sectors
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-starlink-slate/20 border-starlink-grey/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-starlink-slate border-starlink-grey/30">
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-starlink-grey/40">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="border-starlink-grey/40">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-starlink-grey w-4 h-4" />
                <Input 
                  placeholder="Search sectors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-starlink-slate/20 mb-8">
              <TabsTrigger value="overview" className="text-starlink-white data-[state=active]:bg-starlink-blue">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-starlink-white data-[state=active]:bg-starlink-blue">
                <Target className="w-4 h-4 mr-2" />
                Comparison
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="text-starlink-white data-[state=active]:bg-starlink-blue">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Threat Intel
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-starlink-white data-[state=active]:bg-starlink-blue">
                <Globe className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-starlink-grey-light">Critical Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">
                      {filteredSectors.filter(s => s.riskLevel === 'critical').length}
                    </div>
                    <p className="text-xs text-starlink-grey-light">Sectors</p>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-starlink-grey-light">High Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-400">
                      {filteredSectors.filter(s => s.riskLevel === 'high').length}
                    </div>
                    <p className="text-xs text-starlink-grey-light">Sectors</p>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-starlink-grey-light">Medium Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">
                      {filteredSectors.filter(s => s.riskLevel === 'medium').length}
                    </div>
                    <p className="text-xs text-starlink-grey-light">Sectors</p>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-starlink-grey-light">Total Incidents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-starlink-blue">
                      {filteredSectors.reduce((sum, s) => sum + s.recentIncidents, 0)}
                    </div>
                    <p className="text-xs text-starlink-grey-light">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-starlink-grey-light">Avg Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-starlink-orange">
                      {Math.round(filteredSectors.reduce((sum, s) => sum + s.overallRisk, 0) / filteredSectors.length)}
                    </div>
                    <p className="text-xs text-starlink-grey-light">All sectors</p>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Charts */}
              <SectorRiskChart data={filteredSectors} selectedSector={selectedSector} />

              {/* Detailed Sector Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSectors.map((sector, index) => (
                  <Card 
                    key={index} 
                    className={`glass-panel transition-all cursor-pointer ${
                      selectedSector === sector.sector 
                        ? 'border-starlink-blue bg-starlink-blue/10' 
                        : 'border-starlink-grey/30 hover:border-starlink-blue/50'
                    }`}
                    onClick={() => setSelectedSector(sector.sector)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-starlink-white">{sector.sector}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {sector.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                          {sector.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                          {sector.trend === 'stable' && <Shield className="w-4 h-4 text-blue-400" />}
                          <Badge className={`${sector.riskLevel === 'critical' ? 'bg-red-500' : 
                                                sector.riskLevel === 'high' ? 'bg-orange-500' :
                                                sector.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                            {sector.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-starlink-grey-light">
                        {sector.impact}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-starlink-grey-light">Overall Risk Score</span>
                          <span className={`text-sm font-medium ${
                            sector.overallRisk >= 80 ? 'text-red-400' :
                            sector.overallRisk >= 60 ? 'text-orange-400' : 'text-blue-400'
                          }`}>
                            {sector.overallRisk}/100
                          </span>
                        </div>
                        <Progress value={sector.overallRisk} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-starlink-grey-light">Recent Incidents</div>
                          <div className="font-bold text-starlink-white">{sector.recentIncidents}</div>
                        </div>
                        <div>
                          <div className="text-starlink-grey-light">Industry Rank</div>
                          <div className="font-bold text-starlink-white">#{sector.industryRanking}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-starlink-white mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                          Key Threats
                        </h4>
                        <ul className="space-y-1">
                          {sector.threats.slice(0, 3).map((threat, threatIndex) => (
                            <li key={threatIndex} className="text-xs text-starlink-grey-light flex items-start">
                              <span className="w-1 h-1 bg-starlink-grey-light rounded-full mt-2 mr-2 flex-shrink-0" />
                              {threat}
                            </li>
                          ))}
                          {sector.threats.length > 3 && (
                            <li className="text-xs text-starlink-blue">
                              +{sector.threats.length - 3} more threats
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison">
              <SectorComparison 
                sectors={filteredSectors}
                onSectorSelect={setSelectedSector}
                selectedSector={selectedSector}
              />
            </TabsContent>

            <TabsContent value="intelligence">
              <SectorThreatIntelligence
                sector={selectedSector}
                threats={getCurrentThreats()}
                riskScore={getCurrentSectorData().overallRisk}
                onViewDetails={handleViewThreatDetails}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader>
                    <CardTitle className="text-starlink-white">Advanced Analytics Dashboard</CardTitle>
                    <CardDescription>
                      Comprehensive risk analytics and predictive intelligence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-starlink-slate/20 rounded-lg">
                        <h3 className="font-semibold text-starlink-white mb-2">Predictive Risk Modeling</h3>
                        <p className="text-starlink-grey-light text-sm">
                          AI-powered risk forecasting with 85% accuracy for next 30-day period
                        </p>
                      </div>
                      <div className="p-6 bg-starlink-slate/20 rounded-lg">
                        <h3 className="font-semibold text-starlink-white mb-2">Correlation Analysis</h3>
                        <p className="text-starlink-grey-light text-sm">
                          Cross-sector threat correlation and dependency mapping
                        </p>
                      </div>
                      <div className="p-6 bg-starlink-slate/20 rounded-lg">
                        <h3 className="font-semibold text-starlink-white mb-2">Risk Attribution</h3>
                        <p className="text-starlink-grey-light text-sm">
                          Automated threat actor attribution and campaign tracking
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RiskBySector;
