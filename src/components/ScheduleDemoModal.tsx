import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Building, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleDemoModalProps {
  children: React.ReactNode;
}

export const ScheduleDemoModal = ({ children }: ScheduleDemoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    companySize: '',
    useCase: '',
    preferredTime: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual demo scheduling backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Demo Scheduled!",
        description: "We'll contact you within 24 hours to confirm your demo time.",
      });
      
      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        companySize: '',
        useCase: '',
        preferredTime: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule demo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-starlink-dark border-starlink-grey/30">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-starlink-white">
            <Calendar className="w-5 h-5 text-starlink-blue" />
            <span>Schedule a Demo</span>
          </DialogTitle>
          <DialogDescription className="text-starlink-grey-light">
            Get a personalized demo of PREMONIX and DisruptionOS features tailored to your needs.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-starlink-white">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-starlink-white">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-starlink-white">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-starlink-white">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-starlink-white">Company Size</Label>
              <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                <SelectTrigger className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-starlink-dark border-starlink-grey/30">
                  <SelectItem value="1-10" className="text-starlink-white">1-10 employees</SelectItem>
                  <SelectItem value="11-50" className="text-starlink-white">11-50 employees</SelectItem>
                  <SelectItem value="51-200" className="text-starlink-white">51-200 employees</SelectItem>
                  <SelectItem value="201-1000" className="text-starlink-white">201-1000 employees</SelectItem>
                  <SelectItem value="1000+" className="text-starlink-white">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-starlink-white">Preferred Time</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                <SelectTrigger className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-starlink-dark border-starlink-grey/30">
                  <SelectItem value="morning" className="text-starlink-white">Morning (9-12 GMT)</SelectItem>
                  <SelectItem value="afternoon" className="text-starlink-white">Afternoon (12-17 GMT)</SelectItem>
                  <SelectItem value="evening" className="text-starlink-white">Evening (17-20 GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase" className="text-starlink-white">Primary Use Case</Label>
            <Select value={formData.useCase} onValueChange={(value) => setFormData({ ...formData, useCase: value })}>
              <SelectTrigger className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white">
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent className="bg-starlink-dark border-starlink-grey/30">
                <SelectItem value="personal" className="text-starlink-white">Personal/Family Security</SelectItem>
                <SelectItem value="business" className="text-starlink-white">Business Continuity</SelectItem>
                <SelectItem value="enterprise" className="text-starlink-white">Enterprise Risk Management</SelectItem>
                <SelectItem value="government" className="text-starlink-white">Government/Public Sector</SelectItem>
                <SelectItem value="other" className="text-starlink-white">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-starlink-white">Additional Information</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your specific requirements or questions..."
              className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Demo
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};