-- Update the app_role enum to include new roles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'individual';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'pro';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'team_member';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'team_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'enterprise_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'premonix_super_user';

-- Update the handle_new_user function to use the new role structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile first
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email)
  );
  
  -- Then assign role based on email (including variants with + suffixes)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.email LIKE 'leonedwardhardwick22%@gmail.com' THEN 'premonix_super_user'::app_role
      WHEN NEW.email IN ('admin@premonix.com', 'admin@premonix.app', 'admin@premonix.io') THEN 'premonix_super_user'::app_role
      ELSE 'individual'::app_role  -- Changed from 'registered' to 'individual'
    END
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block user creation
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- Update the get_user_role function to handle the new role hierarchy
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;