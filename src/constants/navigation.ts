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

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  authRequired?: boolean;
  external?: boolean;
}

// Grouped navigation for cleaner top nav
export const navGroups: NavGroup[] = [
  {
    label: 'Intelligence',
    items: [
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
        label: 'Reports', 
        href: '/reports',
        icon: FileText
      }
    ]
  },
  {
    label: 'Tools',
    items: [
      { 
        label: 'Dashboard', 
        href: '/dashboard', 
        icon: LayoutGrid,
        authRequired: true 
      },
      { 
        label: 'Resilience Toolkit', 
        href: '/resilience-toolkit',
        icon: Shield
      },
      { 
        label: 'DisruptionOS', 
        href: '/disruption-os',
        icon: Zap
      }
    ]
  },
  {
    label: 'Company',
    items: [
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
    ]
  }
];

// Legacy exports for backwards compatibility
export const mainNavItems: NavItem[] = navGroups.flatMap(group => group.items.filter(item => group.label !== 'Company'));

export const aboutNavItems: NavItem[] = navGroups.find(group => group.label === 'Company')?.items || [];

export const dashboardNavGroups: NavGroup[] = [
  {
    label: 'Intelligence',
    items: [
      { label: 'Overview', href: 'overview', icon: LayoutGrid },
      { label: 'Threats', href: 'threats', icon: Map },
      { label: 'Executive Brief', href: 'executive', icon: FileText },
      { label: 'Watchlist', href: 'watchlist', icon: Info }
    ]
  },
  {
    label: 'Operations',
    items: [
      { label: 'Resilience', href: 'resilience', icon: Shield },
      { label: 'Decision Support', href: 'decision', icon: Zap },
      { label: 'Analytics', href: 'analytics', icon: LayoutGrid },
      { label: 'DisruptionOS', href: 'disruption-os', icon: Building }
    ]
  },
  {
    label: 'Management',
    items: [
      { label: 'Alerts', href: 'alerts', icon: Database },
      { label: 'Settings', href: 'settings', icon: Info },
      { label: 'Admin Console', href: 'admin', icon: Shield, authRequired: true }
    ]
  }
];