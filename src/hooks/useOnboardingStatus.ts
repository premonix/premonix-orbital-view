import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  hasOrganizationProfile: boolean;
  hasDSSAssessment: boolean;
  isLoading: boolean;
}

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<OnboardingStatus>({
    hasCompletedOnboarding: false,
    hasOrganizationProfile: false,
    hasDSSAssessment: false,
    isLoading: true
  });

  useEffect(() => {
    if (!user) {
      setStatus({
        hasCompletedOnboarding: false,
        hasOrganizationProfile: false,
        hasDSSAssessment: false,
        isLoading: false
      });
      return;
    }

    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      // Check for completed onboarding progress
      const { data: progressData } = await supabase
        .from('onboarding_progress')
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('step', 'organization_onboarding')
        .maybeSingle();

      // Check for organization profile
      const { data: orgData } = await supabase
        .from('organization_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check for DSS assessment
      const { data: dssData } = await supabase
        .from('dss_assessments')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setStatus({
        hasCompletedOnboarding: !!progressData?.completed_at,
        hasOrganizationProfile: !!orgData,
        hasDSSAssessment: !!dssData,
        isLoading: false
      });

    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshStatus = () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    checkOnboardingStatus();
  };

  return { ...status, refreshStatus };
};