import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { WelcomeEmail } from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userName: string;
  userEmail: string;
  loginUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Welcome email function called');
    
    const { userName, userEmail, loginUrl }: WelcomeEmailRequest = await req.json();
    
    console.log('Sending welcome email to:', userEmail);

    const baseUrl = loginUrl ? loginUrl.split('/dashboard')[0] : 'https://eydehwbjzpanyzzshgyd.supabase.co';
    const dashboardUrl = `${baseUrl}/dashboard`;

    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        userName: userName || 'there',
        userEmail,
        loginUrl: baseUrl,
        dashboardUrl,
      })
    );

    const emailResponse = await resend.emails.send({
      from: 'PREMONIX <noreply@resend.dev>',
      to: [userEmail],
      subject: 'Welcome to PREMONIX - Your Threat Intelligence Platform',
      html,
    });

    console.log('Welcome email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: 'Welcome email sent successfully' 
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
    console.error("Error in send-welcome-email function:", error);
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