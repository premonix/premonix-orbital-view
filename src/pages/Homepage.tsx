import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Bell, Brain, Users, Building, Home, Briefcase, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Threat Intelligence",
      description: "Real-time monitoring of 10,000+ data sources across military, cyber, economic, and political domains.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=250&fit=crop"
    },
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms predict conflict hotspots and emerging threats before they escalate.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
    },
    {
      icon: Bell,
      title: "Custom Alert System",
      description: "Personalized notifications based on your location, sector, and threat preferences delivered in real-time.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop"
    },
    {
      icon: Shield,
      title: "Resilience Toolkit",
      description: "Tailored preparedness guides and crisis management resources for individuals, families, and businesses.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop"
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
      name: "Business",
      price: "£2,995",
      period: "per year",
      description: "Ideal for SMEs and growing businesses with up to 50 employees",
      features: [
        "Everything in Personal",
        "Business continuity templates",
        "Team collaboration tools",
        "Sector-specific intelligence",
        "Priority support",
        "Custom alert filters"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "£9,750",
      period: "per year",
      description: "Comprehensive solution for large organizations (£5M+ revenue)",
      features: [
        "Everything in Business",
        "Advanced analytics dashboard",
        "API access & integrations",
        "Custom threat modeling",
        "Dedicated account manager",
        "White-label options",
        "24/7 phone support"
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
          <img 
            src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop" 
            alt="Global network visualization" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-starlink-dark/80 via-starlink-dark/60 to-starlink-dark"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30 px-4 py-2 text-sm font-medium">
                🚀 Now Live: Real-time Global Threat Intelligence
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                See the Storm
                <br />
                <span className="text-starlink-blue">Before It Hits</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-starlink-grey-light leading-relaxed">
                OptiQsOn scans 10,000+ military, economic, cyber, and political signals to predict emerging conflict hotspots. 
                Built for resilience—at home and in business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button 
                  size="lg" 
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold px-8 py-4 text-lg"
                  asChild
                >
                  <Link to="/threat-map">
                    <Globe className="w-5 h-5 mr-2" />
                    Explore Live Threat Map
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-panel border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light px-8 py-4 text-lg"
                  asChild
                >
                  <Link to="/so-what">
                    <Shield className="w-5 h-5 mr-2" />
                    Build Your Resilience Kit
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Threat Map Preview */}
            <div className="relative">
              <div className="glass-panel rounded-xl p-4 lg:p-6">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop" 
                  alt="Threat intelligence dashboard interface" 
                  className="w-full h-80 lg:h-96 object-cover rounded-lg"
                />
                <div className="absolute inset-4 lg:inset-6 bg-gradient-to-t from-starlink-dark/60 to-transparent rounded-lg flex items-end">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-starlink-white mb-2">Live Threat Intelligence</h3>
                    <p className="text-starlink-grey-light text-sm">Real-time global monitoring across 195+ countries</p>
                  </div>
                </div>
              </div>
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
                <div className="relative h-48">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-starlink-dark/80 to-transparent"></div>
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
        </div>
      </section>

      {/* User Personas Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Built for Everyone</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Whether you're protecting your family or running a global enterprise, OptiQsOn adapts to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {personas.map((persona, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-starlink-blue/20 rounded-lg flex items-center justify-center mb-4">
                    <persona.icon className="w-6 h-6 text-starlink-blue" />
                  </div>
                  <CardTitle className="text-starlink-white text-2xl">{persona.title}</CardTitle>
                  <CardDescription className="text-starlink-grey-light text-base">
                    {persona.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {persona.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-starlink-blue flex-shrink-0" />
                        <span className="text-starlink-grey-light">{benefit}</span>
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
              Choose the plan that fits your security needs and budget
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
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark' 
                        : 'bg-starlink-slate-light hover:bg-starlink-slate text-starlink-white'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-starlink-grey-light mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <Button variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
              Contact Sales for Custom Enterprise Solutions
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
            Join thousands of individuals and organizations who trust OptiQsOn for their threat intelligence and resilience planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold px-8 py-4"
              asChild
            >
              <Link to="/threat-map">Start Free Trial</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
