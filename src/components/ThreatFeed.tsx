
import { useState, useEffect } from 'react';
import { ThreatSignal } from '@/types/threat';
import { ThreatService } from '@/services/threatService';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import PermissionGate from '@/components/auth/PermissionGate';

const ThreatFeed = () => {
  const [signals, setSignals] = useState<ThreatSignal[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { hasPermission, user } = useAuth();

  useEffect(() => {
    const updateSignals = () => {
      // Limit signals based on user role
      const maxSignals = hasPermission('view_full_feed') ? 20 : 3;
      const latestSignals = ThreatService.getLatestSignals(maxSignals);
      setSignals(latestSignals);
    };

    updateSignals();
    const interval = setInterval(updateSignals, 30000);
    return () => clearInterval(interval);
  }, [hasPermission]);

  const filteredSignals = signals.filter(signal => 
    filter === 'all' || signal.category === filter
  );

  const categories = ['all', 'Military', 'Cyber', 'Diplomatic', 'Economic', 'Supply Chain', 'Unrest'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <PermissionGate 
      permission="view_basic_feed"
      fallback={
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 w-80 z-40">
          <div className="glass-panel rounded-lg p-4">
            <p className="text-starlink-grey-light text-center">
              Threat feed available to registered users
            </p>
          </div>
        </div>
      }
    >
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 w-80 z-40">
        <div className="glass-panel rounded-lg p-4 max-h-[70vh]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-starlink-white">Live Threat Feed</h3>
            <div className="flex items-center space-x-2">
              {!hasPermission('view_full_feed') && (
                <Badge variant="outline" className="text-xs">
                  Limited
                </Badge>
              )}
              <div className="w-2 h-2 bg-starlink-red rounded-full animate-pulse" />
            </div>
          </div>

          {/* Category Filter - only for full access users */}
          {hasPermission('view_full_feed') && (
            <div className="flex flex-wrap gap-1 mb-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    filter === category 
                      ? 'bg-starlink-blue text-starlink-dark' 
                      : 'bg-starlink-slate text-starlink-grey-light hover:bg-starlink-slate-light'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Usage indicator for guest users */}
          {!hasPermission('view_full_feed') && (
            <div className="mb-4 p-2 bg-starlink-slate/30 rounded text-xs text-starlink-grey-light">
              Showing {signals.length}/3 daily signals. 
              <span className="text-starlink-blue cursor-pointer hover:underline ml-1">
                Upgrade for unlimited access
              </span>
            </div>
          )}

          {/* Signals List */}
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredSignals.map(signal => (
                <div key={signal.id} className="p-3 rounded bg-starlink-slate/50 border border-starlink-grey/20">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {signal.category}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(signal.severity)}`} />
                  </div>
                  
                  <h4 className="font-medium text-sm text-starlink-white mb-1">
                    {signal.title}
                  </h4>
                  
                  <p className="text-xs text-starlink-grey-light mb-2">
                    {signal.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-starlink-grey">
                    <span>{signal.location.country}</span>
                    <span>Conf: {signal.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </PermissionGate>
  );
};

export default ThreatFeed;
