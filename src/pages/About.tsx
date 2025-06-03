
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Brain, Users, Target, Award, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "We deliver accurate, actionable intelligence when it matters most."
    },
    {
      icon: Shield,
      title: "Protection",
      description: "Your security and preparedness are our primary mission."
    },
    {
      icon: Brain,
      title: "Innovation",
      description: "Cutting-edge AI and technology drive our threat detection capabilities."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building resilient communities through shared knowledge and preparedness."
    }
  ];

  const team = [
    {
      name: "Security Intelligence",
      role: "Former military and intelligence professionals",
      description: "Deep expertise in global threat analysis and risk assessment."
    },
    {
      name: "AI & Data Science",
      role: "Machine learning and data engineering specialists",
      description: "Advanced algorithms for predictive threat modeling."
    },
    {
      name: "Crisis Management",
      role: "Emergency response and business continuity experts",
      description: "Practical experience in crisis leadership and resilience planning."
    }
  ];

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30 px-4 py-2 text-sm font-medium mb-8">
            About PREMONIX
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Predicting Tomorrow's
            <br />
            <span className="text-starlink-blue">Threats Today</span>
          </h1>
          
          <p className="text-xl text-starlink-grey-light leading-relaxed">
            PREMONIX was born from the recognition that in our interconnected world, 
            threats don't respect borders, and preparedness can't wait for headlines.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-starlink-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-starlink-grey-light mb-6">
                We democratize access to world-class threat intelligence, making it available 
                to individuals, families, and businesses of all sizes. Our platform transforms 
                complex global signals into actionable insights that help you prepare for 
                tomorrow's challenges today.
              </p>
              <p className="text-lg text-starlink-grey-light">
                By monitoring 10,000+ data sources across military, cyber, economic, and 
                political domains, we provide the early warning system that traditional 
                media and government alerts simply can't match.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-starlink-blue/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-starlink-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-starlink-white">Global Coverage</h3>
                    <p className="text-starlink-grey-light">195+ countries monitored 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-starlink-orange/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-starlink-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-starlink-white">Real-Time Processing</h3>
                    <p className="text-starlink-grey-light">Sub-minute threat detection and alerts</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-starlink-red/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-starlink-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-starlink-white">AI-Powered Insights</h3>
                    <p className="text-starlink-grey-light">Predictive modeling and pattern recognition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Everything we build is guided by these core principles that drive our mission forward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-starlink-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-starlink-blue" />
                  </div>
                  <CardTitle className="text-starlink-white text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-starlink-grey-light">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-starlink-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Expertise</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Our multidisciplinary team combines decades of experience in intelligence, 
              technology, and crisis management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <CardTitle className="text-starlink-white text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-starlink-blue font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-starlink-grey-light">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Built for Scale</h2>
          <p className="text-xl text-starlink-grey-light mb-8">
            Our infrastructure processes millions of data points daily, using advanced machine 
            learning to identify patterns and predict threats before they become headlines.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-starlink-blue mb-2">10,000+</div>
              <div className="text-starlink-grey-light">Data Sources</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-starlink-orange mb-2">99.9%</div>
              <div className="text-starlink-grey-light">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-starlink-red mb-2">&lt;60s</div>
              <div className="text-starlink-grey-light">Alert Delivery</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
