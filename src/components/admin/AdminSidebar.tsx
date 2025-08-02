import { useMemo } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminTabs, adminTabGroups } from '@/constants/adminTabs';
import { Menu } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { state } = useSidebar();
  
  const groupedTabs = useMemo(() => {
    return Object.entries(adminTabGroups).map(([groupKey, groupData]) => ({
      ...groupData,
      key: groupKey,
      tabs: adminTabs.filter(tab => tab.group === groupKey)
    }));
  }, []);

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="font-semibold text-lg">Admin Console</h1>
              <p className="text-sm text-muted-foreground">System Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groupedTabs.map((group) => (
          <SidebarGroup key={group.key}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <SidebarMenuItem key={tab.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(tab.id)}
                        isActive={isActive}
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4" />
                        {state !== "collapsed" && (
                          <>
                            <span>{tab.label}</span>
                            {/* Add notification badges here if needed */}
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};