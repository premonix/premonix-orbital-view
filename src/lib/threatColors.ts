// Centralized threat severity color system
// Uses design system colors for consistency across all components

export const THREAT_SEVERITY_COLORS = {
  critical: {
    hex: '#dc2626',      // starlink-red
    tailwind: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
    hsl: '0 84% 45%'
  },
  high: {
    hex: '#f97316',      // starlink-orange  
    tailwind: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
    hsl: '25 95% 53%'
  },
  medium: {
    hex: '#eab308',      // yellow-500
    tailwind: 'bg-yellow-500',
    text: 'text-yellow-500',
    border: 'border-yellow-500',
    hsl: '45 93% 47%'
  },
  low: {
    hex: '#00b4d8',      // starlink-blue
    tailwind: 'bg-blue-500',
    text: 'text-blue-500',
    border: 'border-blue-500',
    hsl: '194 100% 42%'
  }
} as const;

export type ThreatSeverity = keyof typeof THREAT_SEVERITY_COLORS;

// Utility functions for getting colors in different formats
export const getSeverityColorHex = (severity: string): string => {
  const severityKey = severity.toLowerCase() as ThreatSeverity;
  return THREAT_SEVERITY_COLORS[severityKey]?.hex || '#6b7280'; // gray-500 fallback
};

export const getSeverityColorTailwind = (severity: string): string => {
  const severityKey = severity.toLowerCase() as ThreatSeverity;
  return THREAT_SEVERITY_COLORS[severityKey]?.tailwind || 'bg-gray-500';
};

export const getSeverityColorText = (severity: string): string => {
  const severityKey = severity.toLowerCase() as ThreatSeverity;
  return THREAT_SEVERITY_COLORS[severityKey]?.text || 'text-gray-500';
};

export const getSeverityColorBorder = (severity: string): string => {
  const severityKey = severity.toLowerCase() as ThreatSeverity;
  return THREAT_SEVERITY_COLORS[severityKey]?.border || 'border-gray-500';
};

export const getSeverityColorHsl = (severity: string): string => {
  const severityKey = severity.toLowerCase() as ThreatSeverity;
  return THREAT_SEVERITY_COLORS[severityKey]?.hsl || '220 9% 46%'; // gray-500 hsl
};

// Category colors for threat types
export const THREAT_CATEGORY_COLORS = {
  Military: 'text-red-400',
  Cyber: 'text-purple-400', 
  Diplomatic: 'text-blue-400',
  Economic: 'text-green-400',
  'Supply Chain': 'text-yellow-400',
  Unrest: 'text-orange-400',
  Political: 'text-indigo-400'
} as const;

export const getCategoryColor = (category: string): string => {
  return THREAT_CATEGORY_COLORS[category as keyof typeof THREAT_CATEGORY_COLORS] || 'text-gray-400';
};