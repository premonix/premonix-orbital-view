import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { WeeklyDigestEmail } from '../send-welcome-email/_templates/weekly-digest-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeeklyDigestRequest {
  userId?: string;
  userEmail?: string;
  userName?: string;
  weekStarting?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Weekly digest function called');
    
    const { userId, userEmail, userName, weekStarting }: WeeklyDigestRequest = await req.json();
    
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

    // Calculate week starting date
    const weekStart = weekStarting ? new Date(weekStarting) : (() => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek;
      return new Date(now.setDate(diff));
    })();

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    console.log(`Generating weekly digest for ${recipientEmail} - Week of ${weekStart.toISOString()}`);

    // Fetch threat signals for the week
    const { data: signals, error: signalsError } = await supabase
      .from('threat_signals')
      .select('category, severity, title, country, region, timestamp')
      .gte('timestamp', weekStart.toISOString())
      .lt('timestamp', weekEnd.toISOString())
      .order('timestamp', { ascending: false });

    if (signalsError) {
      console.error('Error fetching threat signals:', signalsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch threat data' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const totalSignals = signals?.length || 0;

    // Calculate top categories with trends
    const categoryCounts = signals?.reduce((acc: Record<string, number>, signal) => {
      acc[signal.category] = (acc[signal.category] || 0) + 1;
      return acc;
    }, {}) || {};

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count: count as number,
        trend: 'stable' as 'up' | 'down' | 'stable' // TODO: Calculate actual trend
      }))
      .sort((a, b) => b.count - a.count);

    // Get critical events
    const criticalEvents = signals
      ?.filter(signal => signal.severity === 'critical')
      .slice(0, 5)
      .map(signal => ({
        title: signal.title,
        location: `${signal.country}${signal.region ? `, ${signal.region}` : ''}`,
        date: signal.timestamp
      })) || [];

    const baseUrl = 'https://eydehwbjzpanyzzshgyd.supabase.co';
    const dashboardUrl = `${baseUrl}/dashboard`;
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

    const html = await renderAsync(
      React.createElement(WeeklyDigestEmail, {
        userName: recipientName || 'there',
        weekStarting: weekStart.toISOString(),
        totalSignals,
        topCategories,
        criticalEvents,
        dashboardUrl,
        unsubscribeUrl,
      })
    );

    const emailResponse = await resend.emails.send({
      from: 'PREMONIX Intelligence <digest@resend.dev>',
      to: [recipientEmail],
      subject: `📊 Your Weekly Intelligence Digest - ${totalSignals.toLocaleString()} signals analyzed`,
      html,
    });

    console.log('Weekly digest email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        totalSignals,
        criticalEvents: criticalEvents.length,
        message: 'Weekly digest email sent successfully' 
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
    console.error("Error in send-weekly-digest function:", error);
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