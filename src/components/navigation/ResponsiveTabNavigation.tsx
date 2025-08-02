import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavGroup } from '@/constants/navigation';

interface ResponsiveTabNavigationProps {
  groups: NavGroup[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCounts?: Record<string, number>;
}

export const ResponsiveTabNavigation = ({ 
  groups, 
  activeTab, 
  onTabChange,
  unreadCounts = {}
}: ResponsiveTabNavigationProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const allTabs = groups.flatMap(group => group.items);
  const activeTabData = allTabs.find(tab => tab.href === activeTab);

  if (isMobile) {
    return (
      <div className="w-full">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between mb-4"
            >
              <div className="flex items-center space-x-2">
                {activeTabData?.icon && <activeTabData.icon className="w-4 h-4" />}
                <span>{activeTabData?.label || 'Select Tab'}</span>
              </div>
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh]">
            <div className="space-y-6 py-4">
              {groups.map((group) => (
                <div key={group.label} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-2">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((tab) => {
                      const Icon = tab.icon;
                      const unreadCount = unreadCounts[tab.href] || 0;
                      
                      return (
                        <Button
                          key={tab.href}
                          variant={activeTab === tab.href ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => {
                            onTabChange(tab.href);
                            setMobileNavOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-2 w-full">
                            {Icon && <Icon className="w-4 h-4" />}
                            <span>{tab.label}</span>
                            {unreadCount > 0 && (
                              <span className="ml-auto bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full bg-background/50 backdrop-blur" style={{ gridTemplateColumns: `repeat(${allTabs.length}, 1fr)` }}>
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          const unreadCount = unreadCounts[tab.href] || 0;
          
          return (
            <TabsTrigger 
              key={tab.href} 
              value={tab.href} 
              className="flex items-center space-x-2 data-[state=active]:bg-accent"
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{tab.label}</span>
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-xs min-w-[1.25rem] text-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};