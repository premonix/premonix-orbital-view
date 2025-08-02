-- Update the handle_new_user function to recognize email variants
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

-- Update existing user role for leonedwardhardwick22+premonix@gmail.com
UPDATE public.user_roles 
SET role = 'enterprise'::app_role 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'leonedwardhardwick22+premonix@gmail.com'
);