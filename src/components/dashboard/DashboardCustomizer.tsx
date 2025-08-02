import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RotateCcw } from 'lucide-react';

interface DashboardCustomizerProps {
  preferences: any;
  onSave: (preferences: any) => void;
}

export const DashboardCustomizer = ({ preferences, onSave }: DashboardCustomizerProps) => {
  const [localPreferences, setLocalPreferences] = useState(preferences || {
    theme_preferences: { theme: 'dark', compact_mode: false },
    alert_preferences: { 
      categories: ['Military', 'Cyber', 'Economic'], 
      severity_threshold: 'medium', 
      email_enabled: true, 
      push_enabled: false 
    },
    location_preferences: { monitored_locations: [], radius_km: 100 }
  });

  const handleSave = () => {
    onSave(localPreferences);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <Settings className="w-5 h-5" />
            <span>Dashboard Preferences</span>
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Customize your dashboard layout and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-starlink-white">Appearance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-starlink-grey-light">Theme</Label>
                <Select 
                  value={localPreferences.theme_preferences?.theme || 'dark'}
                  onValueChange={(value) => setLocalPreferences({
                    ...localPreferences,
                    theme_preferences: {
                      ...localPreferences.theme_preferences,
                      theme: value
                    }
                  })}
                >
                  <SelectTrigger className="bg-starlink-dark-secondary border-starlink-dark-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="compact-mode"
                  checked={localPreferences.theme_preferences?.compact_mode || false}
                  onCheckedChange={(checked) => setLocalPreferences({
                    ...localPreferences,
                    theme_preferences: {
                      ...localPreferences.theme_preferences,
                      compact_mode: checked
                    }
                  })}
                />
                <Label htmlFor="compact-mode" className="text-starlink-grey-light">
                  Compact mode
                </Label>
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-starlink-white">Alert Preferences</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-starlink-grey-light">Minimum Severity</Label>
                <Select 
                  value={localPreferences.alert_preferences?.severity_threshold || 'medium'}
                  onValueChange={(value) => setLocalPreferences({
                    ...localPreferences,
                    alert_preferences: {
                      ...localPreferences.alert_preferences,
                      severity_threshold: value
                    }
                  })}
                >
                  <SelectTrigger className="bg-starlink-dark-secondary border-starlink-dark-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email-alerts"
                    checked={localPreferences.alert_preferences?.email_enabled || false}
                    onCheckedChange={(checked) => setLocalPreferences({
                      ...localPreferences,
                      alert_preferences: {
                        ...localPreferences.alert_preferences,
                        email_enabled: checked
                      }
                    })}
                  />
                  <Label htmlFor="email-alerts" className="text-starlink-grey-light">
                    Email alerts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="push-alerts"
                    checked={localPreferences.alert_preferences?.push_enabled || false}
                    onCheckedChange={(checked) => setLocalPreferences({
                      ...localPreferences,
                      alert_preferences: {
                        ...localPreferences.alert_preferences,
                        push_enabled: checked
                      }
                    })}
                  />
                  <Label htmlFor="push-alerts" className="text-starlink-grey-light">
                    Push notifications
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Location Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-starlink-white">Location Monitoring</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-starlink-grey-light">Alert Radius (km)</Label>
                <Select 
                  value={String(localPreferences.location_preferences?.radius_km || 100)}
                  onValueChange={(value) => setLocalPreferences({
                    ...localPreferences,
                    location_preferences: {
                      ...localPreferences.location_preferences,
                      radius_km: parseInt(value)
                    }
                  })}
                >
                  <SelectTrigger className="bg-starlink-dark-secondary border-starlink-dark-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 km</SelectItem>
                    <SelectItem value="100">100 km</SelectItem>
                    <SelectItem value="250">250 km</SelectItem>
                    <SelectItem value="500">500 km</SelectItem>
                    <SelectItem value="1000">1000 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-starlink-dark-secondary">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};