import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Bell, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailPreferences {
  welcomeEmails: boolean;
  threatAlerts: boolean;
  weeklyDigest: boolean;
  criticalAlertsOnly: boolean;
  alertFrequency: 'immediate' | 'hourly' | 'daily';
  digestDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  categories: string[];
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
}

interface EmailPreferencesWidgetProps {
  userId: string;
}

export const EmailPreferencesWidget = ({ userId }: EmailPreferencesWidgetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<EmailPreferences>({
    welcomeEmails: true,
    threatAlerts: true,
    weeklyDigest: true,
    criticalAlertsOnly: false,
    alertFrequency: 'immediate',
    digestDay: 'monday',
    categories: ['Military', 'Cyber', 'Economic'],
    severityThreshold: 'medium'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const availableCategories = ['Military', 'Cyber', 'Economic', 'Political', 'Environmental', 'Health'];

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_dashboard_preferences')
        .select('alert_preferences')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading email preferences:', error);
        return;
      }

      if (data?.alert_preferences) {
        const alertPrefs = data.alert_preferences as any;
        if (alertPrefs && typeof alertPrefs === 'object' && alertPrefs.email) {
          setPreferences({
            ...preferences,
            ...alertPrefs.email
          });
        }
      }
    } catch (error) {
      console.error('Error loading email preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // First get current preferences
      const { data: currentData } = await supabase
        .from('user_dashboard_preferences')
        .select('alert_preferences')
        .eq('user_id', userId)
        .single();

      const currentAlertPrefs = currentData?.alert_preferences as any || {};
      const updatedAlertPreferences = {
        ...currentAlertPrefs,
        email: preferences
      };

      const { error } = await supabase
        .from('user_dashboard_preferences')
        .upsert({
          user_id: userId,
          alert_preferences: updatedAlertPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your email preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving email preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save email preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testWelcomeEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          userName: user?.name || 'Test User',
          userEmail: user?.email,
          loginUrl: window.location.origin
        }
      });

      if (error) throw error;

      toast({
        title: "Test email sent",
        description: "Check your inbox for the welcome email test.",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const testThreatAlert = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-threat-alerts', {
        body: {
          userId,
          alerts: [
            {
              id: 'test-alert-1',
              title: 'Test Critical Threat Alert',
              category: 'Cyber',
              severity: 'critical',
              location: 'Global',
              timestamp: new Date().toISOString(),
              description: 'This is a test alert to verify your notification settings.'
            }
          ]
        }
      });

      if (error) throw error;

      toast({
        title: "Test alert sent",
        description: "Check your inbox for the threat alert test.",
      });
    } catch (error) {
      console.error('Error sending test alert:', error);
      toast({
        title: "Error",
        description: "Failed to send test alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (loading) {
    return (
      <Card className="glass-panel border-starlink-grey/30">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-starlink-blue rounded-full animate-pulse" />
            <span className="text-starlink-grey-light">Loading preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-starlink-grey/30">
      <CardHeader>
        <CardTitle className="text-starlink-white flex items-center">
          <Mail className="w-5 h-5 mr-2 text-starlink-blue" />
          Email Notifications
        </CardTitle>
        <CardDescription className="text-starlink-grey-light">
          Manage your email preferences and notification settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Email Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-starlink-white">Email Types</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-starlink-white">Welcome Emails</Label>
              <p className="text-sm text-starlink-grey-light">Receive onboarding and welcome messages</p>
            </div>
            <Switch
              checked={preferences.welcomeEmails}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, welcomeEmails: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-starlink-white">Threat Alerts</Label>
              <p className="text-sm text-starlink-grey-light">Real-time notifications about relevant threats</p>
            </div>
            <Switch
              checked={preferences.threatAlerts}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, threatAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-starlink-white">Weekly Digest</Label>
              <p className="text-sm text-starlink-grey-light">Summary of threat activity and trends</p>
            </div>
            <Switch
              checked={preferences.weeklyDigest}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyDigest: checked }))}
            />
          </div>
        </div>

        {/* Alert Settings */}
        {preferences.threatAlerts && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-starlink-white">Alert Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-starlink-white">Critical Alerts Only</Label>
                <p className="text-sm text-starlink-grey-light">Only send emails for critical severity threats</p>
              </div>
              <Switch
                checked={preferences.criticalAlertsOnly}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, criticalAlertsOnly: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-starlink-white">Alert Frequency</Label>
              <Select
                value={preferences.alertFrequency}
                onValueChange={(value: any) => setPreferences(prev => ({ ...prev, alertFrequency: value }))}
              >
                <SelectTrigger className="bg-starlink-slate/50 border-starlink-grey/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly digest</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-starlink-white">Minimum Severity</Label>
              <Select
                value={preferences.severityThreshold}
                onValueChange={(value: any) => setPreferences(prev => ({ ...prev, severityThreshold: value }))}
              >
                <SelectTrigger className="bg-starlink-slate/50 border-starlink-grey/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low and above</SelectItem>
                  <SelectItem value="medium">Medium and above</SelectItem>
                  <SelectItem value="high">High and above</SelectItem>
                  <SelectItem value="critical">Critical only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-starlink-white">Threat Categories</h3>
          <p className="text-sm text-starlink-grey-light">Select which categories you want to receive alerts for</p>
          
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <Badge
                key={category}
                variant={preferences.categories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  preferences.categories.includes(category)
                    ? 'bg-starlink-blue text-starlink-dark'
                    : 'border-starlink-grey/40 text-starlink-grey-light hover:text-starlink-white'
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Digest Settings */}
        {preferences.weeklyDigest && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-starlink-white">Digest Settings</h3>
            
            <div className="space-y-2">
              <Label className="text-starlink-white">Weekly Digest Day</Label>
              <Select
                value={preferences.digestDay}
                onValueChange={(value: any) => setPreferences(prev => ({ ...prev, digestDay: value }))}
              >
                <SelectTrigger className="bg-starlink-slate/50 border-starlink-grey/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Test Emails */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-starlink-white">Test Emails</h3>
          <p className="text-sm text-starlink-grey-light">Send test emails to verify your settings</p>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testWelcomeEmail}
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              <Mail className="w-4 h-4 mr-2" />
              Test Welcome
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={testThreatAlert}
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Test Alert
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-starlink-grey/20">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark w-full"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-starlink-dark/20 border-t-starlink-dark rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreferencesWidget;