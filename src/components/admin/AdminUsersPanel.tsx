
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Shield, 
  RotateCcw, 
  Eye,
  MoreHorizontal,
  Crown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  role: string;
  company_name?: string;
}

const AdminUsersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    if (hasPermission('admin_console_access')) {
      fetchUsers();
    }
  }, [hasPermission]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profiles with roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          created_at
        `);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase
            .rpc('get_user_role', { user_id: profile.id });
          
          return {
            ...profile,
            role: roleData || 'registered',
            company_name: profile.email === 'leonedwardhardwick22@gmail.com' ? 'Premonix' : undefined
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-600 text-white';
      case 'business': return 'bg-green-600 text-white';
      case 'registered': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTierBadgeColor = (role: string) => {
    switch (role) {
      case 'enterprise': return 'bg-purple-600 text-white';
      case 'business': return 'bg-green-600 text-white';
      case 'registered': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.role === filterPlan;
    return matchesSearch && matchesPlan;
  });

  if (!hasPermission('admin_console_access')) {
    return (
      <div className="text-center text-starlink-grey-light">
        You don't have permission to access the user management panel.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <UserCheck className="w-6 h-6 mr-2 text-starlink-blue" />
            User Management
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Manage all registered users across the PREMONIX platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-starlink-grey w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-starlink-slate/20 border-starlink-grey/30"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-starlink-grey" />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-starlink-slate/20 border border-starlink-grey/30 rounded-md px-3 py-2 text-starlink-white"
              >
                <option value="all">All Plans</option>
                <option value="guest">Guest</option>
                <option value="registered">Registered</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-starlink-grey/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-starlink-grey/30">
                  <TableHead className="text-starlink-grey-light">User</TableHead>
                  <TableHead className="text-starlink-grey-light">Company</TableHead>
                  <TableHead className="text-starlink-grey-light">Role & Tier</TableHead>
                  <TableHead className="text-starlink-grey-light">Joined</TableHead>
                  <TableHead className="text-starlink-grey-light">Status</TableHead>
                  <TableHead className="text-starlink-grey-light">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-starlink-grey-light">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-starlink-grey-light">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-starlink-grey/30">
                      <TableCell>
                        <div>
                          <div className="font-medium text-starlink-white flex items-center">
                            {user.name || 'Unknown'}
                            {user.email === 'leonedwardhardwick22@gmail.com' && (
                              <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-starlink-grey-light">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-starlink-white">
                          {user.company_name || 'Individual'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getPlanBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getTierBadgeColor(user.role)}>
                            {user.role === 'enterprise' ? 'enterprise' : 
                             user.role === 'business' ? 'business-pro' : 'personal'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-starlink-grey-light">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 text-white">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass-panel border-starlink-grey/30">
                            <DropdownMenuItem className="text-starlink-white cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-starlink-white cursor-pointer">
                              <Shield className="w-4 h-4 mr-2" />
                              Manage Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-starlink-white cursor-pointer">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-starlink-white">{users.length}</div>
              <div className="text-sm text-starlink-grey-light">Total Users</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{users.length}</div>
              <div className="text-sm text-starlink-grey-light">Active Users</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-sm text-starlink-grey-light">Suspended</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-starlink-blue">
                {users.filter(u => u.role === 'enterprise').length}
              </div>
              <div className="text-sm text-starlink-grey-light">Enterprise Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPanel;
