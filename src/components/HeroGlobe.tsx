import { useEffect, useRef, useState } from 'react';

const HeroGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const threatZones = [
    { id: 1, cx: 280, cy: 180, intensity: 'high', delay: 0 },
    { id: 2, cx: 320, cy: 220, intensity: 'medium', delay: 1 },
    { id: 3, cx: 200, cy: 200, intensity: 'low', delay: 2 },
    { id: 4, cx: 380, cy: 160, intensity: 'high', delay: 0.5 },
    { id: 5, cx: 240, cy: 240, intensity: 'medium', delay: 1.5 },
    { id: 6, cx: 350, cy: 260, intensity: 'low', delay: 2.5 },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-gradient-to-br from-starlink-dark via-starlink-slate to-starlink-dark overflow-hidden rounded-2xl border border-starlink-grey/20"
    >
      {/* Background grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Main SVG Globe */}
      <svg 
        viewBox="0 0 600 600" 
        className="w-full h-full"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
        }}
      >
        {/* Definitions for gradients and effects */}
        <defs>
          {/* Globe gradient */}
          <radialGradient id="globeGradient" cx="40%" cy="30%">
            <stop offset="0%" stopColor="rgba(0, 180, 216, 0.3)" />
            <stop offset="50%" stopColor="rgba(0, 180, 216, 0.15)" />
            <stop offset="100%" stopColor="rgba(0, 180, 216, 0.05)" />
          </radialGradient>
          
          {/* Continent gradient */}
          <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(42, 42, 42, 0.9)" />
            <stop offset="100%" stopColor="rgba(26, 26, 26, 0.7)" />
          </linearGradient>
          
          {/* Threat zone gradients */}
          <radialGradient id="threatHigh" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(220, 38, 38, 0.9)" />
            <stop offset="50%" stopColor="rgba(220, 38, 38, 0.3)" />
            <stop offset="100%" stopColor="rgba(220, 38, 38, 0.05)" />
          </radialGradient>
          
          <radialGradient id="threatMedium" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(249, 115, 22, 0.9)" />
            <stop offset="50%" stopColor="rgba(249, 115, 22, 0.3)" />
            <stop offset="100%" stopColor="rgba(249, 115, 22, 0.05)" />
          </radialGradient>
          
          <radialGradient id="threatLow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(0, 180, 216, 0.9)" />
            <stop offset="50%" stopColor="rgba(0, 180, 216, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 180, 216, 0.05)" />
          </radialGradient>

          {/* Glow filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Globe base */}
        <circle 
          cx="300" 
          cy="300" 
          r="250"
          fill="url(#globeGradient)"
          stroke="rgba(0, 180, 216, 0.4)"
          strokeWidth="2"
          filter="url(#glow)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 300 300;360 300 300"
            dur="60s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Globe wireframe lines - Longitude */}
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={`long-${i}`}
            cx="300"
            cy="300"
            rx="250"
            ry={250 * Math.sin((i * 15 * Math.PI) / 180)}
            fill="none"
            stroke="rgba(0, 180, 216, 0.2)"
            strokeWidth="1"
            transform={`rotate(${i * 15} 300 300)`}
            opacity="0.6"
          />
        ))}

        {/* Globe wireframe lines - Latitude */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={`lat-${i}`}
            cx="300"
            cy="300"
            r={250 * Math.sin(((i + 1) * 22.5 * Math.PI) / 180)}
            fill="none"
            stroke="rgba(0, 180, 216, 0.2)"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}

        {/* Continent shapes */}
        <g transform="rotate(0 300 300)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 300 300;360 300 300"
            dur="120s"
            repeatCount="indefinite"
          />
          
          {/* North America */}
          <path
            d="M 180 200 Q 220 180 260 200 Q 240 250 200 240 Q 160 220 180 200 Z"
            fill="url(#continentGradient)"
            stroke="rgba(0, 180, 216, 0.5)"
            strokeWidth="1"
          />
          
          {/* Europe/Asia */}
          <path
            d="M 320 180 Q 400 170 450 200 Q 430 240 380 250 Q 340 240 320 180 Z"
            fill="url(#continentGradient)"
            stroke="rgba(0, 180, 216, 0.5)"
            strokeWidth="1"
          />
          
          {/* Africa */}
          <path
            d="M 280 280 Q 320 270 340 320 Q 320 380 280 370 Q 260 340 280 280 Z"
            fill="url(#continentGradient)"
            stroke="rgba(0, 180, 216, 0.5)"
            strokeWidth="1"
          />
          
          {/* Australia */}
          <path
            d="M 380 380 Q 420 370 440 390 Q 420 410 390 400 Q 370 390 380 380 Z"
            fill="url(#continentGradient)"
            stroke="rgba(0, 180, 216, 0.5)"
            strokeWidth="1"
          />
        </g>

        {/* Threat zones with pulsing effects */}
        {threatZones.map((zone) => (
          <g key={zone.id}>
            {/* Outer glow ring */}
            <circle
              cx={zone.cx}
              cy={zone.cy}
              r="30"
              fill={`url(#threat${zone.intensity === 'high' ? 'High' : zone.intensity === 'medium' ? 'Medium' : 'Low'})`}
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="30;50;30"
                dur="3s"
                begin={`${zone.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="3s"
                begin={`${zone.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Middle ring */}
            <circle
              cx={zone.cx}
              cy={zone.cy}
              r="15"
              fill={`url(#threat${zone.intensity === 'high' ? 'High' : zone.intensity === 'medium' ? 'Medium' : 'Low'})`}
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values="15;25;15"
                dur="2s"
                begin={`${zone.delay + 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Core threat indicator */}
            <circle
              cx={zone.cx}
              cy={zone.cy}
              r="5"
              fill={zone.intensity === 'high' ? '#dc2626' : zone.intensity === 'medium' ? '#f97316' : '#00b4d8'}
              filter="url(#glow)"
            >
              <animate
                attributeName="r"
                values="5;8;5"
                dur="1.5s"
                begin={`${zone.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Data connection lines */}
        <g stroke="rgba(0, 180, 216, 0.4)" strokeWidth="2" fill="none">
          <path
            d="M 100 100 Q 200 150 300 100 Q 400 150 500 100"
            strokeDasharray="10,5"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;15"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          
          <path
            d="M 150 500 Q 250 450 350 500 Q 450 450 550 500"
            strokeDasharray="8,4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;12"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Satellite orbits */}
        <g fill="none" stroke="rgba(0, 180, 216, 0.3)" strokeWidth="1">
          <ellipse cx="300" cy="300" rx="300" ry="100">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 300 300;360 300 300"
              dur="15s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="300" cy="300" rx="280" ry="120" transform="rotate(45 300 300)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="45 300 300;405 300 300"
              dur="18s"
              repeatCount="indefinite"
            />
          </ellipse>
        </g>

        {/* Floating satellites */}
        <circle cx="450" cy="150" r="3" fill="#00b4d8" filter="url(#glow)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 300 300;360 300 300"
            dur="15s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle cx="200" cy="450" r="3" fill="#00b4d8" filter="url(#glow)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 300 300;360 300 300"
            dur="18s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Floating UI elements */}
      <div className="absolute top-8 left-8 glass-panel p-4 rounded-lg border border-starlink-grey/30">
        <div className="text-xs text-starlink-grey-light mb-2 font-space">GLOBAL THREAT STATUS</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-starlink-red animate-pulse"></div>
            <span className="text-xs text-starlink-white">Critical: 4</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-starlink-orange animate-pulse"></div>
            <span className="text-xs text-starlink-white">High: 12</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-starlink-blue animate-pulse"></div>
            <span className="text-xs text-starlink-white">Medium: 28</span>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 glass-panel p-4 rounded-lg border border-starlink-grey/30">
        <div className="text-xs text-starlink-grey-light mb-2 font-space">REAL-TIME COVERAGE</div>
        <div className="text-2xl font-bold text-starlink-blue">10,847</div>
        <div className="text-xs text-starlink-grey-light">Active signals</div>
      </div>

      <div className="absolute bottom-8 left-8 glass-panel p-4 rounded-lg border border-starlink-grey/30">
        <div className="text-xs text-starlink-grey-light mb-2 font-space">PREDICTION ACCURACY</div>
        <div className="text-2xl font-bold text-starlink-blue">94.2%</div>
        <div className="text-xs text-starlink-grey-light">Last 30 days</div>
      </div>

      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-starlink-blue/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default HeroGlobe;