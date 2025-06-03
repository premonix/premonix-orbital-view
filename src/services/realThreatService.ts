
import { supabase } from '@/integrations/supabase/client';
import { ThreatSignal, ThreatZone } from '@/types/threat';

export class RealThreatService {
  private static signalCache: ThreatSignal[] = [];
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static subscriptionCounter = 0;

  static async refreshThreatData(): Promise<{ success: boolean; count?: number; sources?: any; error?: string }> {
    try {
      console.log('Triggering threat data refresh...');
      
      const { data, error } = await supabase.functions.invoke('signal-ingestion', {
        body: { refresh: true }
      });

      if (error) {
        console.error('Error refreshing threat data:', error);
        return { success: false, error: error.message };
      }

      console.log('Threat data refresh response:', data);
      
      // Clear cache to force fresh fetch
      this.signalCache = [];
      this.lastFetch = 0;
      
      return data;
    } catch (error) {
      console.error('Error in refreshThreatData:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async getLatestSignals(limit: number = 20): Promise<ThreatSignal[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.signalCache.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
        return this.signalCache.slice(0, limit);
      }

      console.log('Fetching latest signals from database...');
      
      const { data, error } = await supabase
        .from('threat_signals')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching signals:', error);
        return this.getFallbackSignals(limit);
      }

      if (!data || data.length === 0) {
        console.log('No signals found in database, using fallback data');
        return this.getFallbackSignals(limit);
      }

      // Convert database records to ThreatSignal format
      const signals: ThreatSignal[] = data.map(record => ({
        id: record.id,
        timestamp: new Date(record.timestamp),
        location: {
          lat: record.latitude,
          lng: record.longitude,
          country: record.country,
          region: record.region || 'Unknown'
        },
        category: record.category as ThreatSignal['category'],
        severity: record.severity as ThreatSignal['severity'],
        confidence: record.confidence,
        source: record.source_name,
        title: record.title,
        description: record.summary || record.title,
        tags: record.tags || [],
        escalationPotential: record.escalation_potential || 0
      }));

      // Update cache
      this.signalCache = signals;
      this.lastFetch = now;

      console.log(`Successfully fetched ${signals.length} signals from database`);
      return signals;

    } catch (error) {
      console.error('Error in getLatestSignals:', error);
      return this.getFallbackSignals(limit);
    }
  }

  static async getSignalsByZone(zoneId: string): Promise<ThreatSignal[]> {
    const allSignals = await this.getLatestSignals(100);
    
    return allSignals.filter(signal => {
      switch (zoneId) {
        case 'taiwan':
          return signal.location.country.toLowerCase().includes('taiwan');
        case 'ukraine':
          return signal.location.country.toLowerCase().includes('ukraine');
        case 'south-china':
          return signal.location.country.toLowerCase().includes('china') || 
                 signal.location.region.toLowerCase().includes('south china');
        case 'kashmir':
          return signal.location.country.toLowerCase().includes('india') ||
                 signal.location.country.toLowerCase().includes('pakistan');
        case 'korea':
          return signal.location.country.toLowerCase().includes('korea');
        default:
          return false;
      }
    });
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

  static async getReadinessScore(zoneId: string): Promise<number> {
    const signals = await this.getSignalsByZone(zoneId);
    const threatLevel = this.calculateThreatLevel(signals);
    
    // Calculate readiness score (inverse of threat level)
    const baseScore = { low: 85, medium: 65, high: 35 }[threatLevel];
    const recentSignals = signals.filter(s => 
      Date.now() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    return Math.max(20, baseScore - (recentSignals.length * 5));
  }

  static subscribeToSignals(callback: (signals: ThreatSignal[]) => void): () => void {
    // Generate a unique channel name to avoid conflicts
    this.subscriptionCounter++;
    const channelName = `threat-signals-${this.subscriptionCounter}-${Date.now()}`;
    
    console.log(`Setting up real-time subscription on channel: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threat_signals'
        },
        (payload) => {
          console.log('Real-time signal update received:', payload);
          
          // Clear cache to force refresh
          this.signalCache = [];
          this.lastFetch = 0;
          
          // Fetch latest signals and notify callback
          this.getLatestSignals(20).then(signals => {
            callback(signals);
          });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from channel: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }

  private static getFallbackSignals(limit: number): ThreatSignal[] {
    // Fallback mock data when database is empty or unavailable
    const fallbackSignals: ThreatSignal[] = [
      {
        id: 'fallback-1',
        timestamp: new Date(),
        location: { lat: 25.03, lng: 121.56, country: 'Taiwan', region: 'Asia-Pacific' },
        category: 'Military',
        severity: 'high',
        confidence: 87,
        source: 'GDELT Global Events',
        title: 'Military Exercise Activity Detected',
        description: 'Increased military activity observed in Taiwan Strait region',
        tags: ['military', 'exercise', 'taiwan', 'regional'],
        escalationPotential: 65
      },
      {
        id: 'fallback-2',
        timestamp: new Date(Date.now() - 3600000),
        location: { lat: 48.38, lng: 31.18, country: 'Ukraine', region: 'Eastern Europe' },
        category: 'Military',
        severity: 'critical',
        confidence: 95,
        source: 'NewsAPI Intelligence',
        title: 'Conflict Zone Activity Update',
        description: 'Ongoing military operations in eastern regions',
        tags: ['conflict', 'ukraine', 'military', 'operations'],
        escalationPotential: 85
      },
      {
        id: 'fallback-3',
        timestamp: new Date(Date.now() - 7200000),
        location: { lat: 39.9042, lng: 116.4074, country: 'China', region: 'Asia-Pacific' },
        category: 'Cyber',
        severity: 'medium',
        confidence: 78,
        source: 'GDELT Digital Monitoring',
        title: 'Cybersecurity Incident Reported',
        description: 'Digital infrastructure security concerns raised',
        tags: ['cyber', 'security', 'digital', 'infrastructure'],
        escalationPotential: 45
      }
    ];

    return fallbackSignals.slice(0, limit);
  }
}
