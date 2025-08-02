
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
      
      
      // Parallel fetch profile and role for better performance
      const [profileResult, roleResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single(),
        supabase
          .rpc('get_user_role', { user_id: supabaseUser.id })
      ]);

      const { data: profile, error: profileError } = profileResult;
      const { data: roleData, error: roleError } = roleResult;

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Convert legacy roles to new role structure
      const convertLegacyRole = (legacyRole: string): UserRole => {
        switch (legacyRole) {
          case 'registered': return 'individual';
          case 'business': return 'team_admin';
          case 'enterprise': return 'enterprise_admin';
          default: return legacyRole as UserRole;
        }
      };

      const role: UserRole = roleData ? convertLegacyRole(roleData) : 'individual';
      const permissions = rolePermissions[role];

      return {
        id: supabaseUser.id,
        email: profile.email,
        name: profile.name,
        companyName: role === 'premonix_super_user' && supabaseUser.email?.includes('leonedwardhardwick22') ? 'Premonix' : undefined,
        role,
        permissions,
        subscription: {
          plan: role,
          tier: tierMapping[role],
          features: permissions
        }
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        
        if (session?.user) {
          // User is authenticated, fetch their profile
          const userProfile = await fetchUserProfile(session.user);
          if (userProfile) {
            setAuthState({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            // Profile fetch failed, set as guest
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
        } else {
          // No user, set as guest
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
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      
      if (session?.user) {
        fetchUserProfile(session.user).then(userProfile => {
          if (userProfile) {
            setAuthState({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
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
        });
      } else {
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
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      
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
