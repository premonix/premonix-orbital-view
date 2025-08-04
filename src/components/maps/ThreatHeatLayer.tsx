import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { ThreatSignal } from '@/types/threat';

interface ThreatHeatLayerProps {
  map: mapboxgl.Map | null;
  threatSignals: ThreatSignal[];
  visible: boolean;
}

const ThreatHeatLayer: React.FC<ThreatHeatLayerProps> = ({
  map,
  threatSignals,
  visible
}) => {
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    const addHeatLayer = () => {
      if (!map) return;

      // Remove existing heatmap if it exists
      if (map.getSource('threat-heat')) {
        if (map.getLayer('threat-heatmap')) {
          map.removeLayer('threat-heatmap');
        }
        map.removeSource('threat-heat');
      }

      if (!visible || threatSignals.length === 0) return;

      // Create GeoJSON from threat signals with weights
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: threatSignals.map(signal => {
          // Calculate weight based on severity and confidence
          const severityWeight = {
            'critical': 1.0,
            'high': 0.7,
            'medium': 0.4,
            'low': 0.2
          }[signal.severity] || 0.2;
          
          const confidenceWeight = signal.confidence / 100;
          const escalationWeight = signal.escalationPotential / 100;
          
          const weight = severityWeight * confidenceWeight * (1 + escalationWeight);

          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [signal.location.lng, signal.location.lat]
            },
            properties: {
              weight: weight,
              severity: signal.severity
            }
          };
        })
      };

      // Add source
      map.addSource('threat-heat', {
        type: 'geojson',
        data: geojsonData
      });

      // Add heatmap layer
      map.addLayer({
        id: 'threat-heatmap',
        type: 'heatmap',
        source: 'threat-heat',
        maxzoom: 9,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            0, 0,
            1, 1
          ],
          // Increase the heatmap color weight by zoom level
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
          ],
          // Color ramp for heatmap - from cool to hot
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33, 102, 172, 0)',
            0.2, 'rgb(103, 169, 207)',
            0.4, 'rgb(209, 229, 240)',
            0.6, 'rgb(253, 219, 199)',
            0.8, 'rgb(239, 138, 98)',
            1, 'rgb(178, 24, 43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          // Transition from heatmap to circle layer at zoom level 9
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            9, 0
          ]
        }
      }, 'threat-signals-layer');
    };

    if (map.isStyleLoaded()) {
      addHeatLayer();
    } else {
      map.on('load', addHeatLayer);
    }

    return () => {
      if (map && map.getSource('threat-heat')) {
        if (map.getLayer('threat-heatmap')) {
          map.removeLayer('threat-heatmap');
        }
        map.removeSource('threat-heat');
      }
    };
  }, [map, threatSignals, visible]);

  return null;
};

export default ThreatHeatLayer;