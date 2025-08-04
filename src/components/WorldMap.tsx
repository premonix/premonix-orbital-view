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

        {/* World Map with Realistic Continent Shapes */}
        <div className="absolute inset-0 opacity-80">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <defs>
              <filter id="continentGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* North America - More realistic with Canada, USA, Mexico */}
            <path
              d="M50 120 Q80 90 120 85 Q160 80 200 85 Q240 90 270 100 Q300 110 320 130 L340 150 Q350 170 345 190 L340 210 Q330 230 310 245 L280 255 Q250 260 220 255 L190 250 Q160 245 140 235 L120 220 Q100 200 90 180 L85 160 Q80 140 85 120 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(148, 163, 184, 0.2)"
              filter="url(#continentGlow)"
            />
            
            {/* Greenland */}
            <path
              d="M320 60 Q340 55 360 60 Q375 70 380 85 Q378 100 370 110 Q355 115 340 112 Q325 108 315 95 Q310 80 315 65 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.15)"
            />
            
            {/* South America - Distinctive narrow shape */}
            <path
              d="M240 280 Q255 275 270 280 Q285 290 290 310 L295 340 Q298 370 295 400 Q290 430 280 450 Q270 465 255 470 Q240 475 225 470 Q215 465 210 450 Q205 430 208 400 Q210 370 215 340 L220 310 Q225 290 235 280 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(148, 163, 184, 0.2)"
              filter="url(#continentGlow)"
            />
            
            {/* Europe - Complex coastline */}
            <path
              d="M450 110 Q470 105 490 110 Q510 115 525 125 Q535 135 530 145 Q520 155 505 158 Q490 160 475 158 Q460 155 450 145 Q445 135 448 125 Q450 115 452 110 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(148, 163, 184, 0.2)"
              filter="url(#continentGlow)"
            />
            
            {/* UK */}
            <path
              d="M435 125 Q445 120 450 130 Q448 140 440 145 Q432 142 430 135 Q432 128 435 125 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.15)"
            />
            
            {/* Africa - Characteristic boot shape */}
            <path
              d="M470 180 Q490 175 510 180 Q530 190 540 210 Q545 240 542 270 Q540 300 535 330 Q530 360 520 385 Q505 405 485 415 Q465 420 445 415 Q430 405 425 385 Q420 360 422 330 Q425 300 430 270 Q435 240 445 210 Q455 190 465 180 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(148, 163, 184, 0.2)"
              filter="url(#continentGlow)"
            />
            
            {/* Madagascar */}
            <path
              d="M545 350 Q550 345 555 350 Q558 365 555 380 Q550 385 545 380 Q542 365 545 350 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Asia - Large complex landmass */}
            <path
              d="M530 100 Q570 95 620 100 Q670 105 720 110 Q770 115 810 120 Q850 130 870 150 Q875 170 870 185 Q860 200 840 210 Q810 215 780 212 Q750 210 720 205 Q690 200 660 195 Q630 190 600 185 Q570 180 545 175 Q530 165 525 150 Q522 135 525 120 Q528 105 530 100 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(148, 163, 184, 0.2)"
              filter="url(#continentGlow)"
            />
            
            {/* India subcontinent */}
            <path
              d="M650 220 Q670 215 685 225 Q695 240 690 255 Q680 265 665 262 Q650 258 645 245 Q642 230 650 220 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.15)"
            />
            
            {/* Southeast Asia/Indonesia */}
            <path
              d="M720 250 Q740 245 760 250 Q780 260 785 275 Q782 285 770 288 Q750 285 730 280 Q715 275 712 265 Q715 255 720 250 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Japan */}
            <path
              d="M835 200 Q845 195 850 205 Q855 220 850 230 Q840 235 830 230 Q825 220 828 210 Q832 200 835 200 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Australia - Distinctive shape */}
            <path
              d="M750 350 Q780 345 810 350 Q840 360 855 375 Q860 390 855 400 Q840 410 810 412 Q780 410 750 405 Q725 400 715 385 Q710 370 715 360 Q730 350 750 350 Z"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="rgba(148, 163, 184, 0.2)"
              filter="url(#continentGlow)"
            />
            
            {/* New Zealand */}
            <path
              d="M870 380 Q875 375 880 380 Q882 390 878 395 Q873 398 868 395 Q866 390 868 385 Q869 380 870 380 Z"
              stroke="#64748b"
              strokeWidth="1"
              fill="rgba(148, 163, 184, 0.1)"
            />
            
            {/* Ocean grid lines for reference */}
            <g stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4">
              {/* Latitude lines */}
              <line x1="0" y1="100" x2="1000" y2="100" />
              <line x1="0" y1="150" x2="1000" y2="150" />
              <line x1="0" y1="200" x2="1000" y2="200" />
              <line x1="0" y1="250" x2="1000" y2="250" />
              <line x1="0" y1="300" x2="1000" y2="300" />
              <line x1="0" y1="350" x2="1000" y2="350" />
              <line x1="0" y1="400" x2="1000" y2="400" />
              
              {/* Longitude lines */}
              <line x1="100" y1="0" x2="100" y2="500" />
              <line x1="200" y1="0" x2="200" y2="500" />
              <line x1="300" y1="0" x2="300" y2="500" />
              <line x1="400" y1="0" x2="400" y2="500" />
              <line x1="500" y1="0" x2="500" y2="500" />
              <line x1="600" y1="0" x2="600" y2="500" />
              <line x1="700" y1="0" x2="700" y2="500" />
              <line x1="800" y1="0" x2="800" y2="500" />
            </g>
            
            {/* Continent Labels */}
            <text x="200" y="190" fill="#cbd5e1" fontSize="16" fontWeight="500" textAnchor="middle" opacity="0.8">NORTH AMERICA</text>
            <text x="255" y="370" fill="#cbd5e1" fontSize="14" fontWeight="500" textAnchor="middle" opacity="0.8">SOUTH AMERICA</text>
            <text x="480" y="140" fill="#cbd5e1" fontSize="12" fontWeight="500" textAnchor="middle" opacity="0.8">EUROPE</text>
            <text x="480" y="300" fill="#cbd5e1" fontSize="14" fontWeight="500" textAnchor="middle" opacity="0.8">AFRICA</text>
            <text x="700" y="160" fill="#cbd5e1" fontSize="16" fontWeight="500" textAnchor="middle" opacity="0.8">ASIA</text>
            <text x="780" y="385" fill="#cbd5e1" fontSize="12" fontWeight="500" textAnchor="middle" opacity="0.8">AUSTRALIA</text>
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