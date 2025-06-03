
import { ThreatZone } from '@/types/threat';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ThreatPopupProps {
  zone: ThreatZone;
  x: number;
  y: number;
  onClose: () => void;
}

const ThreatPopup = ({ zone, x, y, onClose }: ThreatPopupProps) => {
  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getThreatProgress = (level: string) => {
    switch (level) {
      case 'high': return 85;
      case 'medium': return 55;
      case 'low': return 25;
      default: return 0;
    }
  };

  return (
    <div 
      className="absolute z-50 glass-panel rounded-lg p-4 min-w-[280px] max-w-[320px] border border-starlink-grey/30"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-starlink-slate/50 hover:bg-starlink-slate flex items-center justify-center text-starlink-grey-light hover:text-starlink-white transition-colors"
      >
        ×
      </button>

      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-starlink-white mb-1">{zone.name}</h3>
        <p className="text-sm text-starlink-grey-light">{zone.activity}</p>
      </div>

      {/* Threat Level */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-starlink-grey">Threat Level</span>
          <Badge className={`${getThreatColor(zone.level)} bg-transparent border`}>
            {zone.level.toUpperCase()}
          </Badge>
        </div>
        <Progress 
          value={getThreatProgress(zone.level)} 
          className="h-2"
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-starlink-blue">
            {zone.readinessScore}/100
          </div>
          <div className="text-xs text-starlink-grey">Readiness</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-starlink-white">
            {zone.signals.length}
          </div>
          <div className="text-xs text-starlink-grey">Active Signals</div>
        </div>
      </div>

      {/* Recent Signals */}
      <div>
        <h4 className="text-sm font-medium text-starlink-white mb-2">Recent Signals</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {zone.signals.slice(0, 3).map(signal => (
            <div key={signal.id} className="p-2 rounded bg-starlink-slate/30 border border-starlink-grey/20">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="text-xs">
                  {signal.category}
                </Badge>
                <span className={`w-2 h-2 rounded-full ${
                  signal.severity === 'critical' ? 'bg-red-500' :
                  signal.severity === 'high' ? 'bg-orange-500' :
                  signal.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
              </div>
              <p className="text-xs text-starlink-grey-light line-clamp-2">
                {signal.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow pointer */}
      <div 
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-starlink-slate/80"
      />
    </div>
  );
};

export default ThreatPopup;
