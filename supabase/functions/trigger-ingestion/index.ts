import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Manual ingestion trigger initiated');
    
    // Trigger both signal ingestion and threat feed ingestion
    const promises = [
      supabaseClient.functions.invoke('signal-ingestion', {
        body: { manual_trigger: true }
      }),
      supabaseClient.functions.invoke('threat-feed-ingestion', {
        body: { manual_trigger: true }
      })
    ];

    const results = await Promise.allSettled(promises);
    
    const signalResult = results[0];
    const feedResult = results[1];
    
    const response = {
      success: true,
      message: 'Ingestion triggered successfully',
      results: {
        signal_ingestion: signalResult.status === 'fulfilled' ? signalResult.value : { error: signalResult.reason },
        threat_feed_ingestion: feedResult.status === 'fulfilled' ? feedResult.value : { error: feedResult.reason }
      }
    };

    console.log('Ingestion trigger completed:', response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Ingestion trigger failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});