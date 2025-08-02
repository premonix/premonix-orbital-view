import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const startTime = Date.now()
  const healthStatus = {
    timestamp: new Date().toISOString(),
    services: {},
    overall_status: 'healthy',
    response_time_ms: 0
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check database connectivity
    const dbStartTime = Date.now()
    try {
      const { data, error } = await supabaseClient
        .from('threat_signals')
        .select('id')
        .limit(1)

      const dbResponseTime = Date.now() - dbStartTime
      
      if (error) {
        throw error
      }

      healthStatus.services.database = {
        status: 'healthy',
        response_time_ms: dbResponseTime,
        last_check: new Date().toISOString()
      }

      // Log health check
      await logHealthCheck(supabaseClient, 'database', 'healthy', dbResponseTime)
    } catch (error) {
      const dbResponseTime = Date.now() - dbStartTime
      healthStatus.services.database = {
        status: 'error',
        response_time_ms: dbResponseTime,
        error: error.message,
        last_check: new Date().toISOString()
      }
      healthStatus.overall_status = 'error'
      
      await logHealthCheck(supabaseClient, 'database', 'error', dbResponseTime, error.message)
    }

    // Check signal ingestion function
    const functionStartTime = Date.now()
    try {
      const { data, error } = await supabaseClient
        .from('data_pipeline_logs')
        .select('*')
        .eq('pipeline_name', 'signal-ingestion')
        .order('created_at', { ascending: false })
        .limit(1)

      const functionResponseTime = Date.now() - functionStartTime
      
      if (error) {
        throw error
      }

      const lastRun = data && data.length > 0 ? data[0] : null
      const timeSinceLastRun = lastRun ? Date.now() - new Date(lastRun.created_at).getTime() : null
      
      // Consider healthy if last run was within 2 hours
      const isHealthy = !timeSinceLastRun || timeSinceLastRun < 2 * 60 * 60 * 1000
      
      healthStatus.services.signal_ingestion = {
        status: isHealthy ? 'healthy' : 'warning',
        response_time_ms: functionResponseTime,
        last_run: lastRun?.created_at || null,
        last_run_status: lastRun?.status || null,
        minutes_since_last_run: timeSinceLastRun ? Math.floor(timeSinceLastRun / 60000) : null,
        last_check: new Date().toISOString()
      }

      if (!isHealthy && healthStatus.overall_status === 'healthy') {
        healthStatus.overall_status = 'warning'
      }

      await logHealthCheck(supabaseClient, 'signal_ingestion', isHealthy ? 'healthy' : 'warning', functionResponseTime)
    } catch (error) {
      const functionResponseTime = Date.now() - functionStartTime
      healthStatus.services.signal_ingestion = {
        status: 'error',
        response_time_ms: functionResponseTime,
        error: error.message,
        last_check: new Date().toISOString()
      }
      healthStatus.overall_status = 'error'
      
      await logHealthCheck(supabaseClient, 'signal_ingestion', 'error', functionResponseTime, error.message)
    }

    // Check external APIs availability
    const apiStartTime = Date.now()
    try {
      // Test NewsAPI
      const newsApiKey = Deno.env.get('NEWSAPI_KEY')
      let newsApiStatus = 'healthy'
      let newsApiError = null
      
      if (!newsApiKey) {
        newsApiStatus = 'warning'
        newsApiError = 'API key not configured'
      } else {
        try {
          const response = await fetch(
            'https://newsapi.org/v2/everything?q=test&pageSize=1',
            {
              headers: { 'X-API-Key': newsApiKey },
              signal: AbortSignal.timeout(10000)
            }
          )
          if (!response.ok) {
            newsApiStatus = 'error'
            newsApiError = `HTTP ${response.status}`
          }
        } catch (error) {
          newsApiStatus = 'error'
          newsApiError = error.message
        }
      }

      // Test GDELT API
      let gdeltStatus = 'healthy'
      let gdeltError = null
      
      try {
        const response = await fetch(
          'http://api.gdeltproject.org/api/v2/doc/doc?query=test&mode=artlist&maxrecords=1&format=json',
          { signal: AbortSignal.timeout(10000) }
        )
        if (!response.ok) {
          gdeltStatus = 'error'
          gdeltError = `HTTP ${response.status}`
        }
      } catch (error) {
        gdeltStatus = 'error'
        gdeltError = error.message
      }

      const apiResponseTime = Date.now() - apiStartTime
      
      healthStatus.services.external_apis = {
        status: newsApiStatus === 'healthy' && gdeltStatus === 'healthy' ? 'healthy' : 
                (newsApiStatus === 'error' || gdeltStatus === 'error' ? 'error' : 'warning'),
        response_time_ms: apiResponseTime,
        news_api: { status: newsApiStatus, error: newsApiError },
        gdelt_api: { status: gdeltStatus, error: gdeltError },
        last_check: new Date().toISOString()
      }

      if (healthStatus.services.external_apis.status === 'error' && healthStatus.overall_status !== 'error') {
        healthStatus.overall_status = 'warning'
      }

      await logHealthCheck(supabaseClient, 'external_apis', healthStatus.services.external_apis.status, apiResponseTime)
    } catch (error) {
      const apiResponseTime = Date.now() - apiStartTime
      healthStatus.services.external_apis = {
        status: 'error',
        response_time_ms: apiResponseTime,
        error: error.message,
        last_check: new Date().toISOString()
      }
      
      await logHealthCheck(supabaseClient, 'external_apis', 'error', apiResponseTime, error.message)
    }

    healthStatus.response_time_ms = Date.now() - startTime

    return new Response(
      JSON.stringify(healthStatus, null, 2),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: healthStatus.overall_status === 'healthy' ? 200 : 
                healthStatus.overall_status === 'warning' ? 200 : 500
      }
    )

  } catch (error) {
    console.error('Health check error:', error)
    
    return new Response(
      JSON.stringify({ 
        timestamp: new Date().toISOString(),
        overall_status: 'error',
        error: error.message,
        response_time_ms: Date.now() - startTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function logHealthCheck(
  supabaseClient: any,
  serviceName: string,
  status: string,
  responseTime: number,
  errorMessage?: string
) {
  try {
    await supabaseClient
      .from('system_health_logs')
      .insert({
        service_name: serviceName,
        status,
        response_time_ms: responseTime,
        error_message: errorMessage,
        metadata: {
          environment: 'production',
          version: '1.0.0'
        }
      })
  } catch (error) {
    console.error('Failed to log health check:', error)
  }
}