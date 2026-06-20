export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      device_latest_states: {
        Row: {
          created_at: string;
          device_external_key: string;
          home_id: string;
          last_seen_at: string;
          room_id: string | null;
          source: string;
          state_payload: Json;
          state_value: Database["public"]["Enums"]["device_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          device_external_key: string;
          home_id: string;
          last_seen_at?: string;
          room_id?: string | null;
          source?: string;
          state_payload?: Json;
          state_value?: Database["public"]["Enums"]["device_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          device_external_key?: string;
          home_id?: string;
          last_seen_at?: string;
          room_id?: string | null;
          source?: string;
          state_payload?: Json;
          state_value?: Database["public"]["Enums"]["device_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "device_latest_states_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: true;
            referencedRelation: "devices";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "device_latest_states_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: true;
            referencedRelation: "v_device_inventory";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "device_latest_states_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "device_latest_states_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      device_state_events: {
        Row: {
          created_at: string;
          device_external_key: string;
          home_id: string;
          id: number;
          mqtt_topic: string | null;
          observed_at: string;
          payload: Json;
          room_id: string | null;
          source: string;
          state_value: string;
        };
        Insert: {
          created_at?: string;
          device_external_key: string;
          home_id: string;
          id?: never;
          mqtt_topic?: string | null;
          observed_at?: string;
          payload?: Json;
          room_id?: string | null;
          source?: string;
          state_value: string;
        };
        Update: {
          created_at?: string;
          device_external_key?: string;
          home_id?: string;
          id?: never;
          mqtt_topic?: string | null;
          observed_at?: string;
          payload?: Json;
          room_id?: string | null;
          source?: string;
          state_value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "device_state_events_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "device_state_events_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: false;
            referencedRelation: "v_device_inventory";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "device_state_events_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "device_state_events_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      devices: {
        Row: {
          active: boolean;
          category: Database["public"]["Enums"]["device_category"];
          created_at: string;
          expected_safe_state: string;
          external_key: string;
          home_id: string;
          id: string;
          metadata: Json;
          name: string;
          reminder_enabled: boolean;
          room_id: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          category: Database["public"]["Enums"]["device_category"];
          created_at?: string;
          expected_safe_state: string;
          external_key: string;
          home_id: string;
          id?: string;
          metadata?: Json;
          name: string;
          reminder_enabled?: boolean;
          room_id?: string | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          category?: Database["public"]["Enums"]["device_category"];
          created_at?: string;
          expected_safe_state?: string;
          external_key?: string;
          home_id?: string;
          id?: string;
          metadata?: Json;
          name?: string;
          reminder_enabled?: boolean;
          room_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "devices_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "devices_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      homes: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homes_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      leave_sessions: {
        Row: {
          created_at: string;
          ended_at: string | null;
          home_id: string;
          id: string;
          metadata: Json;
          started_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          ended_at?: string | null;
          home_id: string;
          id?: string;
          metadata?: Json;
          started_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          ended_at?: string | null;
          home_id?: string;
          id?: string;
          metadata?: Json;
          started_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leave_sessions_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leave_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reminder_events: {
        Row: {
          created_at: string;
          delivery_status: Database["public"]["Enums"]["delivery_status"];
          home_id: string;
          id: number;
          leave_session_id: string | null;
          message: string | null;
          payload: Json;
          reminder_count: number;
          reminders: Json;
          source: string;
        };
        Insert: {
          created_at?: string;
          delivery_status?: Database["public"]["Enums"]["delivery_status"];
          home_id: string;
          id?: never;
          leave_session_id?: string | null;
          message?: string | null;
          payload?: Json;
          reminder_count?: number;
          reminders?: Json;
          source?: string;
        };
        Update: {
          created_at?: string;
          delivery_status?: Database["public"]["Enums"]["delivery_status"];
          home_id?: string;
          id?: never;
          leave_session_id?: string | null;
          message?: string | null;
          payload?: Json;
          reminder_count?: number;
          reminders?: Json;
          source?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reminder_events_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reminder_events_leave_session_id_fkey";
            columns: ["leave_session_id"];
            isOneToOne: false;
            referencedRelation: "leave_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      reminder_rules: {
        Row: {
          active: boolean;
          created_at: string;
          device_external_key: string;
          home_id: string;
          id: string;
          reminder_text: string;
          severity: number;
          trigger_device_state: string;
          trigger_presence_state: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          device_external_key: string;
          home_id: string;
          id?: string;
          reminder_text: string;
          severity?: number;
          trigger_device_state: string;
          trigger_presence_state?: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          device_external_key?: string;
          home_id?: string;
          id?: string;
          reminder_text?: string;
          severity?: number;
          trigger_device_state?: string;
          trigger_presence_state?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reminder_rules_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "reminder_rules_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: false;
            referencedRelation: "v_device_inventory";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "reminder_rules_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          code: string;
          created_at: string;
          floor_label: string | null;
          home_id: string;
          id: string;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          floor_label?: string | null;
          home_id: string;
          id?: string;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          floor_label?: string | null;
          home_id?: string;
          id?: string;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
        ];
      };
      Test: {
        Row: {
          created_at: string;
          id: number;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          text?: string | null;
        };
        Relationships: [];
      };
      user: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_active: boolean;
          role: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          role?: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          role?: string;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      v_active_reminder_rules: {
        Row: {
          active: boolean | null;
          device_category:
            | Database["public"]["Enums"]["device_category"]
            | null;
          device_external_key: string | null;
          device_name: string | null;
          home_id: string | null;
          id: string | null;
          reminder_text: string | null;
          room_code: string | null;
          room_name: string | null;
          severity: number | null;
          trigger_device_state: string | null;
          trigger_presence_state: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reminder_rules_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "reminder_rules_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: false;
            referencedRelation: "v_device_inventory";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "reminder_rules_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
        ];
      };
      v_device_inventory: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          device_category:
            | Database["public"]["Enums"]["device_category"]
            | null;
          device_name: string | null;
          expected_safe_state: string | null;
          external_key: string | null;
          home_id: string | null;
          id: string | null;
          metadata: Json | null;
          reminder_enabled: boolean | null;
          room_code: string | null;
          room_id: string | null;
          room_name: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "devices_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "devices_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      v_latest_device_states: {
        Row: {
          device_category:
            | Database["public"]["Enums"]["device_category"]
            | null;
          device_external_key: string | null;
          device_name: string | null;
          expected_safe_state: string | null;
          home_id: string | null;
          last_seen_at: string | null;
          room_code: string | null;
          room_id: string | null;
          room_name: string | null;
          source: string | null;
          state_payload: Json | null;
          state_value: Database["public"]["Enums"]["device_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "device_latest_states_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: true;
            referencedRelation: "devices";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "device_latest_states_device_external_key_fkey";
            columns: ["device_external_key"];
            isOneToOne: true;
            referencedRelation: "v_device_inventory";
            referencedColumns: ["external_key"];
          },
          {
            foreignKeyName: "device_latest_states_home_id_fkey";
            columns: ["home_id"];
            isOneToOne: false;
            referencedRelation: "homes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "device_latest_states_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      home_owned: { Args: { target_home_id: string }; Returns: boolean };
      seed_demo_home: {
        Args: { p_home_name?: string; p_owner: string };
        Returns: string;
      };
    };
    Enums: {
      delivery_status: "pending" | "sent" | "acknowledged" | "dismissed";
      device_category:
        | "presence"
        | "lighting"
        | "safety"
        | "climate"
        | "access"
        | "opening"
        | "utility";
      device_status: "off" | "locked" | "on" | "taken" | "home" | "warning";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      delivery_status: ["pending", "sent", "acknowledged", "dismissed"],
      device_category: [
        "presence",
        "lighting",
        "safety",
        "climate",
        "access",
        "opening",
        "utility",
      ],
      device_status: ["off", "locked", "on", "taken", "home", "warning"],
    },
  },
} as const;
