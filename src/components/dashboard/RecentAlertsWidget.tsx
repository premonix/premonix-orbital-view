import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
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

interface RecentAlertsWidgetProps {
  alerts: UserAlert[];
  onMarkAsRead: (alertId: string) => void;
}

export const RecentAlertsWidget = ({ alerts, onMarkAsRead }: RecentAlertsWidgetProps) => {
  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'proximity': return <AlertTriangle className="w-4 h-4" />;
      case 'severity': return <Bell className="w-4 h-4" />;
      case 'category': return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertTypeLabel = (alertType: string) => {
    switch (alertType) {
      case 'proximity': return 'Location Alert';
      case 'severity': return 'Severity Alert';
      case 'category': return 'Category Alert';
      case 'custom': return 'Custom Alert';
      default: return 'Alert';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-starlink-white">
              <Bell className="w-5 h-5" />
              <span>Recent Alerts</span>
            </CardTitle>
            <CardDescription className="text-starlink-grey-light">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-starlink-grey mx-auto mb-3" />
              <p className="text-starlink-grey-light">No recent alerts</p>
              <p className="text-sm text-starlink-grey">You're all caught up!</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all ${
                  alert.is_read 
                    ? 'bg-starlink-dark-secondary/30 border-starlink-dark-secondary' 
                    : 'bg-starlink-blue/10 border-starlink-blue/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`mt-1 ${alert.is_read ? 'text-starlink-grey' : 'text-starlink-blue'}`}>
                      {getAlertIcon(alert.alert_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${
                          alert.is_read ? 'text-starlink-grey-light' : 'text-starlink-white'
                        }`}>
                          {getAlertTypeLabel(alert.alert_type)}
                        </span>
                        {alert.threat_signals && (
                          <Badge 
                            variant={getSeverityColor(alert.threat_signals.severity) as any}
                            className="text-xs"
                          >
                            {alert.threat_signals.severity}
                          </Badge>
                        )}
                      </div>
                      
                      {alert.threat_signals && (
                        <p className={`text-sm mb-2 ${
                          alert.is_read ? 'text-starlink-grey' : 'text-starlink-white'
                        }`}>
                          {alert.threat_signals.title}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-starlink-grey">
                        <span>
                          {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}
                        </span>
                        {alert.threat_signals?.country && (
                          <span>{alert.threat_signals.country}</span>
                        )}
                        {alert.threat_signals?.category && (
                          <span>{alert.threat_signals.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!alert.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(alert.id)}
                      className="text-xs text-starlink-blue hover:text-starlink-blue-bright"
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-starlink-dark-secondary">
            <Button variant="outline" size="sm" className="w-full">
              View All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};