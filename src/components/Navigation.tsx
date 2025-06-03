
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { label: 'Threat Map', href: '#map' },
    { label: 'Risk by Sector', href: '#sectors' },
    { label: 'Resilience Toolkit', href: '#toolkit' },
    { label: 'Reports', href: '#reports' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-starlink-grey/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-starlink-blue rounded-sm flex items-center justify-center">
            <span className="text-starlink-dark font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">PREMONIX</span>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-starlink-grey-light hover:text-starlink-white transition-colors duration-200"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.label}
              {hoveredItem === item.label && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-starlink-blue animate-pulse" />
              )}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-starlink-grey-light hover:text-starlink-white">
            Log In
          </Button>
          <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium">
            Create Account
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
