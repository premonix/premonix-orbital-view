
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import UserMenu from '@/components/auth/UserMenu';

const Navigation = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Threat Map', href: '/threat-map' },
    { label: 'Risk by Sector', href: '/risk-by-sector' },
    { label: 'Resilience Toolkit', href: '/resilience-toolkit' },
    { label: 'Reports', href: '/reports' }
  ];

  const aboutItems = [
    { label: 'About', href: '/about' },
    { label: 'Data Sources', href: '/data-sources' }
  ];

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const isAboutActive = () => {
    return location.pathname === '/about' || location.pathname === '/data-sources';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-starlink-grey/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-starlink-blue rounded-sm flex items-center justify-center">
              <span className="text-starlink-dark font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">PREMONIX</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`relative transition-colors duration-200 ${
                  isActiveRoute(item.href) 
                    ? 'text-starlink-white' 
                    : 'text-starlink-grey-light hover:text-starlink-white'
                }`}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
                {(hoveredItem === item.label || isActiveRoute(item.href)) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-starlink-blue animate-pulse" />
                )}
              </Link>
            ))}
            
            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative flex items-center space-x-1 transition-colors duration-200 ${
                    isAboutActive() 
                      ? 'text-starlink-white' 
                      : 'text-starlink-grey-light hover:text-starlink-white'
                  }`}
                  onMouseEnter={() => setHoveredItem('About')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span>About</span>
                  <ChevronDown className="w-4 h-4" />
                  {(hoveredItem === 'About' || isAboutActive()) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-starlink-blue animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-starlink-dark border-starlink-grey/30">
                {aboutItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link
                      to={item.href}
                      className="text-starlink-grey-light hover:text-starlink-white cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-starlink-grey-light hover:text-starlink-white"
                  onClick={() => setShowLoginModal(true)}
                >
                  Log In
                </Button>
                <Button 
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium"
                  onClick={() => setShowRegisterModal(true)}
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Navigation;
