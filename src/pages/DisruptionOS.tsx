
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Target, 
  Zap, 
  Brain, 
  Network, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Building,
  Users,
  Globe,
  Settings
} from "lucide-react";

const DisruptionOS = () => {
  const coreFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "PREMONIX Control",
      subtitle: "Disruption Preparedness Office (DPO)",
      description: "Transform your central console into a virtual DPO with advanced decision tools beyond mapping.",
      features: [
        "Role-based access (Analyst, Ops, Executive)",
        "Escalation matrix with early warning thresholds", 
        "User-curated Threat Watchlist tracker",
        "Advanced command center interface"
      ],
      badge: "Enterprise"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "PREMONIX Risk Lens™",
      subtitle: "Disruption Sensitivity Score (DSS)",
      description: "Evaluate your sensitivity to disruption based on category, geography, industry, and dependencies.",
      features: [
        "DSS builder integrated in 'So What?' flow",
        "Auto-generated DSS from user data and location",
        "DSS badges across maps, toolkits, and dashboards",
        "Real-time sensitivity tracking"
      ],
      badge: "Pro"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "PREMONIX OpsLens™", 
      subtitle: "Initiative Portfolio & Playbooks",
      description: "Board view to plot business initiatives by risk exposure and urgency for strategic planning.",
      features: [
        "Upload initiatives with market/product/supply tags",
        "Map initiatives against global risk zones",
        "Auto-recommend Sandbox/Resilience actions",
        "Portfolio risk visualization"
      ],
      badge: "Enterprise"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "PREMONIX Future Sim™",
      subtitle: "Sandbox Engine",
      description: "Lightweight scenario planning tool for testing disruption responses before they happen.",
      features: [
        "Preset scenarios (Blackout + Cyber + Supply)",
        "Timeline impact simulation",
        "DSS evolution modeling",
        "Actionable response suggestions"
      ],
      badge: "Pro"
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "PREMONIX SignalGraph™",
      subtitle: "Signal Feed to Strategy",
      description: "Connect threat intelligence directly to strategic decisions with full transparency.",
      features: [
        "Feed visualizer with impact tagging",
        "Signal correlation mapping",
        "Weekly DSS shift digest",
        "Strategic decision tracking"
      ],
      badge: "Pro"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "PREMONIX Briefings™",
      subtitle: "Governance Layer",
      description: "Auto-generated executive briefings compiling signals, DSS shifts, and recommended actions.",
      features: [
        "PDF and Notion export capabilities",
        "Slack/MS Teams integration",
        "CISO/CRO-friendly summaries",
        "Automated governance reporting"
      ],
      badge: "Enterprise"
    }
  ];

  const integrationBlueprint = [
    { feature: "Global Map", augmentation: "DSS Overlays + Risk Zones", result: "Dynamic exposure heatmap" },
    { feature: "So What? Toolkit", augmentation: "DSS Builder + Action Links", result: "Personalized action plans" },
    { feature: "Crisis Playbooks", augmentation: "Sector scenarios", result: "Use-case-specific resilience" },
    { feature: "Dashboard Alerts", augmentation: "DSS Trending View", result: "Impact analysis, not just awareness" },
    { feature: "Data Feeds", augmentation: "Strategy Insights", result: "From awareness → preparedness" }
  ];

  const developmentPhases = [
    { phase: "Phase 1", feature: "Add DSS Builder", source: "DisruptionOS DSS Engine" },
    { phase: "Phase 2", feature: "Add Initiative Risk Lens", source: "Portfolio Board + Tagging" },
    { phase: "Phase 3", feature: "Upgrade So What? Toolkit", source: "DSS-triggered recommendations" },
    { phase: "Phase 4", feature: "Add Playbook Scenarios", source: "Pre-loaded + editable scenarios" },
    { phase: "Phase 5", feature: "Briefing Generator", source: "Governance Agent + DSS/Signal Graph" }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Pro': return 'bg-starlink-blue text-starlink-dark';
      case 'Enterprise': return 'bg-starlink-orange text-white';
      default: return 'bg-starlink-grey text-white';
    }
  };

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-starlink-blue text-starlink-dark mb-4 text-sm px-3 py-1">
              PAID FEATURES
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Disruption<span className="text-starlink-blue">OS</span>
            </h1>
            <p className="text-xl text-starlink-grey-light max-w-4xl mx-auto leading-relaxed">
              Elevate PREMONIX from real-time threat intelligence to a proactive, foresight-driven decision engine. 
              Transform awareness into preparedness with strategic disruption management.
            </p>
          </div>

          {/* Value Proposition */}
          <Card className="glass-panel border-starlink-blue/50 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-starlink-blue flex items-center">
                <Zap className="w-8 h-8 mr-3" />
                Strategic Augmentation
              </CardTitle>
              <CardDescription className="text-starlink-grey-light text-lg">
                From awareness to action: DisruptionOS transforms PREMONIX into a comprehensive resilience command center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-starlink-white mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Existing PREMONIX Core
                  </h4>
                  <ul className="space-y-2 text-starlink-grey-light">
                    <li>• Geo-based threat radar with global visualizations</li>
                    <li>• Real-time conflict and escalation alerts</li>
                    <li>• Personal, family, SME, and enterprise prep kits</li>
                    <li>• "So What?" module with tailored guidance</li>
                    <li>• Integrated global data feeds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-starlink-white mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-starlink-blue" />
                    DisruptionOS Enhancement
                  </h4>
                  <ul className="space-y-2 text-starlink-grey-light">
                    <li>• Proactive disruption sensitivity scoring</li>
                    <li>• Strategic scenario simulation engine</li>
                    <li>• Initiative portfolio risk mapping</li>
                    <li>• Automated governance briefings</li>
                    <li>• Signal-to-strategy correlation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="features" className="space-y-8">
            <TabsList className="glass-panel border-starlink-grey/30 w-full">
              <TabsTrigger value="features">Core Features</TabsTrigger>
              <TabsTrigger value="integration">Integration Blueprint</TabsTrigger>
              <TabsTrigger value="roadmap">Development Roadmap</TabsTrigger>
              <TabsTrigger value="impact">Strategic Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {coreFeatures.map((feature, index) => (
                  <Card key={index} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-starlink-blue/20 rounded-lg">
                            {feature.icon}
                          </div>
                          <div>
                            <CardTitle className="text-starlink-white">{feature.title}</CardTitle>
                            <CardDescription className="text-starlink-blue font-medium">
                              {feature.subtitle}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getBadgeColor(feature.badge)}>
                          {feature.badge}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-starlink-grey-light mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-starlink-blue rounded-full flex-shrink-0" />
                            <span className="text-sm text-starlink-grey-light">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-6">
              <Card className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <CardTitle className="text-starlink-white">UX Integration Blueprint</CardTitle>
                  <CardDescription className="text-starlink-grey-light">
                    How DisruptionOS transforms existing PREMONIX features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrationBlueprint.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-starlink-slate/20 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-starlink-white">{item.feature}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-starlink-blue flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-starlink-blue">{item.augmentation}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-starlink-blue flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-starlink-grey-light">{item.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6">
              <Card className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <CardTitle className="text-starlink-white">Development Sequence</CardTitle>
                  <CardDescription className="text-starlink-grey-light">
                    Suggested implementation phases for DisruptionOS integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {developmentPhases.map((phase, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-starlink-blue rounded-full flex items-center justify-center text-starlink-dark font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className="bg-starlink-slate text-starlink-white">{phase.phase}</Badge>
                            <h4 className="font-semibold text-starlink-white">{phase.feature}</h4>
                          </div>
                          <p className="text-starlink-grey-light">Integration Source: {phase.source}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader>
                    <CardTitle className="text-starlink-white flex items-center">
                      <Users className="w-6 h-6 mr-2 text-starlink-blue" />
                      Individual Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-starlink-grey-light">
                      Gain <span className="text-starlink-blue font-semibold">foresight, not just awareness</span>. 
                      Transform from reactive threat monitoring to proactive disruption preparedness.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader>
                    <CardTitle className="text-starlink-white flex items-center">
                      <Building className="w-6 h-6 mr-2 text-starlink-blue" />
                      Businesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-starlink-grey-light">
                      Turn PREMONIX into a <span className="text-starlink-blue font-semibold">resilience command center</span>. 
                      Strategic decision-making with disruption sensitivity at its core.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader>
                    <CardTitle className="text-starlink-white flex items-center">
                      <Globe className="w-6 h-6 mr-2 text-starlink-blue" />
                      Governments & Investors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-starlink-grey-light">
                      Use PREMONIX as a <span className="text-starlink-blue font-semibold">public safety and economic risk tracker</span>. 
                      Policy and investment decisions backed by disruption intelligence.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-starlink-grey/30">
                  <CardHeader>
                    <CardTitle className="text-starlink-white flex items-center">
                      <Settings className="w-6 h-6 mr-2 text-starlink-blue" />
                      Unified Platform
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-starlink-grey-light">
                      <span className="text-starlink-blue font-semibold">PREMONIX + DisruptionOS</span> = 
                      Global signal monitoring, strategic sensitivity scoring, and actionable resilience in one platform.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-panel border-starlink-blue/50 mt-8">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-starlink-white mb-4">Ready to Transform Your Resilience?</h3>
                    <p className="text-starlink-grey-light mb-6">
                      Join the next evolution of threat intelligence and strategic preparedness
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold">
                        Start Pro Trial
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                      >
                        Schedule Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DisruptionOS;
