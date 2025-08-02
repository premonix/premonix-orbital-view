import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Zap } from "lucide-react";

export const Subscription = () => {
  const { user, checkSubscription, openCustomerPortal } = useAuth();

  useEffect(() => {
    // Check subscription status when component mounts
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  const handleManageSubscription = async () => {
    const { url } = await openCustomerPortal();
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Current Subscription Status */}
        {user && (
          <Card className="mb-12 border-muted bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Crown className="w-6 h-6 text-primary" />
                    Current Subscription
                  </CardTitle>
                  <CardDescription>
                    Manage your PREMONIX subscription and billing
                  </CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary">
                  {user.subscription?.plan || 'Individual'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Plan Tier</p>
                    <p className="text-sm text-muted-foreground">{user.subscription?.tier || 'Personal'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Active Features</p>
                    <p className="text-sm text-muted-foreground">{user.permissions?.length || 0} permissions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {user.subscription?.expiresAt ? 'Active' : 'Free Tier'}
                    </p>
                  </div>
                </div>
              </div>
              
              {user.subscription?.expiresAt && (
                <div className="pt-4 border-t border-muted">
                  <p className="text-sm text-muted-foreground">
                    Your subscription will renew on {new Date(user.subscription.expiresAt).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleManageSubscription}
                  >
                    Manage Billing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <SubscriptionPlans />

        {/* Enterprise Contact */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Need a Custom Solution?</CardTitle>
            <CardDescription className="text-lg">
              Get in touch for enterprise pricing and custom threat intelligence solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>✓ Custom integrations</div>
                <div>✓ Dedicated support</div>
                <div>✓ On-premise deployment</div>
              </div>
              <Button size="lg" className="mt-6">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;