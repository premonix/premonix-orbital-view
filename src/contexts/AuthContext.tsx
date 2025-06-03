import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole, rolePermissions } from '@/types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  upgradeRole: (newRole: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('premonix_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      // Set as guest user
      const guestUser: User = {
        id: 'guest',
        role: 'guest',
        permissions: rolePermissions.guest
      };
      setAuthState({
        user: guestUser,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Check if this is the admin email
    const isAdminEmail = email === 'leonedwardhardwick22@gmail.com';
    const userRole: UserRole = isAdminEmail ? 'enterprise' : 'registered';
    
    // Mock login - in real app this would call an API
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: userRole,
      permissions: rolePermissions[userRole],
      subscription: {
        plan: userRole,
        features: rolePermissions[userRole]
      }
    };

    localStorage.setItem('premonix_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const register = async (email: string, password: string, name: string) => {
    // Check if this is the admin email
    const isAdminEmail = email === 'leonedwardhardwick22@gmail.com';
    const userRole: UserRole = isAdminEmail ? 'enterprise' : 'registered';
    
    // Mock registration
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: userRole,
      permissions: rolePermissions[userRole],
      subscription: {
        plan: userRole,
        features: rolePermissions[userRole]
      }
    };

    localStorage.setItem('premonix_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('premonix_user');
    const guestUser: User = {
      id: 'guest',
      role: 'guest',
      permissions: rolePermissions.guest
    };
    setAuthState({
      user: guestUser,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const upgradeRole = (newRole: UserRole) => {
    if (!authState.user) return;

    const updatedUser: User = {
      ...authState.user,
      role: newRole,
      permissions: rolePermissions[newRole],
      subscription: {
        plan: newRole,
        features: rolePermissions[newRole]
      }
    };

    localStorage.setItem('premonix_user', JSON.stringify(updatedUser));
    setAuthState({
      ...authState,
      user: updatedUser
    });
  };

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register,
      upgradeRole,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
