import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OrganizationProfile, OrganizationSector } from "@/types/organization";

interface BasicInfoStepProps {
  data: Partial<OrganizationProfile>;
  onComplete: (data: Partial<OrganizationProfile>) => void;
}

const SECTOR_OPTIONS: { value: OrganizationSector; label: string }[] = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare & Life Sciences' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'energy_utilities', label: 'Energy & Utilities' },
  { value: 'government_public_sector', label: 'Government & Public Sector' },
  { value: 'education', label: 'Education' },
  { value: 'retail_consumer_goods', label: 'Retail & Consumer Goods' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'transportation_logistics', label: 'Transportation & Logistics' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'entertainment_media', label: 'Entertainment & Media' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'consulting', label: 'Consulting & Professional Services' },
  { value: 'other', label: 'Other' }
];

export const BasicInfoStep = ({ data, onComplete }: BasicInfoStepProps) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    sector: data.sector || '',
    website: data.website || '',
    description: data.description || ''
  });

  const handleSubmit = () => {
    onComplete({
      ...formData,
      sector: formData.sector as OrganizationSector
    });
  };

  const isValid = formData.name.trim() && formData.sector;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="org-name" className="text-starlink-white">
            Organization Name *
          </Label>
          <Input
            id="org-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Acme Corporation"
            className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-starlink-white">
            Website
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://www.example.com"
            className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-starlink-white text-lg">Industry Sector *</Label>
        <RadioGroup
          value={formData.sector}
          onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value as OrganizationSector }))}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {SECTOR_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-starlink-grey-light">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-starlink-white">
          Organization Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of your organization's mission and main activities..."
          className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
        >
          Continue to Structure & Scale
        </Button>
      </div>
    </div>
  );
};