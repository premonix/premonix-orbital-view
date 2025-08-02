import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { ThreatAlertEmail } from './_templates/threat-alert-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ThreatAlert {
  id: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  description?: string;
}

interface SendAlertsRequest {
  userId?: string;
  alerts: ThreatAlert[];
  userEmail?: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Threat alerts function called');
    
    const { userId, alerts, userEmail, userName }: SendAlertsRequest = await req.json();
    
    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No alerts provided' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let recipientEmail = userEmail;
    let recipientName = userName;

    // If userId provided, fetch user details from database
    if (userId && !userEmail) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      recipientEmail = profile.email;
      recipientName = profile.name;
    }

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'No recipient email provided' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending ${alerts.length} threat alerts to:`, recipientEmail);

    const baseUrl = 'https://eydehwbjzpanyzzshgyd.supabase.co';
    const dashboardUrl = `${baseUrl}/dashboard`;
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

    const html = await renderAsync(
      React.createElement(ThreatAlertEmail, {
        userName: recipientName || 'there',
        alerts,
        dashboardUrl,
        unsubscribeUrl,
      })
    );

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const subject = criticalCount > 0 
      ? `🚨 ${criticalCount} Critical Threat Alert${criticalCount > 1 ? 's' : ''} - PREMONIX`
      : `⚠️ ${alerts.length} New Threat Alert${alerts.length > 1 ? 's' : ''} - PREMONIX`;

    const emailResponse = await resend.emails.send({
      from: 'PREMONIX Alerts <alerts@resend.dev>',
      to: [recipientEmail],
      subject,
      html,
    });

    console.log('Threat alert email sent successfully:', emailResponse);

    // Log the alert to database
    if (userId) {
      try {
        await supabase
          .from('user_alerts')
          .insert(
            alerts.map(alert => ({
              user_id: userId,
              alert_type: 'email_threat_alert',
              metadata: {
                email_id: emailResponse.data?.id,
                alert_ids: alerts.map(a => a.id),
                severity_counts: {
                  critical: alerts.filter(a => a.severity === 'critical').length,
                  high: alerts.filter(a => a.severity === 'high').length,
                  medium: alerts.filter(a => a.severity === 'medium').length,
                  low: alerts.filter(a => a.severity === 'low').length,
                }
              }
            }))
          );
      } catch (dbError) {
        console.error('Error logging alert to database:', dbError);
        // Don't fail the email send if DB logging fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        alertCount: alerts.length,
        message: 'Threat alert email sent successfully' 
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
    console.error("Error in send-threat-alerts function:", error);
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