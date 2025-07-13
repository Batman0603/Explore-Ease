import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Store, Plus, ChartBar as BarChart3, Users, Star, MapPin, CreditCard as Edit, Eye } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { authService } from '@/utils/auth';
import { User, Shop } from '@/types';
import { mockShops } from '@/constants/mockData';

export default function ShopDashboard() {
  const colors = useColors();
  const [user, setUser] = useState<User | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    loadUser();
    loadShops();
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser || currentUser.type !== 'shop_owner') {
      Alert.alert(
        'Access Denied',
        'This page is only available for shop owners.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
      return;
    }
    setUser(currentUser);
  };

  const loadShops = () => {
    // Filter shops owned by current user
    const userShops = mockShops.filter(shop => shop.ownerId === 'owner1');
    setShops(userShops);
  };

  const stats = [
    {
      icon: Store,
      title: 'Active Shops',
      value: shops.length.toString(),
      color: colors.primary,
    },
    {
      icon: Users,
      title: 'Total Views',
      value: '1.2K',
      color: colors.accent,
    },
    {
      icon: Star,
      title: 'Avg Rating',
      value: '4.2',
      color: colors.warning,
    },
    {
      icon: BarChart3,
      title: 'This Month',
      value: '+15%',
      color: colors.success,
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
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Shops</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {shops.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Store size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No shops yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Scan a QR code to register your first shop
              </Text>
              <TouchableOpacity style={[styles.addShopButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.addShopButtonText, { color: colors.white }]}>Add Your First Shop</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.shopsContainer}>
              {shops.map((shop) => (
                <View key={shop.id} style={[styles.shopCard, { backgroundColor: colors.surface }]}>
                  <Image source={{ uri: shop.image }} style={styles.shopImage} />
                  <View style={[styles.shopContent, { backgroundColor: colors.surface }]}>
                    <View style={styles.shopHeader}>
                      <Text style={[styles.shopName, { color: colors.text }]}>{shop.name}</Text>
                      <View style={styles.shopActions}>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}>
                          <Eye size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}>
                          <Edit size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={[styles.shopCategory, { color: colors.primary }]}>{shop.category}</Text>
                    <Text style={[styles.shopDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                      {shop.description}
                    </Text>
                    <View style={styles.shopFooter}>
                      <View style={styles.shopRating}>
                        <Star size={14} color={colors.warning} />
                        <Text style={[styles.ratingText, { color: colors.text }]}>{shop.rating}</Text>
                      </View>
                      <View style={styles.shopLocation}>
                        <MapPin size={14} color={colors.textTertiary} />
                        <Text style={[styles.locationText, { color: colors.textTertiary }]} numberOfLines={1}>
                          {shop.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.surface }]}>
              <Plus size={24} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Add Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.surface }]}>
              <BarChart3 size={24} color={colors.accent} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>View Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.surface }]}>
              <Edit size={24} color={colors.success} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Update Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  addShopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addShopButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  shopsContainer: {
    gap: 16,
  },
  shopCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shopImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  shopContent: {
    padding: 16,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  shopActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  shopCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  shopDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shopLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 16,
  },
  locationText: {
    fontSize: 12,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});