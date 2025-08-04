import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SectorData {
  sector: string;
  cyberRisk: number;
  physicalRisk: number;
  economicRisk: number;
  reputationalRisk: number;
  operationalRisk: number;
  overallRisk: number;
}

interface SectorRiskChartProps {
  data: SectorData[];
  selectedSector?: string;
}

export const SectorRiskChart: React.FC<SectorRiskChartProps> = ({ data, selectedSector }) => {
  const radarData = selectedSector 
    ? data.filter(item => item.sector === selectedSector).map(item => [
        { subject: 'Cyber Risk', A: item.cyberRisk, fullMark: 100 },
        { subject: 'Physical Risk', A: item.physicalRisk, fullMark: 100 },
        { subject: 'Economic Risk', A: item.economicRisk, fullMark: 100 },
        { subject: 'Reputational Risk', A: item.reputationalRisk, fullMark: 100 },
        { subject: 'Operational Risk', A: item.operationalRisk, fullMark: 100 },
      ])[0]
    : [];

  const barData = data.map(item => ({
    sector: item.sector.replace(' & ', ' &\n'),
    overall: item.overallRisk,
    cyber: item.cyberRisk,
    physical: item.physicalRisk,
    economic: item.economicRisk,
  }));

  return (
    <Card className="glass-panel border-starlink-grey/30">
      <CardHeader>
        <CardTitle className="text-starlink-white">Risk Analysis Charts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-starlink-slate/20">
            <TabsTrigger value="overview" className="text-starlink-white data-[state=active]:bg-starlink-blue">
              Sector Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-starlink-white data-[state=active]:bg-starlink-blue">
              Risk Breakdown
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="sector" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="overall" fill="#3B82F6" name="Overall Risk" />
                  <Bar dataKey="cyber" fill="#EF4444" name="Cyber Risk" />
                  <Bar dataKey="physical" fill="#F59E0B" name="Physical Risk" />
                  <Bar dataKey="economic" fill="#10B981" name="Economic Risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-4">
            {selectedSector && radarData.length > 0 ? (
              <div className="h-80">
                <h3 className="text-lg font-semibold text-starlink-white mb-4 text-center">
                  {selectedSector} - Detailed Risk Profile
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={12} />
                    <PolarRadiusAxis 
                      angle={0} 
                      domain={[0, 100]} 
                      stroke="#9CA3AF"
                      fontSize={10}
                    />
                    <Radar
                      name="Risk Level"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-starlink-grey-light">Select a sector to view detailed risk breakdown</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};