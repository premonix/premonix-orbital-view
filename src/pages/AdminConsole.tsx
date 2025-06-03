
import { useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  Shield, 
  CreditCard, 
  FileText, 
  Beaker, 
  BarChart,
  Lock
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import PermissionGate from '@/components/auth/PermissionGate';
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminOrgsPanel from '@/components/admin/AdminOrgsPanel';
import AdminRolesPanel from '@/components/admin/AdminRolesPanel';
import AdminBillingPanel from '@/components/admin/AdminBillingPanel';
import AdminAuditPanel from '@/components/admin/AdminAuditPanel';
import AdminBetaPanel from '@/components/admin/AdminBetaPanel';
import AdminAnalyticsPanel from '@/components/admin/AdminAnalyticsPanel';

const AdminConsole = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const adminTabs = [
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, component: AdminUsersPanel },
    { id: 'organizations', label: 'Organizations', icon: <Building className="w-4 h-4" />, component: AdminOrgsPanel },
    { id: 'roles', label: 'Roles', icon: <Shield className="w-4 h-4" />, component: AdminRolesPanel },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" />, component: AdminBillingPanel },
    { id: 'audit', label: 'Audit Trail', icon: <FileText className="w-4 h-4" />, component: AdminAuditPanel },
    { id: 'beta', label: 'Beta Access', icon: <Beaker className="w-4 h-4" />, component: AdminBetaPanel },
    { id: 'analytics', label: 'Analytics', icon: <BarChart className="w-4 h-4" />, component: AdminAnalyticsPanel }
  ];

  const ActiveComponent = adminTabs.find(tab => tab.id === activeTab)?.component || AdminUsersPanel;

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <PermissionGate 
            permission="admin_console_access" 
            requiredRole="enterprise"
            fallback={
              <Card className="glass-panel border-red-500/50">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center">
                    <Lock className="w-6 h-6 mr-2" />
                    Access Denied
                  </CardTitle>
                  <CardDescription>
                    This area is restricted to internal PREMONIX administrators only.
                  </CardDescription>
                </CardHeader>
              </Card>
            }
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Admin <span className="text-starlink-blue">Console</span>
                  </h1>
                  <p className="text-starlink-grey-light">
                    Internal platform management and administration
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-red-600 text-white">
                    INTERNAL ONLY
                  </Badge>
                  <Badge className="bg-starlink-blue text-starlink-dark">
                    {user?.role?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Admin Console Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="glass-panel border-starlink-grey/30 w-full grid grid-cols-7">
                {adminTabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center space-x-2 text-xs sm:text-sm"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {adminTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <tab.component />
                </TabsContent>
              ))}
            </Tabs>
          </PermissionGate>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminConsole;
