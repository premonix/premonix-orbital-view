import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, MapPin } from 'lucide-react';
import { ThreatService } from '@/services/threatService';
import { ThreatSignal } from '@/types/threat';
import PermissionGate from '@/components/auth/PermissionGate';

interface ThreatFeedProps {
  // No props needed for now
}

const categories = ['Military', 'Cyber', 'Economic', 'Political'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Military': return 'text-red-400';
    case 'Cyber': return 'text-purple-400';
    case 'Economic': return 'text-green-400';
    case 'Political': return 'text-blue-400';
    default: return 'text-gray-400';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
};

const ThreatFeed = () => {
  const [signals, setSignals] = useState<ThreatSignal[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Fetch initial signals
    const initialSignals = ThreatService.getLatestSignals(20);
    setSignals(initialSignals);

    // Simulate new signals appearing every 30 seconds
    const signalInterval = setInterval(() => {
      const newSignal = ThreatService.getLatestSignals(1)[0];
      if (newSignal) {
        setSignals(prev => [newSignal, ...prev]);
      }
    }, 30000);

    return () => clearInterval(signalInterval);
  }, []);

  const toggleCategory = (category: string) => {
    setActiveCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredSignals = activeCategories.length === 0
    ? signals
    : signals.filter(signal => activeCategories.includes(signal.category));

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 lg:right-6 z-40 w-72 lg:w-80">
      <PermissionGate permission="view_full_feed" requiredRole="registered">
        <div className="glass-panel rounded-lg border border-starlink-grey/30">
          {/* Header */}
          <div className="p-3 lg:p-4 border-b border-starlink-grey/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-starlink-blue rounded-full animate-pulse" />
                <h3 className="text-sm lg:text-base font-semibold text-starlink-white">Live Threat Feed</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 p-0 hover:bg-starlink-slate-light"
              >
                {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-wrap gap-1 mt-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category)}
                    className={`h-6 px-2 text-xs ${
                      activeCategories.includes(category)
                        ? 'bg-starlink-blue text-starlink-dark'
                        : 'text-starlink-grey-light hover:text-starlink-white'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Feed Content */}
          {!isCollapsed && (
            <div className="max-h-64 lg:max-h-96 overflow-y-auto">
              {filteredSignals.length === 0 ? (
                <div className="p-4 text-center text-starlink-grey-light text-sm">
                  No signals for selected categories
                </div>
              ) : (
                <div className="space-y-2 p-3 lg:p-4">
                  {filteredSignals.slice(0, 10).map(signal => (
                    <div 
                      key={signal.id} 
                      className="p-3 rounded-lg bg-starlink-slate/20 border border-starlink-grey/10 hover:bg-starlink-slate/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(signal.category)}`}
                        >
                          {signal.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${getSeverityColor(signal.severity)}`} />
                          <span className="text-xs text-starlink-grey-light">
                            {formatTimeAgo(signal.timestamp.toString())}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium text-starlink-white mb-1 line-clamp-2">
                        {signal.title}
                      </h4>
                      
                      <div className="flex items-center space-x-1 text-xs text-starlink-grey-light">
                        <MapPin className="w-3 h-3" />
                        <span>{signal.location.country}, {signal.location.region}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PermissionGate>
    </div>
  );
};

export default ThreatFeed;
