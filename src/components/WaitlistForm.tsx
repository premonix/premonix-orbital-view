
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WaitlistFormProps {
  variant?: 'default' | 'inline';
  className?: string;
}

const WaitlistForm = ({ variant = 'default', className = '' }: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    
    // Simulate API call - in a real app, you'd send this to your backend
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll notify you when PREMONIX launches.",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className={`flex items-center space-x-2 text-starlink-blue ${className}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">You're on the waitlist!</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-starlink-slate-light border-starlink-grey/40 text-starlink-white placeholder:text-starlink-grey-light"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
        >
          {isLoading ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`glass-panel border-starlink-grey/30 ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <Mail className="w-8 h-8 text-starlink-blue mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-starlink-white">Join the Waitlist</h3>
          <p className="text-starlink-grey-light text-sm">Be the first to know when PREMONIX launches</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-starlink-slate-light border-starlink-grey/40 text-starlink-white placeholder:text-starlink-grey-light"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Joining Waitlist...' : 'Join Waitlist'}
          </Button>
        </form>
        
        <p className="text-xs text-starlink-grey text-center mt-3">
          We'll never spam you. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;
