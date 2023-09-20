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
      channel_memberships: {
        Row: {
          channel_id: string;
          profile_id: string;
        };
        Insert: {
          channel_id: string;
          profile_id: string;
        };
        Update: {
          channel_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'channel_memberships_channel_id_fkey';
            columns: ['channel_id'];
            referencedRelation: 'channels';
            referencedColumns: ['id'];
          }
        ];
      };
      channels: {
        Row: {
          avatar: string;
          cover: string | null;
          created_at: string;
          description: string;
          discord: string | null;
          featured: boolean;
          id: string;
          instagram: string | null;
          lens: string | null;
          name: string;
          slug: string;
          tags: string[] | null;
          x: string | null;
        };
        Insert: {
          avatar: string;
          cover?: string | null;
          created_at?: string;
          description: string;
          discord?: string | null;
          featured?: boolean;
          id?: string;
          instagram?: string | null;
          lens?: string | null;
          name: string;
          slug: string;
          tags?: string[] | null;
          x?: string | null;
        };
        Update: {
          avatar?: string;
          cover?: string | null;
          created_at?: string;
          description?: string;
          discord?: string | null;
          featured?: boolean;
          id?: string;
          instagram?: string | null;
          lens?: string | null;
          name?: string;
          slug?: string;
          tags?: string[] | null;
          x?: string | null;
        };
        Relationships: [];
      };
      rights: {
        Row: {
          gardener_mode: boolean;
          high_signal_notification_filter: boolean;
          id: string;
          is_gardener: boolean;
          is_lens_member: boolean;
          is_pride: boolean;
          is_staff: boolean;
          is_verified: boolean;
          staff_mode: boolean;
        };
        Insert: {
          gardener_mode?: boolean;
          high_signal_notification_filter?: boolean;
          id: string;
          is_gardener?: boolean;
          is_lens_member?: boolean;
          is_pride?: boolean;
          is_staff?: boolean;
          is_verified?: boolean;
          staff_mode?: boolean;
        };
        Update: {
          gardener_mode?: boolean;
          high_signal_notification_filter?: boolean;
          id?: string;
          is_gardener?: boolean;
          is_lens_member?: boolean;
          is_pride?: boolean;
          is_staff?: boolean;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
