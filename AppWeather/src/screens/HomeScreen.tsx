import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWeather } from '../context/WeatherContext';
import { getWeatherGradient, formatTemp } from '../utils/weatherUtils';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants';
import { HourWeather, ForecastDay } from '../types/weather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import WeatherDetails from '../components/WeatherDetails';
import WeatherDetailModal, { DetailItem } from '../components/WeatherDetailModal';

const HomeScreen = () => {
  const {
    data,
    loading,
    error,
    isLocating,
    refresh,
    requestLocation,
  } = useWeather();

  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeHour, setActiveHour] = useState<{ data: HourWeather; label: string } | null>(null);
  const [activeDay, setActiveDay] = useState<{ data: ForecastDay; label: string } | null>(null);

  const handleSelectHour = (hour: HourWeather, label: string) => {
    setActiveHour({ data: hour, label });
    setActiveDay(null);
    setSelectedDetail({ type: 'hour', data: hour, label });
    setModalVisible(true);
  };

  const handleSelectDay = (day: ForecastDay, label: string) => {
    setActiveDay({ data: day, label });
    setActiveHour(null);
    setSelectedDetail({ type: 'day', data: day, label });
    setModalVisible(true);
  };

  const handleResetSelection = () => {
    setActiveHour(null);
    setActiveDay(null);
    setSelectedDetail(null);
  };

  if (loading && !data) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.gradientDay[0] }]}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={styles.loadingText}>Đang tải dữ liệu thời tiết (Open-Meteo)...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.gradientNight[0] }]}>
        <Icon name="cloud-alert" size={64} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  const current = data.current;
  const location = data.location;
  const forecast = data.forecast.forecastday;
  const gradient = getWeatherGradient(current.condition.code, current.is_day);

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.white} />
        }
      >
        {/* Thông tin chính */}
        <View style={styles.headerInfo}>
          {/* Hàng tên địa điểm có nút GPS để định vị lại */}
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={20} color={COLORS.white} style={styles.markerIcon} />
              <Text
                style={styles.locationName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {location.name}
              </Text>
            </View>

            {/* Nút bấm lấy lại GPS */}
            <TouchableOpacity
              style={styles.gpsButton}
              onPress={requestLocation}
              disabled={isLocating}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Icon name="crosshairs-gps" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>

          {location.country ? (
            <Text style={styles.countryName} numberOfLines={1}>
              {location.country}
            </Text>
          ) : null}

          <Text style={styles.temp}>{formatTemp(current.temp_c)}</Text>
          <Text style={styles.condition}>{current.condition.text}</Text>
          <Text style={styles.minMaxTemp}>
            Cao nhất: {formatTemp(forecast[0]?.day?.maxtemp_c ?? current.temp_c)} • Thấp nhất: {formatTemp(forecast[0]?.day?.mintemp_c ?? current.temp_c)}
          </Text>
          <Text style={styles.feelsLike}>
            Cảm nhận thực tế: {formatTemp(current.feelslike_c)}
          </Text>
        </View>

        {/* Dự báo theo giờ (24 giờ) - Cho phép bấm vào từng giờ */}
        {forecast[0]?.hour && (
          <HourlyForecast
            hours={forecast[0].hour}
            selectedHourEpoch={activeHour?.data.time_epoch}
            onSelectHour={handleSelectHour}
          />
        )}

        {/* Dự báo 7 ngày - Cho phép bấm vào từng ngày */}
        <DailyForecast
          forecast={forecast}
          selectedDayDate={activeDay?.data.date}
          onSelectDay={handleSelectDay}
        />

        {/* Thông tin chi tiết các chỉ số */}
        <WeatherDetails
          current={current}
          selectedHour={activeHour?.data}
          selectedDay={activeDay?.data}
          selectedLabel={activeHour?.label || activeDay?.label}
          onResetSelection={handleResetSelection}
        />
      </ScrollView>

      {/* Modal hiển thị chi tiết khi bấm vào giờ hoặc ngày */}
      <WeatherDetailModal
        visible={modalVisible}
        item={selectedDetail}
        onClose={() => setModalVisible(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    color: COLORS.white,
    marginTop: SPACING.md,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  retryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.sm,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold as any,
  },
  headerInfo: {
    alignItems: 'center',
    marginTop: 52, // Canh chỉnh nằm hoàn toàn dưới status bar
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  markerIcon: {
    marginRight: 4,
  },
  locationName: {
    color: COLORS.white,
    fontSize: 22, // Nhỏ gọn tránh tràn màn hình
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
  gpsButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryName: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 3,
    textAlign: 'center',
  },
  temp: {
    color: COLORS.white,
    fontSize: 80,
    fontWeight: FONTS.thin as any,
    marginTop: -4,
  },
  condition: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: FONTS.medium as any,
    marginTop: -6,
  },
  minMaxTemp: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginTop: 6,
  },
  feelsLike: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
});

export default HomeScreen;
