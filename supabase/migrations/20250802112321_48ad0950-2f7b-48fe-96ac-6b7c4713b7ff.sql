-- First remove all existing roles for these users
DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT p.id 
  FROM public.profiles p 
  WHERE p.email IN (
    'admin@premonix.io',
    'leonedwardhardwick22+premonix@gmail.com'
  )
);

-- Then insert the Super User role
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'premonix_super_user'::app_role
FROM public.profiles p 
WHERE p.email IN (
  'admin@premonix.io',
  'leonedwardhardwick22+premonix@gmail.com'
);