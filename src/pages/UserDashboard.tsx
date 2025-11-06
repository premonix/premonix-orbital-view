import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ThreatOverviewWidget } from '@/components/dashboard/ThreatOverviewWidget';
import { RecentAlertsWidget } from '@/components/dashboard/RecentAlertsWidget';
import { ThreatMapWidget } from '@/components/dashboard/ThreatMapWidget';
import { AnalyticsWidget } from '@/components/dashboard/AnalyticsWidget';
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { ResilienceWidget } from '@/components/dashboard/ResilienceWidget';
import { ResilienceToolkitWidget } from '@/components/dashboard/ResilienceToolkitWidget';
import { DecisionSupportWidget } from '@/components/dashboard/DecisionSupportWidget';
import { EmailPreferencesWidget } from '@/components/dashboard/EmailPreferencesWidget';
import { DisruptionOSModulesWidget } from '@/components/dashboard/DisruptionOSModulesWidget';
import { ExecutiveBriefingWidget } from '@/components/dashboard/ExecutiveBriefingWidget';
import { ThreatWatchlistWidget } from '@/components/dashboard/ThreatWatchlistWidget';
import { SuperAdminWidget } from '@/components/dashboard/SuperAdminWidget';
import { DataSourcesWidget } from '@/components/dashboard/DataSourcesWidget';
import { RealTimeThreatStream } from '@/components/dashboard/RealTimeThreatStream';
import { AIThreatAnalysisWidget } from '@/components/dashboard/AIThreatAnalysisWidget';
import { PersonalizedThreatWidget } from '@/components/dashboard/PersonalizedThreatWidget';
import { EnhancedRealTimeStream } from '@/components/dashboard/EnhancedRealTimeStream';
import { AIReportGenerator } from '@/components/dashboard/AIReportGenerator';
import { FullDisruptionOSDashboard } from '@/components/dashboard/FullDisruptionOSDashboard';
import { OpsLensWidget } from '@/components/dashboard/OpsLensWidget';
import { SignalGraphWidget } from '@/components/dashboard/SignalGraphWidget';
import { EnhancedBriefingWidget } from '@/components/dashboard/EnhancedBriefingWidget';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { AuthSection } from '@/components/navigation/AuthSection';
import { useRealTime, RealTimeStatus } from '@/contexts/RealTimeContext';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { Settings, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDashboardNavigation } from '@/hooks/useNavigation';

