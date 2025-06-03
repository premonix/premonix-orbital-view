import { useState, useEffect } from 'react';
import { RealThreatService } from '@/services/realThreatService';
import { ThreatZone, ThreatSignal } from '@/types/threat';
import SignalPulse from './SignalPulse';
import MapControls from './MapControls';
import HeatZoneOverlay from './HeatZoneOverlay';
import ThreatPopup from './ThreatPopup';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const WorldMap = () => {
  const [selectedZone, setSelectedZone] = useState<{zone: ThreatZone, x: number, y: number} | null>(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [threatZones, setThreatZones] = useState<ThreatZone[]>([]);
  const [activePulses, setActivePulses] = useState<Array<{id: string, x: number, y: number, signal: ThreatSignal}>>([]);
  const [allSignals, setAllSignals] = useState<ThreatSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Heat zones for weathermap-style visualization
  const [heatZones] = useState([
    { id: 'taiwan-heat', x: 75, y: 35, radius: 8, intensity: 0.8, type: 'military' },
    { id: 'ukraine-heat', x: 50, y: 25, radius: 12, intensity: 0.9, type: 'military' },
    { id: 'cyber-heat-1', x: 40, y: 45, radius: 6, intensity: 0.6, type: 'cyber' },
    { id: 'supply-heat', x: 65, y: 50, radius: 10, intensity: 0.7, type: 'supply-chain' },
    { id: 'diplomatic-heat', x: 30, y: 35, radius: 7, intensity: 0.5, type: 'diplomatic' },
  ]);

  // Country to coordinate mapping for visualization
  const countryCoordinates: Record<string, {x: number, y: number}> = {
    'Taiwan': { x: 75, y: 35 },
    'Ukraine': { x: 50, y: 25 },
    'China': { x: 72, y: 30 },
    'Russia': { x: 60, y: 20 },
    'US': { x: 20, y: 35 },
    'Iran': { x: 55, y: 32 },
    'Israel': { x: 52, y: 30 },
    'Syria': { x: 53, y: 28 },
    'Afghanistan': { x: 62, y: 30 },
    'Iraq': { x: 54, y: 30 },
    'Yemen': { x: 54, y: 40 },
    'Turkey': { x: 51, y: 26 },
    'Libya': { x: 48, y: 32 },
    'Sudan': { x: 50, y: 40 },
    'Nigeria': { x: 45, y: 42 },
    'Brazil': { x: 25, y: 50 },
    'Venezuela': { x: 22, y: 42 },
    'Mexico': { x: 15, y: 38 },
    'South Korea': { x: 78, y: 30 },
    'North Korea': { x: 77, y: 28 },
    'Japan': { x: 80, y: 30 },
    'India': { x: 65, y: 35 },
    'Pakistan': { x: 62, y: 32 }
  };

  const loadThreatData = async () => {
    setIsLoading(true);
    try {
      const signals = await RealThreatService.fetchThreatSignals(100);
      setAllSignals(signals);

      // Group signals by country to create threat zones
      const zoneMap = new Map<string, ThreatSignal[]>();
      
      signals.forEach(signal => {
        const country = signal.location.country;
        if (!zoneMap.has(country)) {
          zoneMap.set(country, []);
        }
        zoneMap.get(country)!.push(signal);
      });

      // Create threat zones from grouped signals
      const zones: ThreatZone[] = Array.from(zoneMap.entries()).map(([country, countrySignals]) => {
        const coords = countryCoordinates[country] || { x: 50, y: 50 };
        const threatLevel = RealThreatService.calculateThreatLevel(countrySignals);
        const readinessScore = RealThreatService.getReadinessScore(countrySignals);
        
        // Get most recent activity
        const recentSignal = countrySignals[0];
        const activity = recentSignal ? recentSignal.title.substring(0, 60) + '...' : 'No recent activity';

        return {
          id: country.toLowerCase().replace(/\s+/g, '-'),
          name: country,
          x: coords.x,
          y: coords.y,
          level: threatLevel,
          activity,
          signals: countrySignals.slice(0, 10), // Limit to recent signals
          readinessScore
        };
      });

      setThreatZones(zones);
      
      toast({
        title: "Data Updated",
        description: `Loaded ${signals.length} threat signals from ${zones.length} regions`,
      });
    } catch (error) {
      console.error('Error loading threat data:', error);
      toast({
        title: "Error",
        description: "Failed to load threat data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDataRefresh = async () => {
    setIsLoading(true);
    try {
      await RealThreatService.triggerDataIngestion();
      
      toast({
        title: "Data Ingestion Started",
        description: "Fetching latest threat intelligence...",
      });

      // Wait a moment then reload data
      setTimeout(() => {
        loadThreatData();
      }, 3000);
    } catch (error) {
      console.error('Error triggering data refresh:', error);
      toast({
        title: "Error",
        description: "Failed to trigger data refresh",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data load
    loadThreatData();

    // Set up real-time subscription
    const unsubscribe = RealThreatService.subscribeToRealTimeUpdates((newSignal) => {
      console.log('New threat signal received:', newSignal);
      
      // Add pulse for new signal
      const country = newSignal.location.country;
      const coords = countryCoordinates[country] || { x: 50, y: 50 };
      const pulseId = Math.random().toString(36).substr(2, 9);
      
      setActivePulses(prev => [...prev, {
        id: pulseId,
        x: coords.x + (Math.random() - 0.5) * 8,
        y: coords.y + (Math.random() - 0.5) * 8,
        signal: newSignal
      }]);

      // Remove pulse after 5 seconds
      setTimeout(() => {
        setActivePulses(prev => prev.filter(p => p.id !== pulseId));
      }, 5000);

      // Reload data to update zones
      loadThreatData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getZoneClass = (level: string) => {
    const baseClass = 'transition-all duration-300 hover:scale-110 cursor-pointer relative';
    switch (level) {
      case 'high': 
        return `${baseClass} border-red-400 bg-red-500/30 shadow-lg shadow-red-500/50 animate-pulse`;
      case 'medium': 
        return `${baseClass} border-orange-400 bg-orange-500/30 shadow-lg shadow-orange-500/50`;
      case 'low': 
        return `${baseClass} border-blue-400 bg-blue-500/30 shadow-lg shadow-blue-500/50`;
      default: 
        return baseClass;
    }
  };

  const handleZoneClick = (zone: ThreatZone, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedZone({ zone, x: zone.x, y: zone.y });
  };

  const closePopup = () => {
    setSelectedZone(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (selectedZone) {
        setSelectedZone(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedZone]);

  return (
    <div className="relative w-full h-screen bg-starlink-dark overflow-hidden">
      {/* Map Controls - Layer 1 (highest z-index) */}
      <div className="absolute top-4 lg:top-6 left-4 lg:left-6 right-4 lg:right-auto z-50 max-w-xs lg:max-w-none">
        <MapControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Data Refresh Button */}
      <div className="absolute top-4 lg:top-6 right-4 lg:right-6 z-50">
        <Button
          onClick={triggerDataRefresh}
          disabled={isLoading}
          className="bg-starlink-blue hover:bg-starlink-blue/80 text-starlink-dark"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Enhanced World Map Background - Layer 2 (lowest z-index) */}
      <div className={`absolute inset-0 z-0 transition-transform duration-500 ${
        viewMode === 'globe' ? 'perspective-1000 transform-style-3d rotate-x-12' : ''
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-starlink-dark via-starlink-slate/30 to-starlink-dark">
          {/* Grid overlay for weathermap effect */}
          <div className="absolute inset-0 opacity-20 z-0">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Heat Zone Overlay - Layer 3 */}
          <div className="absolute inset-0 z-10">
            <HeatZoneOverlay 
              zones={heatZones} 
              activeFilters={activeFilters}
              viewMode={viewMode}
            />
          </div>

          {/* World Map Outlines - Layer 4 */}
          <div className="absolute inset-0 z-20 opacity-60">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Continents with enhanced styling */}
              <path
                d="M12 15 Q14 14 16 14.5 L18 15.5 Q20 16 22 15 L24 15.5 Q26 16.5 28 16 L30 17 Q32 17.5 34 16.5 L36 17 Q38 18 40 17.5"
                stroke="rgba(100, 116, 139, 0.8)"
                strokeWidth="1.5"
                fill="rgba(100, 116, 139, 0.2)"
                className="transition-opacity duration-300 hover:opacity-80"
              />
              <path
                d="M40 17.5 Q42 16.5 44 17 L46 17.5 Q48 18 50 17.5 L52 18.5"
                stroke="rgba(100, 116, 139, 0.8)"
                strokeWidth="1.5"
                fill="rgba(100, 116, 139, 0.2)"
              />
              <path
                d="M52 18.5 Q54 17.5 56 18 L58 18.5 Q60 19 62 18.5 L64 19.5 Q66 20 68 19.5 L70 20.5 Q72 21 74 20.5 L76 21.5 Q78 22 80 21.5"
                stroke="rgba(100, 116, 139, 0.8)"
                strokeWidth="1.5"
                fill="rgba(100, 116, 139, 0.2)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Signal Pulses - Layer 5 */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {activePulses.map(pulse => (
          <SignalPulse
            key={pulse.id}
            signal={pulse.signal}
            x={pulse.x}
            y={pulse.y}
          />
        ))}
      </div>

      {/* Threat Zones - Layer 6 */}
      <div className="absolute inset-0 z-40">
        {threatZones.map((zone) => (
          <div
            key={zone.id}
            className={`absolute w-8 h-8 lg:w-12 lg:h-12 rounded-full border-2 ${getZoneClass(zone.level)}`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => handleZoneClick(zone, e)}
          >
            <div className="w-full h-full rounded-full bg-current opacity-20" />
            
            {/* Zone indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
                zone.level === 'high' ? 'bg-red-400' :
                zone.level === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
              } animate-pulse`} />
            </div>
          </div>
        ))}
      </div>

      {/* Threat Popup - Layer 7 (highest interactive z-index) */}
      {selectedZone && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <ThreatPopup
              zone={selectedZone.zone}
              x={selectedZone.x}
              y={selectedZone.y}
              onClose={closePopup}
            />
          </div>
        </div>
      )}

      {/* Status Bar - Layer 8 */}
      <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-auto lg:right-6 z-40 glass-panel rounded-lg px-3 lg:px-4 py-2">
        <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-starlink-grey-light">Live Data</span>
          </div>
          <div className="text-starlink-grey">|</div>
          <span className="text-starlink-white">{allSignals.length} Signals</span>
          <div className="text-starlink-grey">|</div>
          <span className="text-starlink-blue">{threatZones.length} Zones</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
