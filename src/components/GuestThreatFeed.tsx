import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, MapPin, Lock, Zap } from 'lucide-react';
import { RealThreatService } from '@/services/realThreatService';
import { ThreatSignal } from '@/types/threat';
import { useAuth } from '@/contexts/AuthContext';
import { getSeverityColorTailwind, getCategoryColor } from '@/lib/threatColors';

interface GuestThreatFeedProps {
  // No props needed for now
}

const categories = ['Military', 'Cyber', 'Economic', 'Political'];

// Use centralized color utilities for consistency
const getSeverityColor = getSeverityColorTailwind;

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

const GuestThreatFeed = () => {
  const [signals, setSignals] = useState<ThreatSignal[]>([]);
  const [dailyViewCount, setDailyViewCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { upgradeRole } = useAuth();
  
  const DAILY_LIMIT = 3;
  const hasReachedLimit = dailyViewCount >= DAILY_LIMIT;

  useEffect(() => {
    // Load guest view count from localStorage
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('guestThreatFeedData');
    
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.date === today) {
        setDailyViewCount(data.count);
      } else {
        // Reset for new day
        localStorage.setItem('guestThreatFeedData', JSON.stringify({ date: today, count: 0 }));
        setDailyViewCount(0);
      }
    } else {
      localStorage.setItem('guestThreatFeedData', JSON.stringify({ date: today, count: 0 }));
    }

    // Fetch initial signals (show limited set for guests)
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      const latestSignals = await RealThreatService.getLatestSignals(DAILY_LIMIT);
      setSignals(latestSignals);
    } catch (error) {
      console.error('Error loading signals:', error);
    }
  };

  const handleSignalView = () => {
    if (hasReachedLimit) return;
    
    const newCount = dailyViewCount + 1;
    setDailyViewCount(newCount);
    
    // Update localStorage
    const today = new Date().toDateString();
    localStorage.setItem('guestThreatFeedData', JSON.stringify({ date: today, count: newCount }));
  };

  const handleUpgrade = () => {
    upgradeRole('individual');
  };

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 lg:right-6 z-40 w-72 lg:w-80">
      <div className="glass-panel rounded-lg border border-starlink-grey/30">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-starlink-grey/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-starlink-blue rounded-full animate-pulse" />
              <h3 className="text-sm lg:text-base font-semibold text-starlink-white">Live Threat Feed</h3>
              <Badge variant="outline" className="text-xs text-starlink-grey-light border-starlink-grey/30">
                Guest
              </Badge>
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
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-starlink-grey-light">
                  Daily view limit: {dailyViewCount}/{DAILY_LIMIT}
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    dailyViewCount >= 1 ? 'bg-starlink-blue' : 'bg-starlink-grey/30'
                  }`} />
                  <div className={`w-2 h-2 rounded-full ${
                    dailyViewCount >= 2 ? 'bg-starlink-blue' : 'bg-starlink-grey/30'
                  }`} />
                  <div className={`w-2 h-2 rounded-full ${
                    dailyViewCount >= 3 ? 'bg-starlink-blue' : 'bg-starlink-grey/30'
                  }`} />
                </div>
              </div>
              
              {hasReachedLimit && (
                <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-300">
                  Daily limit reached. Register for unlimited access!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feed Content */}
        {!isCollapsed && (
          <div className="max-h-64 lg:max-h-96 overflow-y-auto">
            {signals.length === 0 ? (
              <div className="p-4 text-center text-starlink-grey-light text-sm">
                Loading threat signals...
              </div>
            ) : (
              <div className="space-y-2 p-3 lg:p-4">
                {signals.map((signal, index) => (
                  <div 
                    key={signal.id} 
                    className={`p-3 rounded-lg border transition-all ${
                      index < dailyViewCount 
                        ? 'bg-starlink-slate/20 border-starlink-grey/10 hover:bg-starlink-slate/30' 
                        : 'bg-starlink-slate/10 border-starlink-grey/5 opacity-60 relative'
                    }`}
                    onClick={() => index >= dailyViewCount && !hasReachedLimit && handleSignalView()}
                  >
                    {index >= dailyViewCount && (
                      <div className="absolute inset-0 bg-starlink-dark/80 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-4 h-4 mx-auto mb-1 text-starlink-grey-light" />
                          <div className="text-xs text-starlink-grey-light">
                            {hasReachedLimit ? 'Limit reached' : 'Click to view'}
                          </div>
                        </div>
                      </div>
                    )}
                    
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
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-starlink-grey-light">
                        <MapPin className="w-3 h-3" />
                        <span>{signal.location.country}, {signal.location.region}</span>
                      </div>
                      <div className="text-xs text-starlink-grey-light">
                        {signal.source}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Upgrade Prompt */}
                <div className="mt-4 p-3 bg-gradient-to-r from-starlink-blue/10 to-starlink-purple/10 border border-starlink-blue/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-starlink-blue mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-starlink-white mb-1">
                        Unlock Full Access
                      </h4>
                      <p className="text-xs text-starlink-grey-light mb-2">
                        Register for unlimited threat signals, real-time alerts, and dashboard access.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={handleUpgrade}
                        className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark text-xs h-7"
                      >
                        Register Free
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestThreatFeed;