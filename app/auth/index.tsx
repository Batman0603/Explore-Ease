import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Users, Store } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function AuthIndex() {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary, '#DBEAFE']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/cafa5a55-8fc2-4222-8e7f-6aa282faa0ac.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to ExploreEase</Text>
        <Text style={styles.subtitle}>Choose how you'd like to continue</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => router.push('/auth/login?type=customer')}
          >
            <View style={styles.buttonContent}>
              <Users size={32} color={Colors.primary} />
              <Text style={styles.buttonTitle}>I'm a Customer</Text>
              <Text style={styles.buttonSubtitle}>Discover amazing places nearby</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => router.push('/auth/login?type=shop_owner')}
          >
            <View style={styles.buttonContent}>
              <Store size={32} color={Colors.primary} />
              <Text style={styles.buttonTitle}>I'm a Shop Owner</Text>
              <Text style={styles.buttonSubtitle}>List your business and reach customers</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.tagline}>Your local adventure, personalized.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  userTypeButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginTop: 12,
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
  },
});