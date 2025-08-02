-- Security Fixes Migration: Address Critical Database Security Issues

-- 1. Enable RLS on subscription_plans table and add proper policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active subscription plans (for pricing pages)
CREATE POLICY "Allow public read access to active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Only service role can manage subscription plans
CREATE POLICY "Service role can manage subscription plans" 
ON public.subscription_plans 
FOR ALL 
USING (auth.role() = 'service_role');

-- 2. Fix database function search paths to prevent schema poisoning
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'  -- Critical security fix
AS $$
BEGIN
  -- Create profile first
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email)
  );
  
  -- Assign role based on email - use database-driven logic instead of hardcoded
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    'individual'::app_role  -- Default role for all new users
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block user creation
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Fix other database functions with proper search path
CREATE OR REPLACE FUNCTION public.update_dashboard_analytics(
  p_user_id uuid, 
  p_action text, 
  p_category text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Critical security fix
AS $$
BEGIN
  INSERT INTO public.user_dashboard_analytics (user_id, date, threats_viewed, alerts_triggered, dashboard_visits, most_viewed_category)
  VALUES (
    p_user_id,
    CURRENT_DATE,
    CASE WHEN p_action = 'threat_viewed' THEN 1 ELSE 0 END,
    CASE WHEN p_action = 'alert_triggered' THEN 1 ELSE 0 END,
    CASE WHEN p_action = 'dashboard_visit' THEN 1 ELSE 0 END,
    p_category
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    threats_viewed = user_dashboard_analytics.threats_viewed + CASE WHEN p_action = 'threat_viewed' THEN 1 ELSE 0 END,
    alerts_triggered = user_dashboard_analytics.alerts_triggered + CASE WHEN p_action = 'alert_triggered' THEN 1 ELSE 0 END,
    dashboard_visits = user_dashboard_analytics.dashboard_visits + CASE WHEN p_action = 'dashboard_visit' THEN 1 ELSE 0 END,
    most_viewed_category = CASE WHEN p_action = 'threat_viewed' AND p_category IS NOT NULL THEN p_category ELSE user_dashboard_analytics.most_viewed_category END,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'  -- Critical security fix
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = get_user_role.user_id 
  ORDER BY 
    CASE role
      WHEN 'premonix_super_user' THEN 7
      WHEN 'enterprise_admin' THEN 6
      WHEN 'team_admin' THEN 5
      WHEN 'team_member' THEN 4
      WHEN 'pro' THEN 3
      WHEN 'individual' THEN 2
      WHEN 'guest' THEN 1
      -- Legacy support
      WHEN 'enterprise' THEN 6
      WHEN 'business' THEN 5
      WHEN 'registered' THEN 2
    END DESC
  LIMIT 1;
$$;

-- 3. Create a secure admin role assignment function
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  target_user_id uuid;
  calling_user_role app_role;
BEGIN
  -- Check if the calling user has admin privileges
  SELECT public.get_user_role(auth.uid()) INTO calling_user_role;
  
  IF calling_user_role != 'premonix_super_user' THEN
    RAISE EXCEPTION 'Insufficient privileges to assign admin role';
  END IF;
  
  -- Find the target user
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = target_user_email;
  
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'premonix_super_user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- 4. Add input validation functions for enhanced security
CREATE OR REPLACE FUNCTION public.validate_email(email_input text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Basic email validation
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    AND length(email_input) <= 254
    AND email_input NOT LIKE '%..%'
    AND email_input NOT LIKE '.%'
    AND email_input NOT LIKE '%.'
    AND email_input NOT LIKE '%@.%'
    AND email_input NOT LIKE '%.@%';
END;
$$;

CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text, max_length integer DEFAULT 1000)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Remove potential XSS patterns and limit length
  RETURN left(
    regexp_replace(
      regexp_replace(
        coalesce(input_text, ''),
        '<[^>]*>', '', 'gi'  -- Remove HTML tags
      ),
      '[<>"\''&]', '', 'g'  -- Remove dangerous characters
    ),
    max_length
  );
END;
$$;