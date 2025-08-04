import { useState, useEffect } from 'react';
import { RealThreatService } from '@/services/realThreatService';
import { ThreatZone, ThreatSignal } from '@/types/threat';
import MapControls from './MapControls';
import MapContainer from './maps/MapContainer';
import ThreatHeatLayer from './maps/ThreatHeatLayer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';

const WorldMap = () => {
  const { isAuthenticated, upgradeRole } = useAuth();
  const [selectedZone, setSelectedZone] = useState<ThreatZone | null>(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [threatSignals, setThreatSignals] = useState<ThreatSignal[]>([]);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

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

    // Set up real-time subscription
    const unsubscribe = RealThreatService.subscribeToSignals((newSignals) => {
      console.log('Received real-time signal update:', newSignals.length, 'new signals');
      setThreatSignals(prev => [...newSignals, ...prev].slice(0, 200)); // Keep latest 200 signals
    });

    return () => {
      unsubscribe();
    };
  }, [selectedYear]);

  const handleSignalClick = (signal: ThreatSignal, event: mapboxgl.MapMouseEvent) => {
    // Create popup for signal details
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setLngLat([signal.location.lng, signal.location.lat])
      .setHTML(`
        <div class="p-3 bg-starlink-slate-dark text-starlink-white rounded">
          <h3 class="font-semibold text-sm mb-1">${signal.title}</h3>
          <p class="text-xs text-starlink-grey-light mb-2">${signal.description}</p>
          <div class="flex items-center justify-between text-xs">
            <span class="px-2 py-1 bg-${signal.severity === 'critical' ? 'red' : signal.severity === 'high' ? 'orange' : signal.severity === 'medium' ? 'yellow' : 'blue'}-500/20 text-${signal.severity === 'critical' ? 'red' : signal.severity === 'high' ? 'orange' : signal.severity === 'medium' ? 'yellow' : 'blue'}-300 rounded">
              ${signal.severity.toUpperCase()}
            </span>
            <span class="text-starlink-grey">${signal.confidence}% confidence</span>
          </div>
          <div class="mt-2 text-xs text-starlink-grey-light">
            ${signal.location.country} • ${signal.source}
          </div>
        </div>
      `)
      .addTo(mapInstance!);
  };

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

      {/* Main Map Container */}
      <MapContainer
        threatSignals={filteredSignals}
        onSignalClick={handleSignalClick}
        style={viewMode === 'globe' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/dark-v11'}
        zoom={viewMode === 'globe' ? 1.5 : 2}
        center={[0, 20]}
        pitch={viewMode === 'globe' ? 45 : 0}
        className="w-full h-full"
        showControls={true}
      />

      {/* Heatmap Layer */}
      <ThreatHeatLayer
        map={mapInstance}
        threatSignals={filteredSignals}
        visible={showHeatmap}
      />

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

      {/* Heatmap Toggle */}
      <div className="absolute top-20 lg:top-24 right-4 lg:right-6 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="glass-panel text-starlink-white border-starlink-slate-light hover:bg-starlink-blue/20"
        >
          {showHeatmap ? 'Hide' : 'Show'} Heatmap
        </Button>
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
  );
};

export default WorldMap;
