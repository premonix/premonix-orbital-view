
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Flask, 
  Plus, 
  Users, 
  Building,
  ToggleLeft,
  ToggleRight,
  MessageSquare
} from "lucide-react";

interface BetaFeature {
  id: string;
  name: string;
  description: string;
  status: 'development' | 'testing' | 'rollout' | 'stable';
  enabledUsers: number;
  totalUsers: number;
  feedbackCount: number;
  errorRate: number;
}

interface BetaUser {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'organization';
  features: string[];
}

const AdminBetaPanel = () => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const betaFeatures: BetaFeature[] = [
    {
      id: 'advanced_dss',
      name: 'Advanced DSS Builder',
      description: 'Enhanced Disruption Sensitivity Score calculation with ML predictions',
      status: 'testing',
      enabledUsers: 25,
      totalUsers: 1247,
      feedbackCount: 8,
      errorRate: 2.1
    },
    {
      id: 'ai_insights',
      name: 'AI-Powered Insights',
      description: 'Automated threat analysis and recommendations using GPT-4',
      status: 'development',
      enabledUsers: 5,
      totalUsers: 1247,
      feedbackCount: 3,
      errorRate: 8.5
    },
    {
      id: 'real_time_collab',
      name: 'Real-time Collaboration',
      description: 'Live editing and commenting on scenarios and playbooks',
      status: 'rollout',
      enabledUsers: 156,
      totalUsers: 1247,
      feedbackCount: 42,
      errorRate: 0.8
    },
    {
      id: 'mobile_app',
      name: 'Mobile App Beta',
      description: 'Native iOS and Android app with push notifications',
      status: 'testing',
      enabledUsers: 12,
      totalUsers: 1247,
      feedbackCount: 15,
      errorRate: 5.2
    }
  ];

  const betaUsers: BetaUser[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      type: 'individual',
      features: ['advanced_dss', 'real_time_collab']
    },
    {
      id: '2',
      name: 'Acme Corporation',
      email: 'beta@acmecorp.com',
      type: 'organization',
      features: ['advanced_dss', 'ai_insights', 'real_time_collab']
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      type: 'individual',
      features: ['mobile_app']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'development':
        return <Badge className="bg-red-600 text-white">Development</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-600 text-black">Testing</Badge>;
      case 'rollout':
        return <Badge className="bg-blue-600 text-white">Rollout</Badge>;
      case 'stable':
        return <Badge className="bg-green-600 text-white">Stable</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>;
    }
  };

  const addBetaUser = () => {
    if (newUserEmail && selectedFeature) {
      // Mock adding user to beta
      console.log(`Adding ${newUserEmail} to beta feature: ${selectedFeature}`);
      setNewUserEmail('');
      setSelectedFeature(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <Flask className="w-6 h-6 mr-2 text-starlink-blue" />
            Beta Program & Feature Flags
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Manage experimental features and beta user access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Beta Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-starlink-white">Beta Features</h3>
              {betaFeatures.map((feature) => (
                <div key={feature.id} className="p-4 bg-starlink-slate/20 rounded-lg border border-starlink-grey/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-starlink-white">{feature.name}</h4>
                      <p className="text-sm text-starlink-grey-light">{feature.description}</p>
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-starlink-blue">
                        {feature.enabledUsers}
                      </div>
                      <div className="text-xs text-starlink-grey-light">Beta Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-starlink-white">
                        {feature.feedbackCount}
                      </div>
                      <div className="text-xs text-starlink-grey-light">Feedback Items</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-starlink-grey-light">
                      Error Rate: <span className={`font-medium ${feature.errorRate > 5 ? 'text-red-400' : 'text-green-400'}`}>
                        {feature.errorRate}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={feature.enabledUsers > 0}
                        className="data-[state=checked]:bg-starlink-blue"
                      />
                      <span className="text-sm text-starlink-grey-light">
                        {feature.enabledUsers > 0 ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Beta Users Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-starlink-white">Beta Users</h3>
              
              {/* Add New Beta User */}
              <div className="p-4 bg-starlink-slate/20 rounded-lg border border-starlink-blue/30">
                <h4 className="font-medium text-starlink-white mb-3">Add Beta User</h4>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter email address..."
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="bg-starlink-slate/20 border-starlink-grey/30"
                  />
                  <select
                    value={selectedFeature || ''}
                    onChange={(e) => setSelectedFeature(e.target.value)}
                    className="w-full bg-starlink-slate/20 border border-starlink-grey/30 rounded-md px-3 py-2 text-starlink-white"
                  >
                    <option value="">Select feature...</option>
                    {betaFeatures.map((feature) => (
                      <option key={feature.id} value={feature.id}>
                        {feature.name}
                      </option>
                    ))}
                  </select>
                  <Button 
                    onClick={addBetaUser}
                    disabled={!newUserEmail || !selectedFeature}
                    className="w-full bg-starlink-blue hover:bg-starlink-blue-bright"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Beta
                  </Button>
                </div>
              </div>

              {/* Current Beta Users */}
              <div className="space-y-3">
                {betaUsers.map((user) => (
                  <div key={user.id} className="p-3 bg-starlink-slate/20 rounded-lg border border-starlink-grey/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {user.type === 'organization' ? 
                          <Building className="w-4 h-4 text-starlink-blue" /> : 
                          <Users className="w-4 h-4 text-starlink-blue" />
                        }
                        <span className="font-medium text-starlink-white">{user.name}</span>
                      </div>
                      <Badge className={user.type === 'organization' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {user.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-starlink-grey-light mb-2">{user.email}</div>
                    <div className="flex flex-wrap gap-1">
                      {user.features.map((featureId) => {
                        const feature = betaFeatures.find(f => f.id === featureId);
                        return (
                          <Badge key={featureId} className="bg-starlink-blue/20 text-starlink-blue text-xs">
                            {feature?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Summary */}
          <div className="mt-6 p-4 bg-starlink-blue/10 border border-starlink-blue/30 rounded-lg">
            <div className="flex items-center mb-2">
              <MessageSquare className="w-5 h-5 text-starlink-blue mr-2" />
              <h4 className="font-medium text-starlink-white">Recent Beta Feedback</h4>
            </div>
            <div className="text-sm text-starlink-grey-light">
              68 total feedback items across all beta features. 
              <button className="text-starlink-blue hover:underline ml-1">
                View detailed feedback →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBetaPanel;
