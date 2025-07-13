import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Filter, MapPin, Search } from 'lucide-react-native';
import { Place, Filter as FilterType } from '@/types';
import { useColors } from '@/hooks/useColors';
import { mockPlaces } from '@/constants/mockData';
import PlaceCard from '@/components/PlaceCard';
import FilterModal from '@/components/FilterModal';
import { locationService } from '@/utils/location';

export default function Discover() {
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(mockPlaces);
  const colors = useColors();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filter, setFilter] = useState<FilterType>({
    priceRange: [0, 1000],
    distance: 2,
    members: 1,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, places]);

  const getCurrentLocation = async () => {
    const location = await locationService.getCurrentLocation();
    if (location) {
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      updatePlacesWithDistance(location.coords.latitude, location.coords.longitude);
    }
  };

  const updatePlacesWithDistance = (userLat: number, userLon: number) => {
    const updatedPlaces = places.map(place => ({
      ...place,
      distance: locationService.calculateDistance(
        userLat,
        userLon,
        place.location.latitude,
        place.location.longitude
      ),
    }));
    setPlaces(updatedPlaces);
  };

  const applyFilters = () => {
    let filtered = places.filter(place => {
      const withinPriceRange = place.price >= filter.priceRange[0] && place.price <= filter.priceRange[1];
      const withinDistance = place.distance <= filter.distance;
      return withinPriceRange && withinDistance;
    });

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredPlaces(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getCurrentLocation();
    setRefreshing(false);
  };

  const handleFilterApply = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handlePlacePress = (place: Place) => {
    // Navigate to place details
    console.log('Navigate to place:', place.name);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Discover</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                {currentLocation ? 'Current Location' : 'Getting location...'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.surfaceSecondary }]}>
            <Search size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, { 
              borderColor: colors.primary,
              backgroundColor: colors.surfaceSecondary 
            }]}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color={colors.primary} />
            <Text style={[styles.filterText, { color: colors.primary }]}>Filters</Text>
          </TouchableOpacity>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {filteredPlaces.length} places within {filter.distance}km
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onPress={() => handlePlacePress(place)}
          />
        ))}

        {filteredPlaces.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No places found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try adjusting your filters or increasing the distance range
            </Text>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        currentFilter={filter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
  },
  searchButton: {
    padding: 8,
    borderRadius: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});