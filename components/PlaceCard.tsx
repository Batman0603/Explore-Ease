import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react-native';
import { Place } from '@/types';
import { useColors } from '@/hooks/useColors';

interface PlaceCardProps {
  place: Place;
  onPress: () => void;
}

export default function PlaceCard({ place, onPress }: PlaceCardProps) {
  const colors = useColors();

  const getCategoryColor = (category: string) => {
    return colors[category as keyof typeof colors] || colors.primary;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colors.surface }]} onPress={onPress}>
      <Image source={{ uri: place.image }} style={styles.image} />
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{place.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(place.category) }]}>
            <Text style={[styles.categoryText, { color: colors.white }]}>{place.category}</Text>
          </View>
        </View>
        
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{place.description}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MapPin size={14} color={colors.textTertiary} />
            <Text style={[styles.detailText, { color: colors.textTertiary }]}>{place.distance}km away</Text>
          </View>
          
          <View style={styles.detailItem}>
            <DollarSign size={14} color={colors.textTertiary} />
            <Text style={[styles.detailText, { color: colors.textTertiary }]}>{formatPrice(place.price)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Star size={14} color={colors.warning} />
            <Text style={[styles.detailText, { color: colors.textTertiary }]}>{place.rating}</Text>
          </View>
        </View>
        
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.detailItem}>
            <Clock size={14} color={place.isOpen ? colors.success : colors.error} />
            <Text style={[styles.detailText, { color: place.isOpen ? colors.success : colors.error }]}>
              {place.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          {place.openingHours && (
            <Text style={[styles.hours, { color: colors.textTertiary }]}>{place.openingHours}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 0.5,
  },
  hours: {
    fontSize: 12,
  },
});