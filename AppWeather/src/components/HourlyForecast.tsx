import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { HourWeather } from '../types/weather';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants';
import { formatHour, formatTemp } from '../utils/weatherUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HourlyForecastProps {
  hours: HourWeather[];
  selectedHourEpoch?: number | null;
  onSelectHour?: (hour: HourWeather, label: string) => void;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hours,
  selectedHourEpoch,
  onSelectHour,
}) => {
  // Get current time epoch to filter past hours
  const currentEpoch = Math.floor(Date.now() / 1000);
  const futureHours = hours.filter(h => h.time_epoch >= currentEpoch - 3600).slice(0, 24);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="clock-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.title}>Dự báo 24 giờ</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="gesture-tap" size={14} color={COLORS.textMuted} style={{ marginRight: 3 }} />
          <Text style={styles.hintText}>Chạm để xem chi tiết</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {futureHours.map((hour, index) => {
          const isSelected = selectedHourEpoch === hour.time_epoch;
          const timeLabel = index === 0 ? 'Bây giờ' : formatHour(hour.time);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.hourCard,
                isSelected && styles.selectedHourCard,
              ]}
              activeOpacity={0.7}
              onPress={() => onSelectHour && onSelectHour(hour, timeLabel)}
            >
              <Text style={[styles.time, isSelected && styles.selectedText]}>
                {timeLabel}
              </Text>
              <Image
                source={{
                  uri: hour.condition.icon.startsWith('http')
                    ? hour.condition.icon
                    : `https:${hour.condition.icon}`,
                }}
                style={styles.icon}
              />
              <Text style={[styles.temp, isSelected && styles.selectedTemp]}>
                {formatTemp(hour.temp_c)}
              </Text>
              {hour.chance_of_rain > 0 ? (
                <View style={styles.rainChance}>
                  <Icon name="water-percent" size={12} color={COLORS.lightBlue} />
                  <Text style={styles.rainText}>{hour.chance_of_rain}%</Text>
                </View>
              ) : (
                <View style={{ height: 16 }} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold as any,
    marginLeft: SPACING.sm,
  },
  scroll: {
    flexDirection: 'row',
  },
  hourCard: {
    alignItems: 'center',
    marginRight: SPACING.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedHourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: COLORS.white,
  },
  time: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  selectedText: {
    fontWeight: FONTS.bold as any,
    color: COLORS.white,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: SPACING.sm,
  },
  temp: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold as any,
  },
  selectedTemp: {
    color: '#FFE27A',
  },
  rainChance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rainText: {
    color: COLORS.lightBlue,
    fontSize: 12,
    marginLeft: 2,
  },
});

export default HourlyForecast;
