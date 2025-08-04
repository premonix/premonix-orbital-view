import React, { useState, useEffect } from 'react';
import { ThreatSignal, ThreatZone } from '@/types/threat';
import { RealThreatService } from '@/services/realThreatService';
import MapControls from './MapControls';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WorldMap = () => {
  const { isAuthenticated, upgradeRole } = useAuth();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState<'2d' | 'globe'>('2d');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [threatSignals, setThreatSignals] = useState<ThreatSignal[]>([]);

  useEffect(() => {
    // Load threat signals
    const loadThreatData = async () => {
      try {
        const { data: rawSignals, error } = await supabase
          .from('threat_signals')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Database error:', error);
          return;
        }

        // Transform database signals to match ThreatSignal interface
        const transformedSignals: ThreatSignal[] = (rawSignals || []).map(signal => ({
          id: signal.id,
          timestamp: new Date(signal.timestamp),
          location: {
            lat: Number(signal.latitude),
            lng: Number(signal.longitude),
            country: signal.country || '',
            region: signal.region || ''
          },
          category: signal.category as any,
          severity: signal.severity as any,
          confidence: signal.confidence || 0,
          source: signal.source_name || '',
          title: signal.title || '',
          description: signal.summary || '',
          tags: signal.tags || [],
          escalationPotential: signal.escalation_potential || 0
        }));

        setThreatSignals(transformedSignals);
      } catch (error) {
        console.error('Failed to load threat signals:', error);
      }
    };

    loadThreatData();
  }, [selectedYear]);

  // Filter signals based on active filters
  const filteredSignals = threatSignals.filter(signal => {
    if (activeFilters.length === 0) return true;
    return activeFilters.some(filter => {
      const categoryMap: { [key: string]: string } = {
        'military': 'Military',
        'cyber': 'Cyber', 
        'diplomatic': 'Diplomatic',
        'economic': 'Economic',
        'supply-chain': 'Supply Chain',
        'unrest': 'Unrest'
      };
      return signal.category === categoryMap[filter];
    });
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative w-full h-screen bg-starlink-dark overflow-hidden">
      {/* Map Controls */}
      <MapControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* Fallback Map Visualization */}
      <div className="absolute inset-0 bg-gradient-to-br from-starlink-dark via-starlink-slate-dark to-starlink-dark">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              <pattern id="worldGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#worldGrid)" />
          </svg>
        </div>

        {/* World Map with Actual Continent Shapes */}
        <div className="absolute inset-0 opacity-80">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <defs>
              <filter id="continentGlow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* North America - Recognizable shape */}
            <path
              d="M80 120 L100 100 L140 95 L180 105 L220 110 L250 120 L280 140 L300 160 L290 180 L270 200 L240 210 L200 205 L160 190 L120 170 L90 150 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* South America - Distinctive elongated shape */}
            <path
              d="M220 230 L240 220 L260 235 L270 260 L275 290 L270 320 L265 350 L255 380 L245 400 L235 410 L225 405 L220 380 L215 350 L210 320 L205 290 L210 260 L215 240 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* Europe - Small but distinct */}
            <path
              d="M420 110 L440 105 L460 110 L480 115 L500 120 L510 130 L505 140 L490 145 L470 140 L450 135 L430 130 L415 125 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* Africa - Characteristic shape */}
            <path
              d="M430 160 L450 155 L470 160 L485 175 L495 200 L500 230 L495 260 L485 290 L475 320 L465 350 L450 370 L435 375 L425 365 L420 340 L415 310 L410 280 L415 250 L420 220 L425 190 L430 170 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* Asia - Large landmass */}
            <path
              d="M520 100 L580 95 L640 100 L700 105 L760 110 L820 115 L850 130 L860 150 L855 170 L840 185 L800 190 L750 185 L700 180 L650 175 L600 170 L550 165 L520 150 L510 130 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* China/Eastern Asia - Additional detail */}
            <path
              d="M700 200 L740 195 L780 200 L810 210 L820 225 L815 240 L800 245 L770 240 L740 235 L710 230 L695 220 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* Australia - Distinct island shape */}
            <path
              d="M720 330 L760 325 L800 330 L830 340 L840 355 L835 365 L820 370 L780 365 L740 360 L720 350 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="rgba(148, 163, 184, 0.15)"
              filter="url(#continentGlow)"
            />
            
            {/* Greenland */}
            <path
              d="M320 80 L340 75 L355 80 L365 90 L360 105 L350 110 L335 105 L325 95 Z"
              stroke="#94a3b8"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Madagascar */}
            <path
              d="M520 320 L525 315 L530 325 L528 340 L525 350 L520 345 Z"
              stroke="#94a3b8"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Japan */}
            <path
              d="M820 190 L830 185 L835 195 L840 205 L835 215 L825 210 L820 200 Z"
              stroke="#94a3b8"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* UK/British Isles */}
            <path
              d="M400 130 L410 125 L415 135 L412 145 L405 140 Z"
              stroke="#94a3b8"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Ocean/Water boundaries */}
            <circle cx="500" cy="250" r="200" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
            
            {/* Continent Labels */}
            <text x="180" y="160" fill="#cbd5e1" fontSize="14" fontWeight="bold" textAnchor="middle">NORTH AMERICA</text>
            <text x="240" y="320" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">SOUTH AMERICA</text>
            <text x="460" y="135" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">EUROPE</text>
            <text x="460" y="270" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">AFRICA</text>
            <text x="680" y="150" fill="#cbd5e1" fontSize="14" fontWeight="bold" textAnchor="middle">ASIA</text>
            <text x="780" y="350" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">AUSTRALIA</text>
          </svg>
        </div>

        {/* Threat Signal Points */}
        <div className="absolute inset-0">
          {filteredSignals.slice(0, 50).map((signal, index) => {
            // Convert lat/lng to screen coordinates (more accurate mapping)
            const x = ((signal.location.lng + 180) / 360) * 100;
            const y = ((90 - signal.location.lat) / 180) * 100;
            
            return (
              <div
                key={signal.id}
                className={`absolute w-3 h-3 rounded-full ${getSeverityColor(signal.severity)} animate-pulse`}
                style={{
                  left: `${Math.min(Math.max(x, 2), 98)}%`,
                  top: `${Math.min(Math.max(y, 10), 90)}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: `0 0 10px ${signal.severity === 'critical' ? '#ef4444' : 
                                          signal.severity === 'high' ? '#f97316' :
                                          signal.severity === 'medium' ? '#eab308' : '#3b82f6'}`
                }}
                title={`${signal.title} - ${signal.location.country} (${signal.severity})`}
              />
            );
          })}
        </div>


        {/* Enhanced Status Bar */}
        <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-auto lg:right-6 z-40 glass-panel rounded-lg px-3 lg:px-4 py-2">
          <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-starlink-grey-light">Real-time Signals</span>
            </div>
            <div className="text-starlink-grey">|</div>
            <span className="text-starlink-white">{viewMode.toUpperCase()} View</span>
            <div className="text-starlink-grey">|</div>
            <span className="text-starlink-blue">{filteredSignals.length} Threats</span>
            <div className="text-starlink-grey">|</div>
            <span className="text-starlink-blue">{selectedYear}</span>
            {!isAuthenticated && (
              <>
                <div className="text-starlink-grey">|</div>
                <Badge variant="outline" className="text-xs text-orange-300 border-orange-300/30">
                  Guest Mode
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-20 lg:bottom-24 left-4 lg:left-6 z-40 glass-panel rounded-lg p-3">
          <h4 className="text-xs font-medium text-starlink-white mb-2">Threat Levels</h4>
          <div className="space-y-1">
            {[
              { level: 'critical', color: 'bg-red-500', label: 'Critical' },
              { level: 'high', color: 'bg-orange-500', label: 'High' },
              { level: 'medium', color: 'bg-yellow-500', label: 'Medium' },
              { level: 'low', color: 'bg-blue-500', label: 'Low' }
            ].map(({ level, color, label }) => (
              <div key={level} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-starlink-grey-light">{label}</span>
                <span className="text-xs text-starlink-grey">
                  ({filteredSignals.filter(s => s.severity === level).length})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Upgrade Prompt */}
        {!isAuthenticated && (
          <div className="absolute top-32 lg:top-36 left-4 right-4 lg:left-6 lg:right-6 z-30">
            <div className="glass-panel rounded-lg p-3 lg:p-4 bg-gradient-to-r from-starlink-blue/10 to-starlink-purple/10 border border-starlink-blue/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-starlink-blue/20 rounded-full">
                    <Lock className="w-4 h-4 text-starlink-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm lg:text-base font-semibold text-starlink-white">
                      Enhanced Threat Intelligence
                    </h3>
                    <p className="text-xs lg:text-sm text-starlink-grey-light">
                      Register for unlimited signals, real-time alerts, and advanced analytics
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => upgradeRole('individual')}
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Register Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;