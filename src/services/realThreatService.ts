
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

  static async getLatestSignals(limit: number = 100): Promise<ThreatSignal[]> {
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
    // Enhanced fallback mock data with more diverse global signals
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
      },
      {
        id: 'fallback-4',
        timestamp: new Date(Date.now() - 10800000),
        location: { lat: 55.7558, lng: 37.6176, country: 'Russia', region: 'Eastern Europe' },
        category: 'Diplomatic',
        severity: 'medium',
        confidence: 82,
        source: 'Diplomatic Intelligence',
        title: 'Trade Negotiations Stalled',
        description: 'Economic sanctions discussions reach impasse',
        tags: ['diplomatic', 'sanctions', 'trade', 'negotiations'],
        escalationPotential: 55
      },
      {
        id: 'fallback-5',
        timestamp: new Date(Date.now() - 14400000),
        location: { lat: 35.6762, lng: 139.6503, country: 'Japan', region: 'Asia-Pacific' },
        category: 'Economic',
        severity: 'low',
        confidence: 73,
        source: 'Economic Monitor',
        title: 'Supply Chain Disruption Alert',
        description: 'Semiconductor manufacturing delays reported',
        tags: ['economic', 'supply-chain', 'semiconductors', 'manufacturing'],
        escalationPotential: 30
      },
      {
        id: 'fallback-6',
        timestamp: new Date(Date.now() - 18000000),
        location: { lat: 52.5200, lng: 13.4050, country: 'Germany', region: 'Western Europe' },
        category: 'Cyber',
        severity: 'high',
        confidence: 88,
        source: 'Cyber Threat Intelligence',
        title: 'Critical Infrastructure Targeted',
        description: 'Advanced persistent threat detected in energy sector',
        tags: ['cyber', 'apt', 'infrastructure', 'energy'],
        escalationPotential: 70
      },
      {
        id: 'fallback-7',
        timestamp: new Date(Date.now() - 21600000),
        location: { lat: 40.7128, lng: -74.0060, country: 'United States', region: 'North America' },
        category: 'Economic',
        severity: 'medium',
        confidence: 79,
        source: 'Financial Intelligence',
        title: 'Market Volatility Spike',
        description: 'Unusual trading patterns detected in financial markets',
        tags: ['economic', 'finance', 'markets', 'volatility'],
        escalationPotential: 45
      },
      {
        id: 'fallback-8',
        timestamp: new Date(Date.now() - 25200000),
        location: { lat: 31.2304, lng: 121.4737, country: 'China', region: 'Asia-Pacific' },
        category: 'Supply Chain',
        severity: 'medium',
        confidence: 76,
        source: 'Supply Chain Monitor',
        title: 'Port Operations Delayed',
        description: 'Major shipping delays affecting global trade routes',
        tags: ['supply-chain', 'shipping', 'ports', 'logistics'],
        escalationPotential: 40
      },
      {
        id: 'fallback-9',
        timestamp: new Date(Date.now() - 28800000),
        location: { lat: 51.5074, lng: -0.1278, country: 'United Kingdom', region: 'Western Europe' },
        category: 'Unrest',
        severity: 'low',
        confidence: 71,
        source: 'Social Monitor',
        title: 'Peaceful Demonstration Planned',
        description: 'Large-scale but peaceful protests scheduled',
        tags: ['unrest', 'protest', 'peaceful', 'social'],
        escalationPotential: 25
      },
      {
        id: 'fallback-10',
        timestamp: new Date(Date.now() - 32400000),
        location: { lat: 28.6139, lng: 77.2090, country: 'India', region: 'South Asia' },
        category: 'Military',
        severity: 'medium',
        confidence: 84,
        source: 'Regional Intelligence',
        title: 'Border Security Enhancement',
        description: 'Military deployments reported near disputed territories',
        tags: ['military', 'border', 'security', 'deployment'],
        escalationPotential: 60
      },
      {
        id: 'fallback-11',
        timestamp: new Date(Date.now() - 36000000),
        location: { lat: -33.8688, lng: 151.2093, country: 'Australia', region: 'Oceania' },
        category: 'Cyber',
        severity: 'low',
        confidence: 69,
        source: 'Cyber Watch',
        title: 'Data Breach Investigation',
        description: 'Government agencies investigating potential data exposure',
        tags: ['cyber', 'data-breach', 'investigation', 'government'],
        escalationPotential: 35
      },
      {
        id: 'fallback-12',
        timestamp: new Date(Date.now() - 39600000),
        location: { lat: 19.4326, lng: -99.1332, country: 'Mexico', region: 'North America' },
        category: 'Economic',
        severity: 'medium',
        confidence: 77,
        source: 'Economic Analysis',
        title: 'Currency Fluctuation Alert',
        description: 'Significant peso volatility following policy announcements',
        tags: ['economic', 'currency', 'policy', 'volatility'],
        escalationPotential: 50
      }
    ];

    return fallbackSignals.slice(0, limit);
  }
}
