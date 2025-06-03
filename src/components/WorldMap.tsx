
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
        <div className="absolute inset-0 opacity-70">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* North America */}
            <path
              d="M50 150 Q80 120 120 130 Q180 125 200 140 Q220 160 240 180 Q250 200 230 220 Q200 240 170 250 Q120 260 80 240 Q50 220 40 180 Q45 160 50 150 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
            />
            
            {/* South America */}
            <path
              d="M170 280 Q180 270 190 280 Q200 300 210 340 Q215 380 200 400 Q185 420 175 400 Q165 380 160 340 Q155 300 170 280 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
            />
            
            {/* Europe */}
            <path
              d="M450 120 Q480 110 510 120 Q530 140 520 160 Q500 180 480 170 Q460 150 450 120 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
            />
            
            {/* Africa */}
            <path
              d="M480 200 Q520 190 540 210 Q550 250 545 300 Q540 350 520 380 Q500 400 480 390 Q460 360 465 320 Q470 280 480 200 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
            />
            
            {/* Asia */}
            <path
              d="M550 100 Q650 90 750 110 Q800 130 820 160 Q830 190 810 220 Q780 240 740 250 Q680 260 620 250 Q580 240 560 220 Q540 190 550 100 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
            />
            
            {/* Australia */}
            <path
              d="M720 350 Q780 340 820 360 Q830 380 810 390 Q770 400 720 390 Q700 380 720 350 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
            />
            
            {/* Greenland */}
            <path
              d="M380 50 Q420 40 440 60 Q450 80 430 90 Q400 100 380 80 Q370 60 380 50 Z"
              fill="rgba(148, 163, 184, 0.3)"
              stroke="rgba(148, 163, 184, 0.8)"
              strokeWidth="2"
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
