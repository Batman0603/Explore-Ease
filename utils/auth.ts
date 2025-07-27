import { supabase } from './supabase';
import { User } from '@/types';

export const authService = {
  async login(email: string, password: string, userType: 'customer' | 'shop_owner'): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user) throw new Error('Login failed');

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    // Verify user type matches
    if (profile.user_type !== userType) {
      throw new Error(`Invalid user type. Expected ${userType}, got ${profile.user_type}`);
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      type: profile.user_type,
      avatar: profile.avatar_url,
    };
  },

  async register(email: string, password: string, name: string, userType: 'customer' | 'shop_owner'): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user) throw new Error('Registration failed');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        name,
        user_type: userType,
      });

    if (profileError) throw profileError;

    return {
      id: data.user.id,
      email,
      name,
      type: userType,
      avatar: null,
    };
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      type: profile.user_type,
      avatar: profile.avatar_url,
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};