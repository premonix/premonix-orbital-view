
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Users,
  Settings,
  Key
} from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'features' | 'admin' | 'export';
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  requiresMFA: boolean;
  apiAccess: boolean;
}

const AdminRolesPanel = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const permissions: Permission[] = [
    { id: 'view_threat_map', name: 'View Threat Map', description: 'Access to global threat visualization', category: 'data' },
    { id: 'view_feed', name: 'View Signal Feed', description: 'Access to threat intelligence feed', category: 'data' },
    { id: 'modify_dss', name: 'Modify DSS', description: 'Edit Disruption Sensitivity Scores', category: 'features' },
    { id: 'run_simulations', name: 'Run Simulations', description: 'Access to scenario modeling tools', category: 'features' },
    { id: 'edit_playbooks', name: 'Edit Playbooks', description: 'Modify resilience playbooks', category: 'features' },
    { id: 'generate_reports', name: 'Generate Reports', description: 'Create and export reports', category: 'export' },
    { id: 'api_access', name: 'API Access', description: 'Use platform APIs', category: 'admin' },
    { id: 'user_management', name: 'User Management', description: 'Manage team members', category: 'admin' }
  ];

  const roles: Role[] = [
    {
      id: 'analyst',
      name: 'Analyst',
      description: 'Data analysis and research role',
      userCount: 342,
      permissions: ['view_threat_map', 'view_feed', 'run_simulations', 'generate_reports'],
      requiresMFA: false,
      apiAccess: false
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Senior leadership with strategic access',
      userCount: 87,
      permissions: ['view_threat_map', 'view_feed', 'generate_reports'],
      requiresMFA: true,
      apiAccess: false
    },
    {
      id: 'risk_manager',
      name: 'Risk Manager',
      description: 'Risk assessment and mitigation specialist',
      userCount: 156,
      permissions: ['view_threat_map', 'view_feed', 'modify_dss', 'edit_playbooks', 'generate_reports'],
      requiresMFA: true,
      apiAccess: true
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full platform administration',
      userCount: 23,
      permissions: permissions.map(p => p.id),
      requiresMFA: true,
      apiAccess: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data': return 'bg-blue-600 text-white';
      case 'features': return 'bg-green-600 text-white';
      case 'export': return 'bg-yellow-600 text-black';
      case 'admin': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-starlink-white flex items-center">
                <Shield className="w-6 h-6 mr-2 text-starlink-blue" />
                Role & Permissions Editor
              </CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Configure platform roles and access permissions
              </CardDescription>
            </div>
            <Button className="bg-starlink-blue hover:bg-starlink-blue-bright">
              <Plus className="w-4 h-4 mr-2" />
              New Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Roles List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-starlink-white">Platform Roles</h3>
              {roles.map((role) => (
                <div 
                  key={role.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRole === role.id 
                      ? 'border-starlink-blue bg-starlink-blue/10' 
                      : 'border-starlink-grey/30 bg-starlink-slate/20 hover:border-starlink-blue/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-starlink-white">{role.name}</h4>
                        {role.requiresMFA && (
                          <Badge className="bg-orange-600 text-white text-xs">
                            MFA
                          </Badge>
                        )}
                        {role.apiAccess && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            API
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-starlink-grey-light mt-1">{role.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-starlink-grey-light">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {role.userCount} users
                        </span>
                        <span className="flex items-center">
                          <Key className="w-3 h-3 mr-1" />
                          {role.permissions.length} permissions
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Permission Editor */}
            <div className="space-y-4">
              {selectedRole ? (
                <>
                  <h3 className="text-lg font-semibold text-starlink-white">
                    Edit Permissions: {roles.find(r => r.id === selectedRole)?.name}
                  </h3>
                  
                  {/* Role Settings */}
                  <div className="space-y-4 p-4 bg-starlink-slate/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-starlink-white">Require MFA</label>
                        <p className="text-xs text-starlink-grey-light">Force multi-factor authentication</p>
                      </div>
                      <Switch 
                        checked={roles.find(r => r.id === selectedRole)?.requiresMFA}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-starlink-white">API Access</label>
                        <p className="text-xs text-starlink-grey-light">Allow API key generation</p>
                      </div>
                      <Switch 
                        checked={roles.find(r => r.id === selectedRole)?.apiAccess}
                      />
                    </div>
                  </div>

                  {/* Permissions by Category */}
                  {['data', 'features', 'export', 'admin'].map((category) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-starlink-white capitalize flex items-center">
                        <Badge className={`${getCategoryColor(category)} mr-2 text-xs`}>
                          {category}
                        </Badge>
                        Permissions
                      </h4>
                      <div className="space-y-2">
                        {permissions.filter(p => p.category === category).map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 bg-starlink-slate/20 rounded">
                            <div>
                              <div className="text-sm font-medium text-starlink-white">{permission.name}</div>
                              <div className="text-xs text-starlink-grey-light">{permission.description}</div>
                            </div>
                            <Switch 
                              checked={roles.find(r => r.id === selectedRole)?.permissions.includes(permission.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <Eye className="w-12 h-12 text-starlink-grey mx-auto mb-4" />
                  <p className="text-starlink-grey-light">Select a role to edit permissions</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesPanel;
