import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SemesterProgress = () => {
  // Bar chart data - heights representing weekly activity
  const bars = [6, 10, 8, 14, 6, 10, 18, 12, 8, 16, 22, 14, 10, 20, 26, 18, 12, 24, 28, 20];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.label}>Tiến độ học kỳ</Text>
          <Text style={styles.semester}>HK1 · 2026</Text>
        </View>
        <Text style={styles.percentage}>65%</Text>
        <View style={styles.barsContainer}>
          {bars.map((height, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height: height,
                  backgroundColor: index >= 14 ? '#1A2600' : '#2D4000',
                  opacity: index >= 14 ? 0.6 : 1,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#CDFF00',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2600',
  },
  semester: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D5A00',
  },
  percentage: {
    fontSize: 56,
    fontWeight: '900',
    color: '#0A0A0C',
    letterSpacing: -2,
    marginBottom: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 32,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    minWidth: 4,
  },
});

export default SemesterProgress;
