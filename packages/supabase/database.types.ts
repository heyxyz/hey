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
      features: {
        Row: {
          description: string;
          enabled: boolean;
          id: string;
          key: string;
          name: string;
          priority: number;
        };
        Insert: {
          description: string;
          enabled?: boolean;
          id?: string;
          key: string;
          name: string;
          priority?: number;
        };
        Update: {
          description?: string;
          enabled?: boolean;
          id?: string;
          key?: string;
          name?: string;
          priority?: number;
        };
        Relationships: [];
      };
      groups: {
        Row: {
          avatar: string;
          contract: string | null;
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
          contract?: string | null;
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
          contract?: string | null;
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
      'membership-nft': {
        Row: {
          dismissedOrMinted: boolean;
          id: string;
        };
        Insert: {
          dismissedOrMinted?: boolean;
          id: string;
        };
        Update: {
          dismissedOrMinted?: boolean;
          id?: string;
        };
        Relationships: [];
      };
      pro: {
        Row: {
          created_at: string;
          expires_at: string | null;
          hash: string | null;
          id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          hash?: string | null;
          id?: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          hash?: string | null;
          id?: string;
          profile_id?: string;
        };
        Relationships: [];
      };
      'profile-features': {
        Row: {
          created_at: string;
          enabled: boolean;
          feature_id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          feature_id: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          feature_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile-features_feature_id_fkey';
            columns: ['feature_id'];
            isOneToOne: false;
            referencedRelation: 'features';
            referencedColumns: ['id'];
          }
        ];
      };
      rights: {
        Row: {
          high_signal_notification_filter: boolean;
          id: string;
          is_pride: boolean;
        };
        Insert: {
          high_signal_notification_filter?: boolean;
          id: string;
          is_pride?: boolean;
        };
        Update: {
          high_signal_notification_filter?: boolean;
          id?: string;
          is_pride?: boolean;
        };
        Relationships: [];
      };
      'staff-picks': {
        Row: {
          created_at: string;
          id: string;
          picker_id: string;
          score: number;
          type: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          picker_id: string;
          score?: number;
          type: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          picker_id?: string;
          score?: number;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'staff-picks_picker_id_fkey';
            columns: ['picker_id'];
            isOneToOne: false;
            referencedRelation: 'rights';
            referencedColumns: ['id'];
          }
        ];
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
