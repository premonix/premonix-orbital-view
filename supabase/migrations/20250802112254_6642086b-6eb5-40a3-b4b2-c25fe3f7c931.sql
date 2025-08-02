-- Update users to PREMONIX Super User role
UPDATE public.user_roles 
SET role = 'premonix_super_user'::app_role 
WHERE user_id IN (
  SELECT p.id 
  FROM public.profiles p 
  WHERE p.email IN (
    'admin@premonix.io',
    'leonedwardhardwick22+premonix@gmail.com'
  )
);