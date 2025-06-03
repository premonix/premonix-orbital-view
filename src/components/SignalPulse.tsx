
import { useState, useEffect } from 'react';
import { ThreatSignal } from '@/types/threat';

interface SignalPulseProps {
  signal: ThreatSignal;
  x: number;
  y: number;
}

const SignalPulse = ({ signal, x, y }: SignalPulseProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

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
    <div
      className={`absolute w-4 h-4 rounded-full ${getSeverityColor(signal.severity)} animate-ping opacity-75`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className={`absolute inset-0 rounded-full ${getSeverityColor(signal.severity)} animate-pulse`} />
    </div>
  );
};

export default SignalPulse;
