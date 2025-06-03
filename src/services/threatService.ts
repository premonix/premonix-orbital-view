
import { ThreatSignal, ThreatZone } from '@/types/threat';

// Mock threat data generator - in real app this would connect to APIs
export class ThreatService {
  private static signals: ThreatSignal[] = [
    {
      id: '1',
      timestamp: new Date(),
      location: { lat: 25.03, lng: 121.56, country: 'Taiwan', region: 'Asia-Pacific' },
      category: 'Military',
      severity: 'high',
      confidence: 87,
      source: 'OSINT Naval Monitor',
      title: 'PLA Naval Buildup Detected',
      description: 'Increased naval activity in Taiwan Strait with 15 vessels deployed',
      tags: ['naval', 'buildup', 'china', 'taiwan'],
      escalationPotential: 78
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      location: { lat: 48.38, lng: 31.18, country: 'Ukraine', region: 'Eastern Europe' },
      category: 'Military',
      severity: 'critical',
      confidence: 95,
      source: 'Defense Intelligence',
      title: 'Artillery Bombardment Intensifies',
      description: 'Heavy shelling reported along eastern front lines',
      tags: ['artillery', 'ukraine', 'russia', 'escalation'],
      escalationPotential: 92
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000),
      location: { lat: 12.5, lng: 104.9, country: 'South China Sea', region: 'Asia-Pacific' },
      category: 'Diplomatic',
      severity: 'medium',
      confidence: 73,
      source: 'Maritime Authority',
      title: 'Territorial Dispute Escalation',
      description: 'Multiple nations assert claims over disputed waters',
      tags: ['territorial', 'maritime', 'dispute'],
      escalationPotential: 45
    }
  ];

  static getSignalsByZone(zoneId: string): ThreatSignal[] {
    return this.signals.filter(signal => {
      switch (zoneId) {
        case 'taiwan':
          return signal.location.country === 'Taiwan';
        case 'ukraine':
          return signal.location.country === 'Ukraine';
        case 'south-china':
          return signal.location.country === 'South China Sea';
        default:
          return [];
      }
    });
  }

  static getLatestSignals(limit: number = 10): ThreatSignal[] {
    return this.signals
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  static calculateThreatLevel(signals: ThreatSignal[]): 'high' | 'medium' | 'low' {
    if (signals.length === 0) return 'low';
    
    const avgSeverity = signals.reduce((sum, signal) => {
      const severityScore = { low: 1, medium: 2, high: 3, critical: 4 }[signal.severity];
      return sum + severityScore;
    }, 0) / signals.length;

    if (avgSeverity >= 3) return 'high';
    if (avgSeverity >= 2) return 'medium';
    return 'low';
  }

  static getReadinessScore(zoneId: string): number {
    const signals = this.getSignalsByZone(zoneId);
    const threatLevel = this.calculateThreatLevel(signals);
    
    // Calculate readiness score (inverse of threat level)
    const baseScore = { low: 85, medium: 65, high: 35 }[threatLevel];
    const recentSignals = signals.filter(s => 
      Date.now() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    return Math.max(20, baseScore - (recentSignals.length * 5));
  }
}
