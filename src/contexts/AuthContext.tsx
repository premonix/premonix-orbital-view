import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { rolePermissions, tierMapping } from '@/types/user';

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, companyName?: string) => Promise<{ error?: string }>;
  upgradeRole: (newRole: UserRole) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: (planId: string) => Promise<{ url?: string; error?: string }>;
  openCustomerPortal: () => Promise<{ url?: string; error?: string }>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      console.log('=== FETCHING USER PROFILE FROM DATABASE ===');
      console.log('User ID:', supabaseUser.id);
      console.log('Email:', supabaseUser.email);
      
      // Get profile data from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Get user role using the secure database function
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role', { user_id: supabaseUser.id });

      if (roleError) {
        console.error('Error fetching role:', roleError);
        // Default to individual if no role found
        const defaultRole: UserRole = 'individual';
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: profile?.name || supabaseUser.email || '',
          role: defaultRole,
          permissions: rolePermissions[defaultRole],
          subscription: {
            plan: defaultRole,
            tier: tierMapping[defaultRole],
            features: rolePermissions[defaultRole]
          }
        };
      }

      const userRole = (roleData || 'individual') as UserRole;
      
      const userObject = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.name || supabaseUser.email || '',
        role: userRole,
        permissions: rolePermissions[userRole],
        subscription: {
          plan: userRole,
          tier: tierMapping[userRole],
          features: rolePermissions[userRole]
        }
      };
      
      console.log('=== USER PROFILE FETCHED SUCCESSFULLY ===', userObject);
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

      console.log('Login successful, auth state will be updated by listener');
      return {};
    } catch (error: any) {
      console.error('Login exception:', error);
      return { error: error.message || 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string, companyName?: string) => {
    try {
      console.log('Attempting registration for:', email);
      
      // Enhanced password validation
      if (password.length < 12) {
        return { error: 'Password must be at least 12 characters long' };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
            company_name: companyName
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return { error: error.message };
      }

      console.log('Registration successful');
      return {};
    } catch (error: any) {
      console.error('Registration exception:', error);
      return { error: error.message || 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      console.log('Logout successful, auth state will be updated by listener');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const upgradeRole = async (newRole: UserRole) => {
    try {
      console.log('Attempting to upgrade role to:', newRole);
      
      if (!authState.user) {
        console.error('No authenticated user found');
        return;
      }

      // Use the secure admin function for role assignment (requires proper privileges)
      const { error } = await supabase.rpc('assign_admin_role', { 
        target_user_email: authState.user.email 
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

      console.log('Role upgraded successfully to:', newRole);
    } catch (error) {
      console.error('Exception in upgradeRole:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions?.includes(permission) ?? false;
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      const subscriptionInfo: SubscriptionInfo = data;
      if (authState.user && subscriptionInfo.subscription_tier) {
        const updatedUser: User = {
          ...authState.user,
          role: subscriptionInfo.subscription_tier as UserRole,
          permissions: rolePermissions[subscriptionInfo.subscription_tier as UserRole] || [],
          subscription: {
            plan: subscriptionInfo.subscription_tier as UserRole,
            tier: tierMapping[subscriptionInfo.subscription_tier as UserRole] || 'personal',
            features: rolePermissions[subscriptionInfo.subscription_tier as UserRole] || [],
            expiresAt: subscriptionInfo.subscription_end ? new Date(subscriptionInfo.subscription_end) : undefined
          }
        };
        
        setAuthState({
          ...authState,
          user: updatedUser
        });
      }
    } catch (error) {
      console.error('Exception in checkSubscription:', error);
    }
  };

  const createCheckoutSession = async (planId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) {
        console.error('Error creating checkout session:', error);
        return { error: error.message };
      }
      
      return { url: data.url };
    } catch (error: any) {
      console.error('Exception in createCheckoutSession:', error);
      return { error: error.message || 'Failed to create checkout session' };
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        return { error: error.message };
      }
      
      return { url: data.url };
    } catch (error: any) {
      console.error('Exception in openCustomerPortal:', error);
      return { error: error.message || 'Failed to open customer portal' };
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    upgradeRole,
    hasPermission,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};