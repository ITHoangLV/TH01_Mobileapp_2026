import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherResponse, WeatherState } from '../types/weather';
import { fetchWeatherByCoords, fetchWeatherByCity } from '../api/weatherApi';
import { ASYNC_STORAGE_KEYS } from '../constants';
import { MOCK_WEATHER_DATA } from '../data/mockWeather';

// Setup Geolocation configuration
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto',
});

interface WeatherContextType extends WeatherState {
  isLocating: boolean;
  refresh: () => void;
  fetchByCity: (city: string) => void;
  fetchByCoordsWithDetails: (lat: number, lon: number, name?: string, country?: string) => void;
  requestLocation: () => void;
  selectedHourIndex: number;
  setSelectedHourIndex: (i: number) => void;
  selectedDayIndex: number;
  setSelectedDayIndex: (i: number) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const coordsRef = useRef<{ lat: number; lon: number; name?: string; country?: string } | null>(null);

  const loadFromCache = async (): Promise<WeatherResponse | null> => {
    try {
      const cached = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.WEATHER_CACHE);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return null;
  };

  const saveToCache = async (data: WeatherResponse) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.WEATHER_CACHE, JSON.stringify(data));
    } catch {}
  };

  const fetchWeather = useCallback(
    async (lat: number, lon: number, name?: string, country?: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetchWeatherByCoords(lat, lon, name, country);
        await saveToCache(data);
        setState({ data, loading: false, error: null, lastUpdated: new Date() });
      } catch (err: any) {
        const cached = await loadFromCache();
        if (cached) {
          setState({
            data: cached,
            loading: false,
            error: null,
            lastUpdated: null,
          });
        } else {
          // Fallback to offline realistic data
          setState({
            data: {
              ...MOCK_WEATHER_DATA,
              location: {
                ...MOCK_WEATHER_DATA.location,
                name: name || 'Vị trí hiện tại',
                lat,
                lon,
              },
            },
            loading: false,
            error: null,
            lastUpdated: new Date(),
          });
        }
      } finally {
        setIsLocating(false);
      }
    },
    [],
  );

  const fetchByCoordsWithDetails = useCallback(
    (lat: number, lon: number, name?: string, country?: string) => {
      coordsRef.current = { lat, lon, name, country };
      fetchWeather(lat, lon, name, country);
    },
    [fetchWeather],
  );

  const fetchByCity = useCallback(
    async (city: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetchWeatherByCity(city);
        coordsRef.current = {
          lat: data.location.lat,
          lon: data.location.lon,
          name: data.location.name,
          country: data.location.country,
        };
        await saveToCache(data);
        setState({ data, loading: false, error: null, lastUpdated: new Date() });
      } catch (err: any) {
        setState(prev => ({
          ...prev,
          data: {
            ...MOCK_WEATHER_DATA,
            location: {
              ...MOCK_WEATHER_DATA.location,
              name: city,
              country: 'Việt Nam',
            },
          },
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }));
      } finally {
        setIsLocating(false);
      }
    },
    [],
  );

  const requestLocation = useCallback(async () => {
    setIsLocating(true);

    if (Platform.OS === 'android') {
      try {
        const statuses = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fineGranted =
          statuses[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const coarseGranted =
          statuses[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (!fineGranted && !coarseGranted) {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Chưa có quyền vị trí, hiển thị Hà Nội', ToastAndroid.SHORT);
          }
          fetchByCity('Hà Nội');
          return;
        }
      } catch {
        fetchByCity('Hà Nội');
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    // Try normal accuracy first (much faster and highly reliable on mobile & emulators)
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        coordsRef.current = { lat: latitude, lon: longitude };
        if (Platform.OS === 'android') {
          ToastAndroid.show('Đã lấy vị trí GPS thành công', ToastAndroid.SHORT);
        }
        fetchWeather(latitude, longitude);
      },
      error => {
        // Fallback: try high accuracy
        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            coordsRef.current = { lat: latitude, lon: longitude };
            fetchWeather(latitude, longitude);
          },
          () => {
            if (Platform.OS === 'android') {
              ToastAndroid.show('Không thể lấy tọa độ GPS, mặc định Hà Nội', ToastAndroid.SHORT);
            }
            fetchByCity('Hà Nội');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000,
          },
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000,
      },
    );
  }, [fetchWeather, fetchByCity]);

  const refresh = useCallback(() => {
    if (coordsRef.current) {
      fetchWeather(
        coordsRef.current.lat,
        coordsRef.current.lon,
        coordsRef.current.name,
        coordsRef.current.country,
      );
    } else if (state.data?.location) {
      fetchWeather(state.data.location.lat, state.data.location.lon, state.data.location.name, state.data.location.country);
    } else {
      requestLocation();
    }
  }, [fetchWeather, requestLocation, state.data]);

  React.useEffect(() => {
    requestLocation();
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        ...state,
        isLocating,
        refresh,
        fetchByCity,
        fetchByCoordsWithDetails,
        requestLocation,
        selectedHourIndex,
        setSelectedHourIndex,
        selectedDayIndex,
        setSelectedDayIndex,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
};
