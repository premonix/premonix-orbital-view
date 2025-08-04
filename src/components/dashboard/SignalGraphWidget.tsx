import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Network, 
  TrendingUp, 
  Link, 
  AlertTriangle,
  Target,
  Zap,
  GitBranch,
  Eye,
  Filter
} from "lucide-react";
import { RealThreatService } from "@/services/realThreatService";
import type { ThreatSignal } from "@/types/threat";

interface SignalCorrelation {
  id: string;
  signal1: ThreatSignal;
  signal2: ThreatSignal;
  strength: number; // 0-100
  type: 'geographic' | 'temporal' | 'thematic' | 'causal';
  confidence: number;
  strategicImplication: string;
}

interface SignalGraphWidgetProps {
  userId: string;
}

export const SignalGraphWidget = ({ userId }: SignalGraphWidgetProps) => {
  const [signals, setSignals] = useState<ThreatSignal[]>([]);
  const [correlations, setCorrelations] = useState<SignalCorrelation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignalData();
  }, []);

  const loadSignalData = async () => {
    try {
      const threatSignals = await RealThreatService.getLatestSignals(20);
      setSignals(threatSignals);
      
      // Generate mock correlations based on real signals
      const mockCorrelations = generateMockCorrelations(threatSignals);
      setCorrelations(mockCorrelations);
    } catch (error) {
      console.error('Error loading signal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockCorrelations = (signals: ThreatSignal[]): SignalCorrelation[] => {
    const correlations: SignalCorrelation[] = [];
    
    for (let i = 0; i < signals.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 3, signals.length); j++) {
        const signal1 = signals[i];
        const signal2 = signals[j];
        
        // Calculate correlation based on category, location, and time proximity
        const categoryMatch = signal1.category === signal2.category ? 40 : 0;
        const locationProximity = calculateLocationProximity(signal1, signal2);
        const timeProximity = calculateTimeProximity(signal1, signal2);
        
        const strength = Math.min(100, categoryMatch + locationProximity + timeProximity);
        
        if (strength > 30) {
          correlations.push({
            id: `${signal1.id}-${signal2.id}`,
            signal1,
            signal2,
            strength,
            type: getCorrelationType(signal1, signal2),
            confidence: Math.floor(Math.random() * 40) + 60,
            strategicImplication: generateStrategicImplication(signal1, signal2)
          });
        }
      }
    }
    
    return correlations.slice(0, 6); // Limit to 6 correlations
  };

  const calculateLocationProximity = (s1: ThreatSignal, s2: ThreatSignal): number => {
    const distance = Math.sqrt(
      Math.pow(s1.location.lat - s2.location.lat, 2) + 
      Math.pow(s1.location.lng - s2.location.lng, 2)
    );
    return Math.max(0, 30 - distance * 2);
  };

  const calculateTimeProximity = (s1: ThreatSignal, s2: ThreatSignal): number => {
    const timeDiff = Math.abs(s1.timestamp.getTime() - s2.timestamp.getTime());
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    return Math.max(0, 30 - daysDiff * 5);
  };

  const getCorrelationType = (s1: ThreatSignal, s2: ThreatSignal): SignalCorrelation['type'] => {
    if (s1.category === s2.category) return 'thematic';
    if (s1.location.country === s2.location.country) return 'geographic';
    const timeDiff = Math.abs(s1.timestamp.getTime() - s2.timestamp.getTime());
    if (timeDiff < 24 * 60 * 60 * 1000) return 'temporal';
    return 'causal';
  };

  const generateStrategicImplication = (s1: ThreatSignal, s2: ThreatSignal): string => {
    const implications = [
      `Escalating ${s1.category.toLowerCase()} tensions may spillover into ${s2.category.toLowerCase()} domain`,
      `Regional destabilization pattern emerging across ${s1.location.region} and ${s2.location.region}`,
      `Supply chain disruption cascade from ${s1.location.country} to ${s2.location.country}`,
      `Coordinated threat activity suggesting organized campaign`,
      `Economic spillover effects likely to amplify security concerns`
    ];
    return implications[Math.floor(Math.random() * implications.length)];
  };

  const getCorrelationIcon = (type: SignalCorrelation['type']) => {
    switch (type) {
      case 'geographic': return <Target className="w-4 h-4" />;
      case 'temporal': return <TrendingUp className="w-4 h-4" />;
      case 'thematic': return <GitBranch className="w-4 h-4" />;
      case 'causal': return <Zap className="w-4 h-4" />;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-red-500';
    if (strength >= 60) return 'text-orange-500';
    if (strength >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const filteredSignals = selectedCategory === 'all' 
    ? signals 
    : signals.filter(s => s.category === selectedCategory);

  const filteredCorrelations = correlations.filter(c => 
    selectedCategory === 'all' || 
    c.signal1.category === selectedCategory || 
    c.signal2.category === selectedCategory
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-primary animate-pulse" />
            <span>SignalGraph™</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-primary" />
            <span>SignalGraph™ - Signal to Strategy</span>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Military">Military</SelectItem>
                <SelectItem value="Cyber">Cyber</SelectItem>
                <SelectItem value="Economic">Economic</SelectItem>
                <SelectItem value="Diplomatic">Diplomatic</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Analyze signal correlations and strategic implications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="correlations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="network">Network View</TabsTrigger>
            <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="correlations" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Active Correlations</span>
                </div>
                <div className="text-lg font-semibold">{filteredCorrelations.length}</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">High Strength</span>
                </div>
                <div className="text-lg font-semibold">
                  {filteredCorrelations.filter(c => c.strength >= 70).length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredCorrelations.map((correlation) => (
                <div key={correlation.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getCorrelationIcon(correlation.type)}
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          {correlation.signal1.title} ↔ {correlation.signal2.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {correlation.type}
                          </Badge>
                          <span className={getStrengthColor(correlation.strength)}>
                            {correlation.strength}% strength
                          </span>
                          <span>{correlation.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <span className="font-medium">Strategic Implication: </span>
                    {correlation.strategicImplication}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="p-8 border rounded-lg bg-muted/20 text-center">
              <Network className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Network Visualization</h3>
              <p className="text-muted-foreground mb-4">
                Interactive signal correlation network coming soon
              </p>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Full Network
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Emerging Pattern: Regional Escalation
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Multiple signals indicate increasing tensions across Eastern Europe with potential spillover effects.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">High Confidence</Badge>
                  <Badge variant="outline" className="text-xs">3 Signals</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Supply Chain Vulnerability
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Cyber incidents targeting logistics infrastructure may compound with economic pressures.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Medium Confidence</Badge>
                  <Badge variant="outline" className="text-xs">2 Signals</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Analyzing {filteredSignals.length} signals across {filteredCorrelations.length} correlations
          </p>
          <Button variant="outline" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};