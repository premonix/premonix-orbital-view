import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Sending welcome email to Jasper...');
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Call the send-welcome-email function
    const { data, error } = await supabaseClient.functions.invoke('send-welcome-email', {
      body: {
        email: 'jasper@jalinmedia.nl',
        name: 'Jasper',
        userId: '798cd95f-dd3d-4b1e-a8f7-6a32161ca2b5',
        role: 'premonix_super_user'
      }
    });

    if (error) {
      console.error('Error calling welcome email function:', error);
      throw error;
    }

    console.log('Welcome email sent successfully to Jasper');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Welcome email sent to jasper@jalinmedia.nl',
      data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-jasper-welcome function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});