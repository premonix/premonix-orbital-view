import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { OrganizationProfile } from "@/types/organization";

interface RiskAssessmentStepProps {
  data: Partial<OrganizationProfile>;
  onComplete: (data: Partial<OrganizationProfile>) => void;
}

const REGULATORY_REQUIREMENTS_OPTIONS = [
  'GDPR (General Data Protection Regulation)',
  'HIPAA (Health Insurance Portability and Accountability Act)',
  'SOX (Sarbanes-Oxley Act)',
  'PCI DSS (Payment Card Industry Data Security Standard)',
  'FISMA (Federal Information Security Management Act)',
  'ISO 27001 (Information Security Management)',
  'NIST Framework',
  'SOC 2 (Service Organization Control 2)',
  'CCPA (California Consumer Privacy Act)',
  'Industry-specific regulations'
];

export const RiskAssessmentStep = ({ data, onComplete }: RiskAssessmentStepProps) => {
  const [formData, setFormData] = useState({
    risk_tolerance: data.risk_tolerance || 3,
    regulatory_requirements: data.regulatory_requirements || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegulatoryChange = (requirement: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      regulatory_requirements: checked
        ? [...prev.regulatory_requirements, requirement]
        : prev.regulatory_requirements.filter(r => r !== requirement)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Add a small delay to show loading state while DSS calculation happens
    setTimeout(() => {
      onComplete(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const getRiskToleranceLabel = (value: number) => {
    switch (value) {
      case 1: return 'Very Conservative - Minimal risk acceptance';
      case 2: return 'Conservative - Low risk acceptance';
      case 3: return 'Moderate - Balanced risk approach';
      case 4: return 'Aggressive - Higher risk acceptance';
      case 5: return 'Very Aggressive - Maximum risk acceptance';
      default: return 'Moderate - Balanced risk approach';
    }
  };

  const getRiskColor = (value: number) => {
    if (value <= 2) return 'text-green-400';
    if (value <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <Label className="text-starlink-white text-lg">Risk Tolerance Level</Label>
          <p className="text-starlink-grey-light text-sm mt-1">
            How much risk is your organization willing to accept to achieve business objectives?
          </p>
        </div>
        
        <div className="space-y-4">
          <RadioGroup
            value={formData.risk_tolerance.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, risk_tolerance: parseInt(value) }))}
            className="space-y-4"
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex items-start space-x-3 p-4 rounded-lg border border-starlink-grey/20 hover:border-starlink-blue/40 transition-colors">
                <RadioGroupItem value={level.toString()} id={`risk-${level}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`risk-${level}`} className="text-starlink-white font-medium">
                    Level {level}
                  </Label>
                  <p className={`text-sm mt-1 ${getRiskColor(level)}`}>
                    {getRiskToleranceLabel(level)}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-starlink-white text-lg">Regulatory Requirements</Label>
          <p className="text-starlink-grey-light text-sm mt-1">
            Select all regulatory frameworks and compliance requirements that apply to your organization
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {REGULATORY_REQUIREMENTS_OPTIONS.map((requirement) => (
            <div key={requirement} className="flex items-start space-x-2 p-2 rounded border border-starlink-grey/10">
              <Checkbox
                id={`reg-${requirement}`}
                checked={formData.regulatory_requirements.includes(requirement)}
                onCheckedChange={(checked) => handleRegulatoryChange(requirement, checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor={`reg-${requirement}`} className="text-starlink-grey-light text-sm leading-relaxed">
                {requirement}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-starlink-slate/20 p-6 rounded-lg border border-starlink-grey/20">
        <h4 className="text-starlink-white font-medium mb-4">Risk Profile Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-starlink-grey-light">Risk Tolerance:</span>
            <span className={`font-medium ${getRiskColor(formData.risk_tolerance)}`}>
              Level {formData.risk_tolerance}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-starlink-grey-light">Compliance Requirements:</span>
            <span className="text-starlink-blue font-medium">
              {formData.regulatory_requirements.length} selected
            </span>
          </div>
          <div className="pt-2 border-t border-starlink-grey/20">
            <p className="text-xs text-starlink-grey-light">
              This information will be used to calculate your organization's initial Digital Security Score (DSS)
              and provide personalized threat intelligence recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark min-w-[200px]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-starlink-dark/20 border-t-starlink-dark rounded-full animate-spin" />
              Calculating DSS Score...
            </div>
          ) : (
            'Calculate DSS Score'
          )}
        </Button>
      </div>
    </div>
  );
};