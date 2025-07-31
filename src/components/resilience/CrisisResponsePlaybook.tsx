import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Users, Phone, MapPin, Clock, FileText, Download } from "lucide-react";

interface CrisisScenario {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Cyber' | 'Physical' | 'Supply Chain' | 'Personnel' | 'Natural';
  description: string;
  steps: CrisisStep[];
}

interface CrisisStep {
  order: number;
  title: string;
  description: string;
  timeframe: string;
  responsible: string;
  contacts: string[];
}

const CrisisResponsePlaybook = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [customScenario, setCustomScenario] = useState<Partial<CrisisScenario>>({});
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  const predefinedScenarios: CrisisScenario[] = [
    {
      id: 'cyber-attack',
      title: 'Cyber Security Incident',
      severity: 'Critical',
      category: 'Cyber',
      description: 'Ransomware, data breach, or system compromise requiring immediate response',
      steps: [
        {
          order: 1,
          title: 'Immediate Isolation',
          description: 'Disconnect affected systems from network to prevent spread',
          timeframe: '0-15 minutes',
          responsible: 'IT Security Team',
          contacts: ['IT Director', 'CISO', 'External Security Consultant']
        },
        {
          order: 2,
          title: 'Assessment & Documentation',
          description: 'Determine scope of breach and document evidence',
          timeframe: '15-60 minutes',
          responsible: 'Security Analyst',
          contacts: ['Legal Team', 'Forensics Expert']
        },
        {
          order: 3,
          title: 'Stakeholder Notification',
          description: 'Inform management, legal, and relevant authorities',
          timeframe: '1-4 hours',
          responsible: 'Crisis Communication Team',
          contacts: ['CEO', 'Legal Counsel', 'PR Team']
        },
        {
          order: 4,
          title: 'Recovery Initiation',
          description: 'Begin system restoration from clean backups',
          timeframe: '4-24 hours',
          responsible: 'IT Recovery Team',
          contacts: ['Backup Administrator', 'System Architects']
        }
      ]
    },
    {
      id: 'supply-disruption',
      title: 'Supply Chain Disruption',
      severity: 'High',
      category: 'Supply Chain',
      description: 'Critical supplier failure or logistics breakdown affecting operations',
      steps: [
        {
          order: 1,
          title: 'Impact Assessment',
          description: 'Evaluate affected products, services, and customer commitments',
          timeframe: '0-30 minutes',
          responsible: 'Supply Chain Manager',
          contacts: ['Operations Director', 'Customer Service Lead']
        },
        {
          order: 2,
          title: 'Alternative Sourcing',
          description: 'Activate backup suppliers and alternative logistics routes',
          timeframe: '30 minutes - 2 hours',
          responsible: 'Procurement Team',
          contacts: ['Backup Suppliers', 'Logistics Partners']
        },
        {
          order: 3,
          title: 'Customer Communication',
          description: 'Proactively communicate with affected customers',
          timeframe: '2-6 hours',
          responsible: 'Customer Success Team',
          contacts: ['Account Managers', 'Customer Service']
        },
        {
          order: 4,
          title: 'Long-term Mitigation',
          description: 'Implement temporary solutions and plan recovery',
          timeframe: '6-48 hours',
          responsible: 'Operations Team',
          contacts: ['Senior Management', 'Strategy Team']
        }
      ]
    },
    {
      id: 'power-outage',
      title: 'Extended Power Outage',
      severity: 'Medium',
      category: 'Physical',
      description: 'Loss of electrical power affecting business operations',
      steps: [
        {
          order: 1,
          title: 'Emergency Power Activation',
          description: 'Switch to backup generators and UPS systems',
          timeframe: '0-5 minutes',
          responsible: 'Facilities Team',
          contacts: ['Building Manager', 'Electrical Contractor']
        },
        {
          order: 2,
          title: 'Essential Systems Priority',
          description: 'Prioritize power for critical business functions',
          timeframe: '5-30 minutes',
          responsible: 'IT Operations',
          contacts: ['Server Administrator', 'Network Team']
        },
        {
          order: 3,
          title: 'Staff Safety & Communication',
          description: 'Ensure staff safety and establish communication protocols',
          timeframe: '30 minutes - 1 hour',
          responsible: 'HR Manager',
          contacts: ['Security Team', 'Emergency Contacts']
        },
        {
          order: 4,
          title: 'Business Continuity',
          description: 'Implement manual processes and remote work options',
          timeframe: '1-4 hours',
          responsible: 'Operations Manager',
          contacts: ['Department Heads', 'IT Support']
        }
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-black';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cyber': return '🔒';
      case 'Physical': return '🏢';
      case 'Supply Chain': return '🚚';
      case 'Personnel': return '👥';
      case 'Natural': return '🌪️';
      default: return '⚠️';
    }
  };

  const renderScenarioDetails = (scenario: CrisisScenario) => (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <span className="text-2xl mr-2">{getCategoryIcon(scenario.category)}</span>
            {scenario.title}
          </CardTitle>
          <CardDescription className="text-starlink-grey-light flex items-center gap-2">
            <Badge className={getSeverityColor(scenario.severity)}>
              {scenario.severity}
            </Badge>
            <span>{scenario.category}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-starlink-grey-light">{scenario.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-starlink-white">Response Steps</h3>
        {scenario.steps.map((step, index) => (
          <Card key={index} className="glass-panel border-starlink-grey/30">
            <CardHeader>
              <CardTitle className="text-starlink-white flex items-center">
                <div className="w-8 h-8 bg-starlink-blue rounded-full flex items-center justify-center text-starlink-dark font-bold mr-3">
                  {step.order}
                </div>
                {step.title}
              </CardTitle>
              <CardDescription className="text-starlink-grey-light flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {step.timeframe}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-starlink-grey-light mb-4">{step.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-starlink-white mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Responsible
                  </h5>
                  <p className="text-starlink-grey-light">{step.responsible}</p>
                </div>
                <div>
                  <h5 className="font-medium text-starlink-white mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Key Contacts
                  </h5>
                  <ul className="text-starlink-grey-light">
                    {step.contacts.map((contact, contactIndex) => (
                      <li key={contactIndex}>• {contact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark">
          <Download className="w-4 h-4 mr-2" />
          Export Playbook
        </Button>
        <Button 
          variant="outline"
          className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
        >
          <FileText className="w-4 h-4 mr-2" />
          Print Version
        </Button>
      </div>
    </div>
  );

  const renderCustomScenarioForm = () => (
    <Card className="glass-panel border-starlink-grey/30">
      <CardHeader>
        <CardTitle className="text-starlink-white">Create Custom Crisis Scenario</CardTitle>
        <CardDescription className="text-starlink-grey-light">
          Build a tailored response plan for your specific risks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="scenario-title" className="text-starlink-white">Scenario Title</Label>
          <Input
            id="scenario-title"
            value={customScenario.title || ''}
            onChange={(e) => setCustomScenario({ ...customScenario, title: e.target.value })}
            placeholder="e.g., Key Personnel Unavailable"
            className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
          />
        </div>

        <div>
          <Label htmlFor="scenario-description" className="text-starlink-white">Description</Label>
          <Textarea
            id="scenario-description"
            value={customScenario.description || ''}
            onChange={(e) => setCustomScenario({ ...customScenario, description: e.target.value })}
            placeholder="Describe the crisis scenario and its potential impact..."
            className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-starlink-white">Severity Level</Label>
            <div className="space-y-2 mt-2">
              {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="severity"
                    value={level}
                    checked={customScenario.severity === level}
                    onChange={(e) => setCustomScenario({ ...customScenario, severity: e.target.value as CrisisScenario['severity'] })}
                    className="text-starlink-blue"
                  />
                  <span className="text-starlink-grey-light">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-starlink-white">Category</Label>
            <div className="space-y-2 mt-2">
              {['Cyber', 'Physical', 'Supply Chain', 'Personnel', 'Natural'].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={customScenario.category === category}
                    onChange={(e) => setCustomScenario({ ...customScenario, category: e.target.value as CrisisScenario['category'] })}
                    className="text-starlink-blue"
                  />
                  <span className="text-starlink-grey-light">{getCategoryIcon(category)} {category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
            disabled={!customScenario.title || !customScenario.description || !customScenario.severity || !customScenario.category}
          >
            Continue to Steps
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsCreatingCustom(false)}
            className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-blue/50">
        <CardHeader>
          <CardTitle className="text-starlink-blue flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Crisis Response Playbook
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Step-by-step guidance for various threat scenarios
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="glass-panel border-starlink-grey/30">
          <TabsTrigger value="scenarios">Predefined Scenarios</TabsTrigger>
          <TabsTrigger value="custom">Custom Scenarios</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {!selectedScenario ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predefinedScenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-starlink-white flex items-center">
                      <span className="text-2xl mr-2">{getCategoryIcon(scenario.category)}</span>
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="text-starlink-grey-light">
                      <Badge className={getSeverityColor(scenario.severity) + ' mr-2'}>
                        {scenario.severity}
                      </Badge>
                      {scenario.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-starlink-grey-light text-sm">{scenario.description}</p>
                    <div className="mt-4 text-starlink-blue text-sm">
                      {scenario.steps.length} response steps →
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <Button 
                variant="outline"
                onClick={() => setSelectedScenario('')}
                className="mb-6 border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
              >
                ← Back to Scenarios
              </Button>
              {renderScenarioDetails(predefinedScenarios.find(s => s.id === selectedScenario)!)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {!isCreatingCustom ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-starlink-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-starlink-white mb-2">Create Custom Scenarios</h3>
              <p className="text-starlink-grey-light mb-6">
                Build tailored crisis response plans for your organization's unique risks
              </p>
              <Button 
                onClick={() => setIsCreatingCustom(true)}
                className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
              >
                Create New Scenario
              </Button>
            </div>
          ) : (
            renderCustomScenarioForm()
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card className="glass-panel border-starlink-grey/30">
            <CardHeader>
              <CardTitle className="text-starlink-white flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contact Directory
              </CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Maintain up-to-date emergency contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-starlink-white mb-3">External Emergency Services</h4>
                  <div className="space-y-2 text-starlink-grey-light">
                    <div className="flex justify-between">
                      <span>Emergency Services:</span>
                      <span className="text-starlink-blue">999 / 911</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Poison Control:</span>
                      <span className="text-starlink-blue">111</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cyber Crime Unit:</span>
                      <span className="text-starlink-blue">0300 123 2040</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-starlink-white mb-3">Internal Crisis Team</h4>
                  <div className="space-y-2 text-starlink-grey-light">
                    <div className="flex justify-between">
                      <span>Crisis Manager:</span>
                      <span className="text-starlink-blue">[To be filled]</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IT Security Lead:</span>
                      <span className="text-starlink-blue">[To be filled]</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Communications Lead:</span>
                      <span className="text-starlink-blue">[To be filled]</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  variant="outline"
                  className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                >
                  Edit Contact Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrisisResponsePlaybook;