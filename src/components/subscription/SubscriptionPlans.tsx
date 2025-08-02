import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: any;
  max_users: number | null;
  max_organizations: number | null;
  is_active: boolean;
}

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user, createCheckoutSession, openCustomerPortal } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      setPlans((data || []).map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      })));
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    setCheckoutLoading(planId);
    try {
      const { url, error } = await createCheckoutSession(planId);
      if (error) {
        throw new Error(error);
      }
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url, error } = await openCustomerPortal();
      if (error) {
        throw new Error(error);
      }
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
  };

  const isCurrentPlan = (planName: string) => {
    return user?.subscription?.plan?.toLowerCase() === planName.toLowerCase();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-32 bg-muted/50" />
            <CardContent className="h-48 bg-muted/30" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your organization's threat intelligence needs.
          All plans include our core threat detection and monitoring capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.name === 'Pro' ? 'border-primary shadow-lg scale-105' : 'border-muted'
            }`}
          >
            {plan.name === 'Pro' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-foreground">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {plan.description}
              </CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold text-foreground">
                  {formatPrice(plan.price_monthly)}
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                {plan.price_yearly > 0 && (
                  <div className="text-sm text-muted-foreground">
                    or {formatPrice(plan.price_yearly)}/year (save 17%)
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.max_users && (
                <div className="pt-2 border-t border-muted">
                  <p className="text-sm text-muted-foreground">
                    Up to {plan.max_users} users
                  </p>
                  {plan.max_organizations && (
                    <p className="text-sm text-muted-foreground">
                      Up to {plan.max_organizations} organizations
                    </p>
                  )}
                </div>
              )}

              {isCurrentPlan(plan.name) ? (
                <div className="space-y-2">
                  <Badge className="w-full justify-center bg-primary/10 text-primary border-primary">
                    Current Plan
                  </Badge>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleManageSubscription}
                  >
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  variant={plan.name === 'Pro' ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={checkoutLoading === plan.id}
                >
                  {checkoutLoading === plan.id ? "Loading..." : `Subscribe to ${plan.name}`}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.subscription && (
        <div className="text-center pt-8">
          <Button variant="ghost" onClick={handleManageSubscription}>
            Manage Billing & Subscription
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;