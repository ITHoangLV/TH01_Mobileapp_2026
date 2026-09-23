import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface NavItem {
  key: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  {key: 'home', label: 'Trang chủ', icon: '⌂'},
  {key: 'subjects', label: 'Môn học', icon: '▤'},
  {key: 'assignments', label: 'Bài tập', icon: '☰'},
  {key: 'profile', label: 'Cá nhân', icon: '⊙'},
];

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {backgroundColor: colors.background},
      ]}>
      <View
        style={[
          styles.navBar,
          {backgroundColor: colors.surface, borderColor: colors.surfaceBorder},
        ]}>
        {navItems.map(item => {
          const isActive = activeTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => setActiveTab(item.key)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.iconWrapper,
                  isActive && {backgroundColor: colors.accent},
                ]}>
                <Text
                  style={[
                    styles.navIcon,
                    {color: isActive ? '#0A0A0C' : colors.textSecondary},
                  ]}>
                  {item.icon}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 6,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 28,
    paddingVertical: 8,
    borderWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default BottomNavBar;
