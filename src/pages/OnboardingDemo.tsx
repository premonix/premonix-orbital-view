import { useState } from 'react';
import { OrganizationProfile, OrganizationSector, OrganizationSize, GeographicRegion } from "@/types/organization";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BasicInfoStep } from "@/components/onboarding/steps/BasicInfoStep";
import { OrganizationDetailsStep } from "@/components/onboarding/steps/OrganizationDetailsStep";
import { SecurityPostureStep } from "@/components/onboarding/steps/SecurityPostureStep";
import { RiskAssessmentStep } from "@/components/onboarding/steps/RiskAssessmentStep";
import { DSSResultsStep } from "@/components/onboarding/steps/DSSResultsStep";
import { Building2, Users, Shield, AlertTriangle, BarChart3 } from 'lucide-react';

const ONBOARDING_STEPS = [
  { id: 'basic_info', title: 'Organization Info', description: 'Basic details about your organization' },
  { id: 'org_details', title: 'Structure & Scale', description: 'Size, locations, and operations' },
  { id: 'security_posture', title: 'Security Posture', description: 'Current security measures and assets' },
  { id: 'risk_assessment', title: 'Risk Assessment', description: 'Risk tolerance and regulatory requirements' },
  { id: 'dss_results', title: 'Your DSS Score', description: 'Initial security assessment results' }
];

const OnboardingDemo = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [organizationData, setOrganizationData] = useState<Partial<OrganizationProfile>>({});
  const [calculatedDSSScore, setCalculatedDSSScore] = useState<number | null>(null);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  // Real DSS calculation matching the database function
  const calculateRealDSSScore = (orgProfile: OrganizationProfile) => {
    let baseScore = 0;
    let sectorRisk = 0;
    let sizeRisk = 0;
    let regionRisk = 0;
    let complexityRisk = 0;

    // Sector-based risk scoring (matches database function)
    const sectorScores: Record<OrganizationSector, number> = {
      'financial_services': 25,
      'government_public_sector': 30,
      'energy_utilities': 28,
      'healthcare': 22,
      'technology': 20,
      'telecommunications': 24,
      'transportation_logistics': 26,
      'manufacturing': 18,
      'retail_consumer_goods': 15,
      'education': 12,
      'agriculture': 14,
      'real_estate': 10,
      'entertainment_media': 16,
      'consulting': 13,
      'non_profit': 8,
      'other': 15
    };

    // Size-based risk scoring
    const sizeScores: Record<OrganizationSize, number> = {
      'enterprise': 25,
      'large': 20,
      'medium': 15,
      'small': 10,
      'micro': 5
    };

    // Regional risk scoring
    const regionScores: Record<GeographicRegion, number> = {
      'middle_east': 20,
      'africa': 18,
      'asia_pacific': 15,
      'south_america': 12,
      'europe': 10,
      'north_america': 8,
      'oceania': 6,
      'global': 25
    };

    sectorRisk = sectorScores[orgProfile.sector] || 15;
    sizeRisk = sizeScores[orgProfile.size] || 10;
    regionRisk = regionScores[orgProfile.primary_region] || 10;
    complexityRisk = (orgProfile.supply_chain_complexity || 3) * 5;

    baseScore = sectorRisk + sizeRisk + regionRisk + complexityRisk;
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, baseScore));
  };

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...organizationData, ...stepData };
    setOrganizationData(updatedData);

    // Calculate DSS score when reaching risk assessment
    if (currentStep.id === 'risk_assessment' && updatedData.sector && updatedData.size && updatedData.primary_region) {
      const dssScore = calculateRealDSSScore(updatedData as OrganizationProfile);
      setCalculatedDSSScore(dssScore);
    }

    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleFinishDemo = () => {
    // Simulate what would happen in the real version
    const organizationProfile = organizationData as OrganizationProfile;
    
    console.log('Organization Profile that would be saved:', {
      organization_profiles: organizationProfile,
      dss_assessment: {
        overall_score: calculatedDSSScore,
        risk_level: calculatedDSSScore! >= 80 ? 'low' : calculatedDSSScore! >= 60 ? 'medium' : 'high',
        assessment_data: { organization_profile: organizationProfile }
      },
      onboarding_progress: {
        step: 'organization_onboarding',
        completed_at: new Date().toISOString(),
        data: { organization_profile: organizationProfile }
      }
    });

    alert(`✅ Demo Complete! 

🏢 Organization: ${organizationProfile.name}
🏭 Sector: ${organizationProfile.sector?.replace('_', ' ')}
📊 Size: ${organizationProfile.size}
🌍 Region: ${organizationProfile.primary_region?.replace('_', ' ')}
🛡️ DSS Score: ${calculatedDSSScore}

📋 What would happen in the real version:
• Organization profile saved to database
• DSS assessment recorded with ${calculatedDSSScore! >= 80 ? 'LOW' : calculatedDSSScore! >= 60 ? 'MEDIUM' : 'HIGH'} risk level
• Onboarding progress marked complete
• Redirect to personalized dashboard
• Threat intelligence customized for your sector & region`);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 'basic_info':
        return (
          <BasicInfoStep
            data={organizationData}
            onComplete={handleStepComplete}
          />
        );
      case 'org_details':
        return (
          <OrganizationDetailsStep
            data={organizationData}
            onComplete={handleStepComplete}
          />
        );
      case 'security_posture':
        return (
          <SecurityPostureStep
            data={organizationData}
            onComplete={handleStepComplete}
          />
        );
      case 'risk_assessment':
        return (
          <RiskAssessmentStep
            data={organizationData}
            onComplete={handleStepComplete}
          />
        );
      case 'dss_results':
        return (
          <DSSResultsStep
            organizationData={organizationData as OrganizationProfile}
            dssScore={calculatedDSSScore || 50}
            onFinish={handleFinishDemo}
            isSubmitting={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-starlink-dark">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-6">
          <Card className="bg-starlink-blue/10 border-starlink-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/40">
                  ORGANIZATIONAL ONBOARDING DEMO
                </Badge>
                <Badge variant="outline" className="border-starlink-grey/40 text-starlink-grey-light">
                  No Authentication Required
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-starlink-white">
                  <Building2 className="w-4 h-4 text-starlink-blue" />
                  Enterprise-focused setup
                </div>
                <div className="flex items-center gap-2 text-starlink-white">
                  <BarChart3 className="w-4 h-4 text-starlink-blue" />
                  Real DSS calculation
                </div>
                <div className="flex items-center gap-2 text-starlink-white">
                  <Shield className="w-4 h-4 text-starlink-blue" />
                  Security posture assessment
                </div>
                <div className="flex items-center gap-2 text-starlink-white">
                  <AlertTriangle className="w-4 h-4 text-starlink-blue" />
                  Risk-based recommendations
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-panel border-starlink-grey/30 max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-starlink-white text-2xl">Enterprise Organization Onboarding</CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Complete organizational setup for personalized threat intelligence and security assessment
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-starlink-blue">
                Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                {ONBOARDING_STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-1 ${
                      index <= currentStepIndex ? 'text-starlink-blue' : 'text-starlink-grey'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < currentStepIndex
                          ? 'bg-starlink-blue text-starlink-dark'
                          : index === currentStepIndex
                          ? 'bg-starlink-blue/20 border-2 border-starlink-blue text-starlink-blue'
                          : 'bg-starlink-grey/20 text-starlink-grey'
                      }`}
                    >
                      {index < currentStepIndex ? '✓' : index + 1}
                    </div>
                    <span className="text-xs hidden sm:block">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-starlink-white mb-2">
                {currentStep.title}
              </h3>
              <p className="text-starlink-grey-light">
                {currentStep.description}
              </p>
            </div>

            {renderCurrentStep()}

            {currentStep.id !== 'dss_results' && (
              <div className="flex justify-between mt-8 pt-6 border-t border-starlink-grey/20">
                <button
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="px-4 py-2 border border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Back
                </button>
                <div className="text-sm text-starlink-grey-light">
                  🏢 Enterprise Demo - Database integration simulated
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default OnboardingDemo;