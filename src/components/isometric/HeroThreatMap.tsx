
const HeroThreatMap = () => {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Background grid */}
      <defs>
        <pattern id="heroGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 180, 216, 0.1)" strokeWidth="1"/>
        </pattern>
        <radialGradient id="glowRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(220, 38, 38, 0.8)"/>
          <stop offset="100%" stopColor="rgba(220, 38, 38, 0.1)"/>
        </radialGradient>
        <radialGradient id="glowOrange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(249, 115, 22, 0.8)"/>
          <stop offset="100%" stopColor="rgba(249, 115, 22, 0.1)"/>
        </radialGradient>
        <radialGradient id="glowBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 180, 216, 0.8)"/>
          <stop offset="100%" stopColor="rgba(0, 180, 216, 0.1)"/>
        </radialGradient>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#heroGrid)" />
      
      {/* World map outline (simplified isometric) */}
      <path d="M 100 200 Q 150 180 200 190 Q 250 185 300 195 Q 350 200 400 190 Q 450 185 500 200 Q 480 240 450 250 Q 400 260 350 250 Q 300 255 250 245 Q 200 250 150 240 Q 120 230 100 200 Z" 
            fill="rgba(26, 26, 26, 0.6)" stroke="rgba(0, 180, 216, 0.3)" strokeWidth="2"/>
      
      {/* Continental shapes */}
      <path d="M 150 210 Q 180 200 210 215 Q 190 230 160 225 Z" 
            fill="rgba(42, 42, 42, 0.8)" stroke="rgba(0, 180, 216, 0.4)" strokeWidth="1"/>
      <path d="M 250 205 Q 280 195 310 210 Q 295 225 265 220 Z" 
            fill="rgba(42, 42, 42, 0.8)" stroke="rgba(0, 180, 216, 0.4)" strokeWidth="1"/>
      <path d="M 350 200 Q 380 190 410 205 Q 395 220 365 215 Z" 
            fill="rgba(42, 42, 42, 0.8)" stroke="rgba(0, 180, 216, 0.4)" strokeWidth="1"/>
      
      {/* Threat zones with pulsing effects */}
      <circle cx="180" cy="215" r="25" fill="url(#glowRed)">
        <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="280" cy="210" r="20" fill="url(#glowOrange)">
        <animate attributeName="r" values="20;30;20" dur="2.5s" begin="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="380" cy="205" r="15" fill="url(#glowBlue)">
        <animate attributeName="r" values="15;25;15" dur="2s" begin="1s" repeatCount="indefinite"/>
      </circle>
      
      {/* Threat indicators */}
      <circle cx="180" cy="215" r="4" fill="#dc2626">
        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="280" cy="210" r="3" fill="#f97316">
        <animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="380" cy="205" r="2" fill="#00b4d8">
        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* UI panels floating above */}
      <rect x="50" y="50" width="120" height="60" rx="6" fill="rgba(26, 26, 26, 0.9)" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="4s" repeatCount="indefinite"/>
      </rect>
      <text x="110" y="70" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="10" fontFamily="Space Grotesk">THREAT LAYERS</text>
      <rect x="60" y="75" width="15" height="8" fill="rgba(220, 38, 38, 0.8)"/>
      <text x="80" y="82" fill="rgba(148, 163, 184, 1)" fontSize="8">Military</text>
      <rect x="60" y="88" width="15" height="8" fill="rgba(249, 115, 22, 0.8)"/>
      <text x="80" y="95" fill="rgba(148, 163, 184, 1)" fontSize="8">Cyber</text>
      <rect x="60" y="101" width="15" height="8" fill="rgba(0, 180, 216, 0.8)"/>
      <text x="80" y="108" fill="rgba(148, 163, 184, 1)" fontSize="8">Economic</text>
      
      {/* Timeline control */}
      <rect x="430" y="320" width="140" height="50" rx="6" fill="rgba(26, 26, 26, 0.9)" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="3.5s" begin="1s" repeatCount="indefinite"/>
      </rect>
      <text x="500" y="335" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="9" fontFamily="Space Grotesk">TIMELINE</text>
      <line x1="445" y1="350" x2="555" y2="350" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="2"/>
      <circle cx="480" cy="350" r="4" fill="rgba(0, 180, 216, 1)">
        <animate attributeName="cx" values="445;555;445" dur="8s" repeatCount="indefinite"/>
      </circle>
      <text x="445" y="365" fill="rgba(148, 163, 184, 1)" fontSize="7">NOW</text>
      <text x="540" y="365" fill="rgba(148, 163, 184, 1)" fontSize="7">+30 DAYS</text>
      
      {/* Alert popup */}
      <rect x="200" y="80" width="140" height="70" rx="6" fill="rgba(220, 38, 38, 0.1)" stroke="rgba(220, 38, 38, 0.8)" strokeWidth="2">
        <animate attributeName="fill-opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="3s" begin="0.5s" repeatCount="indefinite"/>
      </rect>
      <text x="270" y="100" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="10" fontWeight="bold">⚠️ HIGH ALERT</text>
      <text x="270" y="115" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="8">Cyber Incident Detected</text>
      <text x="270" y="128" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="8">Eastern Europe</text>
      <text x="270" y="141" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="9" fontWeight="bold">Risk Level: 92%</text>
      
      {/* Data streams */}
      <path d="M 100 100 Q 150 120 200 100 Q 250 110 300 95 Q 350 105 400 90" 
            fill="none" stroke="rgba(0, 180, 216, 0.4)" strokeWidth="2" strokeDasharray="8,4">
        <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite"/>
      </path>
      
      {/* Data source indicators */}
      <circle cx="100" cy="100" r="3" fill="rgba(0, 180, 216, 1)">
        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="400" cy="90" r="3" fill="rgba(0, 180, 216, 1)">
        <animate attributeName="r" values="3;6;3" dur="2s" begin="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

export default HeroThreatMap;
