
export interface ThreatSignal {
  id: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
    country: string;
    region: string;
  };
  category: 'Military' | 'Cyber' | 'Diplomatic' | 'Economic' | 'Supply Chain' | 'Unrest';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  source: string;
  title: string;
  description: string;
  tags: string[];
  escalationPotential: number; // 0-100
}

export interface ThreatZone {
  id: string;
  name: string;
  x: number;
  y: number;
  level: 'high' | 'medium' | 'low';
  activity: string;
  signals: ThreatSignal[];
  readinessScore: number;
}

export interface UserRole {
  type: 'guest' | 'registered' | 'business' | 'enterprise';
  permissions: string[];
}

export interface AlertConfig {
  id: string;
  userId: string;
  name: string;
  conditions: {
    location?: string;
    category?: string;
    severity?: string;
    proximityKm?: number;
  };
  enabled: boolean;
  channels: ('email' | 'sms' | 'push')[];
}
