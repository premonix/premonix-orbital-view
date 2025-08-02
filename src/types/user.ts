
export type UserRole = 'guest' | 'individual' | 'pro' | 'team_member' | 'team_admin' | 'enterprise_admin' | 'premonix_super_user';

export interface User {
  id: string;
  email?: string;
  name?: string;
  companyName?: string;
  role: UserRole;
  permissions: string[];
  subscription?: {
    plan: UserRole;
    tier: 'personal' | 'business-pro' | 'enterprise';
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
  individual: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'disruption_sensitivity_score',
    'business_impact_assessment',
    'crisis_playbooks',
    'communications_templates'
  ],
  pro: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'disruption_sensitivity_score',
    'business_impact_assessment',
    'crisis_playbooks',
    'communications_templates',
    'scenario_simulator',
    'api_access_read',
    'data_exports'
  ],
  team_member: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'disruption_sensitivity_score',
    'business_impact_assessment',
    'crisis_playbooks',
    'communications_templates',
    'scenario_simulator',
    'team_dashboards',
    'api_access_read',
    'data_exports'
  ],
  team_admin: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'disruption_sensitivity_score',
    'business_impact_assessment',
    'crisis_playbooks',
    'communications_templates',
    'scenario_simulator',
    'team_dashboards',
    'add_manage_team_members',
    'activity_analytics',
    'api_access_write',
    'billing_dashboard',
    'data_exports'
  ],
  enterprise_admin: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'disruption_sensitivity_score',
    'business_impact_assessment',
    'crisis_playbooks',
    'communications_templates',
    'scenario_simulator',
    'team_dashboards',
    'add_manage_team_members',
    'activity_analytics',
    'api_access_write',
    'billing_dashboard',
    'data_exports',
    'admin_console_access',
    'feature_flags_partial'
  ],
  premonix_super_user: [
    'view_threat_map',
    'view_full_feed',
    'view_dashboard',
    'configure_alerts',
    'view_resilience_toolkit',
    'save_scenarios',
    'disruption_sensitivity_score',
    'business_impact_assessment',
    'crisis_playbooks',
    'communications_templates',
    'scenario_simulator',
    'team_dashboards',
    'add_manage_team_members',
    'activity_analytics',
    'api_access_write',
    'billing_dashboard',
    'data_exports',
    'admin_console_access',
    'view_all_users_organizations',
    'modify_user_roles',
    'manage_feature_flags',
    'view_system_metrics',
    'access_edge_function_logs',
    'reset_demo_data',
    'impersonate_user',
    'modify_billing_settings'
  ]
};

export const planFeatures: Record<UserRole, string[]> = {
  guest: ['Basic threat map', 'Limited signal feed (3/day)', 'Basic resilience guides'],
  individual: ['Full threat map', 'Unlimited signal feed', 'Personal dashboard', 'Basic alerts', 'DSS assessment', 'Crisis playbooks'],
  pro: ['Scenario simulator', 'Advanced filtering', 'Data exports', 'Read API access'],
  team_member: ['Team dashboards', 'Shared scenarios', 'Collaboration tools'],
  team_admin: ['Team management', 'Activity analytics', 'Write API access', 'Billing dashboard'],
  enterprise_admin: ['Admin console access', 'Partial feature flags', 'Organization management'],
  premonix_super_user: ['Full system access', 'All feature flags', 'User impersonation', 'System monitoring', 'Edge function logs']
};

export const tierMapping: Record<UserRole, 'personal' | 'business-pro' | 'enterprise'> = {
  guest: 'personal',
  individual: 'personal',
  pro: 'personal',
  team_member: 'business-pro',
  team_admin: 'business-pro',
  enterprise_admin: 'enterprise',
  premonix_super_user: 'enterprise'
};
