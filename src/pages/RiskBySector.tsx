
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react";

const RiskBySector = () => {
  const sectors = [
    {
      name: "Energy & Utilities",
      riskLevel: 85,
      status: "critical",
      threats: ["Cyber attacks on grid infrastructure", "Geopolitical supply disruptions", "Physical security breaches"],
      trend: "up",
      impact: "High infrastructure dependency"
    },
    {
      name: "Financial Services",
      riskLevel: 78,
      status: "high",
      threats: ["Cyber warfare", "Economic sanctions", "Digital currency volatility"],
      trend: "up",
      impact: "Global market instability"
    },
    {
      name: "Healthcare",
      riskLevel: 72,
      status: "high",
      threats: ["Medical supply chain disruption", "Ransomware attacks", "Biological threats"],
      trend: "stable",
      impact: "Public health implications"
    },
    {
      name: "Technology",
      riskLevel: 65,
      status: "medium",
      threats: ["IP theft", "Semiconductor supply issues", "AI weaponization"],
      trend: "down",
      impact: "Innovation slowdown"
    },
    {
      name: "Manufacturing",
      riskLevel: 58,
      status: "medium",
      threats: ["Supply chain attacks", "Industrial espionage", "Resource scarcity"],
      trend: "stable",
      impact: "Production delays"
    },
    {
      name: "Transportation",
      riskLevel: 52,
      status: "low",
      threats: ["GPS jamming", "Port security", "Fuel supply disruption"],
      trend: "down",
      impact: "Logistics bottlenecks"
    }
  ];

  const getRiskColor = (level: number) => {
    if (level >= 80) return "text-red-400";
    if (level >= 60) return "text-orange-400";
    return "text-blue-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Risk by Sector</h1>
            <p className="text-starlink-grey-light text-lg">
              Real-time threat assessment across critical infrastructure sectors
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Critical Sectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">2</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">High Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">2</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Medium Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">2</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-starlink-grey/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-starlink-grey-light">Avg Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-starlink-blue">68</div>
              </CardContent>
            </Card>
          </div>

          {/* Sector Risk Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sectors.map((sector, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-starlink-white">{sector.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {sector.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                      {sector.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                      {sector.trend === 'stable' && <Shield className="w-4 h-4 text-blue-400" />}
                      <Badge className={`${getStatusColor(sector.status)} text-white`}>
                        {sector.status.toUpperCase()}
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
                      <span className="text-sm text-starlink-grey-light">Risk Level</span>
                      <span className={`text-sm font-medium ${getRiskColor(sector.riskLevel)}`}>
                        {sector.riskLevel}%
                      </span>
                    </div>
                    <Progress 
                      value={sector.riskLevel} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-starlink-white mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                      Key Threats
                    </h4>
                    <ul className="space-y-1">
                      {sector.threats.map((threat, threatIndex) => (
                        <li key={threatIndex} className="text-xs text-starlink-grey-light flex items-start">
                          <span className="w-1 h-1 bg-starlink-grey-light rounded-full mt-2 mr-2 flex-shrink-0" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RiskBySector;
