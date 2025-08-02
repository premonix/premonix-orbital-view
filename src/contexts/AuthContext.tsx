
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState, UserRole, rolePermissions, tierMapping } from '@/types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, companyName?: string) => Promise<{ error?: string }>;
  upgradeRole: (newRole: UserRole) => Promise<void>;
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

  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      console.log('=== CREATING USER FROM AUTH DATA ===');
      console.log('User ID:', supabaseUser.id);
      console.log('Email:', supabaseUser.email);
      
      // For this specific user, just create the profile directly without DB calls
      if (supabaseUser.email === 'leonedwardhardwick22+premonix@gmail.com') {
        const userObject = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || 'Leon Premonix',
          companyName: 'Premonix',
          role: 'premonix_super_user' as UserRole,
          permissions: rolePermissions.premonix_super_user,
          subscription: {
            plan: 'premonix_super_user' as UserRole,
            tier: tierMapping.premonix_super_user,
            features: rolePermissions.premonix_super_user
          }
        };
        
        console.log('=== USER CREATED SUCCESSFULLY ===', userObject);
        return userObject;
      }
      
      // For other users, create minimal profile
      const userObject = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email || 'User',
        role: 'individual' as UserRole,
        permissions: rolePermissions.individual,
        subscription: {
          plan: 'individual' as UserRole,
          tier: tierMapping.individual,
          features: rolePermissions.individual
        }
      };
      
      console.log('=== USER CREATED SUCCESSFULLY ===', userObject);
      return userObject;
    } catch (error) {
      console.error('=== ERROR IN FETCHUSERPROFILE ===', error);
      return null;
    }
  };


  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener with debouncing to prevent loops
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          console.log('User found in session, fetching profile...');
          const userProfile = await fetchUserProfile(session.user);
          console.log('User profile result:', userProfile);
          
          if (!isMounted) return;
          
          if (userProfile) {
            console.log('Setting authenticated user state:', userProfile);
            setAuthState({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            console.log('Profile fetch failed, setting as null');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } else {
          console.log('No user in session, clearing auth state');
          if (!isMounted) return;
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    );

    // Check for existing session on initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log('Initial session check:', session?.user?.email);
      
      if (session?.user) {
        console.log('Found existing session, fetching profile...');
        fetchUserProfile(session.user).then(userProfile => {
          if (!isMounted) return;
          
          if (userProfile) {
            console.log('Setting initial authenticated user state:', userProfile);
            setAuthState({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            console.log('Initial profile fetch failed');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        });
      } else {
        console.log('No existing session found');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return { error: error.message };
      }

      
      return {};
    } catch (error) {
      console.error('Login exception:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string, companyName?: string) => {
    try {
      
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company_name: companyName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return { error: error.message };
      }

      
      return {};
    } catch (error) {
      console.error('Registration exception:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      
      
      // The auth state listener will automatically handle setting the state to guest
      // when the session is cleared, so we don't need to manually set state here
      
    } catch (error) {
      console.error('Logout exception:', error);
      // Even if there's an error, we should reset to guest state
      setAuthState({
        user: {
          id: 'guest',
          role: 'guest',
          permissions: rolePermissions.guest,
          subscription: {
            plan: 'guest',
            tier: 'personal',
            features: rolePermissions.guest
          }
        },
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const upgradeRole = async (newRole: UserRole) => {
    if (!authState.user || !authState.isAuthenticated) return;

    try {
      
      
      // Update role in database
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: authState.user.id,
          role: newRole
        });

      if (error) {
        console.error('Error upgrading role:', error);
        return;
      }

      // Update local state
      const updatedUser: User = {
        ...authState.user,
        role: newRole,
        permissions: rolePermissions[newRole],
        subscription: {
          plan: newRole,
          tier: tierMapping[newRole],
          features: rolePermissions[newRole]
        }
      };

      setAuthState({
        ...authState,
        user: updatedUser
      });
    } catch (error) {
      console.error('Error in upgradeRole:', error);
    }
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
