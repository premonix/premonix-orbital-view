
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back to PREMONIX",
        });
        onOpenChange(false);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-starlink-grey/20">
        <DialogHeader>
          <DialogTitle className="text-starlink-white">Login to PREMONIX</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-starlink-grey-light">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-starlink-slate border-starlink-grey/20 text-starlink-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-starlink-grey-light">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-starlink-slate border-starlink-grey/20 text-starlink-white"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-starlink-grey-light hover:text-starlink-white"
              onClick={onSwitchToRegister}
            >
              Don't have an account? Register
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
