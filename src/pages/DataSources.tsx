
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Satellite, Radio, Database, Shield, Eye, Zap, Activity } from "lucide-react";

const DataSources = () => {
  const sourceCategories = [
    {
      title: "Open Source Intelligence (OSINT)",
      icon: Globe,
      description: "Publicly available information from diverse sources worldwide",
      sources: [
        { name: "GDELT Global Events Database", type: "Real-time", coverage: "195 countries" },
        { name: "Social Media Monitoring", type: "Live feeds", coverage: "Major platforms" },
        { name: "News Wire Services", type: "24/7", coverage: "Global media" },
        { name: "Government Publications", type: "Official", coverage: "State actors" }
      ],
      color: "blue"
    },
    {
      title: "Satellite Intelligence (GEOINT)",
      icon: Satellite,
      description: "Visual and radar intelligence from commercial satellite networks",
      sources: [
        { name: "Planet Labs Imagery", type: "Daily", coverage: "Global coverage" },
        { name: "Sentinel ESA Program", type: "Multi-spectral", coverage: "Earth observation" },
        { name: "Commercial SAR", type: "Weather-independent", coverage: "Critical regions" },
        { name: "Maritime Tracking", type: "AIS/RADAR", coverage: "Shipping lanes" }
      ],
      color: "orange"
    },
    {
      title: "Signals Intelligence (SIGINT)",
      icon: Radio,
      description: "Communications and electronic signals monitoring",
      sources: [
        { name: "Radio Frequency Monitoring", type: "Spectrum analysis", coverage: "Military bands" },
        { name: "Digital Communications", type: "Pattern analysis", coverage: "Encrypted traffic" },
        { name: "IoT Device Networks", type: "Anomaly detection", coverage: "Infrastructure" },
        { name: "Aviation Transponders", type: "Flight tracking", coverage: "Global airspace" }
      ],
      color: "red"
    },
    {
      title: "Cyber Intelligence (CYBINT)",
      icon: Shield,
      description: "Digital threat landscape and cyber attack indicators",
      sources: [
        { name: "Dark Web Monitoring", type: "Threat actor", coverage: "Underground markets" },
        { name: "Vulnerability Databases", type: "CVE tracking", coverage: "Software flaws" },
        { name: "Malware Analysis", type: "Behavioral", coverage: "Attack patterns" },
        { name: "Network Traffic Analysis", type: "Flow monitoring", coverage: "Internet backbone" }
      ],
      color: "purple"
    }
  ];

  const processingStats = [
    { metric: "10,000+", label: "Data Sources", description: "Continuously monitored feeds" },
    { metric: "50TB", label: "Daily Processing", description: "Raw intelligence data" },
    { metric: "<60s", label: "Detection Speed", description: "From signal to alert" },
    { metric: "99.7%", label: "Accuracy Rate", description: "Verified threat signals" }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: "bg-starlink-blue/20", text: "text-starlink-blue", border: "border-starlink-blue/30" },
      orange: { bg: "bg-starlink-orange/20", text: "text-starlink-orange", border: "border-starlink-orange/30" },
      red: { bg: "bg-starlink-red/20", text: "text-starlink-red", border: "border-starlink-red/30" },
      purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30 px-4 py-2 text-sm font-medium mb-8">
            Intelligence Sources
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            The Signal in
            <br />
            <span className="text-starlink-blue">The Noise</span>
          </h1>
          
          <p className="text-xl text-starlink-grey-light leading-relaxed">
            Our threat detection engine processes millions of data points from diverse intelligence 
            sources, using advanced AI to identify patterns and predict emerging risks.
          </p>
        </div>
      </section>

      {/* Processing Stats */}
      <section className="py-16 px-6 bg-starlink-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processingStats.map((stat, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30 text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-starlink-blue mb-2">{stat.metric}</div>
                  <div className="text-lg font-medium text-starlink-white mb-1">{stat.label}</div>
                  <div className="text-sm text-starlink-grey-light">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Source Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Intelligence Disciplines</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Our multi-source approach combines traditional intelligence disciplines with 
              cutting-edge digital monitoring capabilities.
            </p>
          </div>
          
          <div className="space-y-12">
            {sourceCategories.map((category, index) => {
              const colorClasses = getColorClasses(category.color);
              return (
                <Card key={index} className={`glass-panel ${colorClasses.border}`}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                        <category.icon className={`w-8 h-8 ${colorClasses.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-starlink-white">{category.title}</CardTitle>
                        <CardDescription className="text-starlink-grey-light text-lg">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.sources.map((source, sourceIndex) => (
                        <div key={sourceIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-starlink-white">{source.name}</h4>
                            <Badge variant="outline" className={`${colorClasses.text} border-current`}>
                              {source.type}
                            </Badge>
                          </div>
                          <p className="text-starlink-grey-light text-sm">{source.coverage}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Processing Pipeline */}
      <section className="py-16 px-6 bg-starlink-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">AI-Powered Processing</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Advanced machine learning algorithms analyze and correlate signals across 
              all intelligence sources to identify emerging threats.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-panel border-starlink-blue/50">
              <CardHeader>
                <div className="w-12 h-12 bg-starlink-blue/20 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-starlink-blue" />
                </div>
                <CardTitle className="text-starlink-white">Data Ingestion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-starlink-grey-light">
                  Real-time collection and normalization of structured and unstructured data 
                  from thousands of sources worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-starlink-orange/50">
              <CardHeader>
                <div className="w-12 h-12 bg-starlink-orange/20 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-starlink-orange" />
                </div>
                <CardTitle className="text-starlink-white">Pattern Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-starlink-grey-light">
                  Machine learning models identify anomalies, correlations, and emerging 
                  patterns that indicate potential threats.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-starlink-red/50">
              <CardHeader>
                <div className="w-12 h-12 bg-starlink-red/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-starlink-red" />
                </div>
                <CardTitle className="text-starlink-white">Threat Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-starlink-grey-light">
                  Automated risk assessment and confidence scoring enables rapid 
                  prioritization and alert distribution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Quality & Ethics */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Data Quality & Ethics</h2>
          <p className="text-xl text-starlink-grey-light mb-8">
            We maintain the highest standards for data accuracy, source verification, 
            and ethical intelligence practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-starlink-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-starlink-blue" />
              </div>
              <h3 className="text-xl font-semibold text-starlink-white mb-2">Privacy Protected</h3>
              <p className="text-starlink-grey-light">
                No personal data collection. Focus on aggregate patterns and public information only.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-starlink-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-starlink-orange" />
              </div>
              <h3 className="text-xl font-semibold text-starlink-white mb-2">Source Verified</h3>
              <p className="text-starlink-grey-light">
                Multi-source verification and credibility scoring for all intelligence feeds.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-starlink-red/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-starlink-red" />
              </div>
              <h3 className="text-xl font-semibold text-starlink-white mb-2">Transparent Methods</h3>
              <p className="text-starlink-grey-light">
                Open methodology and clear attribution for all threat assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DataSources;
