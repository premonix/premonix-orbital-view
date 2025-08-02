-- Add new enum values to app_role
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'individual';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'pro';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'team_member';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'team_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'enterprise_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'premonix_super_user';