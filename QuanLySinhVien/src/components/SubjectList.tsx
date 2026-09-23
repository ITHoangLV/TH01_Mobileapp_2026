import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  iconBg: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

const subjects: Subject[] = [
  {
    id: '1',
    name: 'Lập trình React Native',
    icon: '📱',
    color: '#7B6FEE',
    iconBg: '#1E1B3A',
    totalLessons: 20,
    completedLessons: 14,
    progress: 70,
  },
  {
    id: '2',
    name: 'Cơ sở dữ liệu',
    icon: '🗄️',
    color: '#4ADE80',
    iconBg: '#143A1E',
    totalLessons: 15,
    completedLessons: 15,
    progress: 100,
  },
  {
    id: '3',
    name: 'Cấu trúc dữ liệu & Giải thuật',
    icon: '🧠',
    color: '#FB923C',
    iconBg: '#3A2510',
    totalLessons: 18,
    completedLessons: 7,
    progress: 39,
  },
  {
    id: '4',
    name: 'Mạng máy tính',
    icon: '🌐',
    color: '#38BDF8',
    iconBg: '#0F2A3A',
    totalLessons: 12,
    completedLessons: 3,
    progress: 25,
  },
  {
    id: '5',
    name: 'Công nghệ phần mềm',
    icon: '⚙️',
    color: '#F472B6',
    iconBg: '#3A1528',
    totalLessons: 16,
    completedLessons: 10,
    progress: 63,
  },
  {
    id: '6',
    name: 'An toàn thông tin',
    icon: '🔒',
    color: '#FBBF24',
    iconBg: '#3A2E0F',
    totalLessons: 14,
    completedLessons: 2,
    progress: 14,
  },
];

const SubjectCard = ({item}: {item: Subject}) => {
  const [pressed, setPressed] = useState(false);
  const {colors, isDark} = useTheme();
  const isCompleted = item.progress === 100;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.card,
        {backgroundColor: colors.surface, borderColor: colors.surfaceBorder},
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.cardTop}>
        <View style={styles.nameRow}>
          <View style={[styles.iconBox, {backgroundColor: isDark ? item.iconBg : item.color + '18'}]}>
            <Text style={styles.iconEmoji}>{item.icon}</Text>
          </View>
          <Text
            style={[styles.name, {color: colors.textPrimary}]}
            numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {isCompleted ? (
          <View style={[styles.completedBadge, {backgroundColor: isDark ? '#143A1E' : '#E8FAF0'}]}>
            <Text style={styles.completedText}>✓ Đã hoàn thành</Text>
          </View>
        ) : (
          <Text style={[styles.progressPercent, {color: item.color}]}>
            {item.progress}%
          </Text>
        )}
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarBg,
              {backgroundColor: colors.surfaceBorder},
            ]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.progress}%`,
                  backgroundColor: isCompleted ? '#4ADE80' : item.color,
                },
              ]}
            />
          </View>
        </View>
        <Text style={[styles.lessonCount, {color: colors.textSecondary}]}>
          {item.completedLessons}/{item.totalLessons}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SubjectList = () => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
          Môn học
        </Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, {color: colors.textSecondary}]}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={subjects}
        keyExtractor={item => item.id}
        renderItem={({item}) => <SubjectCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardPressed: {
    transform: [{scale: 0.98}],
    opacity: 0.85,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconEmoji: {
    fontSize: 18,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
  },
  completedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4ADE80',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBarBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  lessonCount: {
    fontSize: 13,
    fontWeight: '500',
    minWidth: 36,
    textAlign: 'right',
  },
});

export default SubjectList;
