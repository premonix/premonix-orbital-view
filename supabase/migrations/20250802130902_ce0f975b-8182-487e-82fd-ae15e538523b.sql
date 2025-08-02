-- Create contact form submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new',
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for contact submissions
CREATE POLICY "Allow public contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create reports table for generated reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  time_period TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  status TEXT NOT NULL DEFAULT 'active',
  download_count INTEGER DEFAULT 0
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Allow public read access to reports" 
ON public.reports 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Service role can manage reports" 
ON public.reports 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create threat watchlist table
CREATE TABLE public.threat_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  threat_signal_id UUID,
  custom_title TEXT,
  custom_description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[],
  notes TEXT
);

-- Enable RLS for threat watchlist
ALTER TABLE public.threat_watchlist ENABLE ROW LEVEL SECURITY;

-- Create policies for threat watchlist
CREATE POLICY "Users can view their own watchlist" 
ON public.threat_watchlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlist items" 
ON public.threat_watchlist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items" 
ON public.threat_watchlist 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items" 
ON public.threat_watchlist 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create email preferences table
CREATE TABLE public.user_email_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  threat_alerts BOOLEAN NOT NULL DEFAULT true,
  weekly_digest BOOLEAN NOT NULL DEFAULT true,
  security_updates BOOLEAN NOT NULL DEFAULT true,
  marketing_emails BOOLEAN NOT NULL DEFAULT false,
  alert_frequency TEXT NOT NULL DEFAULT 'immediate',
  digest_day TEXT NOT NULL DEFAULT 'monday',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for email preferences
ALTER TABLE public.user_email_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for email preferences
CREATE POLICY "Users can view their own email preferences" 
ON public.user_email_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email preferences" 
ON public.user_email_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email preferences" 
ON public.user_email_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_threat_watchlist_updated_at
BEFORE UPDATE ON public.threat_watchlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_email_preferences_updated_at
BEFORE UPDATE ON public.user_email_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample reports data
INSERT INTO public.reports (title, category, severity, time_period, description) VALUES
('Global Cyber Threat Analysis Q4 2024', 'Cyber', 'High', 'Quarterly', 'Comprehensive analysis of global cyber threats and attack patterns in Q4 2024'),
('Military Tensions Report - December 2024', 'Military', 'Critical', 'Monthly', 'Monthly assessment of global military tensions and conflict zones'),
('Economic Risk Assessment - Asia Pacific', 'Economic', 'Medium', 'Regional', 'Economic stability analysis for Asia Pacific region'),
('Supply Chain Disruption Overview', 'Economic', 'High', 'Weekly', 'Weekly update on global supply chain disruptions and impacts'),
('Climate Security Nexus Report', 'Environmental', 'Medium', 'Quarterly', 'Analysis of climate change impacts on global security'),
('Energy Infrastructure Vulnerability Assessment', 'Infrastructure', 'High', 'Monthly', 'Assessment of critical energy infrastructure vulnerabilities');