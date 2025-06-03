
const GlobalThreatIntelligence = () => {
  return (
    <svg viewBox="0 0 400 250" className="w-full h-full">
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 180, 216, 0.1)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Globe base */}
      <ellipse cx="200" cy="180" rx="80" ry="40" fill="rgba(0, 180, 216, 0.1)" stroke="rgba(0, 180, 216, 0.3)" strokeWidth="2"/>
      
      {/* Globe sphere */}
      <circle cx="200" cy="140" r="60" fill="rgba(26, 26, 26, 0.9)" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2"/>
      
      {/* Continental outlines */}
      <path d="M 160 120 Q 180 110 200 125 Q 220 115 240 130 Q 230 145 210 150 Q 185 155 160 140 Z" 
            fill="rgba(0, 180, 216, 0.2)" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="1"/>
      
      {/* Threat hotspots */}
      <circle cx="180" cy="130" r="4" fill="#dc2626" className="animate-pulse">
        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="220" cy="145" r="3" fill="#f97316" className="animate-pulse">
        <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="190" cy="155" r="2" fill="#00b4d8" className="animate-pulse">
        <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite"/>
      </circle>
      
      {/* Data streams */}
      <path d="M 120 80 Q 160 90 200 70 Q 240 85 280 75" 
            fill="none" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="2" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite"/>
      </path>
      
      {/* Floating UI panels */}
      <rect x="50" y="50" width="80" height="40" rx="4" fill="rgba(42, 42, 42, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="90" y="65" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="8" fontFamily="Space Grotesk">MILITARY</text>
      <text x="90" y="78" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="10" fontWeight="bold">ACTIVE</text>
      
      <rect x="270" y="40" width="80" height="40" rx="4" fill="rgba(42, 42, 42, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="310" y="55" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="8" fontFamily="Space Grotesk">CYBER</text>
      <text x="310" y="68" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="10" fontWeight="bold">HIGH RISK</text>
    </svg>
  );
};

export default GlobalThreatIntelligence;
