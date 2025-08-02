import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp, Bell, BarChart3, Map, Shield, Zap } from 'lucide-react';
import FeaturePreviewOverlay from './FeaturePreviewOverlay';
import { useAuth } from '@/contexts/AuthContext';

const GuestDashboardPreview = () => {
  const { upgradeRole } = useAuth();

  const dashboardFeatures = [
    {
      title: "Threat Overview",
      description: "Real-time global threat landscape",
      icon: TrendingUp,
      preview: "12 Active Threats | 3 High Priority",
      requiredRole: 'individual' as const
    },
    {
      title: "Personal Alerts",
      description: "Custom notifications for your location",
      icon: Bell,
      preview: "5 New Alerts | 2 Urgent",
      requiredRole: 'individual' as const
    },
    {
      title: "Analytics Dashboard",
      description: "Threat trends and insights",
      icon: BarChart3,
      preview: "Regional analysis and forecasts",
      requiredRole: 'team_admin' as const
    },
    {
      title: "Sector Risk Analysis",
      description: "Industry-specific threat intelligence",
      icon: Shield,
      preview: "Monitor risks in your sector",
      requiredRole: 'team_admin' as const
    }
  ];

  return (
    <div className="py-12 lg:py-20 bg-starlink-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30">
            Dashboard Preview
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-starlink-white mb-4">
            Personalized Threat Intelligence
          </h2>
          <p className="text-lg text-starlink-grey-light max-w-2xl mx-auto">
            See what awaits you in your personal dashboard. Get started in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardFeatures.map((feature, index) => (
            <Card key={index} className="bg-starlink-slate/20 border-starlink-grey/30 relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <feature.icon className="w-6 h-6 text-starlink-blue" />
                  <Badge variant="outline" className="text-xs text-starlink-grey-light">
                    {feature.requiredRole}
                  </Badge>
                </div>
                <CardTitle className="text-starlink-white text-base">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-starlink-grey-light text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-starlink-grey-light mb-4">
                  {feature.preview}
                </div>
                <div className="h-16 bg-starlink-slate/10 rounded border border-starlink-grey/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-starlink-blue/5 to-starlink-purple/5" />
                  <div className="absolute top-2 left-2 right-2">
                    <div className="flex justify-between items-center">
                      <div className="w-8 h-2 bg-starlink-blue/30 rounded" />
                      <div className="w-12 h-2 bg-starlink-green/30 rounded" />
                    </div>
                    <div className="mt-2 flex space-x-1">
                      <div className="w-4 h-1 bg-starlink-grey/30 rounded" />
                      <div className="w-6 h-1 bg-starlink-grey/30 rounded" />
                      <div className="w-3 h-1 bg-starlink-grey/30 rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <FeaturePreviewOverlay
                featureName={feature.title}
                description={`${feature.description}. Register to unlock this feature.`}
                requiredRole={feature.requiredRole}
              />
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-starlink-blue/10 to-starlink-purple/10 border border-starlink-blue/30 rounded-xl">
            <div className="p-3 bg-starlink-blue/20 rounded-full">
              <Map className="w-8 h-8 text-starlink-blue" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-starlink-white mb-1">
                Ready to Get Started?
              </h3>
              <p className="text-starlink-grey-light">
                Create your account in seconds and unlock personalized threat intelligence.
              </p>
            </div>
            <Button 
              onClick={() => upgradeRole('individual')}
              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium px-8"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboardPreview;