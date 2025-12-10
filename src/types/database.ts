export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StatusMode = "available" | "qoit" | "focused" | "away";
export type IntegrationType = "slack" | "google_calendar" | "discord";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          title: string | null;
          avatar_url: string | null;
          status: StatusMode;
          status_message: string | null;
          back_at: string | null;
          email_response_time: string | null;
          dm_response_time: string | null;
          urgent_method: string | null;
          personal_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          title?: string | null;
          avatar_url?: string | null;
          status?: StatusMode;
          status_message?: string | null;
          back_at?: string | null;
          email_response_time?: string | null;
          dm_response_time?: string | null;
          urgent_method?: string | null;
          personal_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          title?: string | null;
          avatar_url?: string | null;
          status?: StatusMode;
          status_message?: string | null;
          back_at?: string | null;
          email_response_time?: string | null;
          dm_response_time?: string | null;
          urgent_method?: string | null;
          personal_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          user_id: string;
          type: IntegrationType;
          access_token: string;
          refresh_token: string | null;
          team_id: string | null;
          team_name: string | null;
          scope: string | null;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: IntegrationType;
          access_token: string;
          refresh_token?: string | null;
          team_id?: string | null;
          team_name?: string | null;
          scope?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: IntegrationType;
          access_token?: string;
          refresh_token?: string | null;
          team_id?: string | null;
          team_name?: string | null;
          scope?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          profile_id: string;
          sender_name: string;
          sender_email: string;
          content: string;
          is_urgent: boolean;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          sender_name: string;
          sender_email: string;
          content: string;
          is_urgent?: boolean;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          sender_name?: string;
          sender_email?: string;
          content?: string;
          is_urgent?: boolean;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      status_mode: StatusMode;
      integration_type: IntegrationType;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Integration = Database["public"]["Tables"]["integrations"]["Row"];

