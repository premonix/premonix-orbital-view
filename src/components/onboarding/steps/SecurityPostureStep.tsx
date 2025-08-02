import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { OrganizationProfile } from "@/types/organization";

interface SecurityPostureStepProps {
  data: Partial<OrganizationProfile>;
  onComplete: (data: Partial<OrganizationProfile>) => void;
}

const KEY_ASSETS_OPTIONS = [
  'Customer databases',
  'Financial systems',
  'Intellectual property',
  'Manufacturing systems',
  'Research data',
  'Cloud infrastructure',
  'Physical facilities',
  'Supply chain systems',
  'Communication systems',
  'Backup systems'
];

const SECURITY_MEASURES_OPTIONS = [
  'Firewall protection',
  'Antivirus software',
  'Multi-factor authentication',
  'Employee security training',
  'Regular security audits',
  'Incident response plan',
  'Data encryption',
  'Access controls',
  'Security monitoring',
  'Backup and recovery',
  'Network segmentation',
  'Vulnerability assessments'
];

export const SecurityPostureStep = ({ data, onComplete }: SecurityPostureStepProps) => {
  const [formData, setFormData] = useState({
    key_assets: data.key_assets || [],
    existing_security_measures: data.existing_security_measures || []
  });

  const handleAssetChange = (asset: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      key_assets: checked
        ? [...prev.key_assets, asset]
        : prev.key_assets.filter(a => a !== asset)
    }));
  };

  const handleSecurityMeasureChange = (measure: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      existing_security_measures: checked
        ? [...prev.existing_security_measures, measure]
        : prev.existing_security_measures.filter(m => m !== measure)
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label className="text-starlink-white text-lg">Critical Assets</Label>
          <p className="text-starlink-grey-light text-sm mt-1">
            Select the key assets that are critical to your organization's operations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KEY_ASSETS_OPTIONS.map((asset) => (
            <div key={asset} className="flex items-center space-x-2">
              <Checkbox
                id={`asset-${asset}`}
                checked={formData.key_assets.includes(asset)}
                onCheckedChange={(checked) => handleAssetChange(asset, checked as boolean)}
              />
              <Label htmlFor={`asset-${asset}`} className="text-starlink-grey-light">
                {asset}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-starlink-white text-lg">Current Security Measures</Label>
          <p className="text-starlink-grey-light text-sm mt-1">
            Select the security measures currently implemented in your organization
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECURITY_MEASURES_OPTIONS.map((measure) => (
            <div key={measure} className="flex items-center space-x-2">
              <Checkbox
                id={`measure-${measure}`}
                checked={formData.existing_security_measures.includes(measure)}
                onCheckedChange={(checked) => handleSecurityMeasureChange(measure, checked as boolean)}
              />
              <Label htmlFor={`measure-${measure}`} className="text-starlink-grey-light">
                {measure}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-starlink-slate/20 p-4 rounded-lg border border-starlink-grey/20">
        <h4 className="text-starlink-white font-medium mb-2">Security Assessment Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-starlink-grey-light">Critical Assets Identified:</span>
            <span className="text-starlink-blue ml-2">{formData.key_assets.length}</span>
          </div>
          <div>
            <span className="text-starlink-grey-light">Security Measures in Place:</span>
            <span className="text-starlink-blue ml-2">{formData.existing_security_measures.length}/12</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-starlink-grey-light">Security Maturity</span>
            <span className="text-starlink-blue">
              {Math.round((formData.existing_security_measures.length / SECURITY_MEASURES_OPTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-starlink-grey/20 rounded-full h-2 mt-1">
            <div
              className="bg-starlink-blue h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(formData.existing_security_measures.length / SECURITY_MEASURES_OPTIONS.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
        >
          Continue to Risk Assessment
        </Button>
      </div>
    </div>
  );
};