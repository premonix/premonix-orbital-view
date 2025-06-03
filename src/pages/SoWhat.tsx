
import { useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import UserProfileForm from "@/components/sowhat/UserProfileForm";
import ResilienceToolkit from "@/components/sowhat/ResilienceToolkit";
import { UserProfile } from "@/types/sowhat";

const SoWhat = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showToolkit, setShowToolkit] = useState(false);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowToolkit(true);
  };

  const handleReset = () => {
    setUserProfile(null);
    setShowToolkit(false);
  };

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-starlink-blue">So What?</h1>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Here's how you prepare, based on what we know about you and current threat intelligence.
            </p>
          </div>

          {!showToolkit ? (
            <div className="space-y-8">
              {/* Introduction Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-starlink-blue text-lg">Personal</CardTitle>
                    <CardDescription className="text-starlink-grey-light">
                      Individual preparedness
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-starlink-blue text-lg">Family</CardTitle>
                    <CardDescription className="text-starlink-grey-light">
                      Household safety planning
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-starlink-blue text-lg">SME</CardTitle>
                    <CardDescription className="text-starlink-grey-light">
                      Small business resilience
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-starlink-blue text-lg">Enterprise</CardTitle>
                    <CardDescription className="text-starlink-grey-light">
                      Corporate continuity
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Profile Form */}
              <UserProfileForm onComplete={handleProfileComplete} />
            </div>
          ) : (
            <div>
              {/* User Profile Summary */}
              <Card className="glass-panel border-starlink-grey/30 mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-starlink-white">Your Profile</CardTitle>
                      <CardDescription className="text-starlink-grey-light">
                        {userProfile?.userType} • {userProfile?.location} • {userProfile?.role}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                    >
                      Update Profile
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Resilience Toolkit */}
              <ResilienceToolkit userProfile={userProfile!} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SoWhat;
