import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Users, 
  Building, 
  CreditCard, 
  FileText, 
  TestTube, 
  BarChart3, 
  Activity,
  Settings,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Database,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SuperAdminWidgetProps {
  userId: string;
}

export const SuperAdminWidget = ({ userId }: SuperAdminWidgetProps) => {
  const { user } = useAuth();

  const adminModules = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      stats: { count: '1,247', change: '+12' },
      status: 'active',
      link: '/admin?tab=users'
    },
    {
      id: 'organizations',
      title: 'Organizations',
      description: 'Manage organizational structures',
      icon: Building,
      stats: { count: '89', change: '+3' },
      status: 'monitoring',
      link: '/admin?tab=organizations'
    },
    {
      id: 'system',
      title: 'System Health',
      description: 'Monitor system performance',
      icon: Activity,
      stats: { count: '99.9%', change: 'stable' },
      status: 'healthy',
      link: '/admin?tab=monitoring'
    },
    {
      id: 'analytics',
      title: 'Platform Analytics',
      description: 'Usage metrics and insights',
      icon: BarChart3,
      stats: { count: '847k', change: '+18%' },
      status: 'trending',
      link: '/admin?tab=analytics'
    }
  ];

  const systemAlerts = [
    {
      type: 'info',
      message: 'Scheduled maintenance in 3 days',
      time: '2h ago',
      priority: 'low'
    },
    {
      type: 'warning',
      message: 'High API usage detected',
      time: '45m ago',
      priority: 'medium'
    },
    {
      type: 'success',
      message: 'Security patch deployed successfully',
      time: '1h ago',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'monitoring':
        return 'bg-yellow-500';
      case 'trending':
        return 'bg-purple-500';
      default:
        return 'bg-muted';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Super Admin Console</span>
            </CardTitle>
            <CardDescription>
              System administration and platform management
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="text-xs">
              RESTRICTED ACCESS
            </Badge>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Full Console
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {adminModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} to={module.link}>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{module.title}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{module.stats.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {module.stats.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* System Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>System Alerts</span>
            </h4>
            <Link to="/admin?tab=monitoring">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
          
          {systemAlerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
              <div className="flex items-center space-x-3">
                {getAlertIcon(alert.type)}
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">Priority: {alert.priority}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/admin?tab=users">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
          </Link>
          <Link to="/admin?tab=billing">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </Button>
          </Link>
          <Link to="/admin?tab=audit">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Audit Logs
            </Button>
          </Link>
          <Link to="/admin?tab=beta">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <TestTube className="w-4 h-4 mr-2" />
              Beta Features
            </Button>
          </Link>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Database className="w-4 h-4" />
            <span>Logged in as: {user?.email}</span>
          </div>
          <Badge variant="destructive" className="text-xs">
            SUPER ADMIN
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};