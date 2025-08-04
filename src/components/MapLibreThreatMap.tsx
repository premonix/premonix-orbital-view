import React, { useEffect, useRef, useState } from 'react';
import Map, { Layer, Source, Marker } from 'react-map-gl/maplibre';
import { ThreatSignal } from '@/types/threat';
import { supabase } from '@/integrations/supabase/client';
import MapControls from '@/components/MapControls';
import { Badge } from '@/components/ui/badge';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreThreatMap = () => {
  const [threatSignals, setThreatSignals] = useState<ThreatSignal[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreatSignals = async () => {
      try {
        const { data, error } = await supabase
          .from('threat_signals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        const signals: ThreatSignal[] = data?.map((signal: any) => ({
          id: signal.id,
          timestamp: new Date(signal.created_at),
          location: {
            lat: signal.latitude,
            lng: signal.longitude,
            country: signal.country || 'Unknown',
            region: signal.region || 'Unknown'
          },
          category: signal.category,
          severity: signal.severity,
          confidence: signal.confidence || 80,
          source: signal.source || 'Intelligence Network',
          title: signal.title,
          description: signal.description,
          tags: signal.tags || [],
          escalationPotential: signal.escalation_potential || 50
        })) || [];

        setThreatSignals(signals);
      } catch (error) {
        console.error('Error fetching threat signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreatSignals();
  }, []);

  const filteredSignals = threatSignals.filter(signal => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(signal.category);
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const threatCategories = ['Military', 'Cyber', 'Diplomatic', 'Economic', 'Supply Chain', 'Unrest'];
  const severityLevels = ['critical', 'high', 'medium', 'low'];
  
  const getThreatCountBySeverity = (severity: string) => 
    filteredSignals.filter(signal => signal.severity === severity).length;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Map Controls */}
      <div className="absolute top-6 left-6 z-10">
        <MapControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Map Container */}
      <Map
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: 2,
          pitch: viewMode === 'globe' ? 45 : 0
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json"
        projection={viewMode === 'globe' ? 'globe' : 'mercator'}
      >
        {/* Threat Signals as Markers */}
        {filteredSignals.map((signal) => (
          <Marker
            key={signal.id}
            longitude={signal.location.lng}
            latitude={signal.location.lat}
            anchor="center"
          >
            <div 
              className="relative group cursor-pointer"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getSeverityColor(signal.severity),
                border: '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: `0 0 12px ${getSeverityColor(signal.severity)}`,
                animation: 'pulse 2s infinite'
              }}
              title={`${signal.title} - ${signal.severity}`}
            />
          </Marker>
        ))}

        {/* Heatmap Layer for Threat Density */}
        <Source
          id="threat-heatmap"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: filteredSignals.map(signal => ({
              type: 'Feature',
              properties: {
                severity: signal.severity,
                weight: signal.severity === 'critical' ? 4 : 
                       signal.severity === 'high' ? 3 :
                       signal.severity === 'medium' ? 2 : 1
              },
              geometry: {
                type: 'Point',
                coordinates: [signal.location.lng, signal.location.lat]
              }
            }))
          }}
        >
          <Layer
            id="threat-heat"
            type="heatmap"
            paint={{
              'heatmap-weight': ['get', 'weight'],
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(0, 0, 255, 0)',
                0.1, 'rgba(0, 255, 255, 0.5)',
                0.3, 'rgba(0, 255, 0, 0.7)',
                0.5, 'rgba(255, 255, 0, 0.8)',
                0.7, 'rgba(255, 165, 0, 0.9)',
                1, 'rgba(255, 0, 0, 1)'
              ],
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
            }}
          />
        </Source>
      </Map>

      {/* Status Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-muted-foreground">Active Signals:</span>
              <span className="ml-2 font-bold text-foreground">{filteredSignals.length}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">View:</span>
              <span className="ml-2 font-medium text-foreground capitalize">{viewMode}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Year:</span>
              <span className="ml-2 font-medium text-foreground">{selectedYear}</span>
            </div>
          </div>
          
          {/* Threat Level Legend */}
          <div className="flex items-center gap-4">
            {severityLevels.map((level) => {
              const count = getThreatCountBySeverity(level);
              return (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSeverityColor(level) }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {level}: {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Threat Intelligence...</p>
          </div>
        </div>
      )}

      {/* Custom Styles for Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MapLibreThreatMap;