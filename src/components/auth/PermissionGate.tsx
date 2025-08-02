
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole, planFeatures } from '@/types/user';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: UserRole;
}

const PermissionGate = ({ permission, children, fallback, requiredRole }: PermissionGateProps) => {
  const { hasPermission, user, upgradeRole } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  const currentRole = user?.role || 'guest';
  const targetRole = requiredRole || 'individual';

  return (
    <div className="glass-panel rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-starlink-white mb-2">
        Upgrade Required
      </h3>
      <p className="text-starlink-grey-light mb-4">
        This feature requires a {targetRole} plan or higher.
      </p>
      
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Badge className="bg-gray-500">{currentRole}</Badge>
        <span className="text-starlink-grey">→</span>
        <Badge className="bg-starlink-blue">{targetRole}</Badge>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-starlink-white mb-2">
          {targetRole} Plan Features:
        </h4>
        <ul className="text-sm text-starlink-grey-light space-y-1">
          {planFeatures[targetRole].map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => upgradeRole(targetRole)}
        className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
      >
        Upgrade to {targetRole}
      </Button>
    </div>
  );
};

export default PermissionGate;
