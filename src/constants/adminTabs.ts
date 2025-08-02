import { 
  Users, 
  Building, 
  Shield, 
  CreditCard, 
  FileText, 
  TestTube, 
  BarChart3, 
  Activity,
  LucideIcon
} from 'lucide-react';

export interface AdminTab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  group: 'user-management' | 'system' | 'analytics';
}

export const adminTabGroups = {
  'user-management': {
    label: 'User Management',
    description: 'Manage users, organizations, and access control'
  },
  'system': {
    label: 'System Operations',
    description: 'System health, monitoring, and configuration'
  },
  'analytics': {
    label: 'Analytics & Insights',
    description: 'Usage analytics and reporting'
  }
};

export const adminTabs: AdminTab[] = [
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    description: 'Manage user accounts and permissions',
    group: 'user-management'
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: Building,
    description: 'Manage organizational structures',
    group: 'user-management'
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: Shield,
    description: 'Configure access control and security',
    group: 'user-management'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Manage subscriptions and payments',
    group: 'user-management'
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: FileText,
    description: 'Review system activity and changes',
    group: 'system'
  },
  {
    id: 'beta',
    label: 'Beta Access',
    icon: TestTube,
    description: 'Manage beta features and testing',
    group: 'system'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Usage metrics and performance data',
    group: 'analytics'
  },
  {
    id: 'monitoring',
    label: 'System Health',
    icon: Activity,
    description: 'Monitor system performance and uptime',
    group: 'system'
  }
];