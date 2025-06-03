
const CustomAlertSystem = () => {
  return (
    <svg viewBox="0 0 400 250" className="w-full h-full">
      {/* Background */}
      <rect width="100%" height="100%" fill="rgba(10, 10, 10, 0.9)"/>
      
      {/* Central device/phone */}
      <rect x="170" y="100" width="60" height="100" rx="8" fill="rgba(26, 26, 26, 0.9)" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2"/>
      <rect x="175" y="110" width="50" height="70" rx="4" fill="rgba(42, 42, 42, 0.8)"/>
      
      {/* Alert notifications */}
      <rect x="175" y="115" width="50" height="15" rx="2" fill="rgba(220, 38, 38, 0.2)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="1">
        <animate attributeName="fill-opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="200" y="125" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="7" fontWeight="bold">CYBER ALERT</text>
      
      <rect x="175" y="135" width="50" height="15" rx="2" fill="rgba(249, 115, 22, 0.2)" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1">
        <animate attributeName="fill-opacity" values="0.2;0.6;0.2" dur="2.5s" begin="0.5s" repeatCount="indefinite"/>
      </rect>
      <text x="200" y="145" textAnchor="middle" fill="rgba(249, 115, 22, 1)" fontSize="7" fontWeight="bold">SUPPLY RISK</text>
      
      <rect x="175" y="155" width="50" height="15" rx="2" fill="rgba(0, 180, 216, 0.2)" stroke="rgba(0, 180, 216, 0.6)" strokeWidth="1">
        <animate attributeName="fill-opacity" values="0.2;0.6;0.2" dur="1.8s" begin="1s" repeatCount="indefinite"/>
      </rect>
      <text x="200" y="165" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="7" fontWeight="bold">INFO UPDATE</text>
      
      {/* Signal waves */}
      <g opacity="0.7">
        {[1, 2, 3].map(i => (
          <circle key={i} cx="200" cy="80" r={20 + i * 15} fill="none" stroke="rgba(0, 180, 216, 0.3)" strokeWidth="2">
            <animate attributeName="r" values={`${20 + i * 15};${40 + i * 15};${20 + i * 15}`} dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </g>
      
      {/* Filter/preference panels */}
      <rect x="50" y="120" width="80" height="60" rx="4" fill="rgba(26, 26, 26, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="90" y="135" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="8" fontFamily="Space Grotesk">PREFERENCES</text>
      
      {/* Checkboxes */}
      <rect x="60" y="145" width="8" height="8" fill="rgba(0, 180, 216, 0.8)" stroke="rgba(0, 180, 216, 1)" strokeWidth="1"/>
      <text x="75" y="152" fill="rgba(148, 163, 184, 1)" fontSize="7">Military</text>
      
      <rect x="60" y="158" width="8" height="8" fill="rgba(249, 115, 22, 0.8)" stroke="rgba(249, 115, 22, 1)" strokeWidth="1"/>
      <text x="75" y="165" fill="rgba(148, 163, 184, 1)" fontSize="7">Cyber</text>
      
      <rect x="60" y="171" width="8" height="8" fill="none" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="1"/>
      <text x="75" y="178" fill="rgba(100, 116, 139, 1)" fontSize="7">Economic</text>
      
      {/* Delivery methods */}
      <rect x="270" y="120" width="80" height="60" rx="4" fill="rgba(26, 26, 26, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="310" y="135" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="8" fontFamily="Space Grotesk">DELIVERY</text>
      
      {/* Icons */}
      <circle cx="285" cy="150" r="8" fill="rgba(0, 180, 216, 0.2)" stroke="rgba(0, 180, 216, 1)" strokeWidth="1"/>
      <text x="285" y="154" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="8">📱</text>
      
      <circle cx="310" cy="150" r="8" fill="rgba(0, 180, 216, 0.2)" stroke="rgba(0, 180, 216, 1)" strokeWidth="1"/>
      <text x="310" y="154" textAnchor="middle" fill="rgba(0, 180, 216, 1)" fontSize="8">✉️</text>
      
      <circle cx="335" cy="150" r="8" fill="rgba(100, 116, 139, 0.2)" stroke="rgba(100, 116, 139, 1)" strokeWidth="1"/>
      <text x="335" y="154" textAnchor="middle" fill="rgba(100, 116, 139, 1)" fontSize="8">🔔</text>
      
      {/* Connection lines */}
      <line x1="130" y1="150" x2="170" y2="140" stroke="rgba(0, 180, 216, 0.4)" strokeWidth="2" strokeDasharray="3,3">
        <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="230" y1="140" x2="270" y2="150" stroke="rgba(0, 180, 216, 0.4)" strokeWidth="2" strokeDasharray="3,3">
        <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite"/>
      </line>
    </svg>
  );
};

export default CustomAlertSystem;
