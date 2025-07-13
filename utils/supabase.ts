import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          user_type: 'customer' | 'shop_owner';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          user_type?: 'customer' | 'shop_owner';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          user_type?: 'customer' | 'shop_owner';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      places: {
        Row: {
          id: string;
          name: string;
          category: 'restaurant' | 'show' | 'park' | 'movie' | 'attraction' | 'shop' | 'event';
          description: string;
          price: number;
          image_url: string;
          latitude: number;
          longitude: number;
          address: string;
          is_open: boolean;
          opening_hours: string | null;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'restaurant' | 'show' | 'park' | 'movie' | 'attraction' | 'shop' | 'event';
          description: string;
          price?: number;
          image_url: string;
          latitude: number;
          longitude: number;
          address: string;
          is_open?: boolean;
          opening_hours?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'restaurant' | 'show' | 'park' | 'movie' | 'attraction' | 'shop' | 'event';
          description?: string;
          price?: number;
          image_url?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          is_open?: boolean;
          opening_hours?: string | null;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};