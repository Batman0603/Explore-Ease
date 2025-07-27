import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { databaseService } from '@/utils/database';
import { User } from '@/types';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user: User | null = await databaseService.getCurrentUser();
      
      setTimeout(() => {
        setIsLoading(false);
        if (user) {
          if (user.type === 'customer') {
            router.replace('/(tabs)');
          } else {
            router.replace('/(tabs)/shop-dashboard');
          }
        } else {
          router.replace('/auth');
        }
      }, 2500); // Show splash for 2.5 seconds
    } catch (error) {
      setIsLoading(false);
      router.replace('/auth');
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});