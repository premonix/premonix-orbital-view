
const ResilienceToolkit = () => {
  return (
    <svg viewBox="0 0 400 250" className="w-full h-full">
      {/* Background */}
      <rect width="100%" height="100%" fill="rgba(10, 10, 10, 0.9)"/>
      
      {/* Toolkit base/briefcase */}
      <rect x="120" y="140" width="160" height="80" rx="8" fill="rgba(26, 26, 26, 0.9)" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2"/>
      <rect x="125" y="145" width="150" height="5" fill="rgba(0, 180, 216, 0.3)"/>
      
      {/* Handle */}
      <rect x="180" y="130" width="40" height="10" rx="5" fill="none" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="2"/>
      
      {/* Documents/guides floating */}
      <rect x="140" y="100" width="30" height="40" rx="2" fill="rgba(42, 42, 42, 0.9)" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="1">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="3s" repeatCount="indefinite"/>
      </rect>
      <text x="155" y="115" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="7" fontWeight="bold">FAMILY</text>
      <text x="155" y="125" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="6">GUIDE</text>
      
      <rect x="180" y="90" width="30" height="40" rx="2" fill="rgba(42, 42, 42, 0.9)" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite"/>
      </rect>
      <text x="195" y="105" textAnchor="middle" fill="rgba(249, 115, 22, 1)" fontSize="7" fontWeight="bold">SME</text>
      <text x="195" y="115" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="6">CRISIS</text>
      <text x="195" y="125" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="6">PLAN</text>
      
      <rect x="220" y="85" width="30" height="40" rx="2" fill="rgba(42, 42, 42, 0.9)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="1">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.8s" begin="1s" repeatCount="indefinite"/>
      </rect>
      <text x="235" y="100" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="7" fontWeight="bold">CORP</text>
      <text x="235" y="110" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="6">RISK</text>
      <text x="235" y="120" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="6">MGMT</text>
      
      {/* Inside the toolkit - tools and resources */}
      <rect x="135" y="160" width="20" height="15" rx="1" fill="rgba(0, 180, 216, 0.3)" stroke="rgba(0, 180, 216, 0.8)" strokeWidth="1"/>
      <text x="145" y="170" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="6">📋</text>
      
      <rect x="160" y="160" width="20" height="15" rx="1" fill="rgba(249, 115, 22, 0.3)" stroke="rgba(249, 115, 22, 0.8)" strokeWidth="1"/>
      <text x="170" y="170" textAnchor="middle" fill="rgba(249, 115, 22, 1)" fontSize="6">📊</text>
      
      <rect x="185" y="160" width="20" height="15" rx="1" fill="rgba(220, 38, 38, 0.3)" stroke="rgba(220, 38, 38, 0.8)" strokeWidth="1"/>
      <text x="195" y="170" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="6">🛡️</text>
      
      <rect x="210" y="160" width="20" height="15" rx="1" fill="rgba(0, 180, 216, 0.3)" stroke="rgba(0, 180, 216, 0.8)" strokeWidth="1"/>
      <text x="220" y="170" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="6">📞</text>
      
      <rect x="235" y="160" width="20" height="15" rx="1" fill="rgba(249, 115, 22, 0.3)" stroke="rgba(249, 115, 22, 0.8)" strokeWidth="1"/>
      <text x="245" y="170" textAnchor="middle" fill="rgba(249, 115, 22, 1)" fontSize="6">💾</text>
      
      {/* Bottom row */}
      <rect x="135" y="185" width="20" height="15" rx="1" fill="rgba(100, 116, 139, 0.3)" stroke="rgba(100, 116, 139, 0.8)" strokeWidth="1"/>
      <text x="145" y="195" textAnchor="middle" fill="rgba(100, 116, 139, 1)" fontSize="6">🔧</text>
      
      <rect x="160" y="185" width="20" height="15" rx="1" fill="rgba(0, 180, 216, 0.3)" stroke="rgba(0, 180, 216, 0.8)" strokeWidth="1"/>
      <text x="170" y="195" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="6">📱</text>
      
      <rect x="185" y="185" width="20" height="15" rx="1" fill="rgba(249, 115, 22, 0.3)" stroke="rgba(249, 115, 22, 0.8)" strokeWidth="1"/>
      <text x="195" y="195" textAnchor="middle" fill="rgba(249, 115, 22, 1)" fontSize="6">📈</text>
      
      <rect x="210" y="185" width="20" height="15" rx="1" fill="rgba(220, 38, 38, 0.3)" stroke="rgba(220, 38, 38, 0.8)" strokeWidth="1"/>
      <text x="220" y="195" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="6">⚠️</text>
      
      <rect x="235" y="185" width="20" height="15" rx="1" fill="rgba(0, 180, 216, 0.3)" stroke="rgba(0, 180, 216, 0.8)" strokeWidth="1"/>
      <text x="245" y="195" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="6">🗂️</text>
      
      {/* Download arrows */}
      <path d="M 90 180 L 120 160" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
      <path d="M 310 180 L 280 160" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="2" markerEnd="url(#arrowhead)"/>
      
      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 180, 216, 0.6)"/>
        </marker>
      </defs>
      
      {/* Labels */}
      <text x="80" y="195" fill="rgba(148, 163, 184, 1)" fontSize="8" fontFamily="Space Grotesk">DOWNLOAD</text>
      <text x="320" y="195" fill="rgba(148, 163, 184, 1)" fontSize="8" fontFamily="Space Grotesk">DEPLOY</text>
    </svg>
  );
};

export default ResilienceToolkit;
