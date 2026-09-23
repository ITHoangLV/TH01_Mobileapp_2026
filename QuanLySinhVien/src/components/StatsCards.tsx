import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

const StatCard = ({icon, value, label}: StatCardProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.surface, borderColor: colors.surfaceBorder},
      ]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, {color: colors.textPrimary}]}>{value}</Text>
      <Text style={[styles.label, {color: colors.textSecondary}]}>{label}</Text>
    </View>
  );
};

const StatsCards = () => {
  const stats: StatCardProps[] = [
    {icon: '📚', value: '6', label: 'Môn học'},
    {icon: '📝', value: '20', label: 'Bài tập'},
    {icon: '✅', value: '2/5', label: 'Hoàn thành'},
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  icon: {
    fontSize: 22,
    marginBottom: 8,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default StatsCards;
