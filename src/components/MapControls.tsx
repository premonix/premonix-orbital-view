
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Globe, Map, Filter } from 'lucide-react';

interface MapControlsProps {
  viewMode: '2d' | 'globe';
  onViewModeChange: (mode: '2d' | 'globe') => void;
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const MapControls = ({ 
  viewMode, 
  onViewModeChange, 
  activeFilters, 
  onFiltersChange,
  selectedYear,
  onYearChange
}: MapControlsProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const threatTypes = [
    { id: 'military', label: 'Military', color: 'bg-red-500' },
    { id: 'cyber', label: 'Cyber', color: 'bg-purple-500' },
    { id: 'diplomatic', label: 'Diplomatic', color: 'bg-blue-500' },
    { id: 'economic', label: 'Economic', color: 'bg-green-500' },
    { id: 'supply-chain', label: 'Supply Chain', color: 'bg-orange-500' },
    { id: 'unrest', label: 'Unrest', color: 'bg-yellow-500' }
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    onFiltersChange(newFilters);
  };

  return (
    <div className="absolute top-4 lg:top-6 left-4 lg:left-6 right-4 lg:right-auto z-50 space-y-3 lg:space-y-4 max-w-xs lg:max-w-none">
      {/* View Mode Toggle */}
      <div className="glass-panel rounded-lg p-2">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as '2d' | 'globe')}
          className="grid grid-cols-2 gap-1"
        >
          <ToggleGroupItem 
            value="2d" 
            className="data-[state=on]:bg-starlink-blue data-[state=on]:text-starlink-dark text-xs lg:text-sm"
          >
            <Map className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            2D
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="globe" 
            className="data-[state=on]:bg-starlink-blue data-[state=on]:text-starlink-dark text-xs lg:text-sm"
          >
            <Globe className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Globe
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Threat Type Filters */}
      <div className="glass-panel rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs lg:text-sm font-medium text-starlink-white">Threat Types</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-5 w-5 lg:h-6 lg:w-6 p-0"
          >
            <Filter className="w-3 h-3" />
          </Button>
        </div>
        
        {showFilters && (
          <div className="space-y-2">
            {threatTypes.map(type => (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${type.color}`} />
                  <span className="text-xs text-starlink-white">{type.label}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFilter(type.id)}
                  className={`h-5 lg:h-6 px-2 text-xs ${
                    activeFilters.includes(type.id) 
                      ? 'bg-starlink-blue text-starlink-dark' 
                      : 'text-starlink-grey-light'
                  }`}
                >
                  {activeFilters.includes(type.id) ? 'ON' : 'OFF'}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {!showFilters && (
          <div className="flex flex-wrap gap-1">
            {activeFilters.map(filterId => {
              const type = threatTypes.find(t => t.id === filterId);
              return type ? (
                <Badge key={filterId} className={`${type.color} text-white text-xs`}>
                  {type.label}
                </Badge>
              ) : null;
            })}
            {activeFilters.length === 0 && (
              <span className="text-xs text-starlink-grey">All types visible</span>
            )}
          </div>
        )}
      </div>

      {/* Timeline Control */}
      <div className="glass-panel rounded-lg p-3">
        <h4 className="text-xs lg:text-sm font-medium text-starlink-white mb-2">Timeline</h4>
        <div className="space-y-2">
          <input
            type="range"
            min={2020}
            max={2030}
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="w-full h-1 bg-starlink-slate-light rounded-full appearance-none cursor-pointer custom-slider"
          />
          <div className="flex justify-between text-xs text-starlink-grey">
            <span>2020</span>
            <span className="text-starlink-blue font-medium">{selectedYear}</span>
            <span>2030</span>
          </div>
          <div className="text-xs text-center text-starlink-grey-light">
            {selectedYear >= 2025 ? 'Projection Mode' : 'Historical Data'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;
