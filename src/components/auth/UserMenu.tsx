
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { User, Building, LogOut } from 'lucide-react';

const UserMenu = () => {
  const { user, isAuthenticated, logout, upgradeRole } = useAuth();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'guest': return 'bg-gray-500';
      case 'individual': return 'bg-blue-500';
      case 'team_admin': return 'bg-green-500';
      case 'enterprise_admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'personal': return 'bg-blue-600';
      case 'business-pro': return 'bg-green-600';
      case 'enterprise': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const handleUpgrade = (newRole: UserRole) => {
    upgradeRole(newRole);
  };

  const handleLogout = async () => {
    console.log('UserMenu: Logout clicked');
    try {
      await logout();
      console.log('UserMenu: Logout completed successfully');
    } catch (error) {
      console.error('UserMenu: Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Badge className={getRoleBadgeColor(user?.role || 'guest')}>
          {user?.role || 'guest'}
        </Badge>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm">{user?.name || user?.email}</span>
            {user?.companyName && (
              <div className="flex items-center space-x-1">
                <Building className="w-3 h-3" />
                <span className="text-xs text-starlink-grey-light">{user.companyName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getRoleBadgeColor(user?.role || 'guest')}>
              {user?.role}
            </Badge>
            {user?.subscription?.tier && (
              <Badge className={getTierBadgeColor(user.subscription.tier)}>
                {user.subscription.tier}
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-panel border-starlink-grey/20">
        <DropdownMenuItem className="text-starlink-white">
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="text-starlink-white">
          Alert Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {user?.role === 'individual' && (
          <DropdownMenuItem 
            onClick={() => handleUpgrade('team_admin')}
            className="text-starlink-blue hover:text-starlink-blue-bright"
          >
            Upgrade to Business Pro
          </DropdownMenuItem>
        )}
        
        {user?.role === 'team_admin' && (
          <DropdownMenuItem 
            onClick={() => handleUpgrade('enterprise_admin')}
            className="text-starlink-blue hover:text-starlink-blue-bright"
          >
            Upgrade to Enterprise
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
