import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordModal = ({ open, onOpenChange }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('password-reset', {
        body: { email, action: 'request' }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });

      onOpenChange(false);
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-muted">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-background border-muted focus:border-primary"
              placeholder="Enter your email"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;