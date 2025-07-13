import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User as UserIcon, Settings, Heart, MapPin, Bell, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Palette } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { useTheme } from '@/contexts/ThemeContext';
import { authService } from '@/utils/auth';
import { User } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: Edit,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => console.log('Edit Profile'),
    },
    {
      icon: Heart,
      title: 'Favorites',
      subtitle: 'Your saved places',
      onPress: () => console.log('Favorites'),
    },
    {
      icon: MapPin,
      title: 'Recent Places',
      subtitle: 'Places you\'ve visited',
      onPress: () => console.log('Recent Places'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: Palette,
      title: 'Theme',
      subtitle: `Switch to ${isDark ? 'light' : 'dark'} mode`,
      onPress: toggleTheme,
      rightComponent: <ThemeToggle size={20} />,
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      onPress: () => console.log('Settings'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => console.log('Help & Support'),
    },
  ];

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
        <Image
          source={{ uri: user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
        <View style={[styles.userTypeBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.userTypeText, { color: colors.white }]}>
            {user.type === 'customer' ? 'Customer' : 'Shop Owner'}
          </Text>
        </View>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && { 
                borderBottomColor: colors.border,
                borderBottomWidth: 0.5 
              }
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <item.icon size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
              </View>
            </View>
            {item.rightComponent && (
              <View style={styles.menuItemRight}>
                {item.rightComponent}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.logoutButton, { borderTopColor: colors.border }]} 
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuItemIcon, { backgroundColor: colors.error + '20' }]}>
              <LogOut size={20} color={colors.error} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuItemTitle, { color: colors.error }]}>Logout</Text>
              <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>Sign out of your account</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 12,
  },
  userTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  menuContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemRight: {
    marginLeft: 16,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
  },
});