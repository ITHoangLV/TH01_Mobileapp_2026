import axios from 'axios';
import { WeatherResponse } from '../types/weather';
import { FORECAST_URL, GEOCODING_URL } from '../constants';
import {
  getWMODescription,
  getWMOIconUrl,
  getWindDirectionFromDegree,
} from '../utils/weatherUtils';

/**
 * Reverse geocoding to get city/region name from coordinates
 */
export const reverseGeocode = async (
  lat: number,
  lon: number,
): Promise<{ name: string; country: string }> => {
  try {
    const res = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`,
      { timeout: 5000 },
    );
    const data = res.data;
    const name =
      data.locality ||
      data.city ||
      data.principalSubdivision ||
      `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    const country = data.countryName || 'Việt Nam';
    return { name, country };
  } catch {
    return { name: `Vị trí (${lat.toFixed(2)}, ${lon.toFixed(2)})`, country: '' };
  }
};

/**
 * Fetch current + forecast weather from Open-Meteo by coordinates
 */
export const fetchWeatherByCoords = async (
  lat: number,
  lon: number,
  locationName?: string,
  countryName?: string,
): Promise<WeatherResponse> => {
  // If locationName is not provided, perform reverse geocode in parallel or before
  let name = locationName;
  let country = countryName;

  if (!name) {
    const geo = await reverseGeocode(lat, lon);
    name = geo.name;
    country = geo.country;
  }

  const response = await axios.get(FORECAST_URL, {
    timeout: 10000,
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
        'is_day',
        'surface_pressure',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant',
      ].join(','),
      timezone: 'auto',
      forecast_days: 7,
    },
  });

  const raw = response.data;
  const current = raw.current;
  const hourly = raw.hourly;
  const daily = raw.daily;

  // Find index of current hour in hourly array
  const now = new Date();
  const currentHourPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}`;
  let startHourIdx = 0;
  if (hourly?.time) {
    const found = hourly.time.findIndex((t: string) => t.startsWith(currentHourPrefix));
    if (found !== -1) startHourIdx = found;
  }

  // 24 hour forecast list
  const hourList = [];
  const maxHours = Math.min(24, (hourly?.time?.length || 0) - startHourIdx);
  for (let i = 0; i < maxHours; i++) {
    const idx = startHourIdx + i;
    const timeStr = hourly.time[idx];
    const isDay = hourly.is_day[idx] ?? 1;
    const code = hourly.weather_code[idx] ?? 0;
    hourList.push({
      time_epoch: Math.floor(new Date(timeStr).getTime() / 1000),
      time: timeStr.replace('T', ' '),
      temp_c: Math.round(hourly.temperature_2m[idx]),
      temp_f: Math.round(hourly.temperature_2m[idx] * 1.8 + 32),
      is_day: isDay,
      condition: {
        text: getWMODescription(code, isDay),
        icon: getWMOIconUrl(code, isDay),
        code,
      },
      wind_mph: Math.round((hourly.wind_speed_10m[idx] || 0) * 0.621371),
      wind_kph: Math.round(hourly.wind_speed_10m[idx] || 0),
      wind_degree: hourly.wind_direction_10m[idx] || 0,
      wind_dir: getWindDirectionFromDegree(hourly.wind_direction_10m[idx] || 0),
      pressure_mb: Math.round(hourly.surface_pressure?.[idx] || current.pressure_msl || current.surface_pressure || 1012),
      precip_mm: hourly.precipitation[idx] || 0,
      humidity: Math.round(hourly.relative_humidity_2m[idx] || 0),
      cloud: 0,
      feelslike_c: Math.round(hourly.apparent_temperature[idx]),
      feelslike_f: Math.round(hourly.apparent_temperature[idx] * 1.8 + 32),
      vis_km: Math.round(((hourly.visibility?.[idx] || 10000) / 1000) * 10) / 10,
      uv: Math.round(hourly.uv_index?.[idx] || 0),
      chance_of_rain: hourly.precipitation_probability[idx] || 0,
      chance_of_snow: 0,
      gust_kph: 0,
    });
  }

  // 7 day forecast list
  const forecastdayList = [];
  const daysCount = daily?.time?.length || 0;
  for (let i = 0; i < daysCount; i++) {
    const dateStr = daily.time[i];
    const code = daily.weather_code[i] ?? 0;

    // Calculate approximate daily average humidity and visibility from hourly data
    const dayStart = i * 24;
    const dayEnd = dayStart + 24;
    const dayHumidities = hourly?.relative_humidity_2m?.slice(dayStart, dayEnd) || [];
    const avgHum = dayHumidities.length > 0
      ? Math.round(dayHumidities.reduce((a: number, b: number) => a + b, 0) / dayHumidities.length)
      : 70;
    const dayVisibilities = hourly?.visibility?.slice(dayStart, dayEnd) || [];
    const avgVis = dayVisibilities.length > 0
      ? Math.round((dayVisibilities.reduce((a: number, b: number) => a + b, 0) / dayVisibilities.length / 1000) * 10) / 10
      : 10;

    forecastdayList.push({
      date: dateStr,
      date_epoch: Math.floor(new Date(dateStr).getTime() / 1000),
      day: {
        maxtemp_c: Math.round(daily.temperature_2m_max[i]),
        maxtemp_f: Math.round(daily.temperature_2m_max[i] * 1.8 + 32),
        mintemp_c: Math.round(daily.temperature_2m_min[i]),
        mintemp_f: Math.round(daily.temperature_2m_min[i] * 1.8 + 32),
        avgtemp_c: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
        avgtemp_f: 0,
        maxwind_kph: Math.round(daily.wind_speed_10m_max[i] || 0),
        wind_dir: getWindDirectionFromDegree(daily.wind_direction_10m_dominant?.[i] || 0),
        totalprecip_mm: daily.precipitation_sum?.[i] || 0,
        avgvis_km: avgVis,
        avghumidity: avgHum,
        daily_chance_of_rain: daily.precipitation_probability_max[i] || 0,
        daily_chance_of_snow: 0,
        condition: {
          text: getWMODescription(code, 1),
          icon: getWMOIconUrl(code, 1),
          code,
        },
        uv: Math.round(daily.uv_index_max[i] || 0),
        feelslike_max_c: Math.round(daily.apparent_temperature_max?.[i] ?? daily.temperature_2m_max[i]),
        feelslike_min_c: Math.round(daily.apparent_temperature_min?.[i] ?? daily.temperature_2m_min[i]),
        pressure_mb: Math.round(current.pressure_msl || current.surface_pressure || 1012),
      },
      hour: i === 0 ? hourList : [],
      astro: {
        sunrise: daily.sunrise?.[i] ? daily.sunrise[i].split('T')[1] : '',
        sunset: daily.sunset?.[i] ? daily.sunset[i].split('T')[1] : '',
        moonrise: '',
        moonset: '',
      },
    });
  }

  const currentCode = current.weather_code ?? 0;
  const currentIsDay = current.is_day ?? 1;

  return {
    location: {
      name: name || 'Vị trí hiện tại',
      region: '',
      country: country || '',
      lat,
      lon,
      tz_id: raw.timezone || 'Asia/Bangkok',
      localtime_epoch: Math.floor(Date.now() / 1000),
      localtime: raw.current.time ? raw.current.time.replace('T', ' ') : '',
    },
    current: {
      last_updated_epoch: Math.floor(Date.now() / 1000),
      last_updated: raw.current.time ? raw.current.time.replace('T', ' ') : '',
      temp_c: Math.round(current.temperature_2m),
      temp_f: Math.round(current.temperature_2m * 1.8 + 32),
      is_day: currentIsDay,
      condition: {
        text: getWMODescription(currentCode, currentIsDay),
        icon: getWMOIconUrl(currentCode, currentIsDay),
        code: currentCode,
      },
      wind_mph: Math.round((current.wind_speed_10m || 0) * 0.621371),
      wind_kph: Math.round(current.wind_speed_10m || 0),
      wind_degree: current.wind_direction_10m || 0,
      wind_dir: getWindDirectionFromDegree(current.wind_direction_10m || 0),
      pressure_mb: Math.round(current.pressure_msl || current.surface_pressure || 1012),
      pressure_in: 29.92,
      precip_mm: current.precipitation || 0,
      precip_in: 0,
      humidity: Math.round(current.relative_humidity_2m || 0),
      cloud: current.cloud_cover || 0,
      feelslike_c: Math.round(current.apparent_temperature),
      feelslike_f: Math.round(current.apparent_temperature * 1.8 + 32),
      vis_km: Math.round(((hourly?.visibility?.[startHourIdx] || 10000) / 1000) * 10) / 10,
      vis_miles: 6,
      uv: Math.round(daily?.uv_index_max?.[0] || 0),
      gust_mph: Math.round((current.wind_gusts_10m || 0) * 0.621371),
      gust_kph: Math.round(current.wind_gusts_10m || 0),
    },
    forecast: {
      forecastday: forecastdayList,
    },
  };
};

/**
 * Search city using Open-Meteo Geocoding API
 */
export const searchCity = async (query: string): Promise<any[]> => {
  const response = await axios.get(GEOCODING_URL, {
    timeout: 8000,
    params: {
      name: query,
      count: 10,
      language: 'vi',
      format: 'json',
    },
  });
  const results = response.data.results || [];
  return results.map((item: any) => ({
    id: item.id,
    name: item.name,
    region: item.admin1 || '',
    country: item.country || '',
    lat: item.latitude,
    lon: item.longitude,
  }));
};

/**
 * Fetch weather by city name via Open-Meteo
 */
export const fetchWeatherByCity = async (
  city: string,
): Promise<WeatherResponse> => {
  const results = await searchCity(city);
  if (results && results.length > 0) {
    const first = results[0];
    return fetchWeatherByCoords(first.lat, first.lon, first.name, first.country);
  }
  // Fallback coords for popular VN cities
  const popularCoords: Record<string, { lat: number; lon: number; name: string; country: string }> = {
    'Hà Nội': { lat: 21.0245, lon: 105.8412, name: 'Hà Nội', country: 'Việt Nam' },
    'Hồ Chí Minh': { lat: 10.8231, lon: 106.6297, name: 'Hồ Chí Minh', country: 'Việt Nam' },
    'Đà Nẵng': { lat: 16.0544, lon: 108.2022, name: 'Đà Nẵng', country: 'Việt Nam' },
    'Cần Thơ': { lat: 10.0452, lon: 105.7469, name: 'Cần Thơ', country: 'Việt Nam' },
    'Hải Phòng': { lat: 20.8449, lon: 106.6881, name: 'Hải Phòng', country: 'Việt Nam' },
  };

  const matched = popularCoords[city] || popularCoords['Hà Nội'];
  return fetchWeatherByCoords(matched.lat, matched.lon, matched.name, matched.country);
};
