
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const AdminBillingPanel = () => {
  const mockBillingData = [
    {
      id: '1',
      customer: 'Acme Corporation',
      email: 'billing@acmecorp.com',
      plan: 'Enterprise',
      amount: '$299/month',
      status: 'active',
      nextBilling: '2024-02-15',
      totalRevenue: '$3,588'
    },
    {
      id: '2',
      customer: 'TechStart Inc',
      email: 'finance@techstart.io',
      plan: 'Business',
      amount: '$79/month',
      status: 'past_due',
      nextBilling: '2024-01-28',
      totalRevenue: '$948'
    },
    {
      id: '3',
      customer: 'Global Manufacturing',
      email: 'admin@globalmanuf.de',
      plan: 'Business',
      amount: '$79/month',
      status: 'active',
      nextBilling: '2024-02-10',
      totalRevenue: '$1,896'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'past_due':
        return <Badge className="bg-red-500 text-white"><AlertCircle className="w-3 h-3 mr-1" />Past Due</Badge>;
      case 'trial':
        return <Badge className="bg-yellow-500 text-black"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-grey/30">
        <CardHeader>
          <CardTitle className="text-starlink-white flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-starlink-blue" />
            Billing & Revenue Overview
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Monitor subscription revenue and billing status across all accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-starlink-white">$47.2k</div>
                  <div className="text-sm text-starlink-grey-light">Monthly Revenue</div>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">+12.5%</span>
                <span className="text-starlink-grey-light ml-1">vs last month</span>
              </div>
            </div>

            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-starlink-white">$142.8k</div>
                  <div className="text-sm text-starlink-grey-light">Quarterly Revenue</div>
                </div>
                <TrendingUp className="w-8 h-8 text-starlink-blue" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">+8.3%</span>
                <span className="text-starlink-grey-light ml-1">vs last quarter</span>
              </div>
            </div>

            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-starlink-white">3.2%</div>
                  <div className="text-sm text-starlink-grey-light">Churn Rate</div>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">-0.8%</span>
                <span className="text-starlink-grey-light ml-1">vs last month</span>
              </div>
            </div>

            <div className="bg-starlink-slate/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-starlink-white">89</div>
                  <div className="text-sm text-starlink-grey-light">Active Subscriptions</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">+7</span>
                <span className="text-starlink-grey-light ml-1">new this month</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button className="bg-starlink-blue hover:bg-starlink-blue-bright">
              <Download className="w-4 h-4 mr-2" />
              Export Revenue CSV
            </Button>
            <Button variant="outline" className="border-starlink-grey/30">
              <Download className="w-4 h-4 mr-2" />
              Stripe Summary
            </Button>
            <Button variant="outline" className="border-starlink-grey/30">
              Send Payment Reminder
            </Button>
          </div>

          {/* Billing Table */}
          <div className="border border-starlink-grey/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-starlink-grey/30">
                  <TableHead className="text-starlink-grey-light">Customer</TableHead>
                  <TableHead className="text-starlink-grey-light">Plan</TableHead>
                  <TableHead className="text-starlink-grey-light">Amount</TableHead>
                  <TableHead className="text-starlink-grey-light">Status</TableHead>
                  <TableHead className="text-starlink-grey-light">Next Billing</TableHead>
                  <TableHead className="text-starlink-grey-light">Total Revenue</TableHead>
                  <TableHead className="text-starlink-grey-light">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBillingData.map((billing) => (
                  <TableRow key={billing.id} className="border-starlink-grey/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-starlink-white">{billing.customer}</div>
                        <div className="text-sm text-starlink-grey-light">{billing.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={billing.plan === 'Enterprise' ? 'bg-purple-600' : 'bg-green-600'}>
                        {billing.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-starlink-white font-medium">{billing.amount}</TableCell>
                    <TableCell>{getStatusBadge(billing.status)}</TableCell>
                    <TableCell className="text-starlink-grey-light">{billing.nextBilling}</TableCell>
                    <TableCell className="text-starlink-white font-medium">{billing.totalRevenue}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Credit Account
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400">
                          Cancel Sub
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Payment Issues Alert */}
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h4 className="font-medium text-red-400">Payment Issues Detected</h4>
                <p className="text-sm text-starlink-grey-light mt-1">
                  3 accounts have failed payments in the last 7 days. Consider sending payment reminders.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBillingPanel;
