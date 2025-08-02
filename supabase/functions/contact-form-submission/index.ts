import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organization, subject, message }: ContactFormRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get client info
    const userAgent = req.headers.get("user-agent") || "";
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        organization,
        subject,
        message,
        ip_address: clientIP,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "PREMONIX <support@premonix.com>",
      to: [email],
      subject: "Thank you for contacting PREMONIX",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0066cc;">Thank you for contacting PREMONIX</h1>
          <p>Dear ${name},</p>
          <p>We have received your message regarding: <strong>${subject}</strong></p>
          <p>Our team will review your inquiry and get back to you within 24 hours.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>Best regards,<br>The PREMONIX Team</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "PREMONIX Contact Form <noreply@premonix.com>",
      to: ["admin@premonix.com"],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0066cc;">New Contact Form Submission</h1>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p><strong>Submission ID:</strong> ${submission.id}</p>
          <p><strong>Submitted at:</strong> ${new Date(submission.submitted_at).toLocaleString()}</p>
          <p><strong>IP Address:</strong> ${clientIP}</p>
        </div>
      `,
    });

    console.log("Emails sent:", { userEmailResponse, adminEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully",
        submissionId: submission.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in contact form submission:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});