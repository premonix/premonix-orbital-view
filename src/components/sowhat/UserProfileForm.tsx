
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { UserProfile, UserType, ConcernLevel, BusinessSector } from "@/types/sowhat";

interface UserProfileFormProps {
  onComplete: (profile: UserProfile) => void;
}

const UserProfileForm = ({ onComplete }: UserProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    dependencies: [],
    primaryConcerns: []
  });

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData as UserProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDependencyChange = (dependency: string, checked: boolean) => {
    const current = formData.dependencies || [];
    if (checked) {
      updateFormData('dependencies', [...current, dependency]);
    } else {
      updateFormData('dependencies', current.filter(d => d !== dependency));
    }
  };

  const handleConcernChange = (concern: string, checked: boolean) => {
    const current = formData.primaryConcerns || [];
    if (checked) {
      updateFormData('primaryConcerns', [...current, concern]);
    } else {
      updateFormData('primaryConcerns', current.filter(c => c !== concern));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-starlink-white text-lg mb-4 block">What type of user are you?</Label>
              <RadioGroup 
                value={formData.userType} 
                onValueChange={(value) => updateFormData('userType', value as UserType)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Personal" id="personal" />
                  <Label htmlFor="personal" className="text-starlink-grey-light">Personal - Individual preparedness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Family" id="family" />
                  <Label htmlFor="family" className="text-starlink-grey-light">Family - Household safety planning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SME" id="sme" />
                  <Label htmlFor="sme" className="text-starlink-grey-light">SME - Small business (1-50 employees)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Enterprise" id="enterprise" />
                  <Label htmlFor="enterprise" className="text-starlink-grey-light">Enterprise - Large organization</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="location" className="text-starlink-white text-lg mb-4 block">
                Where are you located?
              </Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="e.g., Birmingham, UK"
                className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="role" className="text-starlink-white text-lg mb-4 block">
                What's your role?
              </Label>
              <Input
                id="role"
                value={formData.role || ''}
                onChange={(e) => updateFormData('role', e.target.value)}
                placeholder="e.g., Head of Family, IT Manager, CEO"
                className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
              />
            </div>
          </div>
        );

      case 4:
        if (formData.userType === 'SME' || formData.userType === 'Enterprise') {
          return (
            <div className="space-y-6">
              <div>
                <Label className="text-starlink-white text-lg mb-4 block">What sector are you in?</Label>
                <RadioGroup 
                  value={formData.sector} 
                  onValueChange={(value) => updateFormData('sector', value as BusinessSector)}
                  className="grid grid-cols-2 gap-3"
                >
                  {['Healthcare', 'Energy', 'Retail', 'Education', 'Technology', 'Finance', 'Manufacturing', 'Transport', 'Government'].map((sector) => (
                    <div key={sector} className="flex items-center space-x-2">
                      <RadioGroupItem value={sector} id={sector.toLowerCase()} />
                      <Label htmlFor={sector.toLowerCase()} className="text-starlink-grey-light">{sector}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        }
        // Skip to next step for Personal/Family
        setTimeout(() => handleNext(), 0);
        return null;

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-starlink-white text-lg mb-4 block">
                What are your key dependencies? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Cloud systems',
                  'Physical offices',
                  'Supply chains',
                  'Remote workers',
                  'Critical infrastructure',
                  'Public transport',
                  'Energy grid',
                  'Internet connectivity'
                ].map((dependency) => (
                  <div key={dependency} className="flex items-center space-x-2">
                    <Checkbox
                      id={dependency}
                      checked={formData.dependencies?.includes(dependency)}
                      onCheckedChange={(checked) => handleDependencyChange(dependency, checked as boolean)}
                    />
                    <Label htmlFor={dependency} className="text-starlink-grey-light">{dependency}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-starlink-white text-lg mb-4 block">How would you describe your concern level?</Label>
              <RadioGroup 
                value={formData.concernLevel} 
                onValueChange={(value) => updateFormData('concernLevel', value as ConcernLevel)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Curious" id="curious" />
                  <Label htmlFor="curious" className="text-starlink-grey-light">Curious - Just exploring options</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mildly Concerned" id="mildly" />
                  <Label htmlFor="mildly" className="text-starlink-grey-light">Mildly Concerned - Want to be prepared</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Preparing Actively" id="actively" />
                  <Label htmlFor="actively" className="text-starlink-grey-light">Preparing Actively - Taking immediate action</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-starlink-white text-lg mb-4 block">
                What are your primary concerns? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Cyber attacks',
                  'Supply chain disruption',
                  'Power outages',
                  'Civil unrest',
                  'Natural disasters',
                  'Economic instability',
                  'Communication breakdown',
                  'Food/water security'
                ].map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={concern}
                      checked={formData.primaryConcerns?.includes(concern)}
                      onCheckedChange={(checked) => handleConcernChange(concern, checked as boolean)}
                    />
                    <Label htmlFor={concern} className="text-starlink-grey-light">{concern}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="glass-panel border-starlink-grey/30 max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-starlink-white">Build Your Resilience Profile</CardTitle>
            <CardDescription className="text-starlink-grey-light">
              Step {currentStep} of {totalSteps}
            </CardDescription>
          </div>
          <div className="w-24">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
            disabled={
              (currentStep === 1 && !formData.userType) ||
              (currentStep === 2 && !formData.location) ||
              (currentStep === 3 && !formData.role) ||
              (currentStep === 6 && !formData.concernLevel)
            }
          >
            {currentStep === totalSteps ? '🛠️ Build My Kit' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
