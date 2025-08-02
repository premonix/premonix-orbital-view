import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Triggering test emails...');
    
    const testEmail = 'leonedwardhardwick22+premonix@gmail.com';
    const testName = 'Leon';
    const baseUrl = 'https://eydehwbjzpanyzzshgyd.supabase.co/functions/v1';

    // 1. Send welcome email
    const welcomeResponse = await fetch(`${baseUrl}/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: testName,
        userEmail: testEmail,
        loginUrl: 'https://eydehwbjzpanyzzshgyd.supabase.co/dashboard'
      })
    });

    // 2. Send threat alerts email
    const threatAlertsResponse = await fetch(`${baseUrl}/send-threat-alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: testEmail,
        userName: testName,
        alerts: [
          {
            id: 'test-1',
            title: 'Critical Infrastructure Threat Detected',
            category: 'Cyber Security',
            severity: 'critical',
            location: 'United States, California',
            timestamp: new Date().toISOString(),
            description: 'Advanced persistent threat targeting energy sector infrastructure'
          },
          {
            id: 'test-2',
            title: 'Supply Chain Disruption Alert',
            category: 'Supply Chain',
            severity: 'high',
            location: 'China, Shanghai',
            timestamp: new Date().toISOString(),
            description: 'Major port delays affecting global semiconductor supply'
          },
          {
            id: 'test-3',
            title: 'Financial Market Volatility Warning',
            category: 'Financial',
            severity: 'medium',
            location: 'United Kingdom, London',
            timestamp: new Date().toISOString(),
            description: 'Currency fluctuations detected in emerging markets'
          }
        ]
      })
    });

    // 3. Send weekly digest email
    const weeklyDigestResponse = await fetch(`${baseUrl}/send-weekly-digest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: testEmail,
        userName: testName,
        weekStarting: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    });

    const welcomeData = await welcomeResponse.json();
    const threatAlertsData = await threatAlertsResponse.json();
    const weeklyDigestData = await weeklyDigestResponse.json();

    console.log('All test emails triggered:', {
      welcome: welcomeData,
      threatAlerts: threatAlertsData,
      weeklyDigest: weeklyDigestData
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'All test emails triggered successfully',
        results: {
          welcome: welcomeData,
          threatAlerts: threatAlertsData,
          weeklyDigest: weeklyDigestData
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error triggering test emails:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);