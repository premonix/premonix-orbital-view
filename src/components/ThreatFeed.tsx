
import { useState, useEffect } from 'react';
import { ThreatSignal } from '@/types/threat';
import { ThreatService } from '@/services/threatService';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ThreatFeed = () => {
  const [signals, setSignals] = useState<ThreatSignal[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const updateSignals = () => {
      const latestSignals = ThreatService.getLatestSignals(20);
      setSignals(latestSignals);
    };

    updateSignals();
    const interval = setInterval(updateSignals, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 w-80 z-40">
      <div className="glass-panel rounded-lg p-4 max-h-[70vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-starlink-white">Live Threat Feed</h3>
          <div className="w-2 h-2 bg-starlink-red rounded-full animate-pulse" />
        </div>

        {/* Category Filter */}
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
  );
};

export default ThreatFeed;
