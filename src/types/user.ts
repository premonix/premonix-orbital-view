
export type UserRole = 'guest' | 'registered' | 'business' | 'enterprise';

export interface User {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  permissions: string[];
  subscription?: {
    plan: UserRole;
    expiresAt?: Date;
    features: string[];
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const rolePermissions: Record<UserRole, string[]> = {
  guest: [
    'view_threat_map',
    'view_basic_feed',
    'view_resilience_toolkit_limited'
  ],
  registered: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios'
  ],
  business: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'sector_analyzer',
    'scenario_simulator',
    'team_dashboards'
  ],
  enterprise: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'sector_analyzer',
    'scenario_simulator',
    'team_dashboards',
    'escalation_modeling',
    'api_access',
    'white_label',
    'custom_alerts'
  ]
};

export const planFeatures: Record<UserRole, string[]> = {
  guest: ['Basic threat map', 'Limited signal feed (3/day)', 'Basic resilience guides'],
  registered: ['Full threat map', 'Unlimited signal feed', 'Personal dashboard', 'Basic alerts'],
  business: ['Sector risk analyzer', 'Scenario simulator', 'Team dashboards', 'Priority alerts'],
  enterprise: ['Full escalation modeling', 'API access', 'White-label features', 'Custom integrations']
};
