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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      advisor_subscriptions: {
        Row: {
          created_at: string
          firm_location: string | null
          firm_name: string
          id: string
          investment_focus: string[] | null
          looking_for: string | null
          monthly_price: number
          number_of_clients: string | null
          payment_reference: string | null
          subscription_ends_at: string | null
          subscription_starts_at: string | null
          subscription_status: Database["public"]["Enums"]["advisor_subscription_status"]
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          firm_location?: string | null
          firm_name: string
          id?: string
          investment_focus?: string[] | null
          looking_for?: string | null
          monthly_price?: number
          number_of_clients?: string | null
          payment_reference?: string | null
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: Database["public"]["Enums"]["advisor_subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          firm_location?: string | null
          firm_name?: string
          id?: string
          investment_focus?: string[] | null
          looking_for?: string | null
          monthly_price?: number
          number_of_clients?: string | null
          payment_reference?: string | null
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: Database["public"]["Enums"]["advisor_subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_waitlist: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      auth_config: {
        Row: {
          created_at: string | null
          id: number
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      institutional_api_keys: {
        Row: {
          api_key: string
          api_secret: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_name: string
          last_used_at: string | null
          partner_id: string | null
          permissions: Json
          rate_limit: number
          subscription_id: string | null
        }
        Insert: {
          api_key: string
          api_secret: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name: string
          last_used_at?: string | null
          partner_id?: string | null
          permissions?: Json
          rate_limit?: number
          subscription_id?: string | null
        }
        Update: {
          api_key?: string
          api_secret?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name?: string
          last_used_at?: string | null
          partner_id?: string | null
          permissions?: Json
          rate_limit?: number
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_api_keys_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "white_label_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institutional_api_keys_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "institutional_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutional_portfolios: {
        Row: {
          ai_confidence_score: number | null
          allocation: Json
          capital_size: number | null
          created_at: string
          expected_return: string | null
          id: string
          inspired_by: string | null
          investment_horizon: string | null
          liquidity_needs: string | null
          portfolio_name: string
          portfolio_type: string
          rationale: string | null
          risk_tolerance: string | null
          subscription_id: string
          updated_at: string
          user_id: string
          volatility: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          allocation: Json
          capital_size?: number | null
          created_at?: string
          expected_return?: string | null
          id?: string
          inspired_by?: string | null
          investment_horizon?: string | null
          liquidity_needs?: string | null
          portfolio_name: string
          portfolio_type: string
          rationale?: string | null
          risk_tolerance?: string | null
          subscription_id: string
          updated_at?: string
          user_id: string
          volatility?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          allocation?: Json
          capital_size?: number | null
          created_at?: string
          expected_return?: string | null
          id?: string
          inspired_by?: string | null
          investment_horizon?: string | null
          liquidity_needs?: string | null
          portfolio_name?: string
          portfolio_type?: string
          rationale?: string | null
          risk_tolerance?: string | null
          subscription_id?: string
          updated_at?: string
          user_id?: string
          volatility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_portfolios_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "institutional_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutional_subscriptions: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_type"]
          id: string
          monthly_price: number
          organization_name: string
          payment_reference: string | null
          plan_tier: Database["public"]["Enums"]["institutional_plan_tier"]
          subscription_ends_at: string | null
          subscription_starts_at: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          monthly_price: number
          organization_name: string
          payment_reference?: string | null
          plan_tier: Database["public"]["Enums"]["institutional_plan_tier"]
          subscription_ends_at?: string | null
          subscription_starts_at?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          monthly_price?: number
          organization_name?: string
          payment_reference?: string | null
          plan_tier?: Database["public"]["Enums"]["institutional_plan_tier"]
          subscription_ends_at?: string | null
          subscription_starts_at?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mobile_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      portfolio_performance_history: {
        Row: {
          id: string
          metadata: Json | null
          portfolio_id: string
          portfolio_value: number | null
          recorded_at: string
          return_percentage: number | null
          volatility_index: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          portfolio_id: string
          portfolio_value?: number | null
          recorded_at?: string
          return_percentage?: number | null
          volatility_index?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          portfolio_id?: string
          portfolio_value?: number | null
          recorded_at?: string
          return_percentage?: number | null
          volatility_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_performance_history_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "institutional_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referee_email: string
          referrer_code: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referee_email: string
          referrer_code: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referee_email?: string
          referrer_code?: string
          status?: string | null
        }
        Relationships: []
      }
      user_portfolios: {
        Row: {
          assets: Json
          created_at: string
          experience_level: string
          id: string
          investment_amount: number
          portfolio_name: string
          rationale: string | null
          risk_score: number
          timeline: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assets: Json
          created_at?: string
          experience_level: string
          id?: string
          investment_amount?: number
          portfolio_name: string
          rationale?: string | null
          risk_score: number
          timeline: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assets?: Json
          created_at?: string
          experience_level?: string
          id?: string
          investment_amount?: number
          portfolio_name?: string
          rationale?: string | null
          risk_score?: number
          timeline?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          credit_balance: number | null
          first_name: string | null
          id: number
          investment_experience: string | null
          last_name: string | null
          phone_number: string
          portfolio_count: number | null
          primary_goal: string | null
          referral_code: string | null
          referral_count: number | null
          referred_by: string | null
          risk_tolerance: string | null
          subscription_plan: string | null
          time_horizon: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_balance?: number | null
          first_name?: string | null
          id?: number
          investment_experience?: string | null
          last_name?: string | null
          phone_number: string
          portfolio_count?: number | null
          primary_goal?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          risk_tolerance?: string | null
          subscription_plan?: string | null
          time_horizon?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          credit_balance?: number | null
          first_name?: string | null
          id?: number
          investment_experience?: string | null
          last_name?: string | null
          phone_number?: string
          portfolio_count?: number | null
          primary_goal?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          risk_tolerance?: string | null
          subscription_plan?: string | null
          time_horizon?: string | null
          user_id?: string
        }
        Relationships: []
      }
      white_label_partners: {
        Row: {
          allowed_portfolios: number | null
          api_enabled: boolean
          branding_config: Json | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_type"]
          id: string
          is_active: boolean
          monthly_fee: number | null
          partner_domain: string | null
          partner_name: string
          partner_tier: Database["public"]["Enums"]["partner_tier"]
          updated_at: string
        }
        Insert: {
          allowed_portfolios?: number | null
          api_enabled?: boolean
          branding_config?: Json | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          is_active?: boolean
          monthly_fee?: number | null
          partner_domain?: string | null
          partner_name: string
          partner_tier?: Database["public"]["Enums"]["partner_tier"]
          updated_at?: string
        }
        Update: {
          allowed_portfolios?: number | null
          api_enabled?: boolean
          branding_config?: Json | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          is_active?: boolean
          monthly_fee?: number | null
          partner_domain?: string | null
          partner_name?: string
          partner_tier?: Database["public"]["Enums"]["partner_tier"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_generate_institutional_portfolio: {
        Args: { sub_id: string }
        Returns: boolean
      }
      can_generate_portfolio: { Args: { user_uuid: string }; Returns: boolean }
      cleanup_expired_email_tokens: { Args: never; Returns: undefined }
      generate_api_key: { Args: never; Returns: string }
      generate_unique_referral_code: { Args: never; Returns: string }
      get_auth_config: { Args: { config_name: string }; Returns: string }
      has_active_advisor_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_portfolio_count: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_email_verification_expired: {
        Args: { token_created_at: string; user_id: string }
        Returns: boolean
      }
      redeem_credits: {
        Args: { p_required_amount: number; p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      advisor_subscription_status:
        | "pending"
        | "active"
        | "cancelled"
        | "expired"
      app_role: "admin" | "moderator" | "user"
      currency_type: "USD" | "NGN" | "EUR" | "GBP"
      institutional_plan_tier:
        | "corporate-starter"
        | "corporate-growth"
        | "corporate-enterprise"
      partner_tier: "standard" | "premium" | "enterprise"
      subscription_status: "active" | "trial" | "cancelled" | "expired"
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
      advisor_subscription_status: [
        "pending",
        "active",
        "cancelled",
        "expired",
      ],
      app_role: ["admin", "moderator", "user"],
      currency_type: ["USD", "NGN", "EUR", "GBP"],
      institutional_plan_tier: [
        "corporate-starter",
        "corporate-growth",
        "corporate-enterprise",
      ],
      partner_tier: ["standard", "premium", "enterprise"],
      subscription_status: ["active", "trial", "cancelled", "expired"],
    },
  },
} as const
