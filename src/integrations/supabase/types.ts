export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          email: string
          id: string
          ip_address: unknown | null
          message: string
          name: string
          organization: string | null
          status: string
          subject: string
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          email: string
          id?: string
          ip_address?: unknown | null
          message: string
          name: string
          organization?: string | null
          status?: string
          subject: string
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          email?: string
          id?: string
          ip_address?: unknown | null
          message?: string
          name?: string
          organization?: string | null
          status?: string
          subject?: string
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      data_ingestion_logs: {
        Row: {
          completed_at: string | null
          data_source_id: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          metadata: Json | null
          records_inserted: number | null
          records_processed: number | null
          records_updated: number | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          data_source_id: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          records_inserted?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string
          status: string
        }
        Update: {
          completed_at?: string | null
          data_source_id?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          records_inserted?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_ingestion_logs_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_pipeline_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          metadata: Json | null
          pipeline_name: string
          records_processed: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          pipeline_name: string
          records_processed?: number | null
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          pipeline_name?: string
          records_processed?: number | null
          status?: string
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          api_key_name: string | null
          configuration: Json
          created_at: string
          endpoint_url: string | null
          id: string
          is_active: boolean
          last_error: string | null
          last_fetch_at: string | null
          name: string
          refresh_interval_minutes: number
          source_type: string
          updated_at: string
        }
        Insert: {
          api_key_name?: string | null
          configuration?: Json
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_fetch_at?: string | null
          name: string
          refresh_interval_minutes?: number
          source_type: string
          updated_at?: string
        }
        Update: {
          api_key_name?: string | null
          configuration?: Json
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_fetch_at?: string | null
          name?: string
          refresh_interval_minutes?: number
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      dss_assessments: {
        Row: {
          assessment_data: Json
          category_scores: Json
          completed_at: string
          created_at: string
          id: string
          organization_id: string | null
          overall_score: number
          recommendations: string[] | null
          risk_level: string
          user_id: string
          version: string
        }
        Insert: {
          assessment_data: Json
          category_scores: Json
          completed_at?: string
          created_at?: string
          id?: string
          organization_id?: string | null
          overall_score: number
          recommendations?: string[] | null
          risk_level: string
          user_id: string
          version?: string
        }
        Update: {
          assessment_data?: Json
          category_scores?: Json
          completed_at?: string
          created_at?: string
          id?: string
          organization_id?: string | null
          overall_score?: number
          recommendations?: string[] | null
          risk_level?: string
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "dss_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dss_score_history: {
        Row: {
          assessment_data: Json
          created_at: string
          id: string
          score: number
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          assessment_data?: Json
          created_at?: string
          id?: string
          score: number
          updated_at?: string
          user_id: string
          version?: string
        }
        Update: {
          assessment_data?: Json
          created_at?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          data: Json | null
          id: string
          step: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          step: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          step?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_profiles: {
        Row: {
          annual_revenue_usd: number | null
          created_at: string
          description: string | null
          employee_count: number | null
          existing_security_measures: string[] | null
          id: string
          key_assets: string[] | null
          locations: string[] | null
          name: string
          primary_region: Database["public"]["Enums"]["geographic_region"]
          regulatory_requirements: string[] | null
          risk_tolerance: number | null
          sector: Database["public"]["Enums"]["organization_sector"]
          size: Database["public"]["Enums"]["organization_size"]
          supply_chain_complexity: number | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          annual_revenue_usd?: number | null
          created_at?: string
          description?: string | null
          employee_count?: number | null
          existing_security_measures?: string[] | null
          id?: string
          key_assets?: string[] | null
          locations?: string[] | null
          name: string
          primary_region: Database["public"]["Enums"]["geographic_region"]
          regulatory_requirements?: string[] | null
          risk_tolerance?: number | null
          sector: Database["public"]["Enums"]["organization_sector"]
          size: Database["public"]["Enums"]["organization_size"]
          supply_chain_complexity?: number | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          annual_revenue_usd?: number | null
          created_at?: string
          description?: string | null
          employee_count?: number | null
          existing_security_measures?: string[] | null
          id?: string
          key_assets?: string[] | null
          locations?: string[] | null
          name?: string
          primary_region?: Database["public"]["Enums"]["geographic_region"]
          regulatory_requirements?: string[] | null
          risk_tolerance?: number | null
          sector?: Database["public"]["Enums"]["organization_sector"]
          size?: Database["public"]["Enums"]["organization_size"]
          supply_chain_complexity?: number | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          download_count: number | null
          file_url: string | null
          id: string
          severity: string
          status: string
          time_period: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          severity: string
          status?: string
          time_period: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          severity?: string
          status?: string
          time_period?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_organizations: number | null
          max_users: number | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          max_organizations?: number | null
          max_users?: number | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_organizations?: number | null
          max_users?: number | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_health_logs: {
        Row: {
          checked_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: string
        }
        Insert: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status: string
        }
        Update: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      threat_signals: {
        Row: {
          category: string
          confidence: number
          country: string
          created_at: string
          escalation_potential: number | null
          id: string
          latitude: number
          longitude: number
          processed_at: string | null
          region: string | null
          severity: string
          source_name: string
          source_url: string | null
          summary: string | null
          tags: string[] | null
          threat_score: number
          timestamp: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          confidence: number
          country: string
          created_at?: string
          escalation_potential?: number | null
          id?: string
          latitude: number
          longitude: number
          processed_at?: string | null
          region?: string | null
          severity: string
          source_name: string
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          threat_score: number
          timestamp?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          confidence?: number
          country?: string
          created_at?: string
          escalation_potential?: number | null
          id?: string
          latitude?: number
          longitude?: number
          processed_at?: string | null
          region?: string | null
          severity?: string
          source_name?: string
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          threat_score?: number
          timestamp?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      threat_watchlist: {
        Row: {
          created_at: string
          custom_description: string | null
          custom_title: string | null
          id: string
          notes: string | null
          priority: string
          status: string
          tags: string[] | null
          threat_signal_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_description?: string | null
          custom_title?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          tags?: string[] | null
          threat_signal_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_description?: string | null
          custom_title?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          tags?: string[] | null
          threat_signal_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          alert_type: string
          id: string
          is_dismissed: boolean
          is_read: boolean
          metadata: Json | null
          threat_signal_id: string | null
          triggered_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          metadata?: Json | null
          threat_signal_id?: string | null
          triggered_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          metadata?: Json | null
          threat_signal_id?: string | null
          triggered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alerts_threat_signal_id_fkey"
            columns: ["threat_signal_id"]
            isOneToOne: false
            referencedRelation: "threat_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_analytics: {
        Row: {
          alerts_triggered: number | null
          avg_session_duration: number | null
          created_at: string
          dashboard_visits: number | null
          date: string
          id: string
          most_viewed_category: string | null
          threats_viewed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alerts_triggered?: number | null
          avg_session_duration?: number | null
          created_at?: string
          dashboard_visits?: number | null
          date?: string
          id?: string
          most_viewed_category?: string | null
          threats_viewed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alerts_triggered?: number | null
          avg_session_duration?: number | null
          created_at?: string
          dashboard_visits?: number | null
          date?: string
          id?: string
          most_viewed_category?: string | null
          threats_viewed?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_dashboard_preferences: {
        Row: {
          alert_preferences: Json | null
          created_at: string
          dashboard_layout: Json | null
          id: string
          location_preferences: Json | null
          theme_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_preferences?: Json | null
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          location_preferences?: Json | null
          theme_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_preferences?: Json | null
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          location_preferences?: Json | null
          theme_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_email_preferences: {
        Row: {
          alert_frequency: string
          created_at: string
          digest_day: string
          id: string
          marketing_emails: boolean
          security_updates: boolean
          threat_alerts: boolean
          updated_at: string
          user_id: string
          weekly_digest: boolean
        }
        Insert: {
          alert_frequency?: string
          created_at?: string
          digest_day?: string
          id?: string
          marketing_emails?: boolean
          security_updates?: boolean
          threat_alerts?: boolean
          updated_at?: string
          user_id: string
          weekly_digest?: boolean
        }
        Update: {
          alert_frequency?: string
          created_at?: string
          digest_day?: string
          id?: string
          marketing_emails?: boolean
          security_updates?: boolean
          threat_alerts?: boolean
          updated_at?: string
          user_id?: string
          weekly_digest?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_submissions: {
        Row: {
          email: string
          id: string
          ip_address: unknown | null
          marketing_consent: boolean
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          email: string
          id?: string
          ip_address?: unknown | null
          marketing_consent?: boolean
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          email?: string
          id?: string
          ip_address?: unknown | null
          marketing_consent?: boolean
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_role: {
        Args: { target_user_email: string }
        Returns: boolean
      }
      calculate_initial_dss_score: {
        Args: {
          employee_count?: number
          org_sector: Database["public"]["Enums"]["organization_sector"]
          org_size: Database["public"]["Enums"]["organization_size"]
          primary_region: Database["public"]["Enums"]["geographic_region"]
          supply_complexity: number
        }
        Returns: number
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      sanitize_text_input: {
        Args: { input_text: string; max_length?: number }
        Returns: string
      }
      update_dashboard_analytics: {
        Args: { p_action: string; p_category?: string; p_user_id: string }
        Returns: undefined
      }
      validate_email: {
        Args: { email_input: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "guest"
        | "registered"
        | "business"
        | "enterprise"
        | "individual"
        | "pro"
        | "team_member"
        | "team_admin"
        | "enterprise_admin"
        | "premonix_super_user"
      geographic_region:
        | "north_america"
        | "south_america"
        | "europe"
        | "africa"
        | "asia_pacific"
        | "middle_east"
        | "oceania"
        | "global"
      organization_sector:
        | "technology"
        | "financial_services"
        | "healthcare"
        | "manufacturing"
        | "energy_utilities"
        | "government_public_sector"
        | "education"
        | "retail_consumer_goods"
        | "telecommunications"
        | "transportation_logistics"
        | "agriculture"
        | "real_estate"
        | "entertainment_media"
        | "non_profit"
        | "consulting"
        | "other"
      organization_size: "micro" | "small" | "medium" | "large" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "guest",
        "registered",
        "business",
        "enterprise",
        "individual",
        "pro",
        "team_member",
        "team_admin",
        "enterprise_admin",
        "premonix_super_user",
      ],
      geographic_region: [
        "north_america",
        "south_america",
        "europe",
        "africa",
        "asia_pacific",
        "middle_east",
        "oceania",
        "global",
      ],
      organization_sector: [
        "technology",
        "financial_services",
        "healthcare",
        "manufacturing",
        "energy_utilities",
        "government_public_sector",
        "education",
        "retail_consumer_goods",
        "telecommunications",
        "transportation_logistics",
        "agriculture",
        "real_estate",
        "entertainment_media",
        "non_profit",
        "consulting",
        "other",
      ],
      organization_size: ["micro", "small", "medium", "large", "enterprise"],
    },
  },
} as const
