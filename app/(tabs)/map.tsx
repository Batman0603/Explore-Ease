import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MapPin, Navigation, Filter } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { mockPlaces, mockShops } from '@/constants/mockData';
import { locationService } from '@/utils/location';

export default function MapView() {
  const colors = useColors();
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const location = await locationService.getCurrentLocation();
    if (location) {
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      Alert.alert(
        'Location Permission',
        'Please enable location services to see nearby places on the map.'
      );
    }
  };

  const categories = [
    { id: 'all', name: 'All', color: colors.textSecondary },
    { id: 'restaurant', name: 'Food', color: colors.restaurant },
    { id: 'show', name: 'Shows', color: colors.show },
    { id: 'park', name: 'Parks', color: colors.park },
    { id: 'movie', name: 'Movies', color: colors.movie },
    { id: 'attraction', name: 'Attractions', color: colors.attraction },
    { id: 'shop', name: 'Shops', color: colors.shop },
  ];

  const filteredPlaces = selectedCategory && selectedCategory !== 'all'
    ? mockPlaces.filter(place => place.category === selectedCategory)
    : mockPlaces;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Explore Map</Text>
        <TouchableOpacity style={[styles.locationButton, { backgroundColor: colors.surfaceSecondary }]} onPress={getCurrentLocation}>
          <Navigation size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.categoryFilter, { backgroundColor: colors.surface }]}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Categories</Text>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category.id ? category.color : colors.surfaceSecondary,
                  borderColor: category.color,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? colors.white : category.color,
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.mapContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color={colors.textTertiary} />
          <Text style={[styles.mapPlaceholderText, { color: colors.text }]}>Interactive Map</Text>
          <Text style={[styles.mapPlaceholderSubtext, { color: colors.textSecondary }]}>
            {currentLocation
              ? `Showing ${filteredPlaces.length} places near you`
              : 'Enable location to see nearby places'}
          </Text>
        </View>
      </View>

      <View style={[styles.legend, { backgroundColor: colors.surface }]}>
        <Text style={[styles.legendTitle, { color: colors.text }]}>Map Legend</Text>
        <View style={styles.legendItems}>
          {categories.slice(1).map((category) => (
            <View key={category.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: category.color }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>{category.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  locationButton: {
    padding: 8,
    borderRadius: 12,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  legend: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
});