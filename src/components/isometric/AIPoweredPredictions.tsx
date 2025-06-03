
const AIPoweredPredictions = () => {
  return (
    <svg viewBox="0 0 400 250" className="w-full h-full">
      {/* Background */}
      <rect width="100%" height="100%" fill="rgba(10, 10, 10, 0.9)"/>
      
      {/* Neural network base */}
      <rect x="120" y="120" width="160" height="80" rx="8" fill="rgba(26, 26, 26, 0.9)" stroke="rgba(0, 180, 216, 0.3)" strokeWidth="2"/>
      
      {/* Neural nodes layer 1 */}
      <circle cx="140" cy="140" r="6" fill="rgba(0, 180, 216, 0.8)"/>
      <circle cx="140" cy="160" r="6" fill="rgba(0, 180, 216, 0.8)"/>
      <circle cx="140" cy="180" r="6" fill="rgba(0, 180, 216, 0.8)"/>
      
      {/* Neural nodes layer 2 */}
      <circle cx="200" cy="135" r="8" fill="rgba(249, 115, 22, 0.8)"/>
      <circle cx="200" cy="160" r="8" fill="rgba(249, 115, 22, 0.8)"/>
      <circle cx="200" cy="185" r="8" fill="rgba(249, 115, 22, 0.8)"/>
      
      {/* Neural nodes layer 3 */}
      <circle cx="260" cy="150" r="10" fill="rgba(220, 38, 38, 0.8)"/>
      <circle cx="260" cy="170" r="10" fill="rgba(220, 38, 38, 0.8)"/>
      
      {/* Connections */}
      {[140, 160, 180].map((y1, i) => 
        [135, 160, 185].map((y2, j) => (
          <line key={`${i}-${j}`} x1="146" y1={y1} x2="194" y2={y2} 
                stroke="rgba(0, 180, 216, 0.4)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite"/>
          </line>
        ))
      )}
      
      {[135, 160, 185].map((y1, i) => 
        [150, 170].map((y2, j) => (
          <line key={`layer2-${i}-${j}`} x1="208" y1={y1} x2="252" y2={y2} 
                stroke="rgba(249, 115, 22, 0.4)" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite"/>
          </line>
        ))
      )}
      
      {/* Prediction output */}
      <rect x="300" y="140" width="60" height="30" rx="4" fill="rgba(42, 42, 42, 0.9)" stroke="rgba(220, 38, 38, 0.6)" strokeWidth="2"/>
      <text x="330" y="151" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="7" fontFamily="Space Grotesk">PREDICTION</text>
      <text x="330" y="163" textAnchor="middle" fill="rgba(220, 38, 38, 1)" fontSize="9" fontWeight="bold">87% RISK</text>
      
      {/* Data input streams */}
      <rect x="40" y="60" width="50" height="20" rx="2" fill="rgba(42, 42, 42, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="65" y="73" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="7">GDELT</text>
      
      <rect x="40" y="90" width="50" height="20" rx="2" fill="rgba(42, 42, 42, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="65" y="103" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="7">ACLED</text>
      
      <rect x="40" y="120" width="50" height="20" rx="2" fill="rgba(42, 42, 42, 0.8)" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1"/>
      <text x="65" y="133" textAnchor="middle" fill="rgba(148, 163, 184, 1)" fontSize="7">SOCIAL</text>
      
      {/* Data flow lines */}
      <path d="M 90 70 Q 110 75 134 140" fill="none" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2" strokeDasharray="3,3">
        <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite"/>
      </path>
      <path d="M 90 100 Q 110 110 134 160" fill="none" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2" strokeDasharray="3,3">
        <animate attributeName="stroke-dashoffset" values="0;6" dur="1.2s" repeatCount="indefinite"/>
      </path>
      <path d="M 90 130 Q 110 135 134 180" fill="none" stroke="rgba(0, 180, 216, 0.5)" strokeWidth="2" strokeDasharray="3,3">
        <animate attributeName="stroke-dashoffset" values="0;6" dur="0.8s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
};

export default AIPoweredPredictions;
