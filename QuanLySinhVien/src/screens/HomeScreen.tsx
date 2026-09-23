import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import Header from '../components/Header';
import SemesterProgress from '../components/SemesterProgress';
import StatsCards from '../components/StatsCards';
import SearchBar from '../components/SearchBar';
import SubjectList from '../components/SubjectList';
import BottomNavBar from '../components/BottomNavBar';

const HomeScreen = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Header />
      <SemesterProgress />
      <StatsCards />
      <SearchBar />
      <SubjectList />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
