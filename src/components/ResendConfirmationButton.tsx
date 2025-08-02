import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

interface ResendConfirmationButtonProps {
  email: string;
}

export const ResendConfirmationButton = ({ email }: ResendConfirmationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resend-confirmation', {
        body: { email }
      });

      if (error) {
        toast.error(`Failed to resend confirmation: ${error.message}`);
      } else {
        toast.success(`Confirmation email resent to ${email}. Please check your inbox and spam folder.`);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleResendConfirmation}
      disabled={isLoading}
      variant="outline"
      className="border-starlink-blue text-starlink-blue hover:bg-starlink-blue hover:text-starlink-dark"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-starlink-blue/20 border-t-starlink-blue rounded-full animate-spin" />
          Sending...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Resend Confirmation Email
        </div>
      )}
    </Button>
  );
};