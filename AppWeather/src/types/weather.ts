// WeatherAPI.com Type Definitions

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface HourWeather {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  uv: number;
  chance_of_rain: number;
  chance_of_snow: number;
  gust_kph: number;
}

export interface DayWeather {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avgvis_km: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
  wind_dir?: string;
  feelslike_max_c?: number;
  feelslike_min_c?: number;
  pressure_mb?: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayWeather;
  hour: HourWeather[];
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
  };
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface WeatherResponse {
  location: Location;
  current: CurrentWeather;
  forecast: Forecast;
}

export interface WeatherState {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
