-- Complete the missing database schema for comprehensive onboarding and payment

-- Create enum for organization sectors
CREATE TYPE organization_sector AS ENUM (
  'technology',
  'financial_services',
  'healthcare',
  'manufacturing',
  'energy_utilities',
  'government_public_sector',
  'education',
  'retail_consumer_goods',
  'telecommunications',
  'transportation_logistics',
  'agriculture',
  'real_estate',
  'entertainment_media',
  'non_profit',
  'consulting',
  'other'
);

-- Create enum for organization sizes
CREATE TYPE organization_size AS ENUM (
  'micro',      -- 1-10 employees
  'small',      -- 11-50 employees
  'medium',     -- 51-250 employees
  'large',      -- 251-1000 employees
  'enterprise'  -- 1000+ employees
);

-- Create enum for geographic regions
CREATE TYPE geographic_region AS ENUM (
  'north_america',
  'south_america',
  'europe',
  'africa',
  'asia_pacific',
  'middle_east',
  'oceania',
  'global'
);

-- Create comprehensive organization profiles table
CREATE TABLE IF NOT EXISTS public.organization_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sector organization_sector NOT NULL,
  size organization_size NOT NULL,
  employee_count INTEGER,
  annual_revenue_usd INTEGER, -- in USD
  primary_region geographic_region NOT NULL,
  locations TEXT[], -- Array of specific locations/countries
  website TEXT,
  description TEXT,
  key_assets TEXT[], -- Critical assets/operations
  supply_chain_complexity INTEGER CHECK (supply_chain_complexity >= 1 AND supply_chain_complexity <= 5),
  regulatory_requirements TEXT[],
  existing_security_measures TEXT[],
  risk_tolerance INTEGER CHECK (risk_tolerance >= 1 AND risk_tolerance <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for organization profiles
ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for organization profiles
CREATE POLICY "Users can view their own organization profile" 
ON public.organization_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own organization profile" 
ON public.organization_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organization profile" 
ON public.organization_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create enhanced DSS assessment results table
CREATE TABLE IF NOT EXISTS public.dss_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  category_scores JSONB NOT NULL, -- Detailed breakdown by category
  assessment_data JSONB NOT NULL, -- All responses and metadata
  recommendations TEXT[],
  risk_level TEXT NOT NULL CHECK (risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version TEXT NOT NULL DEFAULT '2.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for DSS assessments
ALTER TABLE public.dss_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for DSS assessments
CREATE POLICY "Users can view their own DSS assessments" 
ON public.dss_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own DSS assessments" 
ON public.dss_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT UNIQUE,
  price_monthly INTEGER, -- in cents
  price_yearly INTEGER, -- in cents
  features JSONB NOT NULL,
  max_users INTEGER,
  max_organizations INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_yearly, features, max_users, max_organizations, description) VALUES
('Personal', 2900, 29000, '["Global threat map access", "Personal alert system", "Basic resilience toolkit", "24/7 threat monitoring", "Mobile app access"]'::jsonb, 1, 1, 'Perfect for individuals and families seeking personal preparedness'),
('Professional', 9900, 99000, '["Everything in Personal", "Advanced threat analytics", "Custom alert zones", "Threat correlation engine", "DisruptionOS access", "Email & SMS alerts", "Priority support"]'::jsonb, 5, 1, 'Ideal for small businesses and professional users'),
('Enterprise', 39900, 399000, '["Everything in Professional", "Multi-user collaboration", "Custom integrations", "Advanced reporting", "Dedicated account manager", "API access", "Custom training", "White-label options"]'::jsonb, 999, 10, 'Comprehensive solution for large organizations');

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for user subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage subscriptions" 
ON public.user_subscriptions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for password reset tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for password reset tokens (only service role can manage)
CREATE POLICY "Service can manage password reset tokens" 
ON public.password_reset_tokens 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create onboarding progress table
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, step)
);

-- Enable RLS for onboarding progress
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding progress
CREATE POLICY "Users can view their own onboarding progress" 
ON public.onboarding_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding progress" 
ON public.onboarding_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_organization_profiles_updated_at
    BEFORE UPDATE ON public.organization_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate initial DSS score based on organization profile
CREATE OR REPLACE FUNCTION public.calculate_initial_dss_score(
  org_sector organization_sector,
  org_size organization_size,
  supply_complexity INTEGER,
  primary_region geographic_region,
  employee_count INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  base_score INTEGER := 0;
  sector_risk INTEGER := 0;
  size_risk INTEGER := 0;
  region_risk INTEGER := 0;
  complexity_risk INTEGER := 0;
BEGIN
  -- Sector-based risk scoring
  CASE org_sector
    WHEN 'financial_services' THEN sector_risk := 25;
    WHEN 'government_public_sector' THEN sector_risk := 30;
    WHEN 'energy_utilities' THEN sector_risk := 28;
    WHEN 'healthcare' THEN sector_risk := 22;
    WHEN 'technology' THEN sector_risk := 20;
    WHEN 'telecommunications' THEN sector_risk := 24;
    WHEN 'transportation_logistics' THEN sector_risk := 26;
    WHEN 'manufacturing' THEN sector_risk := 18;
    WHEN 'retail_consumer_goods' THEN sector_risk := 15;
    WHEN 'education' THEN sector_risk := 12;
    WHEN 'agriculture' THEN sector_risk := 14;
    WHEN 'real_estate' THEN sector_risk := 10;
    WHEN 'entertainment_media' THEN sector_risk := 16;
    WHEN 'consulting' THEN sector_risk := 13;
    WHEN 'non_profit' THEN sector_risk := 8;
    ELSE sector_risk := 15; -- other
  END CASE;

  -- Size-based risk scoring
  CASE org_size
    WHEN 'enterprise' THEN size_risk := 25;
    WHEN 'large' THEN size_risk := 20;
    WHEN 'medium' THEN size_risk := 15;
    WHEN 'small' THEN size_risk := 10;
    WHEN 'micro' THEN size_risk := 5;
  END CASE;

  -- Regional risk scoring
  CASE primary_region
    WHEN 'middle_east' THEN region_risk := 20;
    WHEN 'africa' THEN region_risk := 18;
    WHEN 'asia_pacific' THEN region_risk := 15;
    WHEN 'south_america' THEN region_risk := 12;
    WHEN 'europe' THEN region_risk := 10;
    WHEN 'north_america' THEN region_risk := 8;
    WHEN 'oceania' THEN region_risk := 6;
    WHEN 'global' THEN region_risk := 25;
  END CASE;

  -- Supply chain complexity risk
  complexity_risk := COALESCE(supply_complexity, 3) * 5;

  -- Calculate total score
  base_score := sector_risk + size_risk + region_risk + complexity_risk;
  
  -- Ensure score is within bounds
  RETURN GREATEST(0, LEAST(100, base_score));
END;
$$ LANGUAGE plpgsql;