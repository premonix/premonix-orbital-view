import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useActiveRoute = () => {
  const location = useLocation();

  const isActiveRoute = useCallback((href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  const isAboutActive = useCallback(() => {
    return ['/about', '/data-sources', '/contact'].includes(location.pathname);
  }, [location.pathname]);

  return { isActiveRoute, isAboutActive, currentPath: location.pathname };
};

export const useNavigationState = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = useCallback((item: string) => {
    setHoveredItem(item);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return {
    hoveredItem,
    mobileMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
    toggleMobileMenu,
    closeMobileMenu
  };
};

export const useDashboardNavigation = (defaultTab: string = 'overview') => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const setTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    sidebarCollapsed,
    setActiveTab: setTab,
    toggleSidebar
  };
};