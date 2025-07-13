import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const AUTH_KEY = 'exploreease_auth';

export const authService = {
  async login(email: string, password: string, userType: 'customer' | 'shop_owner'): Promise<User> {
    // Simulate API call with validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo purposes
    if (!email.includes('@') || password.length < 6) {
      throw new Error('Invalid credentials');
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      type: userType,
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
    };
    
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  async register(email: string, password: string, name: string, userType: 'customer' | 'shop_owner'): Promise<User> {
    // Simulate API call with validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo purposes
    if (!email.includes('@') || password.length < 8 || name.length < 2) {
      throw new Error('Invalid registration data');
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      type: userType,
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
    };
    
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(AUTH_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  }
};