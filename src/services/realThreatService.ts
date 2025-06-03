
import { supabase } from "@/integrations/supabase/client";
import { ThreatSignal } from '@/types/threat';

export class RealThreatService {
  
  static async fetchThreatSignals(limit: number = 50): Promise<ThreatSignal[]> {
    try {
      const { data, error } = await supabase
        .from('threat_signals')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching threat signals:', error);
        return [];
      }

      return data.map(signal => ({
        id: signal.id,
        timestamp: new Date(signal.timestamp),
        location: {
          lat: parseFloat(signal.latitude),
          lng: parseFloat(signal.longitude),
          country: signal.country,
          region: signal.region || 'Global'
        },
        category: signal.category as 'Military' | 'Cyber' | 'Diplomatic' | 'Economic' | 'Supply Chain' | 'Unrest',
        severity: signal.severity as 'low' | 'medium' | 'high' | 'critical',
        confidence: signal.confidence,
        source: signal.source_name,
        title: signal.title,
        description: signal.summary || '',
        tags: signal.tags || [],
        escalationPotential: signal.escalation_potential || 0
      }));
    } catch (error) {
      console.error('Error in fetchThreatSignals:', error);
      return [];
    }
  }

  static async triggerDataIngestion(): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('signal-ingestion');
      
      if (error) {
        console.error('Error triggering data ingestion:', error);
        throw error;
      }
      
      console.log('Data ingestion triggered successfully:', data);
    } catch (error) {
      console.error('Error triggering data ingestion:', error);
      throw error;
    }
  }

  static subscribeToRealTimeUpdates(callback: (signal: ThreatSignal) => void) {
    const channel = supabase
      .channel('threat-signals-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'threat_signals'
        },
        (payload) => {
          const signal = payload.new;
          callback({
            id: signal.id,
            timestamp: new Date(signal.timestamp),
            location: {
              lat: parseFloat(signal.latitude),
              lng: parseFloat(signal.longitude),
              country: signal.country,
              region: signal.region || 'Global'
            },
            category: signal.category,
            severity: signal.severity,
            confidence: signal.confidence,
            source: signal.source_name,
            title: signal.title,
            description: signal.summary || '',
            tags: signal.tags || [],
            escalationPotential: signal.escalation_potential || 0
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  static async getSignalsByRegion(country: string): Promise<ThreatSignal[]> {
    try {
      const { data, error } = await supabase
        .from('threat_signals')
        .select('*')
        .eq('country', country)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching signals by region:', error);
        return [];
      }

      return data.map(signal => ({
        id: signal.id,
        timestamp: new Date(signal.timestamp),
        location: {
          lat: parseFloat(signal.latitude),
          lng: parseFloat(signal.longitude),
          country: signal.country,
          region: signal.region || 'Global'
        },
        category: signal.category,
        severity: signal.severity,
        confidence: signal.confidence,
        source: signal.source_name,
        title: signal.title,
        description: signal.summary || '',
        tags: signal.tags || [],
        escalationPotential: signal.escalation_potential || 0
      }));
    } catch (error) {
      console.error('Error in getSignalsByRegion:', error);
      return [];
    }
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

  static getReadinessScore(signals: ThreatSignal[]): number {
    if (signals.length === 0) return 85;
    
    const threatLevel = this.calculateThreatLevel(signals);
    const baseScore = { low: 85, medium: 65, high: 35 }[threatLevel];
    
    const recentSignals = signals.filter(s => 
      Date.now() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    return Math.max(20, baseScore - (recentSignals.length * 3));
  }
}
