
import { useMemo } from 'react';

interface HeatZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  intensity: number;
  type: string;
}

interface HeatZoneOverlayProps {
  zones: HeatZone[];
  activeFilters: string[];
  viewMode: '2d' | 'globe';
}

const HeatZoneOverlay = ({ zones, activeFilters, viewMode }: HeatZoneOverlayProps) => {
  const filteredZones = useMemo(() => {
    if (activeFilters.length === 0) return zones;
    return zones.filter(zone => activeFilters.includes(zone.type));
  }, [zones, activeFilters]);

  const getHeatColor = (type: string, intensity: number) => {
    const colors = {
      'military': `rgba(239, 68, 68, ${intensity})`,
      'cyber': `rgba(147, 51, 234, ${intensity})`,
      'diplomatic': `rgba(59, 130, 246, ${intensity})`,
      'economic': `rgba(34, 197, 94, ${intensity})`,
      'supply-chain': `rgba(249, 115, 22, ${intensity})`,
      'unrest': `rgba(234, 179, 8, ${intensity})`
    };
    return colors[type as keyof typeof colors] || `rgba(156, 163, 175, ${intensity})`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          {filteredZones.map(zone => (
            <radialGradient
              key={`gradient-${zone.id}`}
              id={`heat-gradient-${zone.id}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={getHeatColor(zone.type, zone.intensity)} />
              <stop offset="70%" stopColor={getHeatColor(zone.type, zone.intensity * 0.5)} />
              <stop offset="100%" stopColor={getHeatColor(zone.type, 0)} />
            </radialGradient>
          ))}
        </defs>
        
        {filteredZones.map(zone => (
          <circle
            key={zone.id}
            cx={zone.x}
            cy={zone.y}
            r={zone.radius}
            fill={`url(#heat-gradient-${zone.id})`}
            className={`transition-opacity duration-500 ${
              viewMode === 'globe' ? 'opacity-80' : 'opacity-60'
            }`}
          />
        ))}
      </svg>
    </div>
  );
};

export default HeatZoneOverlay;
