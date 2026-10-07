import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ForecastDay } from '../types/weather';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants';
import { formatDayLabel, formatTemp } from '../utils/weatherUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DailyForecastProps {
  forecast: ForecastDay[];
  selectedDayDate?: string | null;
  onSelectDay?: (day: ForecastDay, label: string) => void;
}

const DailyForecast: React.FC<DailyForecastProps> = ({
  forecast,
  selectedDayDate,
  onSelectDay,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="calendar-month" size={20} color={COLORS.textSecondary} />
          <Text style={styles.title}>Dự báo {forecast.length} ngày</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="gesture-tap" size={14} color={COLORS.textMuted} style={{ marginRight: 3 }} />
          <Text style={styles.hintText}>Chạm để xem chi tiết</Text>
        </View>
      </View>
      {forecast.map((day, index) => {
        const isSelected = selectedDayDate === day.date;
        const dayLabel = formatDayLabel(day.date);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayRow,
              isSelected && styles.selectedDayRow,
            ]}
            activeOpacity={0.7}
            onPress={() => onSelectDay && onSelectDay(day, dayLabel)}
          >
            <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
              {dayLabel}
            </Text>
            <View style={styles.centerSection}>
              <Image
                source={{
                  uri: day.day.condition.icon.startsWith('http')
                    ? day.day.condition.icon
                    : `https:${day.day.condition.icon}`,
                }}
                style={styles.icon}
              />
              {day.day.daily_chance_of_rain > 0 ? (
                <View style={styles.rainChance}>
                  <Text style={styles.rainText}>{day.day.daily_chance_of_rain}%</Text>
                </View>
              ) : (
                <View style={{ width: 24 }} />
              )}
            </View>
            <View style={styles.tempSection}>
              <Text style={styles.minTemp}>{formatTemp(day.day.mintemp_c)}</Text>
              <View style={styles.tempBar}>
                <View style={styles.tempFill} />
              </View>
              <Text style={[styles.maxTemp, isSelected && styles.selectedMaxTemp]}>
                {formatTemp(day.day.maxtemp_c)}
              </Text>
              <Icon
                name="chevron-right"
                size={18}
                color={isSelected ? COLORS.white : 'rgba(255,255,255,0.3)'}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
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
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  selectedDayRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderBottomColor: 'transparent',
  },
  dayText: {
    color: COLORS.white,
    fontSize: 16,
    width: 80,
  },
  selectedDayText: {
    fontWeight: FONTS.bold as any,
    color: '#FFE27A',
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  icon: {
    width: 32,
    height: 32,
  },
  rainChance: {
    marginLeft: 4,
  },
  rainText: {
    color: COLORS.lightBlue,
    fontSize: 12,
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  minTemp: {
    color: COLORS.textSecondary,
    fontSize: 16,
    width: 30,
    textAlign: 'right',
  },
  tempBar: {
    height: 4,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginHorizontal: SPACING.sm,
    maxWidth: 60,
  },
  tempFill: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.white, // In a real app, calculate width/offset based on weekly min/max
    borderRadius: 2,
  },
  maxTemp: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold as any,
    width: 30,
    textAlign: 'right',
  },
  selectedMaxTemp: {
    color: '#FFE27A',
  },
});

export default DailyForecast;
