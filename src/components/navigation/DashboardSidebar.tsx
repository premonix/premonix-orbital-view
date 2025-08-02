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
import { Badge } from "@/components/ui/badge";
import { dashboardNavGroups } from '@/constants/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCounts?: Record<string, number>;
}

export const DashboardSidebar = ({ 
  activeTab, 
  onTabChange, 
  unreadCounts = {} 
}: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const { user } = useAuth();

  // Filter navigation groups based on user permissions
  const getVisibleNavGroups = () => {
    return dashboardNavGroups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        // Show admin console only for super admin users
        if (item.href === 'admin') {
          return (user as any)?.role === 'premonix_super_user';
        }
        return !item.authRequired || user;
      })
    })).filter(group => group.items.length > 0);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="font-semibold text-lg">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Threat Intelligence</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {getVisibleNavGroups().map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.href;
                  const unreadCount = unreadCounts[item.href] || 0;
                  
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(item.href)}
                        isActive={isActive}
                        className="w-full justify-start"
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {state !== "collapsed" && (
                          <div className="flex items-center justify-between w-full">
                            <span>{item.label}</span>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
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