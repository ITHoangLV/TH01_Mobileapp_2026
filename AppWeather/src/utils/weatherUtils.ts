import { WEATHER_CONDITION_CODES, COLORS } from '../constants';
import { format, isToday, isTomorrow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Get weather description text in Vietnamese from WMO code
 */
export const getWMODescription = (code: number, isDay: number = 1): string => {
  switch (code) {
    case 0:
      return isDay ? 'Trời quang đãng' : 'Đêm quang đãng';
    case 1:
      return 'Ít mây';
    case 2:
      return 'Mây rải rác';
    case 3:
      return 'Nhiều mây, u ám';
    case 45:
    case 48:
      return 'Sương mù';
    case 51:
      return 'Mưa phùn nhẹ';
    case 53:
      return 'Mưa phùn vừa';
    case 55:
      return 'Mưa phùn dày đặc';
    case 56:
    case 57:
      return 'Mưa phùn buốt giá';
    case 61:
      return 'Mưa nhỏ';
    case 63:
      return 'Mưa vừa';
    case 65:
      return 'Mưa to nặng hạt';
    case 66:
    case 67:
      return 'Mưa đóng băng';
    case 71:
      return 'Tuyết rơi nhẹ';
    case 73:
      return 'Tuyết rơi vừa';
    case 75:
      return 'Tuyết rơi dày đặc';
    case 77:
      return 'Hạt tuyết rơi';
    case 80:
      return 'Mưa rào nhẹ';
    case 81:
      return 'Mưa rào';
    case 82:
      return 'Mưa rào dữ dội';
    case 85:
    case 86:
      return 'Mưa rào tuyết';
    case 95:
      return 'Dông bão';
    case 96:
    case 99:
      return 'Dông bão có mưa đá';
    default:
      return 'Có mây';
  }
};

/**
 * Get icon URL from WMO code
 */
export const getWMOIconUrl = (code: number, isDay: number = 1): string => {
  const d = isDay ? 'd' : 'n';
  switch (code) {
    case 0:
      return `https://openweathermap.org/img/wn/01${d}@2x.png`;
    case 1:
    case 2:
      return `https://openweathermap.org/img/wn/02${d}@2x.png`;
    case 3:
      return `https://openweathermap.org/img/wn/03${d}@2x.png`;
    case 45:
    case 48:
      return `https://openweathermap.org/img/wn/50${d}@2x.png`;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return `https://openweathermap.org/img/wn/09${d}@2x.png`;
    case 61:
    case 63:
    case 65:
      return `https://openweathermap.org/img/wn/10${d}@2x.png`;
    case 66:
    case 67:
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return `https://openweathermap.org/img/wn/13${d}@2x.png`;
    case 80:
    case 81:
    case 82:
      return `https://openweathermap.org/img/wn/09${d}@2x.png`;
    case 95:
    case 96:
    case 99:
      return `https://openweathermap.org/img/wn/11${d}@2x.png`;
    default:
      return `https://openweathermap.org/img/wn/02${d}@2x.png`;
  }
};

/**
 * Get gradient colors based on weather condition code and day/night
 */
export const getWeatherGradient = (code: number, isDay: number): string[] => {
  if (WEATHER_CONDITION_CODES.THUNDER.includes(code)) {
    return [...COLORS.gradientStormy];
  }
  if (
    WEATHER_CONDITION_CODES.SNOW.includes(code) ||
    WEATHER_CONDITION_CODES.BLIZZARD.includes(code)
  ) {
    return [...COLORS.gradientSnow];
  }
  if (
    WEATHER_CONDITION_CODES.RAIN.includes(code) ||
    WEATHER_CONDITION_CODES.DRIZZLE.includes(code)
  ) {
    return [...COLORS.gradientRainy];
  }
  if (
    WEATHER_CONDITION_CODES.CLOUDY.includes(code) ||
    WEATHER_CONDITION_CODES.FOG.includes(code)
  ) {
    return [...COLORS.gradientCloudy];
  }
  if (WEATHER_CONDITION_CODES.SUNNY.includes(code) && isDay) {
    return [...COLORS.gradientSunny];
  }
  if (isDay) {
    return [...COLORS.gradientDay];
  }
  return [...COLORS.gradientNight];
};

/**
 * Format temperature
 */
export const formatTemp = (temp: number): string => `${Math.round(temp)}°`;

/**
 * Format hour from time string "2024-01-01T14:00" or "2024-01-01 14:00"
 */
export const formatHour = (timeStr: string): string => {
  const parts = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr.split(' ')[1];
  const hour = parseInt(parts.split(':')[0], 10);
  if (hour === 0) return '12 SA';
  if (hour < 12) return `${hour} SA`;
  if (hour === 12) return '12 CH';
  return `${hour - 12} CH`;
};

/**
 * Format date label (Hôm nay, Ngày mai, or day of week)
 */
export const formatDayLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Hôm nay';
  if (isTomorrow(date)) return 'Ngày mai';
  return format(date, 'EEEE', { locale: vi });
};

/**
 * Format short date
 */
export const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'dd/MM');
};

/**
 * Convert degree (0-360) to wind direction in Vietnamese
 */
export const getWindDirectionFromDegree = (degree: number): string => {
  const directions = [
    'Bắc',
    'Bắc-Đông Bắc',
    'Đông Bắc',
    'Đông-Đông Bắc',
    'Đông',
    'Đông-Đông Nam',
    'Đông Nam',
    'Nam-Đông Nam',
    'Nam',
    'Nam-Tây Nam',
    'Tây Nam',
    'Tây-Tây Nam',
    'Tây',
    'Tây-Tây Bắc',
    'Tây Bắc',
    'Bắc-Tây Bắc',
  ];
  const index = Math.round((degree % 360) / 22.5) % 16;
  return directions[index];
};

export const getWindDirection = (dir: string): string => {
  return dir;
};

/**
 * Get UV index label
 */
export const getUVLabel = (uv: number): string => {
  if (uv <= 2) return 'Thấp';
  if (uv <= 5) return 'Trung bình';
  if (uv <= 7) return 'Cao';
  if (uv <= 10) return 'Rất cao';
  return 'Cực cao';
};

/**
 * Get visibility label
 */
export const getVisibilityLabel = (vis: number): string => {
  if (vis >= 10) return 'Rất tốt';
  if (vis >= 5) return 'Tốt';
  if (vis >= 2) return 'Trung bình';
  return 'Kém';
};

/**
 * Format last updated time
 */
export const formatLastUpdated = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'HH:mm, dd/MM/yyyy');
};
