export type OrganizationSector = 
  | 'technology' 
  | 'financial_services' 
  | 'healthcare' 
  | 'manufacturing' 
  | 'energy_utilities' 
  | 'government_public_sector' 
  | 'education' 
  | 'retail_consumer_goods' 
  | 'telecommunications' 
  | 'transportation_logistics' 
  | 'agriculture' 
  | 'real_estate' 
  | 'entertainment_media' 
  | 'non_profit' 
  | 'consulting' 
  | 'other';

export type OrganizationSize = 
  | 'micro' 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'enterprise';

export type GeographicRegion = 
  | 'north_america' 
  | 'south_america' 
  | 'europe' 
  | 'africa' 
  | 'asia_pacific' 
  | 'middle_east' 
  | 'oceania' 
  | 'global';

export interface OrganizationProfile {
  id?: string;
  name: string;
  sector: OrganizationSector;
  size: OrganizationSize;
  employee_count?: number;
  annual_revenue_usd?: number;
  primary_region: GeographicRegion;
  locations?: string[];
  website?: string;
  description?: string;
  key_assets?: string[];
  supply_chain_complexity?: number;
  regulatory_requirements?: string[];
  existing_security_measures?: string[];
  risk_tolerance?: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  data?: any;
}

export interface OnboardingProgress {
  current_step: string;
  completed_steps: string[];
  organization_profile?: OrganizationProfile;
  initial_dss_score?: number;
  started_at: string;
  completed_at?: string;
}