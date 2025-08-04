import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  Target,
  Globe,
  BarChart3
} from "lucide-react";

interface SectorComparison {
  sector: string;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  keyMetrics: {
    cyberThreats: number;
    physicalRisks: number;
    economicImpact: number;
    reputationalRisk: number;
  };
  recentIncidents: number;
  industryRanking: number;
  totalSectors: number;
}

interface SectorComparisonProps {
  sectors: SectorComparison[];
  onSectorSelect: (sector: string) => void;
  selectedSector?: string;
}

export const SectorComparison: React.FC<SectorComparisonProps> = ({
  sectors,
  onSectorSelect,
  selectedSector
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const sortedSectors = [...sectors].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-starlink-blue" />
            Sector Risk Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {sectors.filter(s => s.riskLevel === 'critical').length}
              </div>
              <div className="text-sm text-starlink-grey-light">Critical Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {sectors.filter(s => s.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-starlink-grey-light">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {sectors.filter(s => s.riskLevel === 'medium').length}
              </div>
              <div className="text-sm text-starlink-grey-light">Medium Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-starlink-blue">
                {Math.round(sectors.reduce((sum, s) => sum + s.riskScore, 0) / sectors.length)}
              </div>
              <div className="text-sm text-starlink-grey-light">Avg Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sector Rankings */}
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-starlink-white">Sector Risk Rankings</CardTitle>
            <Button variant="outline" size="sm" className="border-starlink-grey/40">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort by Risk
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedSectors.map((sector, index) => (
            <div 
              key={sector.sector}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedSector === sector.sector 
                  ? 'border-starlink-blue bg-starlink-blue/10' 
                  : 'border-starlink-grey/30 hover:border-starlink-blue/50'
              }`}
              onClick={() => onSectorSelect(sector.sector)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-starlink-slate rounded-full flex items-center justify-center text-sm font-bold text-starlink-blue">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-starlink-white">{sector.sector}</h3>
                    <div className="flex items-center space-x-2 text-sm text-starlink-grey-light">
                      <span>Industry Ranking: #{sector.industryRanking} of {sector.totalSectors}</span>
                      <span>•</span>
                      <span>{sector.recentIncidents} recent incidents</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getTrendIcon(sector.trend)}
                  <Badge className={`${getRiskBgColor(sector.riskLevel)} text-white`}>
                    {sector.riskLevel.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRiskColor(sector.riskLevel)}`}>
                      {sector.riskScore}
                    </div>
                    <div className="text-xs text-starlink-grey-light">Risk Score</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <Progress value={sector.riskScore} className="h-2" />
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-starlink-grey-light">Cyber</div>
                  <div className="font-medium text-starlink-white">{sector.keyMetrics.cyberThreats}</div>
                </div>
                <div>
                  <div className="text-starlink-grey-light">Physical</div>
                  <div className="font-medium text-starlink-white">{sector.keyMetrics.physicalRisks}</div>
                </div>
                <div>
                  <div className="text-starlink-grey-light">Economic</div>
                  <div className="font-medium text-starlink-white">{sector.keyMetrics.economicImpact}</div>
                </div>
                <div>
                  <div className="text-starlink-grey-light">Reputation</div>
                  <div className="font-medium text-starlink-white">{sector.keyMetrics.reputationalRisk}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Global Risk Trends */}
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-starlink-blue" />
            Global Risk Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <TrendingUp className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-lg font-bold text-red-400">Escalating</div>
              <div className="text-sm text-starlink-grey-light">
                Cyber attacks on critical infrastructure increasing 23% globally
              </div>
            </div>
            
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-lg font-bold text-yellow-400">Monitoring</div>
              <div className="text-sm text-starlink-grey-light">
                Supply chain vulnerabilities under active surveillance
              </div>
            </div>
            
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <TrendingDown className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-lg font-bold text-green-400">Improving</div>
              <div className="text-sm text-starlink-grey-light">
                Enhanced security protocols reducing incident rates
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};