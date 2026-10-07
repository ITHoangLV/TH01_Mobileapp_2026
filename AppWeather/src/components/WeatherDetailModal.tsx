import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HourWeather, ForecastDay } from '../types/weather';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants';
import {
  formatHour,
  formatTemp,
  formatDayLabel,
  getUVLabel,
  getVisibilityLabel,
} from '../utils/weatherUtils';

export type DetailItem =
  | { type: 'hour'; data: HourWeather; label?: string }
  | { type: 'day'; data: ForecastDay; label?: string };

interface WeatherDetailModalProps {
  visible: boolean;
  item: DetailItem | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  if (!item) return null;

  const isHour = item.type === 'hour';
  const hourData = isHour ? (item.data as HourWeather) : null;
  const dayData = !isHour ? (item.data as ForecastDay) : null;

  // Header Title
  const title = isHour
    ? item.label || `Thời tiết lúc ${formatHour(hourData!.time)}`
    : item.label || `Dự báo ${formatDayLabel(dayData!.date)}`;

  // Weather Icon & Description
  const iconUrl = isHour
    ? hourData!.condition.icon.startsWith('http')
      ? hourData!.condition.icon
      : `https:${hourData!.condition.icon}`
    : dayData!.day.condition.icon.startsWith('http')
    ? dayData!.day.condition.icon
    : `https:${dayData!.day.condition.icon}`;

  const conditionText = isHour
    ? hourData!.condition.text
    : dayData!.day.condition.text;

  // Metrics list
  const metrics = isHour
    ? [
        {
          id: 'rain',
          icon: 'weather-rainy',
          label: 'Khả năng mưa',
          value: `${hourData!.chance_of_rain}%`,
          subValue: hourData!.precip_mm > 0 ? `Lượng mưa: ${hourData!.precip_mm} mm` : 'Không mưa',
        },
        {
          id: 'humidity',
          icon: 'water-percent',
          label: 'Độ ẩm không khí',
          value: `${hourData!.humidity}%`,
          subValue: hourData!.humidity > 80 ? 'Ẩm ướt' : hourData!.humidity < 50 ? 'Khô ráo' : 'Lý tưởng',
        },
        {
          id: 'wind',
          icon: 'weather-windy',
          label: 'Tốc độ gió',
          value: `${hourData!.wind_kph} km/h`,
          subValue: `Hướng: ${hourData!.wind_dir}`,
        },
        {
          id: 'uv',
          icon: 'white-balance-sunny',
          label: 'Chỉ số UV',
          value: `${hourData!.uv}`,
          subValue: getUVLabel(hourData!.uv),
        },
        {
          id: 'feelsLike',
          icon: 'thermometer',
          label: 'Cảm nhận thực tế',
          value: formatTemp(hourData!.feelslike_c),
          subValue: `Chênh lệch: ${Math.round(hourData!.feelslike_c - hourData!.temp_c)}°`,
        },
        {
          id: 'visibility',
          icon: 'eye-outline',
          label: 'Tầm nhìn xa',
          value: `${hourData!.vis_km} km`,
          subValue: getVisibilityLabel(hourData!.vis_km),
        },
        {
          id: 'pressure',
          icon: 'gauge',
          label: 'Áp suất khí quyển',
          value: `${hourData!.pressure_mb} mb`,
          subValue: 'Bình thường',
        },
      ]
    : [
        {
          id: 'rain',
          icon: 'weather-rainy',
          label: 'Tỉ lệ mưa cả ngày',
          value: `${dayData!.day.daily_chance_of_rain}%`,
          subValue: dayData!.day.totalprecip_mm > 0 ? `Lượng mưa: ${dayData!.day.totalprecip_mm} mm` : 'Ít khả năng mưa',
        },
        {
          id: 'humidity',
          icon: 'water-percent',
          label: 'Độ ẩm trung bình',
          value: `${dayData!.day.avghumidity}%`,
          subValue: dayData!.day.avghumidity > 80 ? 'Ẩm ướt' : 'Dễ chịu',
        },
        {
          id: 'wind',
          icon: 'weather-windy',
          label: 'Gió mạnh nhất',
          value: `${dayData!.day.maxwind_kph} km/h`,
          subValue: `Hướng: ${dayData!.day.wind_dir || 'Đông Nam'}`,
        },
        {
          id: 'uv',
          icon: 'white-balance-sunny',
          label: 'Chỉ số UV tối đa',
          value: `${dayData!.day.uv}`,
          subValue: getUVLabel(dayData!.day.uv),
        },
        {
          id: 'sun',
          icon: 'weather-sunset-up',
          label: 'Bình minh / Hoàng hôn',
          value: `${dayData!.astro.sunrise || '--:--'}`,
          subValue: `Lặn: ${dayData!.astro.sunset || '--:--'}`,
        },
        {
          id: 'visibility',
          icon: 'eye-outline',
          label: 'Tầm nhìn trung bình',
          value: `${dayData!.day.avgvis_km} km`,
          subValue: getVisibilityLabel(dayData!.day.avgvis_km),
        },
        {
          id: 'feelsLike',
          icon: 'thermometer',
          label: 'Biên độ cảm nhận',
          value: `${dayData!.day.feelslike_max_c ?? dayData!.day.maxtemp_c}°`,
          subValue: `Thấp nhất: ${dayData!.day.feelslike_min_c ?? dayData!.day.mintemp_c}°`,
        },
        {
          id: 'pressure',
          icon: 'gauge',
          label: 'Áp suất khí quyển',
          value: `${dayData!.day.pressure_mb || 1012} mb`,
          subValue: 'Tiêu chuẩn',
        },
      ];

