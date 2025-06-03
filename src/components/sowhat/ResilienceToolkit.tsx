
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Users, Shield, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { UserProfile } from "@/types/sowhat";

interface ResilienceToolkitProps {
  userProfile: UserProfile;
}

const ResilienceToolkit = ({ userProfile }: ResilienceToolkitProps) => {
  const generateCoreChecklist = () => {
    const baseItems = [
      'Emergency contact list (digital & physical)',
      'Important documents backup (cloud & physical)',
      '3-day supply of food and water',
      'First aid kit and medications',
      'Battery-powered radio and flashlights',
      'Cash reserve in small bills',
      'Phone chargers and power banks'
    ];

    if (userProfile.userType === 'Family') {
      baseItems.push(
        'School emergency plans and contacts',
        'Child care backup arrangements',
        'Pet supplies and carriers'
      );
    }

    return baseItems;
  };

  const generateBusinessTools = () => {
    if (userProfile.userType === 'Personal' || userProfile.userType === 'Family') {
      return [];
    }

    const tools = [
      {
        title: 'Crisis Communication Plan',
        description: 'Pre-drafted templates for stakeholder communication',
        items: [
          'Employee notification system setup',
          'Customer communication templates',
          'Media response guidelines',
          'Social media crisis protocols'
        ]
      },
      {
        title: 'Business Continuity Plan',
        description: 'Essential operations maintenance framework',
        items: [
          'Critical process identification',
          'Alternative workspace arrangements',
          'Key personnel backup assignments',
          'Vendor contingency contacts'
        ]
      }
    ];

    if (userProfile.userType === 'Enterprise') {
      tools.push({
        title: 'Supply Chain Stress Test',
        description: 'Evaluate and strengthen your supply network',
        items: [
          'Supplier risk assessment matrix',
          'Alternative sourcing options',
          'Inventory buffer calculations',
          'Geographic risk mapping'
        ]
      });
    }

    return tools;
  };

  const getThreatSpecificGuidance = () => {
    const guidance: { [key: string]: string[] } = {};

    if (userProfile.primaryConcerns?.includes('Cyber attacks')) {
      guidance['Cyber Security'] = [
        'Enable multi-factor authentication on all accounts',
        'Regular backup of critical data',
        'Incident response contact list',
        'Offline communication alternatives'
      ];
    }

    if (userProfile.primaryConcerns?.includes('Supply chain disruption')) {
      guidance['Supply Chain'] = [
        'Local supplier alternatives identification',
        '30-day inventory buffer planning',
        'Critical vs non-critical supply prioritization',
        'Community resource networks'
      ];
    }

    if (userProfile.primaryConcerns?.includes('Power outages')) {
      guidance['Power Resilience'] = [
        'Backup power source options',
        'Manual operation procedures',
        'Communication during outages',
        'Food preservation alternatives'
      ];
    }

    return guidance;
  };

  const getReadinessScore = () => {
    let score = 30; // Base score
    
    if (userProfile.concernLevel === 'Preparing Actively') score += 30;
    else if (userProfile.concernLevel === 'Mildly Concerned') score += 15;
    
    if (userProfile.dependencies?.length > 0) score += 20;
    if (userProfile.primaryConcerns?.length >= 3) score += 20;
    
    return Math.min(score, 100);
  };

  return (
    <div className="space-y-8">
      {/* Readiness Score */}
      <Card className="glass-panel border-starlink-blue/50">
        <CardHeader>
          <CardTitle className="text-starlink-blue flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Your Current Readiness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-starlink-blue">{getReadinessScore()}%</div>
            <div className="flex-1">
              <div className="h-4 bg-starlink-slate rounded-full overflow-hidden">
                <div 
                  className="h-full bg-starlink-blue transition-all duration-500"
                  style={{ width: `${getReadinessScore()}%` }}
                />
              </div>
              <p className="text-starlink-grey-light mt-2">
                Based on your profile and current global threat levels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="core" className="space-y-6">
        <TabsList className="glass-panel border-starlink-grey/30">
          <TabsTrigger value="core">Core Toolkit</TabsTrigger>
          {(userProfile.userType === 'SME' || userProfile.userType === 'Enterprise') && (
            <TabsTrigger value="business">Business Tools</TabsTrigger>
          )}
          <TabsTrigger value="threats">Threat-Specific</TabsTrigger>
          <TabsTrigger value="download">Download & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-6">
          <Card className="glass-panel border-starlink-grey/30">
            <CardHeader>
              <CardTitle className="text-starlink-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-starlink-blue" />
                Emergency Preparedness Checklist
              </CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Essential items for {userProfile.userType.toLowerCase()} preparedness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {generateCoreChecklist().map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-starlink-blue rounded flex-shrink-0" />
                    <span className="text-starlink-grey-light">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-starlink-grey/30">
            <CardHeader>
              <CardTitle className="text-starlink-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-starlink-blue" />
                Communication Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-starlink-white mb-2">Primary Contacts</h4>
                    <div className="space-y-2 text-starlink-grey-light text-sm">
                      <div>Emergency Services: 999/911</div>
                      <div>Local Emergency Management</div>
                      <div>Work/School Emergency Lines</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-starlink-white mb-2">Backup Communication</h4>
                    <div className="space-y-2 text-starlink-grey-light text-sm">
                      <div>Ham radio frequencies</div>
                      <div>Mesh networking apps</div>
                      <div>Satellite communication options</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(userProfile.userType === 'SME' || userProfile.userType === 'Enterprise') && (
          <TabsContent value="business" className="space-y-6">
            {generateBusinessTools().map((tool, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <CardTitle className="text-starlink-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-starlink-blue" />
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-starlink-grey-light">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {tool.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-starlink-blue rounded flex-shrink-0" />
                        <span className="text-starlink-grey-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}

        <TabsContent value="threats" className="space-y-6">
          {Object.entries(getThreatSpecificGuidance()).map(([threat, items]) => (
            <Card key={threat} className="glass-panel border-starlink-grey/30">
              <CardHeader>
                <CardTitle className="text-starlink-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-starlink-orange" />
                  {threat} Preparedness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-4 h-4 border border-starlink-orange rounded flex-shrink-0" />
                      <span className="text-starlink-grey-light">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-starlink-white flex items-center">
                  <Download className="w-5 h-5 mr-2 text-starlink-blue" />
                  PDF Export
                </CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Complete resilience kit as PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-starlink-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-starlink-blue" />
                  Add to Notion
                </CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Import as editable template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                >
                  Export to Notion
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-starlink-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-starlink-blue" />
                  Print Version
                </CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Minimalist printable format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                >
                  Print Kit
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-starlink-grey/30">
            <CardHeader>
              <CardTitle className="text-starlink-white">Alert Integration</CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Connect your resilience kit to live threat alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                  📧 Email Alerts
                </Button>
                <Button variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                  💬 Slack Integration
                </Button>
                <Button variant="outline" className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light">
                  📱 SMS Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResilienceToolkit;
