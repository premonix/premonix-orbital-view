import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { OrganizationProfile, OnboardingProgress } from "@/types/organization";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { OrganizationDetailsStep } from "./steps/OrganizationDetailsStep";
import { SecurityPostureStep } from "./steps/SecurityPostureStep";
import { RiskAssessmentStep } from "./steps/RiskAssessmentStep";
import { DSSResultsStep } from "./steps/DSSResultsStep";

interface OrganizationOnboardingWizardProps {
  onComplete: (profile: OrganizationProfile, dssScore: number) => void;
}

const ONBOARDING_STEPS = [
  { id: 'basic_info', title: 'Organization Info', description: 'Basic details about your organization' },
  { id: 'org_details', title: 'Structure & Scale', description: 'Size, locations, and operations' },
  { id: 'security_posture', title: 'Security Posture', description: 'Current security measures and assets' },
  { id: 'risk_assessment', title: 'Risk Assessment', description: 'Risk tolerance and regulatory requirements' },
  { id: 'dss_results', title: 'Your DSS Score', description: 'Initial security assessment results' }
];

export const OrganizationOnboardingWizard = ({ onComplete }: OrganizationOnboardingWizardProps) => {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [organizationData, setOrganizationData] = useState<Partial<OrganizationProfile>>({});
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedDSSScore, setCalculatedDSSScore] = useState<number | null>(null);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  useEffect(() => {
    if (user) {
      loadOnboardingProgress();
    }
  }, [user]);

  const loadOnboardingProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('step', 'organization_onboarding')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading onboarding progress:', error);
      return;
    }

    if (data) {
      const progressData = data.data as any;
      if (progressData?.organization_profile) {
        setOrganizationData(progressData.organization_profile);
      }
      if (progressData?.current_step_index !== undefined) {
        setCurrentStepIndex(progressData.current_step_index);
      }
    }
  };

  const saveProgress = async (stepIndex: number, data: any) => {
    if (!user) return;

    const progressData = {
      current_step_index: stepIndex,
      organization_profile: { ...organizationData, ...data },
      completed_steps: ONBOARDING_STEPS.slice(0, stepIndex + 1).map(s => s.id)
    };

    const { error } = await supabase
      .from('onboarding_progress')
      .upsert({
        user_id: user.id,
        step: 'organization_onboarding',
        data: progressData,
        completed_at: stepIndex === ONBOARDING_STEPS.length - 1 ? new Date().toISOString() : null
      });

    if (error) {
      console.error('Error saving progress:', error);
    }
  };

  const calculateDSSScore = async (orgProfile: OrganizationProfile) => {
    const { data, error } = await supabase.rpc('calculate_initial_dss_score', {
      org_sector: orgProfile.sector,
      org_size: orgProfile.size,
      supply_complexity: orgProfile.supply_chain_complexity || 3,
      primary_region: orgProfile.primary_region,
      employee_count: orgProfile.employee_count
    });

    if (error) {
      console.error('Error calculating DSS score:', error);
      return 50; // Fallback score
    }

    return data || 50;
  };

  const handleStepComplete = async (stepData: any) => {
    const updatedData = { ...organizationData, ...stepData };
    setOrganizationData(updatedData);

    // If this is the risk assessment step, calculate DSS score
    if (currentStep.id === 'risk_assessment' && updatedData.sector && updatedData.size && updatedData.primary_region) {
      const dssScore = await calculateDSSScore(updatedData as OrganizationProfile);
      setCalculatedDSSScore(dssScore);
    }

    await saveProgress(currentStepIndex, stepData);

    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleFinishOnboarding = async () => {
    if (!user || !calculatedDSSScore) return;

    setIsSubmitting(true);

    try {
      // Save organization profile
      const { error: orgError } = await supabase
        .from('organization_profiles')
        .upsert({
          user_id: user.id,
          ...(organizationData as OrganizationProfile)
        });

      if (orgError) throw orgError;

      // Save DSS assessment
      const { error: dssError } = await supabase
        .from('dss_assessments')
        .insert({
          user_id: user.id,
          overall_score: calculatedDSSScore,
          category_scores: {},
          assessment_data: {
            organization_profile: organizationData,
            onboarding_completed: true
          },
          risk_level: calculatedDSSScore >= 80 ? 'low' : calculatedDSSScore >= 60 ? 'medium' : 'high'
        });

      if (dssError) throw dssError;

      // Mark onboarding as complete
      await saveProgress(ONBOARDING_STEPS.length - 1, {});

      toast.success("Organization onboarding completed successfully!");
      onComplete(organizationData as OrganizationProfile, calculatedDSSScore);

    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            onFinish={handleFinishOnboarding}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-starlink-dark">
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-panel border-starlink-grey/30 max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-starlink-white text-2xl">Organization Onboarding</CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Set up your organization profile for personalized threat intelligence
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
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                >
                  Back
                </Button>
                <div className="text-sm text-starlink-grey-light">
                  Progress will be saved automatically
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};