import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Download,
  Clock,
  MapPin,
  Target,
  Zap
} from "lucide-react";

interface ThreatIntel {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  region: string;
  lastUpdated: string;
  indicators: string[];
  mitigations: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface SectorThreatIntelligenceProps {
  sector: string;
  threats: ThreatIntel[];
  riskScore: number;
  onViewDetails: (threatId: string) => void;
}

export const SectorThreatIntelligence: React.FC<SectorThreatIntelligenceProps> = ({
  sector,
  threats,
  riskScore,
  onViewDetails,
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Sector Overview */}
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-starlink-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-starlink-blue" />
              {sector} Threat Intelligence
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-starlink-grey-light">Risk Score</div>
                <div className={`text-xl font-bold ${getRiskColor(riskScore)}`}>
                  {riskScore}/100
                </div>
              </div>
              <Progress value={riskScore} className="w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {threats.filter(t => t.severity === 'critical').length}
              </div>
              <div className="text-sm text-starlink-grey-light">Critical Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {threats.filter(t => t.severity === 'high').length}
              </div>
              <div className="text-sm text-starlink-grey-light">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-starlink-blue">
                {threats.filter(t => t.trend === 'increasing').length}
              </div>
              <div className="text-sm text-starlink-grey-light">Escalating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-starlink-white">
            Active Threat Intelligence
          </h3>
          <Button variant="outline" size="sm" className="border-starlink-grey/40">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {threats.map((threat, index) => (
          <Card key={threat.id} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <CardTitle className="text-starlink-white">{threat.title}</CardTitle>
                    <Badge className={`${getSeverityColor(threat.severity)} text-white text-xs`}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    {getTrendIcon(threat.trend)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-starlink-grey-light">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {threat.lastUpdated}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {threat.region}
                    </span>
                    <span className="flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      {threat.confidence}% confidence
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onViewDetails(threat.id)}
                  className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-starlink-grey-light">{threat.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-starlink-white mb-2">
                    Key Indicators
                  </h4>
                  <ul className="space-y-1">
                    {threat.indicators.slice(0, 3).map((indicator, idx) => (
                      <li key={idx} className="text-xs text-starlink-grey-light flex items-start">
                        <span className="w-1 h-1 bg-starlink-blue rounded-full mt-2 mr-2 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                    {threat.indicators.length > 3 && (
                      <li className="text-xs text-starlink-blue">
                        +{threat.indicators.length - 3} more indicators
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-starlink-white mb-2">
                    Recommended Actions
                  </h4>
                  <ul className="space-y-1">
                    {threat.mitigations.slice(0, 3).map((mitigation, idx) => (
                      <li key={idx} className="text-xs text-starlink-grey-light flex items-start">
                        <span className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {mitigation}
                      </li>
                    ))}
                    {threat.mitigations.length > 3 && (
                      <li className="text-xs text-green-400">
                        +{threat.mitigations.length - 3} more actions
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <Separator className="bg-starlink-grey/30" />
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-starlink-grey-light">
                  Confidence Level: {threat.confidence}%
                </div>
                <Progress value={threat.confidence} className="w-32 h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};