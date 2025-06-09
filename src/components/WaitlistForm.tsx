
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WaitlistFormProps {
  variant?: 'default' | 'inline' | 'modal';
  className?: string;
  children?: React.ReactNode;
  triggerClassName?: string;
}

const WaitlistForm = ({ 
  variant = 'default', 
  className = '', 
  children,
  triggerClassName = ''
}: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!marketingConsent) {
      toast({
        title: "Marketing consent required",
        description: "Please accept marketing communications to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('waitlist_submissions')
        .insert({
          email: email.toLowerCase().trim(),
          marketing_consent: marketingConsent,
          user_agent: navigator.userAgent,
        });

      if (error) {
        // Handle duplicate email case specifically
        if (error.code === '23505') {
          toast({
            title: "Already registered!",
            description: "This email is already on our waitlist. We'll keep you updated!",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you when PREMONIX launches.",
        });
      }

      setIsSubmitted(true);
      
      // Close modal after successful submission
      if (variant === 'modal') {
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setMarketingConsent(false);
    setIsSubmitted(false);
    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when modal closes
      setTimeout(resetForm, 300);
    }
  };

  const FormContent = () => {
    if (isSubmitted) {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
          <CheckCircle className="w-12 h-12 text-starlink-blue" />
          <div>
            <h3 className="text-lg font-semibold text-starlink-white mb-2">You're on the waitlist!</h3>
            <p className="text-starlink-grey-light text-sm">
              We'll notify you as soon as PREMONIX launches.
            </p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-starlink-slate-light border-starlink-grey/40 text-starlink-white placeholder:text-starlink-grey-light"
            disabled={isLoading}
            required
          />
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing-consent"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
              disabled={isLoading}
              className="border-starlink-grey/40 data-[state=checked]:bg-starlink-blue data-[state=checked]:border-starlink-blue mt-1"
            />
            <label 
              htmlFor="marketing-consent" 
              className="text-sm text-starlink-grey-light leading-relaxed cursor-pointer"
            >
              I agree to receive marketing communications and updates about PREMONIX. 
              You can unsubscribe at any time.
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold"
          disabled={isLoading}
        >
          {isLoading ? 'Joining Waitlist...' : 'Join Waitlist'}
        </Button>
        
        <p className="text-xs text-starlink-grey text-center">
          We respect your privacy. Read our privacy policy for more information.
        </p>
      </form>
    );
  };

  if (variant === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div className={triggerClassName}>
            {children}
          </div>
        </DialogTrigger>
        <DialogContent className="glass-panel border-starlink-grey/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-starlink-white">
              <Mail className="w-5 h-5 text-starlink-blue mr-2" />
              Join the PREMONIX Waitlist
            </DialogTitle>
            <DialogDescription className="text-starlink-grey-light">
              Be the first to know when PREMONIX launches with exclusive early access.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <FormContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === 'inline') {
    if (isSubmitted) {
      return (
        <div className={`flex items-center space-x-2 text-starlink-blue ${className}`}>
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">You're on the waitlist!</span>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-starlink-slate-light border-starlink-grey/40 text-starlink-white placeholder:text-starlink-grey-light"
          disabled={isLoading}
          required
        />
        <Button 
          type="submit" 
          disabled={isLoading || !marketingConsent}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark whitespace-nowrap"
        >
          {isLoading ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`glass-panel border-starlink-grey/30 ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <Mail className="w-8 h-8 text-starlink-blue mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-starlink-white mb-2">Join the Waitlist</h3>
          <p className="text-starlink-grey-light text-sm">
            Be the first to know when PREMONIX launches with exclusive early access
          </p>
        </div>
        
        <FormContent />
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;
