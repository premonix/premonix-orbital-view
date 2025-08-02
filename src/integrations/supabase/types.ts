export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      update_dashboard_analytics: {
        Args: { p_user_id: string; p_action: string; p_category?: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "guest" | "registered" | "business" | "enterprise"
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
      app_role: ["guest", "registered", "business", "enterprise"],
    },
  },
} as const
