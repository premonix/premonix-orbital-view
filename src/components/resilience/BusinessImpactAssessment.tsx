import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingDown, TrendingUp, Clock } from "lucide-react";

interface BusinessProcess {
  name: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  downtime: number; // hours before significant impact
  dependencies: string[];
}

const BusinessImpactAssessment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [newProcess, setNewProcess] = useState<Partial<BusinessProcess>>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const predefinedProcesses = [
    'Customer Service',
    'Payment Processing',
    'Manufacturing',
    'Inventory Management',
    'IT Systems',
    'Communications',
    'Supply Chain',
    'Human Resources'
  ];

  const addProcess = () => {
    if (newProcess.name && newProcess.criticality && newProcess.downtime) {
      setProcesses([...processes, newProcess as BusinessProcess]);
      setNewProcess({});
    }
  };

  const calculateRiskScore = () => {
    if (processes.length === 0) return 0;
    
    const criticalityWeights = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    const totalScore = processes.reduce((sum, process) => {
      const weight = criticalityWeights[process.criticality];
      const timeWeight = process.downtime <= 1 ? 4 : process.downtime <= 4 ? 3 : process.downtime <= 24 ? 2 : 1;
      return sum + (weight * timeWeight);
    }, 0);
    
    return Math.min(Math.round((totalScore / (processes.length * 16)) * 100), 100);
  };

  const getRecommendations = () => {
    const riskScore = calculateRiskScore();
    const criticalProcesses = processes.filter(p => p.criticality === 'Critical' || p.criticality === 'High');
    
    const recommendations = [];
    
    if (riskScore > 70) {
      recommendations.push('Immediate action required - develop comprehensive business continuity plan');
    }
    
    if (criticalProcesses.length > 0) {
      recommendations.push(`Focus on ${criticalProcesses.length} high-priority processes first`);
    }
    
    if (processes.some(p => p.downtime <= 1)) {
      recommendations.push('Implement real-time backup systems for time-critical processes');
    }
    
    recommendations.push('Create detailed recovery procedures for each identified process');
    recommendations.push('Establish alternative communication channels');
    
    return recommendations;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-starlink-white mb-4">
                Identify Your Critical Business Processes
              </h3>
              <p className="text-starlink-grey-light mb-6">
                List the key processes that keep your business running. Consider both customer-facing and internal operations.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {predefinedProcesses.map((process) => (
                  <Button
                    key={process}
                    variant="outline"
                    size="sm"
                    onClick={() => setNewProcess({ ...newProcess, name: process })}
                    className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                  >
                    {process}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="process-name" className="text-starlink-white">Custom Process Name</Label>
                  <Input
                    id="process-name"
                    value={newProcess.name || ''}
                    onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                    placeholder="Enter process name"
                    className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
                  />
                </div>

                <div>
                  <Label className="text-starlink-white mb-3 block">Criticality Level</Label>
                  <RadioGroup 
                    value={newProcess.criticality} 
                    onValueChange={(value) => setNewProcess({ ...newProcess, criticality: value as BusinessProcess['criticality'] })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Low" id="low" />
                      <Label htmlFor="low" className="text-starlink-grey-light">Low - Minor impact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Medium" id="medium" />
                      <Label htmlFor="medium" className="text-starlink-grey-light">Medium - Noticeable impact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="High" id="high" />
                      <Label htmlFor="high" className="text-starlink-grey-light">High - Significant impact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Critical" id="critical" />
                      <Label htmlFor="critical" className="text-starlink-grey-light">Critical - Business stopping</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="downtime" className="text-starlink-white">Maximum Acceptable Downtime (hours)</Label>
                  <Input
                    id="downtime"
                    type="number"
                    value={newProcess.downtime || ''}
                    onChange={(e) => setNewProcess({ ...newProcess, downtime: parseInt(e.target.value) })}
                    placeholder="Hours before critical impact"
                    className="bg-starlink-slate/50 border-starlink-grey/40 text-starlink-white"
                  />
                </div>

                <Button 
                  onClick={addProcess}
                  disabled={!newProcess.name || !newProcess.criticality || !newProcess.downtime}
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                >
                  Add Process
                </Button>
              </div>

              {processes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-starlink-white mb-3">Added Processes:</h4>
                  <div className="space-y-2">
                    {processes.map((process, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-starlink-slate/30 rounded">
                        <div>
                          <span className="text-starlink-white">{process.name}</span>
                          <span className="text-starlink-grey-light ml-2">({process.criticality})</span>
                        </div>
                        <span className="text-starlink-grey-light">{process.downtime}h max downtime</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-starlink-white mb-4">
                Impact Analysis Results
              </h3>
              
              <Card className="glass-panel border-starlink-blue/50 mb-6">
                <CardHeader>
                  <CardTitle className="text-starlink-blue flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    Business Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-starlink-blue">{calculateRiskScore()}%</div>
                    <div className="flex-1">
                      <div className="h-4 bg-starlink-slate rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            calculateRiskScore() > 70 ? 'bg-red-500' : 
                            calculateRiskScore() > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${calculateRiskScore()}%` }}
                        />
                      </div>
                      <p className="text-starlink-grey-light mt-2">
                        {calculateRiskScore() > 70 ? 'High Risk' : 
                         calculateRiskScore() > 40 ? 'Medium Risk' : 'Low Risk'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processes.map((process, index) => (
                  <Card key={index} className="glass-panel border-starlink-grey/30">
                    <CardHeader>
                      <CardTitle className="text-starlink-white flex items-center">
                        {process.criticality === 'Critical' ? 
                          <TrendingUp className="w-5 h-5 mr-2 text-red-500" /> :
                          process.criticality === 'High' ?
                          <TrendingDown className="w-5 h-5 mr-2 text-yellow-500" /> :
                          <Clock className="w-5 h-5 mr-2 text-green-500" />
                        }
                        {process.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-starlink-grey-light">Criticality:</span>
                          <span className={`font-medium ${
                            process.criticality === 'Critical' ? 'text-red-400' :
                            process.criticality === 'High' ? 'text-yellow-400' :
                            process.criticality === 'Medium' ? 'text-blue-400' : 'text-green-400'
                          }`}>
                            {process.criticality}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-starlink-grey-light">Max Downtime:</span>
                          <span className="text-starlink-white">{process.downtime} hours</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-starlink-white mb-4">
                Recommendations & Next Steps
              </h3>
              
              <Card className="glass-panel border-starlink-grey/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-starlink-white">Priority Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getRecommendations().map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-starlink-blue rounded-full mt-2 flex-shrink-0" />
                        <span className="text-starlink-grey-light">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setAssessmentComplete(true)}
                  className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
                >
                  Generate Full Report
                </Button>
                <Button 
                  variant="outline"
                  className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
                >
                  Export to PDF
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (assessmentComplete) {
    return (
      <Card className="glass-panel border-starlink-blue/50">
        <CardHeader>
          <CardTitle className="text-starlink-blue">Assessment Complete!</CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Your business impact assessment has been saved. You can now proceed to develop specific mitigation strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setAssessmentComplete(false);
                setProcesses([]);
              }}
              variant="outline"
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              Start New Assessment
            </Button>
            <Button className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark">
              Continue to Crisis Response Planning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-starlink-grey/30 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-starlink-white">Business Impact Assessment</CardTitle>
            <CardDescription className="text-starlink-grey-light">
              Step {currentStep} of {totalSteps}
            </CardDescription>
          </div>
          <div className="w-32">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && processes.length === 0) ||
              currentStep === totalSteps
            }
            className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
          >
            {currentStep === totalSteps ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessImpactAssessment;