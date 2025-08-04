
import { useState, useEffect } from 'react';
import { RealThreatService } from '@/services/realThreatService';
import { useRealTime } from '@/contexts/RealTimeContext';
import { ThreatSignal } from '@/types/threat';
import { getSeverityColorTailwind, getSeverityColorText } from '@/lib/threatColors';

interface ThreatRegion {
  id: string;
  name: string;
  country: string;
  riskLevel: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  latestThreat?: ThreatSignal;
  signalCount: number;
  lastUpdate: Date;
}

const ThreatIndicator = () => {
  const [currentRegion, setCurrentRegion] = useState<ThreatRegion | null>(null);
  const [topRegions, setTopRegions] = useState<ThreatRegion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { realtimeThreats, isConnected } = useRealTime();

  // Define key regions to monitor
  const monitoredRegions = [
    { id: 'taiwan', name: 'Taiwan Strait', country: 'Taiwan' },
    { id: 'ukraine', name: 'Ukraine Region', country: 'Ukraine' },
    { id: 'south-china', name: 'South China Sea', country: 'China' },
    { id: 'kashmir', name: 'Kashmir Region', country: 'India' },
    { id: 'korea', name: 'Korean Peninsula', country: 'Korea' }
  ];

  // Calculate threat score from signals
  const calculateThreatScore = (signals: ThreatSignal[]): number => {
    if (signals.length === 0) return 15;
    
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const recentSignals = signals.filter(s => 
      Date.now() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    const avgSeverity = recentSignals.reduce((sum, signal) => {
      return sum + severityWeights[signal.severity] * (signal.confidence / 100);
    }, 0) / Math.max(recentSignals.length, 1);
    
    return Math.round(Math.min(avgSeverity * 25, 100));
  };

  // Determine threat level from score
  const getThreatLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  // Load regional threat data
  const loadRegionalThreats = async () => {
    try {
      setIsLoading(true);
      const regionPromises = monitoredRegions.map(async (region) => {
        const signals = await RealThreatService.getSignalsByZone(region.id);
        const riskLevel = calculateThreatScore(signals);
        const threatLevel = getThreatLevel(riskLevel);
        const latestThreat = signals.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        )[0];

        return {
          ...region,
          riskLevel,
          threatLevel,
          latestThreat,
          signalCount: signals.length,
          lastUpdate: new Date()
        };
      });

      const regions = await Promise.all(regionPromises);
      const sortedRegions = regions.sort((a, b) => b.riskLevel - a.riskLevel);
      
      setTopRegions(sortedRegions);
      setCurrentRegion(sortedRegions[0]);
    } catch (error) {
      console.error('Error loading regional threats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and real-time updates
  useEffect(() => {
    loadRegionalThreats();
    
    const unsubscribe = RealThreatService.subscribeToSignals(() => {
      loadRegionalThreats();
    });

    return unsubscribe;
  }, []);

  // Rotate through top regions
  useEffect(() => {
    if (topRegions.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % Math.min(topRegions.length, 3);
        setCurrentRegion(topRegions[nextIndex]);
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [topRegions]);

  // Update when real-time threats change
  useEffect(() => {
    if (realtimeThreats.length > 0) {
      loadRegionalThreats();
    }
  }, [realtimeThreats]);

  if (isLoading || !currentRegion) {
    return (
      <div className="fixed top-20 right-6 z-40">
        <div className="glass-panel rounded-lg p-4 min-w-[280px] bg-muted/20 border-muted/50">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 border-red-500/50';
      case 'high': return 'bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50';
      default: return 'bg-blue-500/20 border-blue-500/50';
    }
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="fixed top-20 right-6 z-40">
      <div className={`glass-panel rounded-lg p-4 min-w-[280px] border ${getRiskBgColor(currentRegion.threatLevel)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">LIVE THREAT LEVEL</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'animate-pulse bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1}/{Math.min(topRegions.length, 3)}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{currentRegion.name}</span>
            <span className={`text-2xl font-bold ${getSeverityColorText(currentRegion.threatLevel)}`}>
              {currentRegion.riskLevel}/100
            </span>
          </div>
          
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getSeverityColorTailwind(currentRegion.threatLevel)}`}
              style={{ width: `${Math.min(currentRegion.riskLevel, 100)}%` }}
            />
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {currentRegion.latestThreat ? 
                currentRegion.latestThreat.title.substring(0, 60) + 
                (currentRegion.latestThreat.title.length > 60 ? '...' : '')
                : `${currentRegion.signalCount} active signals monitored`
              }
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentRegion.signalCount} signals</span>
              <span>Updated {formatLastUpdate(currentRegion.lastUpdate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatIndicator;
