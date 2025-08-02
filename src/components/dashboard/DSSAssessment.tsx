import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Calculator, 
  Save, 
  BarChart3, 
  AlertTriangle,
  Building,
  Globe,
  Users,
  DollarSign,
  Shield,
  TrendingUp
} from "lucide-react";

interface DSSAssessmentProps {
  userId: string;
  onScoreUpdate?: (score: number) => void;
}

interface DSSQuestion {
  id: string;
  category: string;
  question: string;
  type: 'radio' | 'select' | 'number' | 'text';
  options?: { value: string; label: string; weight: number }[];
  weight: number;
  icon: any;
}

export const DSSAssessment = ({ userId, onScoreUpdate }: DSSAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [dssScore, setDssScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const dssQuestions: DSSQuestion[] = [
    {
      id: 'geographic_concentration',
      category: 'Geographic Risk',
      question: 'How geographically concentrated are your operations?',
      type: 'radio',
      options: [
        { value: 'single_location', label: 'Single location/city', weight: 25 },
        { value: 'single_region', label: 'Single region/state', weight: 20 },
        { value: 'single_country', label: 'Single country', weight: 15 },
        { value: 'multiple_countries', label: 'Multiple countries', weight: 10 },
        { value: 'global_distributed', label: 'Globally distributed', weight: 5 }
      ],
      weight: 0.2,
      icon: Globe
    },
    {
      id: 'industry_sector',
      category: 'Industry Risk',
      question: 'Which sector best describes your primary industry?',
      type: 'select',
      options: [
        { value: 'financial', label: 'Financial Services', weight: 20 },
        { value: 'healthcare', label: 'Healthcare', weight: 18 },
        { value: 'technology', label: 'Technology', weight: 16 },
        { value: 'energy', label: 'Energy & Utilities', weight: 22 },
        { value: 'manufacturing', label: 'Manufacturing', weight: 19 },
        { value: 'retail', label: 'Retail & Consumer', weight: 14 },
        { value: 'government', label: 'Government', weight: 25 },
        { value: 'education', label: 'Education', weight: 12 },
        { value: 'other', label: 'Other', weight: 15 }
      ],
      weight: 0.18,
      icon: Building
    },
    {
      id: 'organization_size',
      category: 'Operational Scale',
      question: 'What is your organization size (employees)?',
      type: 'radio',
      options: [
        { value: 'micro', label: '1-10 employees', weight: 8 },
        { value: 'small', label: '11-50 employees', weight: 12 },
        { value: 'medium', label: '51-250 employees', weight: 16 },
        { value: 'large', label: '251-1000 employees', weight: 20 },
        { value: 'enterprise', label: '1000+ employees', weight: 25 }
      ],
      weight: 0.15,
      icon: Users
    },
    {
      id: 'revenue_range',
      category: 'Financial Impact',
      question: 'What is your annual revenue range?',
      type: 'select',
      options: [
        { value: 'under_1m', label: 'Under $1M', weight: 8 },
        { value: '1m_10m', label: '$1M - $10M', weight: 12 },
        { value: '10m_50m', label: '$10M - $50M', weight: 16 },
        { value: '50m_250m', label: '$50M - $250M', weight: 20 },
        { value: '250m_1b', label: '$250M - $1B', weight: 22 },
        { value: 'over_1b', label: 'Over $1B', weight: 25 }
      ],
      weight: 0.12,
      icon: DollarSign
    },
    {
      id: 'supply_chain_complexity',
      category: 'Supply Chain Risk',
      question: 'How complex is your supply chain?',
      type: 'radio',
      options: [
        { value: 'minimal', label: 'Minimal external dependencies', weight: 5 },
        { value: 'local', label: 'Primarily local suppliers', weight: 10 },
        { value: 'national', label: 'National supplier network', weight: 15 },
        { value: 'international', label: 'International suppliers', weight: 20 },
        { value: 'global_complex', label: 'Complex global supply chain', weight: 25 }
      ],
      weight: 0.15,
      icon: TrendingUp
    },
    {
      id: 'cybersecurity_maturity',
      category: 'Cyber Resilience',
      question: 'How would you rate your cybersecurity maturity?',
      type: 'radio',
      options: [
        { value: 'basic', label: 'Basic security measures', weight: 20 },
        { value: 'standard', label: 'Standard security protocols', weight: 15 },
        { value: 'advanced', label: 'Advanced security framework', weight: 10 },
        { value: 'enterprise', label: 'Enterprise-grade security', weight: 5 },
        { value: 'zero_trust', label: 'Zero-trust architecture', weight: 2 }
      ],
      weight: 0.1,
      icon: Shield
    },
    {
      id: 'crisis_preparedness',
      category: 'Crisis Management',
      question: 'Do you have formal crisis management procedures?',
      type: 'radio',
      options: [
        { value: 'none', label: 'No formal procedures', weight: 25 },
        { value: 'basic', label: 'Basic emergency plans', weight: 20 },
        { value: 'documented', label: 'Documented procedures', weight: 15 },
        { value: 'tested', label: 'Regularly tested plans', weight: 10 },
        { value: 'integrated', label: 'Integrated crisis management', weight: 5 }
      ],
      weight: 0.1,
      icon: AlertTriangle
    }
  ];

  useEffect(() => {
    loadExistingAssessment();
  }, [userId]);

  const loadExistingAssessment = async () => {
    try {
      const { data, error } = await supabase
        .from('user_dashboard_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data && data.alert_preferences && typeof data.alert_preferences === 'object') {
        const alertPrefs = data.alert_preferences as any;
        if (alertPrefs.dss_assessment) {
          setResponses(alertPrefs.dss_assessment.responses || {});
          setDssScore(alertPrefs.dss_assessment.score || 0);
          setHasCompletedAssessment(Object.keys(alertPrefs.dss_assessment.responses || {}).length > 0);
        }
      }
    } catch (error) {
      console.error('Error loading DSS assessment:', error);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateDSSScore = () => {
    setIsCalculating(true);
    
    let totalScore = 0;
    let totalWeight = 0;

    dssQuestions.forEach(question => {
      const response = responses[question.id];
      if (response) {
        let questionScore = 0;
        
        if (question.type === 'radio' || question.type === 'select') {
          const option = question.options?.find(opt => opt.value === response);
          if (option) {
            questionScore = option.weight;
          }
        } else if (question.type === 'number') {
          // For number inputs, we can apply custom scoring logic
          questionScore = Math.min(25, Math.max(5, parseInt(response) / 10));
        }
        
        totalScore += questionScore * question.weight;
        totalWeight += question.weight;
      }
    });

    const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    setDssScore(finalScore);
    setHasCompletedAssessment(true);
    
    if (onScoreUpdate) {
      onScoreUpdate(finalScore);
    }

    setTimeout(() => setIsCalculating(false), 1000);
  };

  const saveAssessment = async () => {
    try {
      // Get current preferences
      const { data: currentPrefs } = await supabase
        .from('user_dashboard_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const updatedPrefs = {
        user_id: userId,
        dashboard_layout: currentPrefs?.dashboard_layout || {},
        location_preferences: currentPrefs?.location_preferences || {},
        theme_preferences: currentPrefs?.theme_preferences || {},
        alert_preferences: {
          ...(typeof currentPrefs?.alert_preferences === 'object' ? currentPrefs.alert_preferences : {}),
          dss_assessment: {
            responses,
            score: dssScore,
            completed_at: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

      const { error } = await supabase
        .from('user_dashboard_preferences')
        .upsert(updatedPrefs);

      if (error) throw error;

      // Track analytics
      await supabase.rpc('update_dashboard_analytics', {
        p_user_id: userId,
        p_action: 'dss_assessment_completed'
      });

    } catch (error) {
      console.error('Error saving DSS assessment:', error);
    }
  };

  const getScoreSeverity = (score: number) => {
    if (score >= 80) return { label: 'Critical', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score >= 60) return { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (score >= 40) return { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (score >= 20) return { label: 'Low', color: 'bg-blue-500', textColor: 'text-blue-500' };
    return { label: 'Minimal', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const getCompletionPercentage = () => {
    const answeredQuestions = Object.keys(responses).length;
    return Math.round((answeredQuestions / dssQuestions.length) * 100);
  };

  const severity = getScoreSeverity(dssScore);

  return (
    <div className="space-y-6">
      {/* DSS Score Display */}
      {hasCompletedAssessment && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Your Disruption Sensitivity Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                      className="text-primary" strokeDasharray={`${dssScore * 2.51} 251`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{dssScore}</span>
                  </div>
                </div>
                <div>
                  <Badge className={`${severity.color} text-white`}>
                    {severity.label} Risk
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Assessment completed
                  </p>
                </div>
              </div>
              <Button onClick={saveAssessment} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Assessment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>DSS Assessment</span>
          </CardTitle>
          <CardDescription>
            Answer these questions to calculate your organization's Disruption Sensitivity Score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Completion Progress</span>
              <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>

          <div className="space-y-8">
            {dssQuestions.map((question, index) => {
              const Icon = question.icon;
              const isAnswered = responses[question.id] !== undefined;
              
              return (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${isAnswered ? 'bg-primary/10' : 'bg-muted/10'}`}>
                      <Icon className={`w-5 h-5 ${isAnswered ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{question.question}</h4>
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                      </div>

                      {question.type === 'radio' && (
                        <RadioGroup 
                          value={responses[question.id] || ''} 
                          onValueChange={(value) => handleResponseChange(question.id, value)}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options?.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                                <Label htmlFor={`${question.id}-${option.value}`} className="text-sm">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}

                      {question.type === 'select' && (
                        <Select 
                          value={responses[question.id] || ''} 
                          onValueChange={(value) => handleResponseChange(question.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {question.type === 'number' && (
                        <Input 
                          type="number"
                          value={responses[question.id] || ''}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          placeholder="Enter number"
                        />
                      )}
                    </div>
                  </div>
                  
                  {index < dssQuestions.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={calculateDSSScore}
              disabled={isCalculating || getCompletionPercentage() < 70}
              className="flex items-center space-x-2"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>Calculate DSS Score</span>
                </>
              )}
            </Button>
          </div>

          {getCompletionPercentage() < 70 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Answer at least 70% of questions to calculate your DSS score
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};