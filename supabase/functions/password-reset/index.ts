import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordResetRequest {
  email: string;
  action: 'request' | 'verify' | 'reset';
  token?: string;
  newPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, action, token, newPassword }: PasswordResetRequest = await req.json();

    // Validate email format
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

    switch (action) {
      case 'request':
        // Generate secure token and save to database
        const resetToken = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

        // Find user by email
        const { data: userData } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (!userData) {
          // Don't reveal if email exists - security best practice
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'If an account with this email exists, a reset link has been sent.'
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Store reset token
        await supabaseClient
          .from('password_reset_tokens')
          .insert({
            user_id: userData.id,
            token: resetToken,
            expires_at: expiresAt.toISOString()
          });

        // In a real implementation, send email here using Resend
        console.log(`Password reset token for ${email}: ${resetToken}`);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'If an account with this email exists, a reset link has been sent.'
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );

      case 'verify':
        if (!token) {
          return new Response(
            JSON.stringify({ error: 'Token is required' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Check if token exists and is valid
        const { data: tokenData } = await supabaseClient
          .from('password_reset_tokens')
          .select('*')
          .eq('token', token)
          .is('used_at', null)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (!tokenData) {
          return new Response(
            JSON.stringify({ error: 'Invalid or expired token' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Token is valid' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );

      case 'reset':
        if (!token || !newPassword) {
          return new Response(
            JSON.stringify({ error: 'Token and new password are required' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Validate password strength
        if (newPassword.length < 12) {
          return new Response(
            JSON.stringify({ error: 'Password must be at least 12 characters long' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Find and validate token
        const { data: resetTokenData } = await supabaseClient
          .from('password_reset_tokens')
          .select('*')
          .eq('token', token)
          .is('used_at', null)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (!resetTokenData) {
          return new Response(
            JSON.stringify({ error: 'Invalid or expired token' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Get user email for auth update
        const { data: userProfile } = await supabaseClient
          .from('profiles')
          .select('email')
          .eq('id', resetTokenData.user_id)
          .single();

        if (!userProfile) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Update password using Supabase Auth Admin API
        const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
          resetTokenData.user_id,
          { password: newPassword }
        );

        if (updateError) {
          console.error('Error updating password:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update password' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Mark token as used
        await supabaseClient
          .from('password_reset_tokens')
          .update({ used_at: new Date().toISOString() })
          .eq('token', token);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Password has been reset successfully'
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
    }

  } catch (error: any) {
    console.error('Error in password-reset function:', error);
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