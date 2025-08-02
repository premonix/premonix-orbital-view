import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserAlert {
  id: string;
  alert_type: string;
  is_read: boolean;
  is_dismissed: boolean;
  triggered_at: string;
  threat_signals?: {
    title: string;
    severity: string;
    category: string;
    country: string;
  };
  metadata: any;
}

interface AlertsPanelProps {
  alerts: UserAlert[];
  onMarkAsRead: (alertId: string) => void;
  preferences?: any;
}

export const AlertsPanel = ({ alerts, onMarkAsRead, preferences }: AlertsPanelProps) => {
  const unreadAlerts = alerts.filter(alert => !alert.is_read);
  const readAlerts = alerts.filter(alert => alert.is_read);

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-starlink-white">
            <Bell className="w-5 h-5" />
            <span>Alert Center</span>
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Manage your threat alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unreadAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-starlink-white mb-3">
                  Unread Alerts ({unreadAlerts.length})
                </h4>
                <div className="space-y-2">
                  {unreadAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-starlink-blue/10 border border-starlink-blue/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-starlink-white font-medium">
                            {alert.threat_signals?.title || 'New Alert'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.alert_type}
                            </Badge>
                            {alert.threat_signals && (
                              <Badge variant="destructive" className="text-xs">
                                {alert.threat_signals.severity}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-starlink-grey mt-2">
                            {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {readAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-starlink-white mb-3">
                  Recent Alerts
                </h4>
                <div className="space-y-2">
                  {readAlerts.slice(0, 10).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-starlink-dark-secondary/30"
                    >
                      <p className="text-starlink-grey-light">
                        {alert.threat_signals?.title || 'Alert'}
                      </p>
                      <p className="text-xs text-starlink-grey mt-1">
                        {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alerts.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-starlink-grey mx-auto mb-3" />
                <p className="text-starlink-grey-light">No alerts yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};