import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/common/ToastContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ONBOARDING_KEY = 'spotride_has_onboarded';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      console.log('[RootLayout] Checking onboarding status...');
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        console.log('[RootLayout] Onboarding status:', value);

        // Short delay to ensure the Router and Stack are fully mounted
        setTimeout(() => {
          if (value === 'true') {
            router.replace('/(tabs)');
          } else {
            router.replace('/onboarding');
          }
          setIsCheckingOnboarding(false);
        }, 300);
      } catch (e) {
        console.error('[RootLayout] AsyncStorage error:', e);
        router.replace('/onboarding');
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
          </Stack>
          <StatusBar style="light" backgroundColor="transparent" translucent />

          {/* Loading overlay to prevent flashing the home page */}
          {isCheckingOnboarding && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111218' }]} />
          )}
        </ThemeProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
