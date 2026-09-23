import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {backgroundColor: colors.surface, borderColor: colors.surfaceBorder},
        ]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.input, {color: colors.textPrimary}]}
          placeholder="Tìm kiếm môn học..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <Text
            style={[styles.clearIcon, {color: colors.textSecondary}]}
            onPress={() => setSearchText('')}>
            ✕
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    padding: 4,
  },
});

export default SearchBar;
