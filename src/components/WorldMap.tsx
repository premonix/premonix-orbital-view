
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    console.log('WorldMap component mounted');
    console.log('Current route hash:', window.location.hash);
  }, []);

  const threatZones: ThreatZone[] = [
    { id: 'taiwan', name: 'Taiwan Strait', x: 75, y: 35, level: 'high', activity: 'Naval buildup' },
    { id: 'ukraine', name: 'Eastern Ukraine', x: 50, y: 25, level: 'high', activity: 'Active conflict' },
    { id: 'south-china', name: 'South China Sea', x: 72, y: 45, level: 'medium', activity: 'Territorial disputes' },
    { id: 'kashmir', name: 'Kashmir', x: 65, y: 35, level: 'medium', activity: 'Border tensions' },
    { id: 'korea', name: 'Korean Peninsula', x: 78, y: 30, level: 'low', activity: 'Diplomatic talks' },
  ];

  const getZoneClass = (level: string) => {
    switch (level) {
      case 'high': return 'threat-zone-high';
      case 'medium': return 'threat-zone-medium';
      case 'low': return 'threat-zone-low';
      default: return 'threat-zone-low';
    }
  };

  console.log('Rendering WorldMap with', threatZones.length, 'threat zones');

  return (
    <div className="relative w-full h-screen bg-starlink-dark grid-overlay">
      {/* Debug info */}
      <div className="absolute top-4 left-4 z-50 bg-red-500 text-white p-2 rounded text-xs">
        Debug: Map Rendered - Zones: {threatZones.length}
      </div>

      {/* World Map Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-starlink-dark via-starlink-slate/50 to-starlink-dark">
        <div className="absolute inset-0 opacity-100">
          {/* Debug border for SVG container */}
          <div className="w-full h-full border-4 border-yellow-400">
            <svg viewBox="0 0 1000 500" className="w-full h-full" style={{ border: '2px solid red' }}>
              {/* Simple test rectangle first */}
              <rect x="100" y="100" width="200" height="100" fill="lime" stroke="blue" strokeWidth="3" />
              
              {/* North America - Simplified */}
              <path
                d="M100 150 L300 120 L350 180 L320 250 L200 280 L120 240 Z"
                fill="rgba(148, 163, 184, 0.8)"
                stroke="rgba(148, 163, 184, 1)"
                strokeWidth="3"
              />
              
              {/* Europe - Simplified */}
              <path
                d="M450 120 L550 110 L580 160 L540 200 L460 190 L440 150 Z"
                fill="rgba(148, 163, 184, 0.8)"
                stroke="rgba(148, 163, 184, 1)"
                strokeWidth="3"
              />
              
              {/* Asia - Simplified */}
              <path
                d="M580 100 L800 90 L850 150 L820 220 L650 240 L580 200 L570 150 Z"
                fill="rgba(148, 163, 184, 0.8)"
                stroke="rgba(148, 163, 184, 1)"
                strokeWidth="3"
              />
              
              {/* Africa - Simplified */}
              <path
                d="M480 200 L580 190 L600 300 L580 400 L480 410 L460 300 L470 250 Z"
                fill="rgba(148, 163, 184, 0.8)"
                stroke="rgba(148, 163, 184, 1)"
                strokeWidth="3"
              />
              
              {/* Australia - Simplified */}
              <path
                d="M720 350 L820 340 L840 380 L800 410 L720 400 L710 370 Z"
                fill="rgba(148, 163, 184, 0.8)"
                stroke="rgba(148, 163, 184, 1)"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Threat Zones */}
      {threatZones.map((zone) => {
        console.log('Rendering zone:', zone.name, 'at', zone.x, zone.y);
        return (
          <div
            key={zone.id}
            className={`absolute w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-300 ${getZoneClass(zone.level)} ${
              zone.level === 'high' ? 'animate-pulse-glow' : ''
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
            }}
            onMouseEnter={() => {
              console.log('Hovering zone:', zone.name);
              setHoveredZone(zone.id);
            }}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <div className="w-full h-full rounded-full bg-current opacity-30" />
            
            {/* Tooltip */}
            {hoveredZone === zone.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-panel rounded-lg p-3 min-w-[200px] z-10">
                <h4 className="font-semibold text-starlink-white">{zone.name}</h4>
                <p className="text-sm text-starlink-grey-light">{zone.activity}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    zone.level === 'high' ? 'bg-starlink-red' :
                    zone.level === 'medium' ? 'bg-starlink-orange' : 'bg-starlink-blue'
                  }`} />
                  <span className="text-xs uppercase tracking-wide">{zone.level} Risk</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Timeline Slider */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel rounded-full px-6 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-starlink-grey-light">Apr 2024</span>
          <input
            type="range"
            min={2024}
            max={2027}
            value={selectedYear}
            onChange={(e) => {
              const newYear = parseInt(e.target.value);
              console.log('Year changed to:', newYear);
              setSelectedYear(newYear);
            }}
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
