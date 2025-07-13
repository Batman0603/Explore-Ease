import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { X, DollarSign, MapPin, Users } from 'lucide-react-native';
import { Filter } from '@/types';
import { useColors } from '@/hooks/useColors';

const { height } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: Filter) => void;
  currentFilter: Filter;
}

export default function FilterModal({ visible, onClose, onApply, currentFilter }: FilterModalProps) {
  const colors = useColors();
  const [filter, setFilter] = useState<Filter>(currentFilter);

  const priceRanges = [
    { label: 'Free', value: [0, 0] },
    { label: '$1 - $20', value: [1, 20] },
    { label: '$21 - $50', value: [21, 50] },
    { label: '$51 - $100', value: [51, 100] },
    { label: '$100+', value: [100, 1000] },
  ];

  const distances = [0.5, 1, 2, 5, 10];
  const memberCounts = [1, 2, 3, 4, 5, 6];

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    const resetFilter: Filter = {
      priceRange: [0, 1000],
      distance: 2,
      members: 1,
    };
    setFilter(resetFilter);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Range</Text>
            </View>
            <View style={styles.optionsGrid}>
              {priceRanges.map((range, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.surface 
                    },
                    filter.priceRange[0] === range.value[0] && filter.priceRange[1] === range.value[1]
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : null,
                  ]}
                  onPress={() => setFilter({ ...filter, priceRange: range.value as [number, number] })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      filter.priceRange[0] === range.value[0] && filter.priceRange[1] === range.value[1]
                        ? { color: colors.white }
                        : null,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Distance (km)</Text>
            </View>
            <View style={styles.optionsGrid}>
              {distances.map((distance) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.option,
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.surface 
                    },
                    filter.distance === distance ? { backgroundColor: colors.primary, borderColor: colors.primary } : null,
                  ]}
                  onPress={() => setFilter({ ...filter, distance })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      filter.distance === distance ? { color: colors.white } : null,
                    ]}
                  >
                    {distance}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Members */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Number of Members</Text>
            </View>
            <View style={styles.optionsGrid}>
              {memberCounts.map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.option,
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.surface 
                    },
                    filter.members === count ? { backgroundColor: colors.primary, borderColor: colors.primary } : null,
                  ]}
                  onPress={() => setFilter({ ...filter, members: count })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      filter.members === count ? { color: colors.white } : null,
                    ]}
                  >
                    {count} {count === 1 ? 'person' : 'people'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={handleReset}>
            <Text style={[styles.resetButtonText, { color: colors.text }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]} onPress={handleApply}>
            <Text style={[styles.applyButtonText, { color: colors.white }]}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});