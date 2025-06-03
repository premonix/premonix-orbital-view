
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

  return (
    <div className="relative w-full h-screen bg-starlink-dark grid-overlay">
      {/* World Map Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-starlink-dark via-starlink-slate/50 to-starlink-dark">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* Simplified world map outlines */}
            <path
              d="M150 200 L200 180 L280 190 L350 170 L400 180 L450 200 L500 190"
              stroke="rgba(100, 116, 139, 0.3)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M600 220 L700 200 L800 210 L850 230 L900 220"
              stroke="rgba(100, 116, 139, 0.3)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </div>

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
      ))}

      {/* Timeline Slider */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel rounded-full px-6 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-starlink-grey-light">Apr 2024</span>
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
