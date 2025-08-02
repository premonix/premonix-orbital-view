import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
}

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string, maxRequests = 5, windowMs = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { firstName, lastName, email, organization, subject, message }: ContactFormRequest = await req.json();

    // Enhanced input validation for security
    if (!firstName || !lastName || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Validate field lengths
    if (firstName.length > 50 || lastName.length > 50 || subject.length > 200 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Field length exceeds maximum allowed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Validate email format using database function
    const { data: isValidEmail } = await supabaseClient
      .rpc('validate_email', { email_input: email });

    if (!isValidEmail) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Sanitize text inputs to prevent XSS
    const { data: sanitizedFirstName } = await supabaseClient
      .rpc('sanitize_text_input', { input_text: firstName, max_length: 50 });
    const { data: sanitizedLastName } = await supabaseClient
      .rpc('sanitize_text_input', { input_text: lastName, max_length: 50 });
    const { data: sanitizedOrganization } = await supabaseClient
      .rpc('sanitize_text_input', { input_text: organization || '', max_length: 100 });
    const { data: sanitizedSubject } = await supabaseClient
      .rpc('sanitize_text_input', { input_text: subject, max_length: 200 });
    const { data: sanitizedMessage } = await supabaseClient
      .rpc('sanitize_text_input', { input_text: message, max_length: 2000 });

    // Save to database with sanitized inputs
    const { data, error } = await supabaseClient
      .from('contact_submissions')
      .insert({
        name: `${sanitizedFirstName} ${sanitizedLastName}`,
        email: email.toLowerCase().trim(),
        organization: sanitizedOrganization || null,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        status: 'new',
        submitted_at: new Date().toISOString(),
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent') || 'unknown'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Secure contact form submission saved:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        submissionId: data.id
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json', 
          'X-RateLimit-Remaining': String(4 - (rateLimitMap.get(clientIP)?.count || 0)),
          ...corsHeaders 
        },
      }
    );

  } catch (error: any) {
    console.error('Error in secure-contact-form function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);