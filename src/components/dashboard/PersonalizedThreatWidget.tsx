import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  MapPin,
  Building2,
  Star
} from 'lucide-react';

interface PersonalizedThreat {
  id: string;
  title: string;
  summary: string;
  category: string;
  severity: string;
  relevance_score: number;
  geographic_scope: string;
  affected_sectors: string[];
  personalization_reasons: string[];
  created_at: string;
}

interface UserProfile {
  sector: string;
  size: string;
  region: string;
  locations: string[];
  dss_score: number;
  risk_level: string;
}

export const PersonalizedThreatWidget = () => {
  const [personalizedThreats, setPersonalizedThreats] = useState<PersonalizedThreat[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    highRelevance: 0,
    immediateThreats: 0,
    sectorSpecific: 0,
    regionalThreats: 0
  });

  useEffect(() => {
    loadUserProfile();
    loadPersonalizedThreats();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get organization profile
      const { data: orgProfile } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get latest DSS assessment
      const { data: dssAssessment } = await supabase
        .from('dss_assessments')
        .select('overall_score, risk_level')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (orgProfile) {
        setUserProfile({
          sector: orgProfile.sector || 'other',
          size: orgProfile.size || 'medium',
          region: orgProfile.primary_region || 'global',
          locations: orgProfile.locations || [],
          dss_score: dssAssessment?.overall_score || 50,
          risk_level: dssAssessment?.risk_level || 'medium'
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadPersonalizedThreats = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !userProfile) return;

      // Get recent threats
      const { data: threats, error } = await supabase
        .from('threat_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (threats) {
        // Filter and score threats based on user profile
        const personalizedList = threats
          .map(threat => {
            const relevanceReasons: string[] = [];
            let relevanceScore = 0;

            // Sector relevance
            if (threat.category && userProfile.sector) {
              const sectorMapping: Record<string, string[]> = {
                'financial_services': ['Financial', 'Economic', 'Cyber'],
                'healthcare': ['Health', 'Medical', 'Cyber'],
                'technology': ['Cyber', 'Technology', 'Innovation'],
                'government_public_sector': ['Political', 'Military', 'Governance'],
                'energy_utilities': ['Energy', 'Infrastructure', 'Environmental'],
                'manufacturing': ['Supply Chain', 'Industrial', 'Economic'],
                'transportation_logistics': ['Transportation', 'Supply Chain', 'Infrastructure']
              };

              const relevantCategories = sectorMapping[userProfile.sector] || [];
              if (relevantCategories.some(cat => threat.category.includes(cat))) {
                relevanceScore += 30;
                relevanceReasons.push(`Relevant to ${userProfile.sector} sector`);
              }
            }

            // Geographic relevance
            if (threat.country && userProfile.locations.includes(threat.country)) {
              relevanceScore += 25;
              relevanceReasons.push(`Affects your operational region: ${threat.country}`);
            }

            // Severity adjustment based on DSS score
            if (userProfile.dss_score > 70 && ['high', 'critical'].includes(threat.severity)) {
              relevanceScore += 20;
              relevanceReasons.push('High-risk organization - priority threat');
            }

            // Category-specific scoring
            if (threat.category === 'Cyber' && userProfile.dss_score < 50) {
              relevanceScore += 15;
              relevanceReasons.push('Cyber vulnerability detected in assessment');
            }

            return {
              ...threat,
              relevance_score: Math.min(relevanceScore, 100),
              personalization_reasons: relevanceReasons,
              affected_sectors: [userProfile.sector],
              geographic_scope: threat.region || 'Global'
            };
          })
          .filter(threat => threat.relevance_score > 20)
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, 10);

        setPersonalizedThreats(personalizedList);
        updateStats(personalizedList);
      }
    } catch (error) {
      console.error('Error loading personalized threats:', error);
      toast.error('Failed to load personalized threats');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (threats: PersonalizedThreat[]) => {
    const newStats = {
      highRelevance: threats.filter(t => t.relevance_score >= 70).length,
      immediateThreats: threats.filter(t => t.severity === 'critical').length,
      sectorSpecific: threats.filter(t => t.personalization_reasons.some(r => r.includes('sector'))).length,
      regionalThreats: threats.filter(t => t.personalization_reasons.some(r => r.includes('region'))).length
    };
    setStats(newStats);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-yellow-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personalized Threat Intelligence
            {isLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </div>
          <Button 
            size="sm" 
            onClick={loadPersonalizedThreats}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Profile Summary */}
        {userProfile && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Your Risk Profile</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>{userProfile.sector} • {userProfile.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{userProfile.region}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>DSS Risk Score</span>
                <span className={`font-medium ${userProfile.dss_score > 70 ? 'text-red-600' : userProfile.dss_score > 40 ? 'text-orange-600' : 'text-green-600'}`}>
                  {userProfile.dss_score}/100
                </span>
              </div>
              <Progress value={userProfile.dss_score} className="h-2" />
            </div>
          </div>
        )}

        {/* Personalization Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.highRelevance}</div>
            <div className="text-sm text-muted-foreground">High Relevance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.immediateThreats}</div>
            <div className="text-sm text-muted-foreground">Immediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.sectorSpecific}</div>
            <div className="text-sm text-muted-foreground">Sector Specific</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.regionalThreats}</div>
            <div className="text-sm text-muted-foreground">Regional</div>
          </div>
        </div>

        {/* Personalized Threats List */}
        {personalizedThreats.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              Threats Relevant to You
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {personalizedThreats.map((threat) => (
                <div key={threat.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{threat.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {threat.summary?.slice(0, 150)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className={`w-4 h-4 ${getRelevanceColor(threat.relevance_score)}`} />
                      <span className={`text-xs font-medium ${getRelevanceColor(threat.relevance_score)}`}>
                        {threat.relevance_score}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity}
                    </Badge>
                    <Badge variant="outline">{threat.category}</Badge>
                    {threat.geographic_scope && (
                      <Badge variant="secondary">{threat.geographic_scope}</Badge>
                    )}
                  </div>

                  {threat.personalization_reasons.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded text-sm">
                      <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Why this is relevant to you:
                      </div>
                      <ul className="text-yellow-700 dark:text-yellow-300 text-xs space-y-1">
                        {threat.personalization_reasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && personalizedThreats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Complete your organization profile to see personalized threats</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};