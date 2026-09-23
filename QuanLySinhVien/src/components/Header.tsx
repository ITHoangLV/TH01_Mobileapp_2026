import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View>
          <Text style={[styles.studentName, { color: colors.textPrimary }]}>
            Lưu Việt Hoàng
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
          onPress={toggleTheme}
          activeOpacity={0.7}>
          <Text style={styles.btnIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
          activeOpacity={0.7}>
          <Text style={styles.btnIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        <Image
          source={{
            uri: 'https://cdn.pico.vn/2026/01/20/1768898918193361988.jpeg',
          }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  leftSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  btnIcon: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});

export default Header;
