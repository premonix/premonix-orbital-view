
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  Calendar,
  Target,
  Clock
} from "lucide-react";

const AdminAnalyticsPanel = () => {
  const usageData = [
    { feature: 'Threat Map', usage: 89, trend: '+12%' },
    { feature: 'DSS Builder', usage: 67, trend: '+8%' },
    { feature: 'Scenario Simulator', usage: 54, trend: '+23%' },
    { feature: 'Resilience Toolkit', usage: 78, trend: '+5%' },
    { feature: 'Governance Generator', usage: 43, trend: '+15%' },
    { feature: 'Signal Feed', usage: 92, trend: '+3%' }
  ];

  const userMetrics = [
    { period: 'Daily Active Users', value: '1,247', change: '+5.2%', positive: true },
    { period: 'Weekly Active Users', value: '3,891', change: '+12.8%', positive: true },
    { period: 'Monthly Active Users', value: '12,543', change: '+18.3%', positive: true },
    { period: 'Session Duration', value: '24m 35s', change: '+2.1%', positive: true }
  ];

  const topOrganizations = [
    { name: 'Acme Corporation', users: 42, sessions: 1247, lastActive: '2 hours ago' },
    { name: 'Global Manufacturing', users: 28, sessions: 892, lastActive: '1 hour ago' },
    { name: 'TechStart Innovations', users: 15, sessions: 456, lastActive: '30 minutes ago' },
    { name: 'Financial Services Inc', users: 35, sessions: 1156, lastActive: '4 hours ago' }
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-starlink-white flex items-center">
                <BarChart className="w-6 h-6 mr-2 text-starlink-blue" />
                Usage Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Platform usage metrics and user engagement analytics
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-starlink-grey/30">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              <Button className="bg-starlink-blue hover:bg-starlink-blue-bright">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* User Activity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {userMetrics.map((metric, index) => (
              <div key={index} className="bg-starlink-slate/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-starlink-white">{metric.value}</div>
                  <Activity className="w-6 h-6 text-starlink-blue" />
                </div>
                <div className="text-sm text-starlink-grey-light mb-1">{metric.period}</div>
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-400">{metric.change}</span>
                  <span className="text-xs text-starlink-grey-light ml-1">vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-starlink-white mb-4">Feature Usage</h3>
              <div className="space-y-4">
                {usageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-starlink-slate/20 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-starlink-white">{item.feature}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-starlink-white">{item.usage}%</span>
                          <Badge className="bg-green-600 text-white text-xs">
                            {item.trend}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-starlink-grey/20 rounded-full h-2">
                        <div 
                          className="bg-starlink-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.usage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Organizations */}
            <div>
              <h3 className="text-lg font-semibold text-starlink-white mb-4">Most Active Organizations</h3>
              <div className="space-y-3">
                {topOrganizations.map((org, index) => (
                  <div key={index} className="p-3 bg-starlink-slate/20 rounded-lg border border-starlink-grey/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-starlink-white">{org.name}</span>
                      <Badge className="bg-starlink-blue text-starlink-dark">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-starlink-grey-light">
                          <Users className="w-3 h-3 mr-1" />
                          {org.users} users
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-starlink-grey-light">
                          <Target className="w-3 h-3 mr-1" />
                          {org.sessions} sessions
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-starlink-grey-light">
                          <Clock className="w-3 h-3 mr-1" />
                          {org.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-starlink-slate/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">94.7%</div>
                <div className="text-starlink-white font-medium mb-1">Platform Uptime</div>
                <div className="text-sm text-starlink-grey-light">Last 30 days</div>
              </div>
            </div>

            <div className="bg-starlink-slate/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-starlink-blue mb-2">2.4s</div>
                <div className="text-starlink-white font-medium mb-1">Avg Response Time</div>
                <div className="text-sm text-starlink-grey-light">API endpoints</div>
              </div>
            </div>

            <div className="bg-starlink-slate/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">4.8/5</div>
                <div className="text-starlink-white font-medium mb-1">User Satisfaction</div>
                <div className="text-sm text-starlink-grey-light">Based on 1,234 surveys</div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-8 p-4 bg-starlink-blue/10 border border-starlink-blue/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-starlink-white">Analytics Export</h4>
                <p className="text-sm text-starlink-grey-light">
                  Export detailed analytics data for external analysis
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="border-starlink-grey/30">
                  Export CSV
                </Button>
                <Button variant="outline" className="border-starlink-grey/30">
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPanel;
