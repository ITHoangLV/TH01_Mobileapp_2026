import React, {createContext, useContext, useState, useMemo} from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentDark: string;
  statusBarStyle: 'light-content' | 'dark-content';
}

const darkColors: ThemeColors = {
  background: '#0A0A0C',
  surface: '#161618',
  surfaceBorder: '#2A2A2C',
  textPrimary: '#FFFFFF',
  textSecondary: '#7C7C80',
  accent: '#CDFF00',
  accentDark: '#1A1F00',
  statusBarStyle: 'light-content',
};

const lightColors: ThemeColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceBorder: '#E5E5EA',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  accent: '#8BC34A',
  accentDark: '#F1F8E9',
  statusBarStyle: 'dark-content',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  colors: darkColors,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [isDark, setIsDark] = useState(true);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
      toggleTheme: () => setIsDark(prev => !prev),
    }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