  if (!visible || !item) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdropTouchable}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.sheetContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            <Icon
              name={isHour ? 'clock-outline' : 'calendar-month'}
              size={22}
              color={COLORS.lightBlue}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="close" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero Summary */}
            <View style={styles.heroBox}>
              <Image source={{ uri: iconUrl }} style={styles.heroIcon} />
              <View style={styles.heroTexts}>
                {isHour ? (
                  <Text style={styles.heroTemp}>
                    {formatTemp(hourData!.temp_c)}
                  </Text>
                ) : (
                  <Text style={styles.heroTemp}>
                    {formatTemp(dayData!.day.maxtemp_c)}{' '}
                    <Text style={styles.heroTempSub}>
                      / {formatTemp(dayData!.day.mintemp_c)}
                    </Text>
                  </Text>
                )}
                <Text style={styles.heroCondition}>{conditionText}</Text>
                {isHour ? (
                  <Text style={styles.heroSub}>
                    Cảm nhận thực tế: {formatTemp(hourData!.feelslike_c)}
                  </Text>
                ) : (
                  <Text style={styles.heroSub}>
                    Nhiệt độ TB: {formatTemp(dayData!.day.avgtemp_c)}
                  </Text>
                )}
              </View>
            </View>

            {/* Metrics Title */}
            <Text style={styles.sectionTitle}>Chỉ số thời tiết chi tiết</Text>

            {/* Metrics Grid */}
            <View style={styles.grid}>
              {metrics.map((m) => (
                <View key={m.id} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Icon name={m.icon} size={18} color={COLORS.lightBlue} />
                    <Text style={styles.metricLabel}>{m.label}</Text>
                  </View>
                  <Text style={styles.metricValue}>{m.value}</Text>
                  {m.subValue ? (
                    <Text style={styles.metricSub}>{m.subValue}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneText}>Đóng</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 25,
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: '#1E2336',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  sheetTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold as any,
    flexShrink: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  heroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroIcon: {
    width: 64,
    height: 64,
    marginRight: SPACING.md,
  },
  heroTexts: {
    flex: 1,
  },
  heroTemp: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: FONTS.bold as any,
  },
  heroTempSub: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: FONTS.regular as any,
  },
  heroCondition: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.medium as any,
    marginTop: 2,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: FONTS.medium as any,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 6,
    flexShrink: 1,
  },
  metricValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold as any,
  },
  metricSub: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginTop: 3,
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  doneText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold as any,
  },
});

export default WeatherDetailModal;
