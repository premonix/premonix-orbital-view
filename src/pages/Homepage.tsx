import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Bell, Brain, Users, Building, Home, Briefcase, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import GlobalThreatIntelligence from "@/components/isometric/GlobalThreatIntelligence";
import AIPoweredPredictions from "@/components/isometric/AIPoweredPredictions";
import CustomAlertSystem from "@/components/isometric/CustomAlertSystem";
import ResilienceToolkit from "@/components/isometric/ResilienceToolkit";
import HeroThreatMap from "@/components/isometric/HeroThreatMap";
import WaitlistForm from "@/components/WaitlistForm";

const Homepage = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Threat Intelligence",
      description: "Real-time monitoring of 10,000+ data sources across military, cyber, economic, and political domains.",
      component: GlobalThreatIntelligence
    },
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms predict conflict hotspots and emerging threats before they escalate.",
      component: AIPoweredPredictions
    },
    {
      icon: Bell,
      title: "Custom Alert System",
      description: "Personalized notifications based on your location, sector, and threat preferences delivered in real-time.",
      component: CustomAlertSystem
    },
    {
      icon: Shield,
      title: "Resilience Toolkit",
      description: "Tailored preparedness guides and crisis management resources for individuals, families, and businesses.",
      component: ResilienceToolkit
    }
  ];

  const personas = [
    {
      icon: Home,
      title: "Personal & Family",
      description: "Individual preparedness and household safety planning for uncertain times.",
      benefits: ["Emergency planning guides", "Local threat monitoring", "Family communication plans", "Personal safety alerts"]
    },
    {
      icon: Briefcase,
      title: "Small & Medium Business",
      description: "Business continuity and resilience planning for small to medium enterprises.",
      benefits: ["Crisis management templates", "Supply chain monitoring", "Staff communication tools", "Sector-specific alerts"]
    },
    {
      icon: Building,
      title: "Enterprise & Government",
      description: "Comprehensive threat intelligence and risk management for large organizations.",
      benefits: ["Advanced analytics dashboard", "Multi-team coordination", "API integrations", "Custom threat modeling"]
    },
    {
      icon: Zap,
      title: "DisruptionOS Integration",
      description: "Transform awareness into preparedness with strategic disruption management.",
      benefits: ["Disruption Sensitivity Score", "Scenario simulation engine", "Initiative portfolio mapping", "Automated governance briefings"]
    }
  ];

  const pricingPlans = [
    {
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

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-starlink-dark via-starlink-slate/20 to-starlink-dark opacity-60">
            <HeroThreatMap />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-starlink-dark/80 via-starlink-dark/60 to-starlink-dark"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30 px-4 py-2 text-sm font-medium">
                🚀 Coming Soon: Real-time Global Threat Intelligence + DisruptionOS
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Real-Time Risk.
                <br />
                <span className="text-starlink-blue">Real-World Readiness.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-starlink-grey-light leading-relaxed">
                PREMONIX scans 10,000+ military, economic, cyber, and political signals to predict emerging conflict hotspots. 
                Enhanced with DisruptionOS for strategic preparedness—at home and in business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <WaitlistForm variant="modal">
                  <Button 
                    size="lg" 
                    className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold px-8 py-4 text-lg"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Join Waitlist
                  </Button>
                </WaitlistForm>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-panel border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light px-8 py-4 text-lg"
                  asChild
                >
                  <Link to="/disruption-os">
                    <Zap className="w-5 h-5 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Waitlist Form */}
            <div className="relative">
              <WaitlistForm />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-starlink-blue">24/7</div>
              <div className="text-starlink-grey-light">Global Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-starlink-orange">10K+</div>
              <div className="text-starlink-grey-light">Data Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-starlink-red">Real-time</div>
              <div className="text-starlink-grey-light">Intelligence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-starlink-slate/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Core Capabilities</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Advanced threat intelligence meets practical preparedness in one comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-starlink-slate/30 to-starlink-dark/90">
                  <feature.component />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-starlink-blue/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className="w-6 h-6 text-starlink-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-starlink-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-starlink-grey-light text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* DisruptionOS CTA */}
          <div className="mt-16 text-center">
            <Card className="glass-panel border-starlink-blue/50 max-w-4xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-starlink-blue mr-3" />
                  <h3 className="text-2xl font-bold text-starlink-white">Enhanced with DisruptionOS</h3>
                </div>
                <p className="text-starlink-grey-light mb-6 text-lg">
                  Transform from reactive threat monitoring to proactive disruption preparedness with strategic scenario simulation, 
                  sensitivity scoring, and automated governance briefings.
                </p>
                <WaitlistForm variant="inline" className="max-w-md mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Personas Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Built for Everyone</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Whether you're protecting your family or running a global enterprise, PREMONIX adapts to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {personas.map((persona, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-starlink-blue/20 rounded-lg flex items-center justify-center mb-4">
                    <persona.icon className="w-6 h-6 text-starlink-blue" />
                  </div>
                  <CardTitle className="text-starlink-white text-xl">{persona.title}</CardTitle>
                  <CardDescription className="text-starlink-grey-light text-base">
                    {persona.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {persona.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-starlink-blue flex-shrink-0" />
                        <span className="text-starlink-grey-light text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-starlink-slate/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Choose the plan that fits your security needs and budget. DisruptionOS features included in Pro and Enterprise tiers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-panel relative ${
                plan.popular 
                  ? 'border-starlink-blue/50 ring-2 ring-starlink-blue/30' 
                  : 'border-starlink-grey/30'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-starlink-blue text-starlink-dark font-semibold px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-starlink-white text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-starlink-blue">{plan.price}</span>
                    <span className="text-starlink-grey-light ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="text-starlink-grey-light">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-starlink-blue flex-shrink-0" />
                        <span className="text-starlink-grey-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <WaitlistForm variant="modal">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark' 
                          : 'bg-starlink-slate-light hover:bg-starlink-slate text-starlink-white'
                      }`}
                    >
                      Join Waitlist
                    </Button>
                  </WaitlistForm>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-starlink-grey-light mb-4">
              All plans will include a 14-day free trial. No credit card required.
            </p>
            <Button variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
              Contact Us for Custom Enterprise Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Don't Wait for the Storm
          </h2>
          <p className="text-xl text-starlink-grey-light mb-8">
            Join thousands of individuals and organizations preparing for tomorrow's threats with PREMONIX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WaitlistForm variant="modal">
              <Button 
                size="lg" 
                className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold px-8 py-4"
              >
                Join Waitlist
              </Button>
            </WaitlistForm>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
