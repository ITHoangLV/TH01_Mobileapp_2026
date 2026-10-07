import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useWeather } from '../context/WeatherContext';
import { searchCity } from '../api/weatherApi';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants';

const POPULAR_CITIES = [
  { id: '1', name: 'Hà Nội', region: 'Thủ đô', country: 'Việt Nam', lat: 21.0245, lon: 105.8412 },
  { id: '2', name: 'Hồ Chí Minh', region: 'Đông Nam Bộ', country: 'Việt Nam', lat: 10.8231, lon: 106.6297 },
  { id: '3', name: 'Đà Nẵng', region: 'Duyên hải Nam Trung Bộ', country: 'Việt Nam', lat: 16.0544, lon: 108.2022 },
  { id: '4', name: 'Hải Phòng', region: 'Đồng bằng sông Hồng', country: 'Việt Nam', lat: 20.8449, lon: 106.6881 },
  { id: '5', name: 'Cần Thơ', region: 'Đồng bằng sông Cửu Long', country: 'Việt Nam', lat: 10.0452, lon: 105.7469 },
  { id: '6', name: 'Nha Trang', region: 'Khánh Hòa', country: 'Việt Nam', lat: 12.2388, lon: 109.1967 },
  { id: '7', name: 'Đà Lạt', region: 'Lâm Đồng', country: 'Việt Nam', lat: 11.9404, lon: 108.4583 },
  { id: '8', name: 'Huế', region: 'Thừa Thiên Huế', country: 'Việt Nam', lat: 16.4637, lon: 107.5909 },
  { id: '9', name: 'Sa Pa', region: 'Lào Cai', country: 'Việt Nam', lat: 22.3364, lon: 103.8438 },
];

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchByCoordsWithDetails } = useWeather();
  const navigation = useNavigation();

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length > 1) {
      setLoading(true);
      try {
        const data = await searchCity(text.trim());
        if (Array.isArray(data) && data.length > 0) {
          setResults(data);
        } else {
          const filtered = POPULAR_CITIES.filter(c =>
            c.name.toLowerCase().includes(text.toLowerCase()),
          );
          setResults(filtered);
        }
      } catch {
        const filtered = POPULAR_CITIES.filter(c =>
          c.name.toLowerCase().includes(text.toLowerCase()),
        );
        setResults(filtered);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelectLocation = (item: { lat: number; lon: number; name: string; country?: string }) => {
    Keyboard.dismiss();
    fetchByCoordsWithDetails(item.lat, item.lon, item.name, item.country);
    navigation.navigate('Home' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm kiếm địa điểm</Text>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên thành phố (vd: Hà Nội, Paris, Tokyo)..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color={COLORS.textSecondary} style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryBlue} style={{ marginTop: 20 }} />
      ) : query.trim().length > 1 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id?.toString() || `${item.lat}_${item.lon}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectLocation(item)}
            >
              <View style={styles.resultRow}>
                <Icon name="map-marker" size={20} color={COLORS.accent} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultRegion}>
                    {item.region ? `${item.region}, ` : ''}{item.country || ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy địa điểm nào phù hợp.</Text>
          }
        />
      ) : (
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Địa điểm phổ biến (Việt Nam)</Text>
          <FlatList
            data={POPULAR_CITIES}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.resultRow}>
                  <Icon name="city-variant" size={20} color={COLORS.lightBlue} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultRegion}>{item.region}, {item.country}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tabBarBg,
    paddingTop: 55,
    paddingHorizontal: SPACING.md,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONTS.bold as any,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  clearIcon: {
    marginLeft: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },
  popularSection: {
    flex: 1,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  resultItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONTS.medium as any,
  },
  resultRegion: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
    fontSize: 15,
  },
});

export default SearchScreen;
