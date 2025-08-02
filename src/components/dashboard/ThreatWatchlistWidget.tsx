import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Clock,
  Target,
  Globe
} from "lucide-react";

interface ThreatWatchlistWidgetProps {
  userId: string;
  threatSignals: any[];
}

export const ThreatWatchlistWidget = ({ userId, threatSignals }: ThreatWatchlistWidgetProps) => {
  const watchlistItems = [
    {
      id: 1,
      category: 'Supply Chain',
      region: 'Asia Pacific',
      severity: 'High',
      status: 'Active',
      lastUpdate: '2 hours ago',
      signals: 12,
      trend: 'increasing'
    },
    {
      id: 2,
      category: 'Cyber Security',
      region: 'Financial Sector',
      severity: 'High',
      status: 'Monitoring',
      lastUpdate: '4 hours ago',
      signals: 8,
      trend: 'stable'
    },
    {
      id: 3,
      category: 'Geopolitical',
      region: 'Eastern Europe',
      severity: 'Medium',
      status: 'Active',
      lastUpdate: '6 hours ago',
      signals: 15,
      trend: 'decreasing'
    },
    {
      id: 4,
      category: 'Energy',
      region: 'Middle East',
      severity: 'Medium',
      status: 'Monitoring',
      lastUpdate: '1 day ago',
      signals: 5,
      trend: 'stable'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-destructive';
      case 'Medium':
        return 'bg-amber-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-3 h-3 text-destructive" />;
      case 'decreasing':
        return <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />;
      default:
        return <Target className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>Threat Watchlist</span>
            </CardTitle>
            <CardDescription>
              Critical monitoring targets and risk areas
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-xl font-bold text-destructive">
              {watchlistItems.filter(item => item.severity === 'High').length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-xl font-bold">
              {watchlistItems.filter(item => item.status === 'Active').length}
            </div>
            <div className="text-xs text-muted-foreground">Active Items</div>
          </div>
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <div className="text-xl font-bold">
              {watchlistItems.reduce((sum, item) => sum + item.signals, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Signals</div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Watchlist Items */}
        <div className="space-y-3">
          {watchlistItems.map((item) => (
            <div key={item.id} className="p-3 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{item.category}</span>
                  </div>
                  <Badge 
                    className={`${getSeverityColor(item.severity)} text-white text-xs`}
                  >
                    {item.severity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(item.trend)}
                  <Badge variant="outline" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">{item.region}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{item.signals} signals</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{item.lastUpdate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Real-time monitoring active</span>
          </div>
          <Button variant="ghost" size="sm">
            Configure Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};