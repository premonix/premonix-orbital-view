import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OrganizationOnboardingWizard } from '@/components/onboarding/OrganizationOnboardingWizard';
import { OrganizationProfile } from '@/types/organization';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const OrganizationOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOnboardingComplete = (profile: OrganizationProfile, dssScore: number) => {
    // Redirect to dashboard after successful onboarding with success state
    navigate('/dashboard', { 
      state: { 
        onboardingCompleted: true, 
        initialDSSScore: dssScore,
        organizationProfile: profile,
        isNewUser: true,
        completionTimestamp: new Date().toISOString()
      } 
    });
  };

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-starlink-dark">
      <Navigation />
      <OrganizationOnboardingWizard onComplete={handleOnboardingComplete} />
      <Footer />
    </div>
  );
};

export default OrganizationOnboarding;