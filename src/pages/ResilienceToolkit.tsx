
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ExternalLink, PlayCircle, FileText, Users, Zap } from "lucide-react";

const ResilienceToolkit = () => {
  const toolkitSections = [
    {
      category: "Assessment",
      tools: [
        {
          title: "Business Impact Assessment",
          description: "Evaluate potential disruption scenarios and their business impact",
          type: "Interactive Tool",
          icon: <FileText className="w-5 h-5" />,
          status: "available"
        },
        {
          title: "Supply Chain Risk Mapper",
          description: "Identify vulnerabilities in your supply chain network",
          type: "Analysis Tool",
          icon: <Zap className="w-5 h-5" />,
          status: "beta"
        }
      ]
    },
    {
      category: "Planning",
      tools: [
        {
          title: "Crisis Response Playbook",
          description: "Step-by-step guidance for various threat scenarios",
          type: "Framework",
          icon: <Users className="w-5 h-5" />,
          status: "available"
        },
        {
          title: "Communication Templates",
          description: "Pre-drafted messages for stakeholder communication during crises",
          type: "Templates",
          icon: <FileText className="w-5 h-5" />,
          status: "available"
        }
      ]
    },
    {
      category: "Training",
      tools: [
        {
          title: "Threat Awareness Training",
          description: "Interactive modules for team threat awareness",
          type: "Course",
          icon: <PlayCircle className="w-5 h-5" />,
          status: "available"
        },
        {
          title: "Scenario Simulation",
          description: "Practice responses to realistic threat scenarios",
          type: "Simulation",
          icon: <Users className="w-5 h-5" />,
          status: "coming-soon"
        }
      ]
    }
  ];

  const resources = [
    {
      title: "Global Threat Landscape 2024",
      type: "Report",
      size: "2.4 MB",
      downloads: "1,247"
    },
    {
      title: "Cyber Resilience Checklist",
      type: "PDF",
      size: "580 KB",
      downloads: "3,156"
    },
    {
      title: "Supply Chain Risk Framework",
      type: "Guide",
      size: "1.8 MB",
      downloads: "892"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Resilience Toolkit</h1>
            <p className="text-starlink-grey-light text-lg">
              Comprehensive tools and resources to build organizational resilience against emerging threats
            </p>
          </div>

          <Tabs defaultValue="tools" className="space-y-6">
            <TabsList className="glass-panel border-starlink-grey/30">
              <TabsTrigger value="tools">Assessment Tools</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-8">
              {toolkitSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h2 className="text-2xl font-semibold mb-4 text-starlink-blue">{section.category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.tools.map((tool, toolIndex) => (
                      <Card key={toolIndex} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-starlink-blue/20 rounded-lg">
                                {tool.icon}
                              </div>
                              <div>
                                <CardTitle className="text-starlink-white">{tool.title}</CardTitle>
                                <CardDescription className="text-starlink-grey-light">
                                  {tool.type}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(tool.status)} text-white`}>
                              {tool.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-starlink-grey-light mb-4">{tool.description}</p>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                              disabled={tool.status === 'coming-soon'}
                            >
                              {tool.status === 'coming-soon' ? 'Coming Soon' : 'Launch Tool'}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                            >
                              Learn More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <Card key={index} className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-starlink-white flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-starlink-blue" />
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-starlink-grey-light">
                        {resource.type} • {resource.size}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-starlink-grey-light">
                          {resource.downloads} downloads
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <div className="text-center py-12">
                <PlayCircle className="w-16 h-16 text-starlink-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Training Modules</h3>
                <p className="text-starlink-grey-light mb-6">
                  Comprehensive training programs to enhance your team's threat awareness and response capabilities
                </p>
                <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark">
                  Start Training Program
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResilienceToolkit;
