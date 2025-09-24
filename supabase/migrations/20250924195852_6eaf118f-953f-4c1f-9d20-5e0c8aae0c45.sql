-- Upgrade pl@zowy.co.uk to premonix_super_user role
UPDATE public.user_roles 
SET role = 'premonix_super_user'::app_role, 
    assigned_at = now()
WHERE user_id = '16dedb0e-8eea-425b-968e-50fa351f88c8';