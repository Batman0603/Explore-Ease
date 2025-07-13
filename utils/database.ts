import { supabase } from './supabase';
import { User, Place } from '@/types';

export const databaseService = {
  // Auth functions
  async signUp(email: string, password: string, name: string, userType: 'customer' | 'shop_owner') {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          name,
          user_type: userType,
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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

  // Places functions
  async getPlaces(): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(place => ({
      id: place.id,
      name: place.name,
      category: place.category,
      price: place.price,
      distance: 0, // Will be calculated based on user location
      rating: 4.5, // Default rating for now
      image: place.image_url,
      description: place.description,
      location: {
        latitude: place.latitude,
        longitude: place.longitude,
      },
      address: place.address,
      isOpen: place.is_open,
      openingHours: place.opening_hours,
    }));
  },

  async createPlace(place: Omit<Place, 'id' | 'distance' | 'rating'>) {
    const user = await this.getCurrentUser();
    if (!user || user.type !== 'shop_owner') {
      throw new Error('Only shop owners can create places');
    }

    const { data, error } = await supabase
      .from('places')
      .insert({
        name: place.name,
        category: place.category,
        description: place.description,
        price: place.price,
        image_url: place.image,
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        address: place.address,
        is_open: place.isOpen,
        opening_hours: place.openingHours,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePlace(placeId: string, updates: Partial<Place>) {
    const user = await this.getCurrentUser();
    if (!user || user.type !== 'shop_owner') {
      throw new Error('Only shop owners can update places');
    }

    const { data, error } = await supabase
      .from('places')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.category && { category: updates.category }),
        ...(updates.description && { description: updates.description }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.image && { image_url: updates.image }),
        ...(updates.location && { 
          latitude: updates.location.latitude,
          longitude: updates.location.longitude 
        }),
        ...(updates.address && { address: updates.address }),
        ...(updates.isOpen !== undefined && { is_open: updates.isOpen }),
        ...(updates.openingHours && { opening_hours: updates.openingHours }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', placeId)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePlace(placeId: string) {
    const user = await this.getCurrentUser();
    if (!user || user.type !== 'shop_owner') {
      throw new Error('Only shop owners can delete places');
    }

    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', placeId)
      .eq('owner_id', user.id);

    if (error) throw error;
  },

  async getPlacesByOwner(ownerId: string): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(place => ({
      id: place.id,
      name: place.name,
      category: place.category,
      price: place.price,
      distance: 0,
      rating: 4.5,
      image: place.image_url,
      description: place.description,
      location: {
        latitude: place.latitude,
        longitude: place.longitude,
      },
      address: place.address,
      isOpen: place.is_open,
      openingHours: place.opening_hours,
    }));
  },
};