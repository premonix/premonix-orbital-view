import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StableInput from "./StableInput";

interface CreateAccountFormProps {
  variant?: 'default' | 'inline' | 'modal';
  className?: string;
  children?: React.ReactNode;
  triggerClassName?: string;
}

const CreateAccountForm = ({ 
  variant = 'default', 
  className = '', 
  children,
  triggerClassName = ''
}: CreateAccountFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 12) {
      toast({
        title: "Password too short",
        description: "Password must be at least 12 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await register(email, password, name, companyName || undefined);

      if (error) {
        toast({
          title: "Registration failed",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email and click the confirmation link to complete setup.",
        });
        setIsSubmitted(true);
        
        // Close modal after successful submission
        if (variant === 'modal') {
          setTimeout(() => setIsOpen(false), 2000);
        }
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
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
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
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

  const inputStyle = {
    width: '100%',
    height: '40px',
    padding: '8px 12px',
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    border: '1px solid rgba(100, 116, 139, 0.4)',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  // Memoized handlers to prevent re-renders that cause focus loss
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Name field changed:', e.target.value);
    setName(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Email field changed:', e.target.value);
    setEmail(e.target.value);
  }, []);

  const handleCompanyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const FormContent = () => {
    if (isSubmitted) {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
          <CheckCircle className="w-12 h-12 text-starlink-blue" />
          <div>
            <h3 className="text-lg font-semibold text-starlink-white mb-2">Account created!</h3>
            <p className="text-starlink-grey-light text-sm">
              Please check your email and click the confirmation link to complete setup.
            </p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="name" className="text-starlink-grey-light">Full Name *</Label>
            <StableInput
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(value) => {
                console.log('Name changed:', value);
                setName(value);
              }}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-starlink-grey-light">Email Address *</Label>
            <StableInput
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(value) => {
                console.log('Email changed:', value);
                setEmail(value);
              }}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="companyName" className="text-starlink-grey-light">Company Name (Optional)</Label>
            <StableInput
              id="companyName"
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={setCompanyName}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-starlink-grey-light">Password *</Label>
            <StableInput
              id="password"
              type="password"
              placeholder="Enter a secure password (min 12 characters)"
              value={password}
              onChange={setPassword}
              disabled={isLoading}
              required
              minLength={12}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-starlink-grey-light">Confirm Password *</Label>
            <StableInput
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={isLoading}
              required
              minLength={12}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-semibold"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        <p className="text-xs text-starlink-grey text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
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
              <UserPlus className="w-5 h-5 text-starlink-blue mr-2" />
              Create Your PREMONIX Account
            </DialogTitle>
            <DialogDescription className="text-starlink-grey-light">
              Start with our Individual plan and get access to global threat intelligence.
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
          <span className="text-sm font-medium">Account created! Check your email.</span>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => {
              console.log('Inline form - Name changed:', e.target.value);
              setName(e.target.value);
            }}
            style={inputStyle}
            disabled={isLoading}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              console.log('Inline form - Email changed:', e.target.value);
              setEmail(e.target.value);
            }}
            style={inputStyle}
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="password"
            placeholder="Password (min 12 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
            required
            minLength={12}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
            required
            minLength={12}
          />
        </div>
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`glass-panel border-starlink-grey/30 ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <UserPlus className="w-8 h-8 text-starlink-blue mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-starlink-white mb-2">Create Your Account</h3>
          <p className="text-starlink-grey-light text-sm">
            Start with our Individual plan and get access to global threat intelligence
          </p>
        </div>
        
        <FormContent />
      </CardContent>
    </Card>
  );
};

export default CreateAccountForm;