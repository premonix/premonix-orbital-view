-- Update the handle_new_user function to include admin@premonix.io
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
      WHEN NEW.email LIKE 'leonedwardhardwick22%@gmail.com' THEN 'enterprise'::app_role
      WHEN NEW.email IN ('admin@premonix.com', 'admin@premonix.app', 'admin@premonix.io') THEN 'enterprise'::app_role
      ELSE 'registered'::app_role
    END
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block user creation
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- Also update the existing user with admin@premonix.io to enterprise role
INSERT INTO public.user_roles (user_id, role)
VALUES ('db19a576-4074-4db8-8103-d004789cec9c', 'enterprise'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;