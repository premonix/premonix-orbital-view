import React, { useEffect, useRef, useState } from 'react';
import Map, { Layer, Source, Marker } from 'react-map-gl/maplibre';
import { ThreatSignal } from '@/types/threat';
import { RealThreatService } from '@/services/realThreatService';
import MapControls from '@/components/MapControls';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Shield, AlertTriangle, Clock, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { getSeverityColorHex } from '@/lib/threatColors';
import { supabase } from '@/integrations/supabase/client';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreThreatMap = () => {
  const [threatSignals, setThreatSignals] = useState<ThreatSignal[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<ThreatSignal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const signals = await RealThreatService.getLatestSignals(500);
      setThreatSignals(signals);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading threat signals:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const refreshResult = await RealThreatService.refreshThreatData();
      if (refreshResult.success) {
        await loadSignals();
      } else {
        console.error('Refresh failed:', refreshResult.error);
      }
    } catch (error) {
      console.error('Error refreshing threat data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSignals();

    // Set up real-time subscription for new threat signals
    const channel = supabase
      .channel('threat-signals-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'threat_signals'
        },
        (payload) => {
          console.log('New threat signal received:', payload.new);
          // Add the new signal to the existing signals
          setThreatSignals(prev => [payload.new as ThreatSignal, ...prev]);
          setLastUpdated(new Date());
          setIsConnected(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'threat_signals'
        },
        (payload) => {
          console.log('Threat signal updated:', payload.new);
          // Update the existing signal
          setThreatSignals(prev => 
            prev.map(signal => 
              signal.id === payload.new.id ? payload.new as ThreatSignal : signal
            )
          );
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing threat data...');
      handleRefresh();
    }, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, []);

  const filteredSignals = threatSignals.filter(signal => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(signal.category);
  });

  // Use centralized color system for consistency
  const getSeverityColor = getSeverityColorHex;

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

      {/* Real-time Status & Refresh Controls */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 px-2"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
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
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
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
              className="relative group cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedThreat(signal)}
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
        {filteredSignals.length > 0 && (
          <Source
            id="threat-heatmap"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: filteredSignals.map(signal => ({
                type: 'Feature',
                properties: {
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
        )}
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

      {/* Threat Details Dialog */}
      <Dialog open={!!selectedThreat} onOpenChange={() => setSelectedThreat(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: selectedThreat ? getSeverityColor(selectedThreat.severity) : undefined }} />
              {selectedThreat?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedThreat && (
            <div className="space-y-6">
              {/* Threat Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Severity</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className="capitalize"
                    style={{ 
                      borderColor: getSeverityColor(selectedThreat.severity),
                      color: getSeverityColor(selectedThreat.severity)
                    }}
                  >
                    {selectedThreat.severity}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedThreat.location.region}, {selectedThreat.location.country}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Timestamp</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedThreat.timestamp.toLocaleDateString()} {selectedThreat.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Category</span>
                  </div>
                  <Badge variant="secondary">
                    {selectedThreat.category}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {selectedThreat.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedThreat.description}
                  </p>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${selectedThreat.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{selectedThreat.confidence}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Escalation Potential</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${selectedThreat.escalationPotential}%`,
                          backgroundColor: selectedThreat.escalationPotential > 70 ? '#dc2626' : 
                                         selectedThreat.escalationPotential > 40 ? '#ea580c' : '#16a34a'
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{selectedThreat.escalationPotential}%</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedThreat.tags && selectedThreat.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedThreat.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Source */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Source</h4>
                <p className="text-sm text-muted-foreground">{selectedThreat.source}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedThreat(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapLibreThreatMap;