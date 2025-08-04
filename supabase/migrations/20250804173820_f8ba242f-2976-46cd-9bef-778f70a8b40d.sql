-- Insert threat intelligence reports aligned with current threat signals
INSERT INTO public.reports (
  title, 
  category, 
  severity, 
  time_period, 
  description, 
  status,
  download_count
) VALUES 
(
  'Global Cyber Threat Landscape - Q4 2024',
  'cyber',
  'critical',
  'Quarterly',
  'Comprehensive analysis of emerging cyber threats targeting critical infrastructure, including banking trojans, ransomware campaigns, and state-sponsored attacks affecting financial institutions globally.',
  'active',
  847
),
(
  'Eastern European Military Activities Assessment',
  'military',
  'high',
  'Weekly',
  'Detailed assessment of military movements and exercises in Eastern Europe, including NATO training operations and regional defense posture updates affecting geopolitical stability.',
  'active',
  623
),
(
  'Economic Disruption Analysis - Supply Chain Vulnerabilities',
  'economic',
  'high',
  'Monthly',
  'In-depth analysis of global supply chain disruptions, focusing on semiconductor shortages, shipping delays, and their impact on economic stability across key industries.',
  'active',
  445
),
(
  'Diplomatic Tensions & Trade Impact Report',
  'political',
  'medium',
  'Bi-weekly',
  'Analysis of ongoing trade negotiations, diplomatic tensions, and their potential impact on international markets and business operations.',
  'active',
  289
),
(
  'Critical Infrastructure Protection Update',
  'global',
  'critical',
  'Monthly',
  'Assessment of vulnerabilities in power grids, transportation systems, and telecommunications infrastructure, with recommendations for enhanced security measures.',
  'active',
  712
),
(
  'Asia-Pacific Security Outlook',
  'military',
  'medium',
  'Monthly',
  'Regional security analysis covering military developments, territorial disputes, and defense cooperation agreements in the Asia-Pacific region.',
  'active',
  356
),
(
  'Ransomware Campaign Intelligence Brief',
  'cyber',
  'critical',
  'Daily',
  'Real-time intelligence on active ransomware campaigns targeting healthcare, energy, and financial sectors with IOCs and mitigation strategies.',
  'active',
  1203
),
(
  'Market Volatility & Financial Stability Assessment',
  'economic',
  'medium',
  'Weekly',
  'Analysis of market volatility indicators, financial sector stress tests, and potential triggers for economic instability.',
  'active',
  567
)