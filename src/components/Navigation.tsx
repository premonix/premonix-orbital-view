import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mainNavItems, aboutNavItems } from '@/constants/navigation';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { NavigationDropdown } from '@/components/navigation/NavigationDropdown';
import { AuthSection } from '@/components/navigation/AuthSection';
import { useActiveRoute, useNavigationState } from '@/hooks/useNavigation';

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const { isActiveRoute } = useActiveRoute();
  const { hoveredItem, mobileMenuOpen, handleMouseEnter, handleMouseLeave, toggleMobileMenu, closeMobileMenu } = useNavigationState();

  const visibleNavItems = mainNavItems.filter(
    item => !item.authRequired || isAuthenticated
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">PREMONIX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`relative flex items-center space-x-1 transition-colors duration-200 ${
                  isActiveRoute(item.href) 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
                {(hoveredItem === item.label || isActiveRoute(item.href)) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
          
          {/* About Dropdown */}
          <NavigationDropdown label="About" items={aboutNavItems} />
        </div>

        {/* Mobile Navigation & Auth Section */}
        <div className="flex items-center space-x-4">
          <MobileNavigation 
            open={mobileMenuOpen} 
            onOpenChange={toggleMobileMenu} 
          />
          <AuthSection />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
