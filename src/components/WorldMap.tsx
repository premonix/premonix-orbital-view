import React, { useState, useEffect } from 'react';
import { ThreatSignal, ThreatZone } from '@/types/threat';
import { RealThreatService } from '@/services/realThreatService';
import MapControls from './MapControls';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WorldMap = () => {
  const { isAuthenticated, upgradeRole } = useAuth();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [threatSignals, setThreatSignals] = useState<ThreatSignal[]>([]);

  useEffect(() => {
    // Load threat signals
    const loadThreatData = async () => {
      try {
        const { data: rawSignals, error } = await supabase
          .from('threat_signals')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Database error:', error);
          return;
        }

        // Transform database signals to match ThreatSignal interface
        const transformedSignals: ThreatSignal[] = (rawSignals || []).map(signal => ({
          id: signal.id,
          timestamp: new Date(signal.timestamp),
          location: {
            lat: Number(signal.latitude),
            lng: Number(signal.longitude),
            country: signal.country || '',
            region: signal.region || ''
          },
          category: signal.category as any,
          severity: signal.severity as any,
          confidence: signal.confidence || 0,
          source: signal.source_name || '',
          title: signal.title || '',
          description: signal.summary || '',
          tags: signal.tags || [],
          escalationPotential: signal.escalation_potential || 0
        }));

        setThreatSignals(transformedSignals);
      } catch (error) {
        console.error('Failed to load threat signals:', error);
      }
    };

    loadThreatData();
  }, [selectedYear]);

  // Filter signals based on active filters
  const filteredSignals = threatSignals.filter(signal => {
    if (activeFilters.length === 0) return true;
    return activeFilters.some(filter => {
      const categoryMap: { [key: string]: string } = {
        'military': 'Military',
        'cyber': 'Cyber', 
        'diplomatic': 'Diplomatic',
        'economic': 'Economic',
        'supply-chain': 'Supply Chain',
        'unrest': 'Unrest'
      };
      return signal.category === categoryMap[filter];
    });
  });

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
    <div className="relative w-full h-screen bg-starlink-dark overflow-hidden">
      {/* Map Controls */}
      <MapControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* Fallback Map Visualization */}
      <div className="absolute inset-0 bg-gradient-to-br from-starlink-dark via-starlink-slate-dark to-starlink-dark">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              <pattern id="worldGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#worldGrid)" />
          </svg>
        </div>

        {/* World Map Outline */}
        <div className="absolute inset-0 opacity-60">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Simplified world continents */}
            <path
              d="M10 15 Q15 12 20 15 L25 18 Q30 20 35 18 L40 20"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              className="opacity-40"
            />
            <path
              d="M40 20 Q45 18 50 20 L55 22 Q60 24 65 22"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              className="opacity-40"
            />
            <path
              d="M65 22 Q70 20 75 22 L80 24 Q85 26 90 24"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              className="opacity-40"
            />
            <path
              d="M15 30 Q25 28 35 30 L45 32 Q55 34 65 32"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="none"
              className="opacity-30"
            />
          </svg>
        </div>

        {/* Threat Signal Points */}
        <div className="absolute inset-0">
          {filteredSignals.slice(0, 50).map((signal, index) => {
            // Convert lat/lng to approximate screen coordinates
            const x = ((signal.location.lng + 180) / 360) * 100;
            const y = ((90 - signal.location.lat) / 180) * 100;
            
            return (
              <div
                key={signal.id}
                className={`absolute w-3 h-3 rounded-full ${getSeverityColor(signal.severity)} animate-pulse`}
                style={{
                  left: `${Math.min(Math.max(x, 2), 98)}%`,
                  top: `${Math.min(Math.max(y, 10), 90)}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: `0 0 10px ${signal.severity === 'critical' ? '#ef4444' : 
                                          signal.severity === 'high' ? '#f97316' :
                                          signal.severity === 'medium' ? '#eab308' : '#3b82f6'}`
                }}
                title={`${signal.title} - ${signal.location.country} (${signal.severity})`}
              />
            );
          })}
        </div>

        {/* Map Configuration Notice */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-starlink-slate-dark/90 backdrop-blur border border-starlink-slate-light rounded-lg p-6 max-w-md text-center">
            <MapPin className="w-8 h-8 text-starlink-blue mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-starlink-white mb-2">
              Interactive Map Loading
            </h3>
            <p className="text-sm text-starlink-grey-light mb-4">
              Displaying {filteredSignals.length} threat signals in fallback mode.
              The interactive Mapbox map will load once properly configured.
            </p>
            <div className="text-xs text-starlink-grey">
              Real-time threat data is being displayed using simplified visualization
            </div>
          </div>
        </div>

        {/* Enhanced Status Bar */}
        <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-auto lg:right-6 z-40 glass-panel rounded-lg px-3 lg:px-4 py-2">
          <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-starlink-grey-light">Real-time Signals</span>
            </div>
            <div className="text-starlink-grey">|</div>
            <span className="text-starlink-white">{viewMode.toUpperCase()} View</span>
            <div className="text-starlink-grey">|</div>
            <span className="text-starlink-blue">{filteredSignals.length} Threats</span>
            <div className="text-starlink-grey">|</div>
            <span className="text-starlink-blue">{selectedYear}</span>
            {!isAuthenticated && (
              <>
                <div className="text-starlink-grey">|</div>
                <Badge variant="outline" className="text-xs text-orange-300 border-orange-300/30">
                  Guest Mode
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-20 lg:bottom-24 left-4 lg:left-6 z-40 glass-panel rounded-lg p-3">
          <h4 className="text-xs font-medium text-starlink-white mb-2">Threat Levels</h4>
          <div className="space-y-1">
            {[
              { level: 'critical', color: 'bg-red-500', label: 'Critical' },
              { level: 'high', color: 'bg-orange-500', label: 'High' },
              { level: 'medium', color: 'bg-yellow-500', label: 'Medium' },
              { level: 'low', color: 'bg-blue-500', label: 'Low' }
            ].map(({ level, color, label }) => (
              <div key={level} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-starlink-grey-light">{label}</span>
                <span className="text-xs text-starlink-grey">
                  ({filteredSignals.filter(s => s.severity === level).length})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Upgrade Prompt */}
        {!isAuthenticated && (
          <div className="absolute top-32 lg:top-36 left-4 right-4 lg:left-6 lg:right-6 z-30">
            <div className="glass-panel rounded-lg p-3 lg:p-4 bg-gradient-to-r from-starlink-blue/10 to-starlink-purple/10 border border-starlink-blue/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-starlink-blue/20 rounded-full">
                    <Lock className="w-4 h-4 text-starlink-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm lg:text-base font-semibold text-starlink-white">
                      Enhanced Threat Intelligence
                    </h3>
                    <p className="text-xs lg:text-sm text-starlink-grey-light">
                      Register for unlimited signals, real-time alerts, and advanced analytics
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => upgradeRole('individual')}
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Register Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;