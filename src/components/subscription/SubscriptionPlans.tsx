import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import WaitlistForm from "@/components/WaitlistForm";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

export const SubscriptionPlans = () => {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Static pricing that matches homepage
  const plans: SubscriptionPlan[] = [
    {
      id: "personal",
      name: "Personal",
      price: "£290",
      period: "per year",
      description: "Perfect for individuals and families seeking personal preparedness",
      features: [
        "Global threat map access",
        "Personal alert system",
        "Basic resilience toolkit",
        "Mobile app access",
        "Email support"
      ],
      popular: false
    },
    {
      id: "business-pro",
      name: "Business Pro",
      price: "£2,995",
      period: "per year",
      description: "Ideal for SMEs and growing businesses with up to 50 employees",
      features: [
        "Everything in Personal",
        "Business continuity templates",
        "Team collaboration tools",
        "Sector-specific intelligence",
        "Priority support",
        "Custom alert filters",
        "Basic DisruptionOS features"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "£9,750",
      period: "per year",
      description: "Comprehensive solution for large organizations (£5M+ revenue)",
      features: [
        "Everything in Business Pro",
        "Advanced analytics dashboard",
        "API access & integrations",
        "Custom threat modeling",
        "Dedicated account manager",
        "White-label options",
        "24/7 phone support",
        "Full DisruptionOS suite"
      ],
      popular: false
    }
  ];

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
      // For now, we'll show a toast that this feature is coming soon
      toast({
        title: "Coming Soon",
        description: "Subscription checkout is currently in development. Join our waitlist to be notified when it's available!",
      });
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

  const isCurrentPlan = (planName: string) => {
    return user?.subscription?.plan?.toLowerCase() === planName.toLowerCase();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your security needs and budget. DisruptionOS features included in Pro and Enterprise tiers.
          All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.popular ? 'border-primary/50 ring-2 ring-primary/30' : 'border-muted'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <CardDescription>
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan(plan.name) ? (
                <Badge className="w-full justify-center bg-primary/10 text-primary border-primary">
                  Current Plan
                </Badge>
              ) : (
                <WaitlistForm variant="modal">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    disabled={checkoutLoading === plan.id}
                  >
                    {checkoutLoading === plan.id ? "Loading..." : "Join Waitlist"}
                  </Button>
                </WaitlistForm>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          All plans will include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;