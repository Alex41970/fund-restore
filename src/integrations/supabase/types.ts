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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          case_id: string
          content_type: string | null
          created_at: string
          file_name: string | null
          file_path: string
          id: string
          size: number | null
          user_id: string
        }
        Insert: {
          case_id: string
          content_type?: string | null
          created_at?: string
          file_name?: string | null
          file_path: string
          id?: string
          size?: number | null
          user_id: string
        }
        Update: {
          case_id?: string
          content_type?: string | null
          created_at?: string
          file_name?: string | null
          file_path?: string
          id?: string
          size?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_messages: {
        Row: {
          case_id: string
          content: string
          created_at: string
          id: string
          is_internal: boolean
          sender_type: Database["public"]["Enums"]["sender_type"]
          user_id: string
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          sender_type?: Database["public"]["Enums"]["sender_type"]
          user_id: string
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          sender_type?: Database["public"]["Enums"]["sender_type"]
          user_id?: string
        }
        Relationships: []
      }
      case_progress: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          id: string
          status: string
          step_order: number
          title: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          step_order: number
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          step_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_progress_updates: {
        Row: {
          case_id: string
          created_at: string
          created_by: string
          id: string
          progress_percentage: number
          update_message: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by: string
          id?: string
          progress_percentage: number
          update_message: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string
          id?: string
          progress_percentage?: number
          update_message?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_updates: {
        Row: {
          body: string
          case_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          body: string
          case_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          body?: string
          case_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_updates_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          preferred_currency: string
          progress_percentage: number | null
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          preferred_currency?: string
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          preferred_currency?: string
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cases_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_invoices: {
        Row: {
          amount_due: number
          blockchain_network: string | null
          case_id: string
          created_at: string
          currency: string
          description: string
          due_date: string
          id: string
          invoice_status: string
          paid_at: string | null
          payment_method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_due: number
          blockchain_network?: string | null
          case_id: string
          created_at?: string
          currency?: string
          description: string
          due_date: string
          id?: string
          invoice_status?: string
          paid_at?: string | null
          payment_method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_due?: number
          blockchain_network?: string | null
          case_id?: string
          created_at?: string
          currency?: string
          description?: string
          due_date?: string
          id?: string
          invoice_status?: string
          paid_at?: string | null
          payment_method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_invoices_case_id"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_invoices_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_payments: {
        Row: {
          amount_paid: number
          blockchain_network: string
          confirmation_status: string
          confirmed_at: string | null
          created_at: string
          exchange_rate_usd: number | null
          gas_fees: number | null
          id: string
          invoice_id: string
          token_address: string | null
          token_symbol: string
          transaction_hash: string
          wallet_address: string
        }
        Insert: {
          amount_paid: number
          blockchain_network?: string
          confirmation_status?: string
          confirmed_at?: string | null
          created_at?: string
          exchange_rate_usd?: number | null
          gas_fees?: number | null
          id?: string
          invoice_id: string
          token_address?: string | null
          token_symbol?: string
          transaction_hash: string
          wallet_address: string
        }
        Update: {
          amount_paid?: number
          blockchain_network?: string
          confirmation_status?: string
          confirmed_at?: string | null
          created_at?: string
          exchange_rate_usd?: number | null
          gas_fees?: number | null
          id?: string
          invoice_id?: string
          token_address?: string | null
          token_symbol?: string
          transaction_hash?: string
          wallet_address?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_connections: {
        Row: {
          blockchain_network: string
          created_at: string
          id: string
          last_used: string | null
          preferred_payment_wallet: boolean
          user_id: string
          verification_status: string
          wallet_address: string
          wallet_type: string
        }
        Insert: {
          blockchain_network?: string
          created_at?: string
          id?: string
          last_used?: string | null
          preferred_payment_wallet?: boolean
          user_id: string
          verification_status?: string
          wallet_address: string
          wallet_type: string
        }
        Update: {
          blockchain_network?: string
          created_at?: string
          id?: string
          last_used?: string | null
          preferred_payment_wallet?: boolean
          user_id?: string
          verification_status?: string
          wallet_address?: string
          wallet_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      case_status:
        | "open"
        | "in_review"
        | "resolved"
        | "closed"
        | "in_progress"
        | "pending_client"
        | "under_review"
      sender_type: "client" | "admin"
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
      app_role: ["admin", "moderator", "user"],
      case_status: [
        "open",
        "in_review",
        "resolved",
        "closed",
        "in_progress",
        "pending_client",
        "under_review",
      ],
      sender_type: ["client", "admin"],
    },
  },
} as const
