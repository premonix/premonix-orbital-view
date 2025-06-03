
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Building, 
  Users, 
  FileText, 
  Settings,
  MoreHorizontal,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Organization {
  id: string;
  name: string;
  sector: string;
  country: string;
  tier: 'business' | 'enterprise';
  seats: number;
  usedSeats: number;
  status: 'active' | 'trial' | 'expired';
  admin: string;
  dssAverage: number;
  initiatives: number;
}

const AdminOrgsPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockOrgs: Organization[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      sector: 'Technology',
      country: 'United States',
      tier: 'enterprise',
      seats: 50,
      usedSeats: 42,
      status: 'active',
      admin: 'john@acmecorp.com',
      dssAverage: 78,
      initiatives: 12
    },
    {
      id: '2',
      name: 'Global Manufacturing Ltd',
      sector: 'Manufacturing',
      country: 'Germany',
      tier: 'business',
      seats: 25,
      usedSeats: 18,
      status: 'active',
      admin: 'admin@globalmanuf.de',
      dssAverage: 85,
      initiatives: 8
    },
    {
      id: '3',
      name: 'TechStart Innovations',
      sector: 'Startups',
      country: 'Canada',
      tier: 'business',
      seats: 10,
      usedSeats: 7,
      status: 'trial',
      admin: 'ceo@techstart.io',
      dssAverage: 65,
      initiatives: 4
    }
  ];

  const getTierBadgeColor = (tier: string) => {
    return tier === 'enterprise' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'trial': return 'bg-yellow-500 text-black';
      case 'expired': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredOrgs = mockOrgs.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <Building className="w-6 h-6 mr-2 text-starlink-blue" />
            Business Account Management
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Manage all business organizations and their subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Control */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-starlink-grey w-4 h-4" />
            <Input
              placeholder="Search organizations by name, sector, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-starlink-slate/20 border-starlink-grey/30"
            />
          </div>

          {/* Organizations Table */}
          <div className="border border-starlink-grey/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-starlink-grey/30">
                  <TableHead className="text-starlink-grey-light">Organization</TableHead>
                  <TableHead className="text-starlink-grey-light">Sector & Country</TableHead>
                  <TableHead className="text-starlink-grey-light">Subscription</TableHead>
                  <TableHead className="text-starlink-grey-light">Seats</TableHead>
                  <TableHead className="text-starlink-grey-light">DSS Avg</TableHead>
                  <TableHead className="text-starlink-grey-light">Initiatives</TableHead>
                  <TableHead className="text-starlink-grey-light">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id} className="border-starlink-grey/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-starlink-white">{org.name}</div>
                        <div className="text-sm text-starlink-grey-light">Admin: {org.admin}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-starlink-white">{org.sector}</div>
                        <div className="text-sm text-starlink-grey-light">{org.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getTierBadgeColor(org.tier)}>
                          {org.tier}
                        </Badge>
                        <Badge className={getStatusBadgeColor(org.status)}>
                          {org.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-starlink-white">
                        {org.usedSeats} / {org.seats}
                        <div className="w-16 bg-starlink-slate/20 rounded-full h-2 mt-1">
                          <div 
                            className="bg-starlink-blue h-2 rounded-full"
                            style={{ width: `${(org.usedSeats / org.seats) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-starlink-slate/20 rounded-full h-2">
                          <div 
                            className="bg-starlink-blue h-2 rounded-full"
                            style={{ width: `${org.dssAverage}%` }}
                          />
                        </div>
                        <span className="text-sm text-starlink-white">{org.dssAverage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-starlink-white">{org.initiatives}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-panel border-starlink-grey/30">
                          <DropdownMenuItem className="text-starlink-white cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-starlink-white cursor-pointer">
                            <Users className="w-4 h-4 mr-2" />
                            Adjust Seats
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-starlink-white cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" />
                            View Usage
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-starlink-white cursor-pointer">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                          </DropdownMenuItem>
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
              <div className="text-2xl font-bold text-starlink-white">89</div>
              <div className="text-sm text-starlink-grey-light">Total Organizations</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">1,847</div>
              <div className="text-sm text-starlink-grey-light">Total Seats</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-starlink-blue">1,432</div>
              <div className="text-sm text-starlink-grey-light">Used Seats</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">$47.2k</div>
              <div className="text-sm text-starlink-grey-light">Monthly Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrgsPanel;
