
import { useState, useEffect } from 'react';
import { ThreatService } from '@/services/threatService';
import SignalPulse from './SignalPulse';

interface ThreatZone {
  id: string;
  name: string;
  x: number;
  y: number;
  level: 'high' | 'medium' | 'low';
  activity: string;
}

const WorldMap = () => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [threatZones, setThreatZones] = useState<ThreatZone[]>([]);
  const [activePulses, setActivePulses] = useState<Array<{id: string, x: number, y: number, signal: any}>>([]);

  useEffect(() => {
    // Initialize threat zones with real-time data
    const zones: ThreatZone[] = [
      { id: 'taiwan', name: 'Taiwan Strait', x: 75, y: 35, level: 'high', activity: 'Naval buildup' },
      { id: 'ukraine', name: 'Eastern Ukraine', x: 50, y: 25, level: 'high', activity: 'Active conflict' },
      { id: 'south-china', name: 'South China Sea', x: 72, y: 45, level: 'medium', activity: 'Territorial disputes' },
      { id: 'kashmir', name: 'Kashmir', x: 65, y: 35, level: 'medium', activity: 'Border tensions' },
      { id: 'korea', name: 'Korean Peninsula', x: 78, y: 30, level: 'low', activity: 'Diplomatic talks' },
    ];

    // Update threat levels based on real data
    const updatedZones = zones.map(zone => ({
      ...zone,
      level: ThreatService.calculateThreatLevel(ThreatService.getSignalsByZone(zone.id))
    }));

    setThreatZones(updatedZones);

    // Simulate new threat signals appearing
    const signalInterval = setInterval(() => {
      const newSignal = ThreatService.getLatestSignals(1)[0];
      if (newSignal) {
        const zone = zones.find(z => z.id === 'taiwan'); // Example: always show on Taiwan for demo
        if (zone) {
          const pulseId = Math.random().toString(36).substr(2, 9);
          setActivePulses(prev => [...prev, {
            id: pulseId,
            x: zone.x + (Math.random() - 0.5) * 5, // Add some randomness
            y: zone.y + (Math.random() - 0.5) * 5,
            signal: newSignal
          }]);

          // Remove pulse after 5 seconds
          setTimeout(() => {
            setActivePulses(prev => prev.filter(p => p.id !== pulseId));
          }, 5000);
        }
      }
    }, 10000); // New signal every 10 seconds

    return () => clearInterval(signalInterval);
  }, []);

  const getZoneClass = (level: string) => {
    switch (level) {
      case 'high': return 'threat-zone-high';
      case 'medium': return 'threat-zone-medium';
      case 'low': return 'threat-zone-low';
      default: return 'threat-zone-low';
    }
  };

  const getReadinessScore = (zoneId: string) => {
    return ThreatService.getReadinessScore(zoneId);
  };

  return (
    <div className="relative w-full h-screen bg-starlink-dark grid-overlay">
      {/* Enhanced World Map Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-starlink-dark via-starlink-slate/50 to-starlink-dark">
        <div className="absolute inset-0 opacity-40">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* More detailed world map outlines */}
            {/* North America */}
            <path
              d="M120 150 Q140 140 160 145 L180 155 Q200 160 220 150 L240 155 Q260 165 280 160 L300 170 Q320 175 340 165 L360 170 Q380 180 400 175 L420 185 Q440 190 460 180 L480 190"
              stroke="rgba(100, 116, 139, 0.6)"
              strokeWidth="2"
              fill="rgba(100, 116, 139, 0.1)"
            />
            {/* Europe */}
            <path
              d="M480 180 Q500 170 520 175 L540 185 Q560 190 580 185 L600 195"
              stroke="rgba(100, 116, 139, 0.6)"
              strokeWidth="2"
              fill="rgba(100, 116, 139, 0.1)"
            />
            {/* Asia */}
            <path
              d="M600 195 Q620 185 640 190 L660 200 Q680 205 700 195 L720 205 Q740 210 760 200 L780 210 Q800 215 820 205 L840 215"
              stroke="rgba(100, 116, 139, 0.6)"
              strokeWidth="2"
              fill="rgba(100, 116, 139, 0.1)"
            />
            {/* Africa */}
            <path
              d="M480 220 Q500 230 520 235 L540 245 Q560 250 580 245 L600 255 Q620 260 640 255 L660 265"
              stroke="rgba(100, 116, 139, 0.6)"
              strokeWidth="2"
              fill="rgba(100, 116, 139, 0.1)"
            />
            {/* Australia */}
            <path
              d="M720 340 Q740 350 760 345 L780 355 Q800 360 820 355"
              stroke="rgba(100, 116, 139, 0.6)"
              strokeWidth="2"
              fill="rgba(100, 116, 139, 0.1)"
            />
          </svg>
        </div>
      </div>

      {/* Signal Pulses */}
      {activePulses.map(pulse => (
        <SignalPulse
          key={pulse.id}
          signal={pulse.signal}
          x={pulse.x}
          y={pulse.y}
        />
      ))}

      {/* Threat Zones */}
      {threatZones.map((zone) => (
        <div
          key={zone.id}
          className={`absolute w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-300 ${getZoneClass(zone.level)} ${
            zone.level === 'high' ? 'animate-pulse-glow' : ''
          }`}
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setHoveredZone(zone.id)}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <div className="w-full h-full rounded-full bg-current opacity-30" />
          
          {/* Enhanced Tooltip */}
          {hoveredZone === zone.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-panel rounded-lg p-4 min-w-[250px] z-10">
              <h4 className="font-semibold text-starlink-white mb-2">{zone.name}</h4>
              <p className="text-sm text-starlink-grey-light mb-2">{zone.activity}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-starlink-grey">Threat Level:</span>
                  <div className={`w-2 h-2 rounded-full ${
                    zone.level === 'high' ? 'bg-starlink-red' :
                    zone.level === 'medium' ? 'bg-starlink-orange' : 'bg-starlink-blue'
                  }`} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-starlink-grey">Readiness Score:</span>
                  <span className="text-xs font-medium text-starlink-blue">
                    {getReadinessScore(zone.id)}/100
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-starlink-grey">Active Signals:</span>
                  <span className="text-xs font-medium text-starlink-white">
                    {ThreatService.getSignalsByZone(zone.id).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Timeline Slider */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel rounded-full px-6 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-starlink-grey-light">Current</span>
          <input
            type="range"
            min={2024}
            max={2027}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-48 h-1 bg-starlink-slate-light rounded-full appearance-none cursor-pointer custom-slider"
          />
          <span className="text-sm text-starlink-grey-light">2027 Projections</span>
        </div>
        <div className="text-center mt-1">
          <span className="text-starlink-blue font-medium">{selectedYear}</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
