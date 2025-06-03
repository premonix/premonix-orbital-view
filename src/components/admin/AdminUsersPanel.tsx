
import { useState } from 'react';
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

interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  plan: 'guest' | 'registered' | 'business' | 'enterprise';
  lastLogin: string;
  dssScore: number;
  status: 'active' | 'suspended';
  role: string;
}

const AdminUsersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  // Mock data - in real app this would come from API
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      country: 'United States',
      plan: 'enterprise',
      lastLogin: '2024-01-15',
      dssScore: 85,
      status: 'active',
      role: 'Admin'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techstart.io',
      country: 'Canada',
      plan: 'business',
      lastLogin: '2024-01-14',
      dssScore: 72,
      status: 'active',
      role: 'Analyst'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@globalfirm.com',
      country: 'Singapore',
      plan: 'registered',
      lastLogin: '2024-01-10',
      dssScore: 45,
      status: 'suspended',
      role: 'Viewer'
    }
  ];

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-600 text-white';
      case 'business': return 'bg-green-600 text-white';
      case 'registered': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

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
                  <TableHead className="text-starlink-grey-light">Country</TableHead>
                  <TableHead className="text-starlink-grey-light">Plan</TableHead>
                  <TableHead className="text-starlink-grey-light">Last Login</TableHead>
                  <TableHead className="text-starlink-grey-light">DSS Score</TableHead>
                  <TableHead className="text-starlink-grey-light">Status</TableHead>
                  <TableHead className="text-starlink-grey-light">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-starlink-grey/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-starlink-white flex items-center">
                          {user.name}
                          {user.role === 'Admin' && (
                            <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-starlink-grey-light">{user.email}</div>
                        <Badge className="text-xs mt-1">{user.role}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-starlink-grey-light">{user.country}</TableCell>
                    <TableCell>
                      <Badge className={getPlanBadgeColor(user.plan)}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-starlink-grey-light">{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-starlink-slate/20 rounded-full h-2">
                          <div 
                            className="bg-starlink-blue h-2 rounded-full"
                            style={{ width: `${user.dssScore}%` }}
                          />
                        </div>
                        <span className="text-sm text-starlink-white">{user.dssScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {user.status}
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
                            Impersonate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-starlink-white cursor-pointer">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          {user.status === 'active' ? (
                            <DropdownMenuItem className="text-red-400 cursor-pointer">
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-400 cursor-pointer">
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reactivate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-starlink-white">1,247</div>
              <div className="text-sm text-starlink-grey-light">Total Users</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">1,198</div>
              <div className="text-sm text-starlink-grey-light">Active Users</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">49</div>
              <div className="text-sm text-starlink-grey-light">Suspended</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-starlink-blue">89</div>
              <div className="text-sm text-starlink-grey-light">Avg DSS Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPanel;
