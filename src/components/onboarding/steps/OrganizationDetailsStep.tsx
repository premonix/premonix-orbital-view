import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { OrganizationProfile, OrganizationSize, GeographicRegion } from "@/types/organization";

interface OrganizationDetailsStepProps {
  data: Partial<OrganizationProfile>;
  onComplete: (data: Partial<OrganizationProfile>) => void;
}

const SIZE_OPTIONS: { value: OrganizationSize; label: string; description: string }[] = [
  { value: 'micro', label: 'Micro (1-10 employees)', description: 'Small teams, basic operations' },
  { value: 'small', label: 'Small (11-50 employees)', description: 'Growing business, multiple departments' },
  { value: 'medium', label: 'Medium (51-250 employees)', description: 'Established operations, regional presence' },
  { value: 'large', label: 'Large (251-1000 employees)', description: 'Multiple locations, complex operations' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)', description: 'Global presence, highly complex operations' }
];

const REGION_OPTIONS: { value: GeographicRegion; label: string }[] = [
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'africa', label: 'Africa' },
  { value: 'asia_pacific', label: 'Asia Pacific' },
  { value: 'middle_east', label: 'Middle East' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'global', label: 'Global Operations' }
];

const LOCATION_SUGGESTIONS = [
  'New York, NY', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia',
  'Toronto, Canada', 'Berlin, Germany', 'Singapore', 'Mumbai, India',
  'São Paulo, Brazil', 'Dubai, UAE', 'Los Angeles, CA', 'Paris, France'
];

export const OrganizationDetailsStep = ({ data, onComplete }: OrganizationDetailsStepProps) => {
  const [formData, setFormData] = useState({
    size: data.size || '',
    employee_count: data.employee_count || '',
    annual_revenue_usd: data.annual_revenue_usd || '',
    primary_region: data.primary_region || '',
    locations: data.locations || [],
    supply_chain_complexity: data.supply_chain_complexity || 3
  });

  const [newLocation, setNewLocation] = useState('');

  const handleLocationAdd = () => {
    if (newLocation.trim() && !formData.locations.includes(newLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()]
      }));
      setNewLocation('');
    }
  };

  const handleLocationRemove = (location: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== location)
    }));
  };

  const handleLocationSuggestion = (location: string) => {
    if (!formData.locations.includes(location)) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, location]
      }));
    }
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      size: formData.size as OrganizationSize,
      primary_region: formData.primary_region as GeographicRegion,
      employee_count: formData.employee_count ? parseInt(formData.employee_count.toString()) : undefined,
      annual_revenue_usd: formData.annual_revenue_usd ? parseInt(formData.annual_revenue_usd.toString()) : undefined
    };
    onComplete(submitData);
  };

  const isValid = formData.size && formData.primary_region;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-starlink-white text-lg">Organization Size *</Label>
        <RadioGroup
          value={formData.size}
          onValueChange={(value) => setFormData(prev => ({ ...prev, size: value as OrganizationSize }))}
          className="space-y-3"
        >
          {SIZE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-starlink-grey/20 hover:border-starlink-blue/40 transition-colors">
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={option.value} className="text-starlink-white font-medium">
                  {option.label}
                </Label>
                <p className="text-sm text-starlink-grey-light mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employee-count" className="text-starlink-white">
            Employee Count
          </Label>
          <Input
            id="employee-count"
            type="number"
            value={formData.employee_count}
            onChange={(e) => setFormData(prev => ({ ...prev, employee_count: e.target.value }))}
            placeholder="e.g., 150"
            className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="annual-revenue" className="text-starlink-white">
            Annual Revenue (USD)
          </Label>
          <Input
            id="annual-revenue"
            type="number"
            value={formData.annual_revenue_usd}
            onChange={(e) => setFormData(prev => ({ ...prev, annual_revenue_usd: e.target.value }))}
            placeholder="e.g., 10000000"
            className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-starlink-white text-lg">Primary Geographic Region *</Label>
        <RadioGroup
          value={formData.primary_region}
          onValueChange={(value) => setFormData(prev => ({ ...prev, primary_region: value as GeographicRegion }))}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {REGION_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-starlink-grey-light">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-starlink-white text-lg">Office Locations</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Add a location (city, country)"
              className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
              onKeyPress={(e) => e.key === 'Enter' && handleLocationAdd()}
            />
            <Button
              type="button"
              onClick={handleLocationAdd}
              variant="outline"
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              Add
            </Button>
          </div>

          {formData.locations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.locations.map((location) => (
                <div
                  key={location}
                  className="bg-starlink-blue/20 text-starlink-blue px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {location}
                  <button
                    onClick={() => handleLocationRemove(location)}
                    className="text-starlink-blue hover:text-starlink-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-starlink-grey-light text-sm">Quick add common locations:</Label>
            <div className="flex flex-wrap gap-2">
              {LOCATION_SUGGESTIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSuggestion(location)}
                  className="text-xs px-2 py-1 rounded border border-starlink-grey/40 text-starlink-grey-light hover:border-starlink-blue/40 hover:text-starlink-blue transition-colors"
                  disabled={formData.locations.includes(location)}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-starlink-white text-lg">Supply Chain Complexity</Label>
        <div className="space-y-3">
          <RadioGroup
            value={formData.supply_chain_complexity.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, supply_chain_complexity: parseInt(value) }))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="supply-1" />
              <Label htmlFor="supply-1" className="text-starlink-grey-light">Simple - Few suppliers, local operations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="supply-3" />
              <Label htmlFor="supply-3" className="text-starlink-grey-light">Moderate - Multiple suppliers, regional operations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="supply-5" />
              <Label htmlFor="supply-5" className="text-starlink-grey-light">Complex - Global suppliers, intricate dependencies</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
        >
          Continue to Security Posture
        </Button>
      </div>
    </div>
  );
};