import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Map, Filter, Globe, MapPin } from 'lucide-react';

interface ThreatSignal {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  country: string;
  region?: string;
  category: string;
  severity: string;
  title: string;
  threat_score: number;
}

interface ThreatMapWidgetProps {
  threatSignals: ThreatSignal[];
  userPreferences?: any;
  showFilters?: boolean;
}

export const ThreatMapWidget = ({ 
  threatSignals, 
  userPreferences,
  showFilters = false 
}: ThreatMapWidgetProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredSignals = threatSignals.filter(signal => {
    if (selectedCategory !== 'all' && signal.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && signal.severity !== selectedSeverity) return false;
    if (selectedRegion !== 'all' && signal.country !== selectedRegion) return false;
    return true;
  });

  const categories = [...new Set(threatSignals.map(s => s.category))];
  const severities = ['critical', 'high', 'medium', 'low'];
  const regions = [...new Set(threatSignals.map(s => s.country))];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRegionStats = () => {
    const stats = filteredSignals.reduce((acc, signal) => {
      if (!acc[signal.country]) {
        acc[signal.country] = { count: 0, highPriority: 0 };
      }
      acc[signal.country].count++;
      if (signal.severity === 'critical' || signal.severity === 'high') {
        acc[signal.country].highPriority++;
      }
      return acc;
    }, {} as Record<string, { count: number; highPriority: number }>);

    return Object.entries(stats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 8);
  };

  const regionStats = getRegionStats();

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-starlink-white">
              <Map className="w-5 h-5" />
              <span>Threat Map</span>
            </CardTitle>
            <CardDescription className="text-starlink-grey-light">
              {filteredSignals.length} signals • Global threat distribution
            </CardDescription>
          </div>
          {showFilters && (
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-starlink-grey-light mb-2 block">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-starlink-dark-secondary border-starlink-dark-secondary">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-starlink-grey-light mb-2 block">
                Severity
              </label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="bg-starlink-dark-secondary border-starlink-dark-secondary">
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severities.map(severity => (
                    <SelectItem key={severity} value={severity}>
                      <span className="capitalize">{severity}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-starlink-grey-light mb-2 block">
                Region
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="bg-starlink-dark-secondary border-starlink-dark-secondary">
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="relative h-64 bg-starlink-dark-secondary/50 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-12 h-12 text-starlink-grey mx-auto mb-3" />
              <p className="text-starlink-grey-light">Interactive threat map</p>
              <p className="text-sm text-starlink-grey">Coming soon</p>
            </div>
          </div>
          
          {/* Threat points overlay */}
          <div className="absolute inset-0">
            {filteredSignals.slice(0, 10).map((signal, index) => (
              <div
                key={signal.id}
                className={`absolute w-3 h-3 rounded-full ${getSeverityColor(signal.severity)} animate-pulse`}
                style={{
                  left: `${20 + (index * 8)}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                title={`${signal.title} - ${signal.country}`}
              />
            ))}
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-starlink-white">Regional Activity</h4>
          <div className="space-y-2">
            {regionStats.map(([country, stats]) => (
              <div key={country} className="flex items-center justify-between p-2 rounded-lg bg-starlink-dark-secondary/50">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-starlink-grey" />
                  <span className="text-starlink-white text-sm font-medium">{country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {stats.count} total
                  </Badge>
                  {stats.highPriority > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.highPriority} high
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-starlink-white">Severity Legend</h4>
          <div className="flex flex-wrap gap-2">
            {severities.map(severity => (
              <div key={severity} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`}></div>
                <span className="text-xs text-starlink-grey-light capitalize">{severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MapPin className="w-4 h-4 mr-2" />
            Set Location
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Globe className="w-4 h-4 mr-2" />
            Full Screen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};