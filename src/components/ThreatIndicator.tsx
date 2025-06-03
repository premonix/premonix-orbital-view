
import { useState, useEffect } from 'react';

const ThreatIndicator = () => {
  const [riskLevel, setRiskLevel] = useState(85);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskLevel(prev => prev + (Math.random() - 0.5) * 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: number) => {
    if (level > 80) return 'text-starlink-red';
    if (level > 60) return 'text-starlink-orange';
    return 'text-starlink-blue';
  };

  const getRiskBgColor = (level: number) => {
    if (level > 80) return 'bg-starlink-red/20 border-starlink-red/50';
    if (level > 60) return 'bg-starlink-orange/20 border-starlink-orange/50';
    return 'bg-starlink-blue/20 border-starlink-blue/50';
  };

  return (
    <div className="fixed top-20 right-6 z-40">
      <div className={`glass-panel rounded-lg p-4 min-w-[280px] ${getRiskBgColor(riskLevel)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-starlink-grey-light">LIVE THREAT LEVEL</span>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse-glow' : ''} bg-starlink-red`} />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Taiwan Strait</span>
            <span className={`text-2xl font-bold ${getRiskColor(riskLevel)}`}>
              {Math.round(riskLevel)}/100
            </span>
          </div>
          
          <div className="w-full bg-starlink-slate-light rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                riskLevel > 80 ? 'bg-starlink-red' : 
                riskLevel > 60 ? 'bg-starlink-orange' : 'bg-starlink-blue'
              }`}
              style={{ width: `${Math.min(riskLevel, 100)}%` }}
            />
          </div>
          
          <p className="text-xs text-starlink-grey-light">
            PLA naval activity surge detected
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreatIndicator;
