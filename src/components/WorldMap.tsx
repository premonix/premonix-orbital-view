import { useState, useEffect } from 'react';
import { RealThreatService } from '@/services/realThreatService';
import { ThreatZone } from '@/types/threat';
import SignalPulse from './SignalPulse';
import MapControls from './MapControls';
import HeatZoneOverlay from './HeatZoneOverlay';
import ThreatPopup from './ThreatPopup';

const WorldMap = () => {
  const [selectedZone, setSelectedZone] = useState<{zone: ThreatZone, x: number, y: number} | null>(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [threatZones, setThreatZones] = useState<ThreatZone[]>([]);
  const [activePulses, setActivePulses] = useState<Array<{id: string, x: number, y: number, signal: any}>>([]);

  // Heat zones for weathermap-style visualization
  const [heatZones] = useState([
    { id: 'taiwan-heat', x: 75, y: 35, radius: 8, intensity: 0.8, type: 'military' },
    { id: 'ukraine-heat', x: 50, y: 25, radius: 12, intensity: 0.9, type: 'military' },
    { id: 'cyber-heat-1', x: 40, y: 45, radius: 6, intensity: 0.6, type: 'cyber' },
    { id: 'supply-heat', x: 65, y: 50, radius: 10, intensity: 0.7, type: 'supply-chain' },
    { id: 'diplomatic-heat', x: 30, y: 35, radius: 7, intensity: 0.5, type: 'diplomatic' },
  ]);

  useEffect(() => {
    // Initialize threat zones with enhanced data
    const zones: ThreatZone[] = [
      { 
        id: 'taiwan', 
        name: 'Taiwan Strait', 
        x: 75, 
        y: 35, 
        level: 'high', 
        activity: 'Naval buildup and military exercises',
        signals: [],
        readinessScore: 65
      },
      { 
        id: 'ukraine', 
        name: 'Eastern Ukraine', 
        x: 50, 
        y: 25, 
        level: 'high', 
        activity: 'Active conflict zone',
        signals: [],
        readinessScore: 35
      },
      { 
        id: 'south-china', 
        name: 'South China Sea', 
        x: 72, 
        y: 45, 
        level: 'medium', 
        activity: 'Territorial disputes and patrols',
        signals: [],
        readinessScore: 75
      },
      { 
        id: 'kashmir', 
        name: 'Kashmir Region', 
        x: 65, 
        y: 35, 
        level: 'medium', 
        activity: 'Border tensions and skirmishes',
        signals: [],
        readinessScore: 70
      },
      { 
        id: 'korea', 
        name: 'Korean Peninsula', 
        x: 78, 
        y: 30, 
        level: 'low', 
        activity: 'Diplomatic engagement',
        signals: [],
        readinessScore: 85
      },
    ];

    // Load threat data and update zones
    const loadThreatData = async () => {
      const updatedZones = await Promise.all(
        zones.map(async (zone) => {
          const signals = await RealThreatService.getSignalsByZone(zone.id);
          const readinessScore = await RealThreatService.getReadinessScore(zone.id);
          
          return {
            ...zone,
            signals,
            level: RealThreatService.calculateThreatLevel(signals),
            readinessScore
          };
        })
      );
      
      setThreatZones(updatedZones);
    };

    loadThreatData();

    // Set up real-time subscription
    const unsubscribe = RealThreatService.subscribeToSignals((newSignals) => {
      console.log('Received real-time signal update, refreshing zones...');
      loadThreatData();
      
      // Add new signal pulse animation
      if (newSignals.length > 0) {
        const latestSignal = newSignals[0];
        const zone = zones[Math.floor(Math.random() * zones.length)];
        const pulseId = Math.random().toString(36).substr(2, 9);
        
        setActivePulses(prev => [...prev, {
          id: pulseId,
          x: zone.x + (Math.random() - 0.5) * 8,
          y: zone.y + (Math.random() - 0.5) * 8,
          signal: latestSignal
        }]);

        setTimeout(() => {
          setActivePulses(prev => prev.filter(p => p.id !== pulseId));
        }, 5000);
      }
    });

    // Simulate new threat signals appearing periodically
    const signalInterval = setInterval(() => {
      RealThreatService.getLatestSignals(1).then(signals => {
        if (signals.length > 0) {
          const signal = signals[0];
          const zone = zones[Math.floor(Math.random() * zones.length)];
          const pulseId = Math.random().toString(36).substr(2, 9);
          
          setActivePulses(prev => [...prev, {
            id: pulseId,
            x: zone.x + (Math.random() - 0.5) * 8,
            y: zone.y + (Math.random() - 0.5) * 8,
            signal: signal
          }]);

          setTimeout(() => {
            setActivePulses(prev => prev.filter(p => p.id !== pulseId));
          }, 5000);
        }
      });
    }, 20000);

    return () => {
      unsubscribe();
      clearInterval(signalInterval);
    };
  }, [selectedYear]);

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

  // Click outside to close popup
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

      {/* Enhanced Status Bar - Layer 8 */}
      <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-auto lg:right-6 z-40 glass-panel rounded-lg px-3 lg:px-4 py-2">
        <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-starlink-grey-light">GDELT + NewsAPI</span>
          </div>
          <div className="text-starlink-grey">|</div>
          <span className="text-starlink-white">{viewMode.toUpperCase()} View</span>
          <div className="text-starlink-grey">|</div>
          <span className="text-starlink-blue">{selectedYear}</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
