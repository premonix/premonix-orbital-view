import { 
  LayoutGrid, 
  Map, 
  Building, 
  Shield, 
  FileText, 
  Zap,
  Info,
  Database,
  Mail,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  authRequired?: boolean;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const mainNavItems: NavItem[] = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutGrid,
    authRequired: true 
  },
  { 
    label: 'Threat Map', 
    href: '/threat-map',
    icon: Map
  },
  { 
    label: 'Risk by Sector', 
    href: '/risk-by-sector',
    icon: Building
  },
  { 
    label: 'Resilience Toolkit', 
    href: '/resilience-toolkit',
    icon: Shield
  },
  { 
    label: 'Reports', 
    href: '/reports',
    icon: FileText
  },
  { 
    label: 'DisruptionOS', 
    href: '/disruption-os',
    icon: Zap
  }
];

export const aboutNavItems: NavItem[] = [
  { 
    label: 'About', 
    href: '/about',
    icon: Info
  },
  { 
    label: 'Data Sources', 
    href: '/data-sources',
    icon: Database
  },
  { 
    label: 'Contact', 
    href: '/contact',
    icon: Mail
  }
];

export const dashboardNavGroups: NavGroup[] = [
  {
    label: 'Monitoring',
    items: [
      { label: 'Overview', href: 'overview', icon: LayoutGrid },
      { label: 'Threats', href: 'threats', icon: Map },
      { label: 'Alerts', href: 'alerts', icon: FileText }
    ]
  },
  {
    label: 'Management',
    items: [
      { label: 'Resilience', href: 'resilience', icon: Shield },
      { label: 'Decision Support', href: 'decision', icon: Zap },
      { label: 'Analytics', href: 'analytics', icon: LayoutGrid }
    ]
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Settings', href: 'settings', icon: Info }
    ]
  }
];