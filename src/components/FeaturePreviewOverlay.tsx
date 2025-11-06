import { Button } from '@/components/ui/button';
import { Lock, Zap, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CreateAccountForm from './CreateAccountForm';

interface FeaturePreviewOverlayProps {
  featureName: string;
  description: string;
  requiredRole?: 'individual' | 'pro' | 'team_member' | 'team_admin' | 'enterprise_admin' | 'premonix_super_user';
  className?: string;
}

const FeaturePreviewOverlay = ({ 
  featureName, 
  description, 
  requiredRole = 'individual',
  className = ""
}: FeaturePreviewOverlayProps) => {
  const { upgradeRole, user } = useAuth();

  const handleUpgrade = () => {
    upgradeRole(requiredRole);
  };

  const getIcon = () => {
    switch (requiredRole) {
      case 'team_admin':
        return <TrendingUp className="w-5 h-5 text-starlink-blue" />;
      case 'enterprise_admin':
        return <Shield className="w-5 h-5 text-starlink-purple" />;
      default:
        return <Zap className="w-5 h-5 text-starlink-blue" />;
    }
  };

  const getButtonText = () => {
    switch (requiredRole) {
      case 'team_admin':
        return 'Upgrade to Business';
      case 'enterprise_admin':
        return 'Upgrade to Enterprise';
      default:
        return 'Register Free';
    }
  };

  const getColor = () => {
    switch (requiredRole) {
      case 'team_admin':
        return 'from-green-500/10 to-blue-500/10 border-green-500/30';
      case 'enterprise_admin':
        return 'from-purple-500/10 to-blue-500/10 border-purple-500/30';
      default:
        return 'from-starlink-blue/10 to-starlink-purple/10 border-starlink-blue/30';
    }
  };

  return (
    <div className={`absolute inset-0 bg-starlink-dark/90 backdrop-blur-sm rounded-lg flex items-center justify-center ${className}`}>
      <div className={`p-4 lg:p-6 bg-gradient-to-br ${getColor()} border rounded-lg max-w-sm mx-4 text-center`}>
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 bg-starlink-slate/20 rounded-full mr-2">
            <Lock className="w-4 h-4 text-starlink-grey-light" />
          </div>
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-starlink-white mb-2">
          {featureName}
        </h3>
        
        <p className="text-sm text-starlink-grey-light mb-4">
          {description}
        </p>
        
        {!user && requiredRole === 'individual' ? (
          <CreateAccountForm variant="modal">
            <Button 
              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium"
            >
              {getButtonText()}
            </Button>
          </CreateAccountForm>
        ) : (
          <Button 
            onClick={handleUpgrade}
            className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium"
          >
            {getButtonText()}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeaturePreviewOverlay;