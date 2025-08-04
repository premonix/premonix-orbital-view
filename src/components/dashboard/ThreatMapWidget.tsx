import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapLibreThreatMap from '@/components/MapLibreThreatMap';

interface ThreatMapWidgetProps {
  threatSignals?: any[];
  userPreferences?: any;
}

export const ThreatMapWidget = ({ 
  threatSignals = [], 
  userPreferences 
}: ThreatMapWidgetProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Global Threat Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[600px] w-full">
          <MapLibreThreatMap />
        </div>
      </CardContent>
    </Card>
  );
};