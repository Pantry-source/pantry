export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          user_id?: string | null;
        };
      };
      pantries: {
        Row: {
          description: string | null;
          id: number;
          inserted_at: string;
          title: string;
          user_id: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          inserted_at?: string;
          title: string;
          user_id: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          inserted_at?: string;
          title?: string;
          user_id?: string;
        };
      };
      products: {
        Row: {
          category_id: number;
          created_at: string;
          expires_at: string | null;
          id: number;
          is_essential: boolean;
          name: string;
          pantry_id: number;
          quantity_amount: number | null;
          quantity_unit: number;
          vendor: string | null;
        };
        Insert: {
          category_id: number;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          is_essential: boolean;
          name: string;
          pantry_id: number;
          quantity_amount?: number | null;
          quantity_unit: number;
          vendor?: string | null;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          is_essential?: boolean;
          name?: string;
          pantry_id?: number;
          quantity_amount?: number | null;
          quantity_unit?: number;
          vendor?: string | null;
        };
      };
      quantity_units: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          user_id?: string | null;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
