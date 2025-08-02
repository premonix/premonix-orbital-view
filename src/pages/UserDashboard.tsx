import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThreatOverviewWidget } from '@/components/dashboard/ThreatOverviewWidget';
import { RecentAlertsWidget } from '@/components/dashboard/RecentAlertsWidget';
import { ThreatMapWidget } from '@/components/dashboard/ThreatMapWidget';
import { AnalyticsWidget } from '@/components/dashboard/AnalyticsWidget';
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { ResilienceWidget } from '@/components/dashboard/ResilienceWidget';
import { DecisionSupportWidget } from '@/components/dashboard/DecisionSupportWidget';
import { Settings, LayoutGrid, Bell, BarChart3, Map, AlertTriangle, Shield, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardPreferences {
  id: string;
  dashboard_layout: any;
  location_preferences: any;
  alert_preferences: any;
  theme_preferences: any;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<DashboardPreferences | null>(null);
  const [threatSignals, setThreatSignals] = useState<any[]>([]);
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-starlink-white">Dashboard</h1>
            <p className="text-starlink-grey-light mt-2">
              Welcome back! Here's your personalized threat intelligence overview.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            {unreadAlerts > 0 && (
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                  {unreadAlerts}
                </Badge>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-starlink-grey-light">Threats (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-starlink-white">{threatSummary.last24h}</div>
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

          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-starlink-grey-light">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-starlink-white">{userAlerts.length}</div>
              <div className="text-sm text-starlink-grey-light mt-2">
                {unreadAlerts} unread
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-starlink-grey-light">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-starlink-white">
                {Object.entries(threatSummary.byCategory).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'None'}
              </div>
              <div className="text-sm text-starlink-grey-light mt-2">
                {String(Object.entries(threatSummary.byCategory).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[1] || 0)} signals
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-starlink-grey-light">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-yellow-400">
                {threatSummary.bySeverity.critical > 0 ? 'CRITICAL' : 
                 threatSummary.bySeverity.high > 0 ? 'HIGH' : 
                 threatSummary.bySeverity.medium > 0 ? 'MEDIUM' : 'LOW'}
              </div>
              <div className="text-sm text-starlink-grey-light mt-2">
                Based on recent threats
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-starlink-dark-secondary">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Threats</span>
            </TabsTrigger>
            <TabsTrigger value="resilience" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Resilience</span>
            </TabsTrigger>
            <TabsTrigger value="decision" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Decision</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Alerts {unreadAlerts > 0 && `(${unreadAlerts})`}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
            <ThreatMapWidget 
              threatSignals={threatSignals}
              userPreferences={preferences?.location_preferences}
            />
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <ThreatMapWidget 
              threatSignals={threatSignals}
              userPreferences={preferences?.location_preferences}
              showFilters={true}
            />
          </TabsContent>

          <TabsContent value="resilience" className="space-y-6">
            <ResilienceWidget 
              userProfile={preferences}
              threatSignals={threatSignals || []}
              userId={user?.id || ''}
            />
          </TabsContent>

          <TabsContent value="decision" className="space-y-6">
            <DecisionSupportWidget 
              threatSignals={threatSignals || []}
              userAlerts={userAlerts || []}
              analytics={analytics || []}
              userId={user?.id || ''}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsWidget 
              analytics={analytics || []}
              threatSignals={threatSignals || []}
              userId={user?.id || ''}
            />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel 
              alerts={userAlerts}
              onMarkAsRead={markAlertAsRead}
              preferences={preferences?.alert_preferences}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;