interface DashboardPreferences {
  id: string;
  dashboard_layout: any;
  location_preferences: any;
  alert_preferences: any;
  theme_preferences: any;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasCompletedOnboarding, isLoading } = useOnboardingStatus();

  // Redirect to onboarding if user hasn't completed it (with bypass option)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const skipOnboarding = urlParams.get('skip') === 'true';
    
    if (user && !isLoading && !hasCompletedOnboarding && !skipOnboarding) {
      navigate('/onboarding');
    }
  }, [user, hasCompletedOnboarding, isLoading, navigate]);
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<DashboardPreferences | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [threatSignals, setThreatSignals] = useState<any[]>([]);
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { activeTab, setActiveTab } = useDashboardNavigation('overview');

  useEffect(() => {
    if (user && user.id) {
      fetchDashboardData();
      trackDashboardVisit();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user || !user.id || typeof user.id !== 'string') {
      console.warn('Invalid user or user ID:', user);
      setLoading(false);
      return;
    }

    try {
      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_dashboard_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error fetching preferences:', prefsError);
      } else if (prefsData) {
        setPreferences(prefsData);
      } else {
        // Create default preferences
        await createDefaultPreferences();
      }

      // Fetch threat signals
      const { data: threatsData, error: threatsError } = await supabase
        .from('threat_signals')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (threatsError) {
        console.error('Error fetching threats:', threatsError);
      } else {
        setThreatSignals(threatsData || []);
      }

      // Fetch user alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('user_alerts')
        .select(`
          *,
          threat_signals(*)
        `)
        .eq('user_id', user.id)
        .order('triggered_at', { ascending: false })
        .limit(20);

      if (alertsError) {
        console.error('Error fetching alerts:', alertsError);
      } else {
        setUserAlerts(alertsData || []);
      }

      // Fetch analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('user_dashboard_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError);
      } else {
        setAnalytics(analyticsData || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    const defaultPrefs = {
      user_id: user.id,
      dashboard_layout: {
        widgets: [
          { id: 'threat-overview', type: 'threat-overview', position: { x: 0, y: 0, w: 6, h: 4 } },
          { id: 'recent-alerts', type: 'recent-alerts', position: { x: 6, y: 0, w: 6, h: 4 } },
          { id: 'threat-map', type: 'threat-map', position: { x: 0, y: 4, w: 12, h: 6 } }
        ]
      },
      location_preferences: { monitored_locations: [], radius_km: 100 },
      alert_preferences: { 
        categories: ['Military', 'Cyber', 'Economic'], 
        severity_threshold: 'medium', 
        email_enabled: true, 
        push_enabled: false 
      },
      theme_preferences: { theme: 'dark', compact_mode: false }
    };

    const { data, error } = await supabase
      .from('user_dashboard_preferences')
      .insert(defaultPrefs)
      .select()
      .single();

    if (error) {
      console.error('Error creating default preferences:', error);
    } else {
      setPreferences(data);
    }
  };

  const trackDashboardVisit = async () => {
    if (!user) return;

    try {
      await supabase.rpc('update_dashboard_analytics', {
        p_user_id: user.id,
        p_action: 'dashboard_visit'
      });
    } catch (error) {
      console.error('Error tracking dashboard visit:', error);
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      await supabase
        .from('user_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      setUserAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const getThreatSummary = () => {
    const last24h = threatSignals.filter(signal => 
      new Date(signal.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const bySeverity = {
      critical: last24h.filter(s => s.severity === 'critical').length,
      high: last24h.filter(s => s.severity === 'high').length,
      medium: last24h.filter(s => s.severity === 'medium').length,
      low: last24h.filter(s => s.severity === 'low').length,
    };

    const byCategory = last24h.reduce((acc, signal) => {
      acc[signal.category] = (acc[signal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { last24h: last24h.length, bySeverity, byCategory };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-starlink-dark text-starlink-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-starlink-grey-light">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-starlink-dark text-starlink-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-starlink-blue"></div>
          <p className="mt-4 text-starlink-grey-light">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const threatSummary = getThreatSummary();
  const unreadAlerts = userAlerts.filter(alert => !alert.is_read).length;

  // Check if user is super admin - check both role field and user_roles table data
  const isSuperAdmin = (user as any)?.role === 'premonix_super_user';

  const unreadCounts = {
    alerts: unreadAlerts,
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            unreadCounts={unreadCounts}
          />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
              <SidebarTrigger className="-ml-1" />
              
              {/* Real-Time Status */}
              <div className="flex-1">
                <RealTimeStatus />
              </div>
              
              <div className="flex items-center space-x-4">
                {unreadAlerts > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="relative"
                    onClick={() => setActiveTab('alerts')}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Alerts</span>
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                      {unreadAlerts}
                    </Badge>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
                
                {/* User Menu with Logout */}
                <AuthSection />
              </div>
            </header>
            
            <div className="flex-1 p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Here's your personalized threat intelligence overview.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Threats (24h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{threatSummary.last24h}</div>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="destructive" className="text-xs">
                        {(threatSummary.bySeverity.critical || 0) + (threatSummary.bySeverity.high || 0)} High+
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {threatSummary.bySeverity.medium || 0} Medium
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userAlerts.length}</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {unreadAlerts} unread
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {Object.entries(threatSummary.byCategory).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'None'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {String(Object.entries(threatSummary.byCategory).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[1] || 0)} signals
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-amber-500">
                      {threatSummary.bySeverity.critical > 0 ? 'CRITICAL' : 
                       threatSummary.bySeverity.high > 0 ? 'HIGH' : 
                       threatSummary.bySeverity.medium > 0 ? 'MEDIUM' : 'LOW'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Based on recent threats
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Personalized Intelligence Section */}
                    <PersonalizedThreatWidget />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ThreatOverviewWidget 
                        threatSignals={threatSignals} 
                        userId={user.id}
                      />
                      <RecentAlertsWidget 
                        alerts={userAlerts.slice(0, 5)} 
                        onMarkAsRead={markAlertAsRead}
                      />
                    </div>
                    
                    {/* Enhanced with DisruptionOS Features */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ExecutiveBriefingWidget 
                        userId={user.id}
                        threatSignals={threatSignals}
                      />
                      <ThreatWatchlistWidget 
                        userId={user.id}
                        threatSignals={threatSignals}
                      />
                    </div>
                    
                    <DisruptionOSModulesWidget userId={user.id} />
                    
                    {/* Super Admin Section - Only visible to super admins */}
                    {isSuperAdmin && (
                      <SuperAdminWidget userId={user.id} />
                    )}
                    
                    <ThreatMapWidget 
                      threatSignals={threatSignals}
                      userPreferences={preferences?.location_preferences}
                    />
                  </div>
                )}

                {activeTab === 'admin' && isSuperAdmin && (
                  <div className="space-y-6">
                    {/* Enhanced Real-Time Intelligence Hub */}
                    <EnhancedRealTimeStream />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RealTimeThreatStream />
                      <AIThreatAnalysisWidget />
                    </div>
                    <DataSourcesWidget />
                    <SuperAdminWidget userId={user.id} />
                  </div>
                )}

                {activeTab === 'executive' && (
                  <ExecutiveBriefingWidget 
                    userId={user.id}
                    threatSignals={threatSignals}
                  />
                )}

                {activeTab === 'watchlist' && (
                  <ThreatWatchlistWidget 
                    userId={user.id}
                    threatSignals={threatSignals}
                  />
                )}

                {activeTab === 'disruption-os' && (
                  <div className="space-y-6">
                    <FullDisruptionOSDashboard userId={user.id} />
                  </div>
                )}

                {activeTab === 'threats' && (
                  <ThreatMapWidget 
                    threatSignals={threatSignals}
                    userPreferences={preferences?.location_preferences}
                  />
                )}

                {activeTab === 'resilience' && (
                  <div className="space-y-6">
                    <ResilienceWidget 
                      userProfile={preferences}
                      threatSignals={threatSignals || []}
                      userId={user?.id || ''}
                    />
                    <ResilienceToolkitWidget
                      userProfile={null}
                      threatSignals={threatSignals || []}
                      userId={user?.id || ''}
                    />
                  </div>
                )}

                {activeTab === 'decision' && (
                  <DecisionSupportWidget 
                    threatSignals={threatSignals || []}
                    userAlerts={userAlerts || []}
                    analytics={analytics || []}
                    userId={user?.id || ''}
                  />
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <EnhancedBriefingWidget 
                      userId={user?.id || ''}
                      threatSignals={threatSignals}
                    />
                    <SignalGraphWidget userId={user?.id || ''} />
                    <AIReportGenerator threatSignals={threatSignals} />
                    <AnalyticsWidget 
                      analytics={analytics || []}
                      threatSignals={threatSignals || []}
                      userId={user?.id || ''}
                    />
                  </div>
                )}

                {activeTab === 'alerts' && (
                  <AlertsPanel 
                    alerts={userAlerts}
                    onMarkAsRead={markAlertAsRead}
                    preferences={preferences?.alert_preferences}
                  />
                )}

                {activeTab === 'settings' && (
                  <EmailPreferencesWidget userId={user?.id || ''} />
                )}

                {activeTab === 'subscription' && (
                  <div className="space-y-6">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
                      <p className="text-muted-foreground">
                        Manage your PREMONIX subscription, billing, and plan upgrades.
                      </p>
                    </div>
                    <SubscriptionPlans />
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default UserDashboard;