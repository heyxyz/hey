export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      channels: {
        Row: {
          avatar: string;
          cover: string;
          description: string;
          id: string;
          name: string;
          slug: string;
          tags: string[] | null;
        };
        Insert: {
          avatar: string;
          cover: string;
          description: string;
          id?: string;
          name: string;
          slug: string;
          tags?: string[] | null;
        };
        Update: {
          avatar?: string;
          cover?: string;
          description?: string;
          id?: string;
          name?: string;
          slug?: string;
          tags?: string[] | null;
        };
        Relationships: [];
      };
      rights: {
        Row: {
          gardener_mode: boolean;
          high_signal_notification_filter: boolean;
          id: string;
          is_gardener: boolean;
          is_pride: boolean;
          is_staff: boolean;
          is_trusted_member: boolean;
          is_verified: boolean;
          staff_mode: boolean;
        };
        Insert: {
          gardener_mode?: boolean;
          high_signal_notification_filter?: boolean;
          id: string;
          is_gardener?: boolean;
          is_pride?: boolean;
          is_staff?: boolean;
          is_trusted_member?: boolean;
          is_verified?: boolean;
          staff_mode?: boolean;
        };
        Update: {
          gardener_mode?: boolean;
          high_signal_notification_filter?: boolean;
          id?: string;
          is_gardener?: boolean;
          is_pride?: boolean;
          is_staff?: boolean;
          is_trusted_member?: boolean;
          is_verified?: boolean;
          staff_mode?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      community_state: 'Accepted' | 'Pending' | 'Rejected' | 'Suspended';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
