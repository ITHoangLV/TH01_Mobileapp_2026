import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WeatherProvider } from './src/context/WeatherContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AppNavigator />
      </WeatherProvider>
    </SafeAreaProvider>
  );
};

export default App;
