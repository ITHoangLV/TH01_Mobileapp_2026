import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CurrentWeather, HourWeather, ForecastDay } from '../types/weather';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants';
import { getUVLabel, getVisibilityLabel, getWindDirection } from '../utils/weatherUtils';

interface WeatherDetailsProps {
  current: CurrentWeather;
  selectedHour?: HourWeather | null;
  selectedDay?: ForecastDay | null;
  selectedLabel?: string | null;
  onResetSelection?: () => void;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  current,
  selectedHour,
  selectedDay,
  selectedLabel,
  onResetSelection,
}) => {
  let details = [];
  let headerTitle = 'Chi tiết thời tiết hiện tại';
  const isCustomSelection = Boolean(selectedHour || selectedDay);

  if (selectedHour) {
    headerTitle = selectedLabel ? `Chi tiết: ${selectedLabel}` : 'Chi tiết giờ đã chọn';
    details = [
      {
        id: 'rain',
        icon: 'weather-rainy',
        label: 'Khả năng mưa',
        value: `${selectedHour.chance_of_rain}%`,
        subValue: selectedHour.precip_mm > 0 ? `Lượng: ${selectedHour.precip_mm} mm` : 'Không mưa',
      },
      {
        id: 'humidity',
        icon: 'water-percent',
        label: 'Độ ẩm',
        value: `${selectedHour.humidity}%`,
        subValue: selectedHour.humidity > 80 ? 'Ẩm ướt' : 'Dễ chịu',
      },
      {
        id: 'wind',
        icon: 'weather-windy',
        label: 'Tốc độ gió',
        value: `${selectedHour.wind_kph} km/h`,
        subValue: `Hướng: ${selectedHour.wind_dir}`,
      },
      {
        id: 'feelsLike',
        icon: 'thermometer',
        label: 'Cảm nhận',
        value: `${Math.round(selectedHour.feelslike_c)}°`,
        subValue: `Nhiệt độ: ${Math.round(selectedHour.temp_c)}°`,
      },
      {
        id: 'uv',
        icon: 'white-balance-sunny',
        label: 'Chỉ số UV',
        value: selectedHour.uv.toString(),
        subValue: getUVLabel(selectedHour.uv),
      },
      {
        id: 'pressure',
        icon: 'gauge',
        label: 'Áp suất',
        value: `${selectedHour.pressure_mb} mb`,
      },
      {
        id: 'visibility',
        icon: 'eye-outline',
        label: 'Tầm nhìn',
        value: `${selectedHour.vis_km} km`,
        subValue: getVisibilityLabel(selectedHour.vis_km),
      },
    ];
  } else if (selectedDay) {
    headerTitle = selectedLabel ? `Chi tiết: ${selectedLabel}` : 'Chi tiết ngày đã chọn';
    details = [
      {
        id: 'rain',
        icon: 'weather-rainy',
        label: 'Tỉ lệ mưa cả ngày',
        value: `${selectedDay.day.daily_chance_of_rain}%`,
        subValue: selectedDay.day.totalprecip_mm > 0 ? `Lượng: ${selectedDay.day.totalprecip_mm} mm` : 'Ít mưa',
      },
      {
        id: 'humidity',
        icon: 'water-percent',
        label: 'Độ ẩm trung bình',
        value: `${selectedDay.day.avghumidity}%`,
        subValue: selectedDay.day.avghumidity > 80 ? 'Ẩm ướt' : 'Dễ chịu',
      },
      {
        id: 'wind',
        icon: 'weather-windy',
        label: 'Gió mạnh nhất',
        value: `${selectedDay.day.maxwind_kph} km/h`,
        subValue: `Hướng: ${selectedDay.day.wind_dir || 'Đông Nam'}`,
      },
      {
        id: 'feelsLike',
        icon: 'thermometer',
        label: 'Cảm nhận nhiệt',
        value: `${selectedDay.day.feelslike_max_c ?? selectedDay.day.maxtemp_c}°`,
        subValue: `Thấp nhất: ${selectedDay.day.feelslike_min_c ?? selectedDay.day.mintemp_c}°`,
      },
      {
        id: 'uv',
        icon: 'white-balance-sunny',
        label: 'Chỉ số UV tối đa',
        value: selectedDay.day.uv.toString(),
        subValue: getUVLabel(selectedDay.day.uv),
      },
      {
        id: 'pressure',
        icon: 'gauge',
        label: 'Áp suất khí quyển',
        value: `${selectedDay.day.pressure_mb || 1012} mb`,
      },
      {
        id: 'visibility',
        icon: 'eye-outline',
        label: 'Tầm nhìn trung bình',
        value: `${selectedDay.day.avgvis_km} km`,
        subValue: getVisibilityLabel(selectedDay.day.avgvis_km),
      },
      {
        id: 'sun',
        icon: 'weather-sunset-up',
        label: 'Mặt trời',
        value: selectedDay.astro.sunrise || '--:--',
        subValue: `Lặn: ${selectedDay.astro.sunset || '--:--'}`,
      },
    ];
  } else {
    // Current weather metrics
    details = [
      {
        id: 'humidity',
        icon: 'water-percent',
        label: 'Độ ẩm',
        value: `${current.humidity}%`,
        subValue: current.humidity > 80 ? 'Ẩm ướt' : 'Bình thường',
      },
      {
        id: 'wind',
        icon: 'weather-windy',
        label: 'Gió',
        value: `${current.wind_kph} km/h`,
        subValue: getWindDirection(current.wind_dir),
      },
      {
        id: 'feelsLike',
        icon: 'thermometer',
        label: 'Cảm nhận',
        value: `${Math.round(current.feelslike_c)}°`,
        subValue: `Thực tế: ${Math.round(current.temp_c)}°`,
      },
      {
        id: 'uv',
        icon: 'white-balance-sunny',
        label: 'Chỉ số UV',
        value: current.uv.toString(),
        subValue: getUVLabel(current.uv),
      },
      {
        id: 'pressure',
        icon: 'gauge',
        label: 'Áp suất',
        value: `${current.pressure_mb} mb`,
        subValue: 'Tiêu chuẩn',
      },
      {
        id: 'visibility',
        icon: 'eye-outline',
        label: 'Tầm nhìn',
        value: `${current.vis_km} km`,
        subValue: getVisibilityLabel(current.vis_km),
      },
    ];
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Icon
            name={selectedHour ? 'clock-outline' : selectedDay ? 'calendar-month' : 'view-dashboard-outline'}
            size={20}
            color={COLORS.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.title} numberOfLines={1}>
            {headerTitle}
          </Text>
        </View>

        {isCustomSelection && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={onResetSelection}
            activeOpacity={0.7}
          >
            <Icon name="restore" size={14} color={COLORS.white} style={{ marginRight: 4 }} />
            <Text style={styles.resetText}>Về hiện tại</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.grid}>
        {details.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.header}>
              <Icon name={item.icon} size={20} color={COLORS.textSecondary} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={styles.value}>{item.value}</Text>
            {item.subValue ? <Text style={styles.subValue}>{item.subValue}</Text> : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONTS.bold as any,
    flexShrink: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.round,
  },
  resetText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: FONTS.medium as any,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginLeft: SPACING.xs,
    flexShrink: 1,
  },
  value: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: FONTS.bold as any,
  },
  subValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginTop: 3,
  },
});

export default WeatherDetails;
