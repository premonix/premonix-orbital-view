import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ThreatSignal, ThreatZone } from '@/types/threat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface MapContainerProps {
  threatSignals?: ThreatSignal[];
  threatZones?: ThreatZone[];
  onZoneClick?: (zone: ThreatZone, event: mapboxgl.MapMouseEvent) => void;
  onSignalClick?: (signal: ThreatSignal, event: mapboxgl.MapMouseEvent) => void;
  style?: string;
  zoom?: number;
  center?: [number, number];
  pitch?: number;
  bearing?: number;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({
  threatSignals = [],
  threatZones = [],
  onZoneClick,
  onSignalClick,
  style = 'mapbox://styles/mapbox/dark-v11',
  zoom = 2,
  center = [0, 20],
  pitch = 0,
  bearing = 0,
  className = '',
  interactive = true,
  showControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  // Check for existing Mapbox token
  useEffect(() => {
    const checkMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-mapbox-token');
        if (data?.token) {
          setMapboxToken(data.token);
          setIsTokenValid(true);
        }
      } catch (error) {
        console.log('No Mapbox token found, will prompt user');
      }
    };

    checkMapboxToken();
  }, []);

  const handleTokenSubmit = async () => {
    if (!tokenInput.trim()) return;
    
    try {
      // Test the token by making a simple request
      const testResponse = await fetch(`https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=${tokenInput}`);
      if (testResponse.ok) {
        setMapboxToken(tokenInput);
        setIsTokenValid(true);
        // Store token in Supabase Edge Function secrets
        await supabase.functions.invoke('store-mapbox-token', {
          body: { token: tokenInput }
        });
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      alert('Invalid Mapbox token. Please check your token and try again.');
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !isTokenValid || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center,
      zoom,
      pitch,
      bearing,
      interactive,
      projection: 'globe' as any,
      antialias: true
    });

    // Add controls
    if (showControls) {
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: 'metric'
        }),
        'bottom-left'
      );
    }

    // Add atmosphere and fog for globe
    map.current.on('style.load', () => {
      if (map.current) {
        map.current.setFog({
          color: 'rgb(30, 30, 40)',
          'high-color': 'rgb(50, 50, 70)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(10, 10, 20)',
          'star-intensity': 0.8
        });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [isTokenValid, mapboxToken, style, center, zoom, pitch, bearing, interactive, showControls]);

  // Add threat signals
  useEffect(() => {
    if (!map.current || !isTokenValid || threatSignals.length === 0) return;

    const addThreatSignals = () => {
      if (!map.current) return;

      // Remove existing sources and layers
      if (map.current.getSource('threat-signals')) {
        map.current.removeLayer('threat-signals-layer');
        map.current.removeSource('threat-signals');
      }

      // Add threat signals source
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: threatSignals.map(signal => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [signal.location.lng, signal.location.lat]
          },
          properties: {
            id: signal.id,
            category: signal.category,
            severity: signal.severity,
            title: signal.title,
            confidence: signal.confidence
          }
        }))
      };

      map.current.addSource('threat-signals', {
        type: 'geojson',
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add clustered circles
      map.current.addLayer({
        id: 'threat-signals-clusters',
        type: 'circle',
        source: 'threat-signals',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      // Add cluster count labels
      map.current.addLayer({
        id: 'threat-signals-cluster-count',
        type: 'symbol',
        source: 'threat-signals',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Add individual points
      map.current.addLayer({
        id: 'threat-signals-layer',
        type: 'circle',
        source: 'threat-signals',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'severity'],
            'critical', '#ef4444',
            'high', '#f97316',
            'medium', '#eab308',
            'low', '#3b82f6',
            '#6b7280'
          ],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 4,
            15, 12
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });

      // Add click handlers
      if (onSignalClick) {
        map.current.on('click', 'threat-signals-layer', (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0];
            const signal = threatSignals.find(s => s.id === feature.properties?.id);
            if (signal) {
              onSignalClick(signal, e);
            }
          }
        });
      }

      // Change cursor on hover
      map.current.on('mouseenter', 'threat-signals-layer', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'threat-signals-layer', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    };

    if (map.current.isStyleLoaded()) {
      addThreatSignals();
    } else {
      map.current.on('load', addThreatSignals);
    }
  }, [threatSignals, onSignalClick, isTokenValid]);

  if (!isTokenValid) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-starlink-dark flex items-center justify-center z-10">
          <div className="max-w-md mx-auto p-6 bg-starlink-slate-dark rounded-lg border border-starlink-slate-light">
            <Alert>
              <AlertDescription>
                To use interactive maps, please enter your Mapbox public token.
                <br />
                <a 
                  href="https://account.mapbox.com/access-tokens/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-starlink-blue hover:underline"
                >
                  Get your token here
                </a>
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Mapbox public token (pk.)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit}>
                Save
              </Button>
            </div>
          </div>
        </div>
        <div ref={mapContainer} className={`w-full h-full ${className}`} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className={`w-full h-full ${className}`} />
    </div>
  );
};

export default MapContainer;