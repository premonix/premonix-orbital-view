import { useState } from 'react';
import { OrganizationProfile } from "@/types/organization";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BasicInfoStep } from "@/components/onboarding/steps/BasicInfoStep";
import { OrganizationDetailsStep } from "@/components/onboarding/steps/OrganizationDetailsStep";
import { SecurityPostureStep } from "@/components/onboarding/steps/SecurityPostureStep";
import { RiskAssessmentStep } from "@/components/onboarding/steps/RiskAssessmentStep";
import { DSSResultsStep } from "@/components/onboarding/steps/DSSResultsStep";

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

  // Simple DSS calculation for demo purposes
  const calculateDemoDSSScore = (orgProfile: Partial<OrganizationProfile>) => {
    let score = 40; // Base score
    
    // Sector risk adjustments
    const sectorScores: Record<string, number> = {
      'technology': 20,
      'financial_services': 25,
      'healthcare': 22,
      'manufacturing': 18,
      'energy_utilities': 28,
      'government_public_sector': 30,
      'education': 12,
      'retail_consumer_goods': 15,
      'other': 15
    };
    
    if (orgProfile.sector) {
      score += sectorScores[orgProfile.sector] || 15;
    }
    
    // Size adjustments
    const sizeScores: Record<string, number> = {
      'micro': 5,
      'small': 10,
      'medium': 15,
      'large': 20,
      'enterprise': 25
    };
    
    if (orgProfile.size) {
      score += sizeScores[orgProfile.size] || 10;
    }
    
    // Security measures bonus
    if (orgProfile.existing_security_measures) {
      score -= orgProfile.existing_security_measures.length * 2; // More security = lower risk score
    }
    
    return Math.max(20, Math.min(85, score)); // Keep between 20-85
  };

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...organizationData, ...stepData };
    setOrganizationData(updatedData);

    // Calculate DSS score when reaching risk assessment
    if (currentStep.id === 'risk_assessment') {
      const dssScore = calculateDemoDSSScore(updatedData);
      setCalculatedDSSScore(dssScore);
    }

    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleFinishDemo = () => {
    alert(`Demo Complete! 
    
Organization: ${organizationData.name}
Sector: ${organizationData.sector}
DSS Score: ${calculatedDSSScore}

In the real version, this would save to the database and redirect to your personalized dashboard.`);
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
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/40">
                  DEMO MODE
                </Badge>
                <p className="text-starlink-white text-sm">
                  This is a demo of the organization onboarding flow. No data will be saved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-panel border-starlink-grey/30 max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-starlink-white text-2xl">Organization Onboarding Demo</CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Experience the full onboarding process for personalized threat intelligence
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
                  Demo Mode - No data is saved
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