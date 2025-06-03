
export type UserType = 'Personal' | 'Family' | 'SME' | 'Enterprise';

export type ConcernLevel = 'Curious' | 'Mildly Concerned' | 'Preparing Actively';

export type BusinessSector = 
  | 'Healthcare' 
  | 'Energy' 
  | 'Retail' 
  | 'Education' 
  | 'Technology' 
  | 'Finance' 
  | 'Manufacturing' 
  | 'Transport' 
  | 'Government'
  | 'Other';

export interface UserProfile {
  userType: UserType;
  location: string;
  role: string;
  sector?: BusinessSector;
  dependencies: string[];
  concernLevel: ConcernLevel;
  teamSize?: number;
  hasCriticalInfrastructure: boolean;
  hasRemoteWorkers: boolean;
  primaryConcerns: string[];
}

export interface ToolkitSection {
  id: string;
  title: string;
  description: string;
  items: ToolkitItem[];
  userTypes: UserType[];
}

export interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'template' | 'guide' | 'worksheet';
  content: string[];
  downloadable: boolean;
}
