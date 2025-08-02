
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Lock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import PermissionGate from '@/components/auth/PermissionGate';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useDashboardNavigation } from '@/hooks/useNavigation';
import { adminTabs } from '@/constants/adminTabs';
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminOrgsPanel from '@/components/admin/AdminOrgsPanel';
import AdminRolesPanel from '@/components/admin/AdminRolesPanel';
import AdminBillingPanel from '@/components/admin/AdminBillingPanel';
import AdminAuditPanel from '@/components/admin/AdminAuditPanel';
import AdminBetaPanel from '@/components/admin/AdminBetaPanel';
import AdminAnalyticsPanel from '@/components/admin/AdminAnalyticsPanel';
import SystemMonitoringPanel from '@/components/admin/SystemMonitoringPanel';

const AdminConsole = () => {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useDashboardNavigation('monitoring');

  const componentMap = {
    users: AdminUsersPanel,
    organizations: AdminOrgsPanel,
    roles: AdminRolesPanel,
    billing: AdminBillingPanel,
    audit: AdminAuditPanel,
    beta: AdminBetaPanel,
    analytics: AdminAnalyticsPanel,
    monitoring: SystemMonitoringPanel,
  };

  const ActiveComponent = componentMap[activeTab as keyof typeof componentMap] || SystemMonitoringPanel;
  const currentTab = adminTabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <PermissionGate 
          permission="admin_console_access" 
          requiredRole="enterprise_admin"
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center">
                    <Lock className="w-6 h-6 mr-2" />
                    Access Denied
                  </CardTitle>
                  <CardDescription>
                    This area is restricted to internal PREMONIX administrators only.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          }
        >
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              
              <SidebarInset className="flex-1">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
                  <SidebarTrigger className="-ml-1" />
                  <AdminBreadcrumbs activeTab={activeTab} />
                </header>
                
                <div className="flex-1 p-6">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold flex items-center space-x-3">
                          {currentTab && <currentTab.icon className="w-8 h-8" />}
                          <span>{currentTab?.label || 'Admin Console'}</span>
                        </h1>
                        <p className="text-muted-foreground mt-2">
                          {currentTab?.description || 'System administration and management'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="destructive">
                          INTERNAL ONLY
                        </Badge>
                        <Badge variant="secondary">
                          {user?.role?.toUpperCase() || 'ADMIN'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Active Component */}
                  <div className="space-y-6">
                    <ActiveComponent />
                  </div>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </PermissionGate>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminConsole;
