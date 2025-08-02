import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OrganizationProfile } from "@/types/organization";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface DSSResultsStepProps {
  organizationData: OrganizationProfile;
  dssScore: number;
  onFinish: () => void;
  isSubmitting: boolean;
}

export const DSSResultsStep = ({ organizationData, dssScore, onFinish, isSubmitting }: DSSResultsStepProps) => {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-400/20' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    if (score >= 40) return { level: 'High', color: 'text-orange-400', bgColor: 'bg-orange-400/20' };
    return { level: 'Critical', color: 'text-red-400', bgColor: 'bg-red-400/20' };
  };

  const getRecommendations = (score: number, orgData: OrganizationProfile) => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push("Implement comprehensive incident response plan");
      recommendations.push("Enhance employee security training programs");
      recommendations.push("Conduct regular security assessments");
    }
    
    if (score < 40) {
      recommendations.push("Deploy advanced threat detection systems");
      recommendations.push("Establish 24/7 security monitoring");
      recommendations.push("Consider hiring dedicated security personnel");
    }

    if (orgData.existing_security_measures && orgData.existing_security_measures.length < 6) {
      recommendations.push("Strengthen basic security controls (MFA, encryption, access controls)");
    }

    if (orgData.size === 'enterprise' || orgData.size === 'large') {
      recommendations.push("Implement network segmentation");
      recommendations.push("Deploy security orchestration and automated response");
    }

    return recommendations.slice(0, 4); // Limit to top 4 recommendations
  };

  const riskInfo = getRiskLevel(dssScore);
  const recommendations = getRecommendations(dssScore, organizationData);

  return (
    <div className="space-y-6">
      {/* DSS Score Display */}
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full ${riskInfo.bgColor}`}>
              <Shield className={`w-12 h-12 ${riskInfo.color}`} />
            </div>
          </div>
          <CardTitle className="text-2xl text-starlink-white">
            Your Digital Security Score
          </CardTitle>
          <div className="text-6xl font-bold text-starlink-blue mt-4">
            {dssScore}
          </div>
          <Badge className={`${riskInfo.bgColor} ${riskInfo.color} border-none mt-2`}>
            {riskInfo.level} Risk Level
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={dssScore} className="h-3" />
            <p className="text-starlink-grey-light text-center text-sm">
              Based on your organization profile: {organizationData.name} ({organizationData.sector})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-starlink-blue/20">
                <Shield className="w-5 h-5 text-starlink-blue" />
              </div>
              <div>
                <p className="text-starlink-white font-medium">Sector Risk</p>
                <p className="text-starlink-grey-light text-sm capitalize">
                  {organizationData.sector.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-starlink-blue/20">
                <TrendingUp className="w-5 h-5 text-starlink-blue" />
              </div>
              <div>
                <p className="text-starlink-white font-medium">Organization Size</p>
                <p className="text-starlink-grey-light text-sm capitalize">
                  {organizationData.size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-starlink-grey/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-starlink-blue/20">
                <AlertTriangle className="w-5 h-5 text-starlink-blue" />
              </div>
              <div>
                <p className="text-starlink-white font-medium">Geographic Risk</p>
                <p className="text-starlink-grey-light text-sm capitalize">
                  {organizationData.primary_region.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-starlink-blue" />
            Immediate Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-starlink-slate/20">
                <div className="w-6 h-6 rounded-full bg-starlink-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-starlink-blue text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-starlink-grey-light text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="glass-panel border-starlink-grey/30 bg-starlink-blue/5">
        <CardContent className="p-6">
          <h3 className="text-starlink-white font-semibold mb-3">What happens next?</h3>
          <div className="space-y-2 text-starlink-grey-light text-sm">
            <p>✓ Your organization profile has been saved</p>
            <p>✓ DSS assessment results are recorded for tracking</p>
            <p>✓ Personalized threat intelligence will be generated</p>
            <p>✓ You'll receive threat alerts relevant to your sector and region</p>
          </div>
        </CardContent>
      </Card>

      {/* Finish Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onFinish}
          disabled={isSubmitting}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark min-w-[250px] py-3"
          size="lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-starlink-dark/20 border-t-starlink-dark rounded-full animate-spin" />
              Finalizing Setup...
            </div>
          ) : (
            'Complete Onboarding & Access Dashboard'
          )}
        </Button>
      </div>
    </div>
  );
};