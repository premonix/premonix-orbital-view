
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Search, 
  AlertTriangle, 
  Shield, 
  Download, 
  Eye,
  MapPin,
  Clock
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  email: string;
  action: string;
  resource: string;
  location: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

const AdminAuditPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:32:15',
      user: 'John Smith',
      email: 'john@acmecorp.com',
      action: 'DSS_MODIFIED',
      resource: 'Supply Chain Assessment',
      location: 'New York, US',
      ipAddress: '192.168.1.100',
      severity: 'medium',
      details: 'Modified DSS score from 75 to 85'
    },
    {
      id: '2',
      timestamp: '2024-01-15 13:45:22',
      user: 'Admin User',
      email: 'admin@premonix.com',
      action: 'USER_SUSPENDED',
      resource: 'sarah.johnson@techstart.io',
      location: 'London, UK',
      ipAddress: '10.0.0.15',
      severity: 'high',
      details: 'User account suspended for policy violation'
    },
    {
      id: '3',
      timestamp: '2024-01-15 12:18:45',
      user: 'Michael Chen',
      email: 'mchen@globalfirm.com',
      action: 'FAILED_LOGIN',
      resource: 'Login Portal',
      location: 'Singapore, SG',
      ipAddress: '203.0.113.42',
      severity: 'critical',
      details: '5th failed login attempt in 10 minutes'
    },
    {
      id: '4',
      timestamp: '2024-01-15 11:55:33',
      user: 'Sarah Wilson',
      email: 'swilson@manufacturing.com',
      action: 'EXPORT_DATA',
      resource: 'Threat Intelligence Report',
      location: 'Toronto, CA',
      ipAddress: '198.51.100.25',
      severity: 'medium',
      details: 'Exported Q4 threat analysis report (PDF)'
    },
    {
      id: '5',
      timestamp: '2024-01-15 10:30:12',
      user: 'Anonymous',
      email: 'unknown',
      action: 'BRUTE_FORCE_DETECTED',
      resource: 'API Endpoint',
      location: 'Unknown',
      ipAddress: '203.0.113.195',
      severity: 'critical',
      details: 'Multiple API authentication failures detected'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge className="bg-green-600 text-white">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600 text-black">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-600 text-white">High</Badge>;
      case 'critical':
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">{severity}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN') || action.includes('BRUTE_FORCE')) {
      return <Shield className="w-4 h-4 text-red-400" />;
    }
    if (action.includes('EXPORT')) {
      return <Download className="w-4 h-4 text-blue-400" />;
    }
    if (action.includes('MODIFIED') || action.includes('DSS')) {
      return <Eye className="w-4 h-4 text-yellow-400" />;
    }
    return <FileText className="w-4 h-4 text-starlink-blue" />;
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const criticalAlerts = mockAuditLogs.filter(log => log.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <FileText className="w-6 h-6 mr-2 text-starlink-blue" />
            Audit Log & Security Panel
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Monitor all platform activity and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Security Alerts */}
          {criticalAlerts > 0 && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                <div>
                  <h4 className="font-medium text-red-400">Security Alerts</h4>
                  <p className="text-sm text-starlink-grey-light mt-1">
                    {criticalAlerts} critical security events detected. Immediate attention required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-starlink-grey w-4 h-4" />
              <Input
                placeholder="Search logs by user, action, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-starlink-slate/20 border-starlink-grey/30"
              />
            </div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-starlink-slate/20 border border-starlink-grey/30 rounded-md px-3 py-2 text-starlink-white"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-starlink-white">1,247</div>
              <div className="text-sm text-starlink-grey-light">Total Events (24h)</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">1,198</div>
              <div className="text-sm text-starlink-grey-light">Normal Activity</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">46</div>
              <div className="text-sm text-starlink-grey-light">Warnings</div>
            </div>
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">{criticalAlerts}</div>
              <div className="text-sm text-starlink-grey-light">Critical Alerts</div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-starlink-grey/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-starlink-grey/30">
                  <TableHead className="text-starlink-grey-light">Time & User</TableHead>
                  <TableHead className="text-starlink-grey-light">Action</TableHead>
                  <TableHead className="text-starlink-grey-light">Resource</TableHead>
                  <TableHead className="text-starlink-grey-light">Location</TableHead>
                  <TableHead className="text-starlink-grey-light">Severity</TableHead>
                  <TableHead className="text-starlink-grey-light">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-starlink-grey/30">
                    <TableCell>
                      <div>
                        <div className="flex items-center text-starlink-white">
                          <Clock className="w-3 h-3 mr-1 text-starlink-grey" />
                          {log.timestamp.split(' ')[1]}
                        </div>
                        <div className="text-sm font-medium text-starlink-white">{log.user}</div>
                        <div className="text-xs text-starlink-grey-light">{log.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className="ml-2 text-starlink-white font-mono text-sm">
                          {log.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-starlink-grey-light">{log.resource}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-starlink-grey-light">
                        <MapPin className="w-3 h-3 mr-1" />
                        <div>
                          <div>{log.location}</div>
                          <div className="text-xs">{log.ipAddress}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell className="text-starlink-grey-light text-sm max-w-xs truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditPanel;
