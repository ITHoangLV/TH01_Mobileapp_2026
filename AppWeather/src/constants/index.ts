// App constants and configuration

export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const COLORS = {
  // Primary gradient colors
  gradientDay: ['#1a237e', '#0d47a1', '#1565c0', '#1976d2'] as const,
  gradientNight: ['#0a0a2e', '#0d1b3e', '#1a2a4a', '#162032'] as const,
  gradientSunny: ['#ff6f00', '#f57c00', '#fb8c00', '#ffa726'] as const,
  gradientRainy: ['#37474f', '#455a64', '#546e7a', '#607d8b'] as const,
  gradientCloudy: ['#263238', '#37474f', '#455a64', '#546e7a'] as const,
  gradientStormy: ['#1a237e', '#283593', '#303f9f', '#3949ab'] as const,
  gradientSnow: ['#b0bec5', '#cfd8dc', '#eceff1', '#ffffff'] as const,

  // UI colors
  white: '#FFFFFF',
  black: '#000000',
  primaryBlue: '#1976d2',
  lightBlue: '#64b5f6',
  darkBlue: '#0d47a1',
  accent: '#00e5ff',
  accentOrange: '#ff6f00',
  cardBg: 'rgba(255,255,255,0.15)',
  cardBgDark: 'rgba(0,0,0,0.2)',
  overlay: 'rgba(0,0,0,0.3)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.5)',
  error: '#ef5350',
  success: '#66bb6a',
  warning: '#ffa726',

  // Tab bar
  tabBarBg: '#0d1b3e',
  tabBarActive: '#00e5ff',
  tabBarInactive: 'rgba(255,255,255,0.4)',
};

export const FONTS = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 999,
};

// Open-Meteo WMO Weather Codes
export const WEATHER_CONDITION_CODES = {
  SUNNY: [0],
  PARTLY_CLOUDY: [1, 2],
  CLOUDY: [3],
  FOG: [45, 48],
  DRIZZLE: [51, 53, 55, 56, 57],
  RAIN: [61, 63, 65, 66, 67, 80, 81, 82],
  SLEET: [66, 67, 85],
  SNOW: [71, 73, 75, 77, 85, 86],
  THUNDER: [95, 96, 99],
  BLIZZARD: [75, 86],
};

export const ASYNC_STORAGE_KEYS = {
  WEATHER_CACHE: '@weather_cache',
  LAST_LOCATION: '@last_location',
  SETTINGS: '@settings',
};
