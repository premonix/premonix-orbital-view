
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
        <div className="absolute inset-0 opacity-80">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* North America */}
            <path
              d="M50 120 L60 100 L80 95 L100 90 L120 85 L140 80 L160 85 L180 90 L200 100 L220 110 L240 120 L250 140 L260 160 L250 180 L240 200 L220 220 L200 230 L180 235 L160 240 L140 245 L120 250 L100 245 L80 240 L70 230 L60 220 L50 200 L45 180 L40 160 L45 140 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />
            
            {/* South America */}
            <path
              d="M170 260 L180 250 L190 260 L195 280 L200 300 L205 320 L210 340 L215 360 L220 380 L215 400 L210 420 L200 430 L190 425 L180 420 L170 415 L165 400 L160 380 L155 360 L160 340 L165 320 L168 300 L170 280 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />
            
            {/* Europe */}
            <path
              d="M450 100 L470 95 L490 100 L510 105 L530 110 L540 130 L535 150 L530 170 L520 180 L500 185 L480 180 L460 175 L450 160 L445 140 L448 120 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />
            
            {/* Africa */}
            <path
              d="M480 190 L500 185 L520 190 L540 200 L550 220 L555 240 L560 260 L555 280 L550 300 L545 320 L540 340 L535 360 L530 380 L520 400 L510 410 L490 415 L470 410 L450 400 L460 380 L465 360 L470 340 L475 320 L480 300 L478 280 L476 260 L478 240 L480 220 L482 200 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />
            
            {/* Asia */}
            <path
              d="M550 80 L580 75 L610 70 L640 75 L670 80 L700 85 L730 90 L760 95 L790 100 L820 110 L840 120 L850 140 L845 160 L840 180 L830 200 L820 220 L800 240 L780 250 L760 255 L740 260 L720 255 L700 250 L680 245 L660 240 L640 235 L620 230 L600 225 L580 220 L560 215 L550 200 L545 180 L550 160 L555 140 L560 120 L555 100 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />
            
            {/* Australia */}
            <path
              d="M720 340 L750 335 L780 340 L810 350 L830 365 L835 380 L830 395 L815 405 L790 410 L760 405 L730 400 L710 390 L705 375 L710 360 L715 350 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />
            
            {/* Greenland */}
            <path
              d="M380 40 L400 35 L420 40 L440 50 L450 70 L445 90 L435 100 L420 105 L400 100 L385 95 L375 85 L370 70 L375 50 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
              strokeWidth="2"
            />

            {/* Antarctica */}
            <path
              d="M100 450 L200 445 L300 440 L400 445 L500 450 L600 445 L700 450 L800 445 L900 450 L950 460 L900 470 L800 475 L700 480 L600 475 L500 480 L400 475 L300 480 L200 475 L100 470 Z"
              fill="rgba(148, 163, 184, 0.4)"
              stroke="rgba(148, 163, 184, 0.9)"
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
