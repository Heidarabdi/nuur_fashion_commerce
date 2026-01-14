import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { queryClient } from '@/lib/query-client';
import { ONBOARDING_COMPLETE_KEY } from './onboarding';
import { setReactNativeStorageCache } from '@nuur-fashion-commerce/api';

// Google Fonts
import {
  Playfair_700Bold,
  Playfair_700Bold_Italic,
} from '@expo-google-fonts/playfair';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { isDark } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  // Check onboarding status and hydrate guest ID on mount
  useEffect(() => {
    const initialize = async () => {
      // Check onboarding status
      const complete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      setIsOnboardingComplete(complete === 'true');

      // Hydrate guest ID from AsyncStorage
      const guestId = await AsyncStorage.getItem('guest_id');
      if (guestId) {
        setReactNativeStorageCache({ guest_id: guestId });
      } else {
        // Generate new guest ID and save to AsyncStorage
        const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await AsyncStorage.setItem('guest_id', newGuestId);
        setReactNativeStorageCache({ guest_id: newGuestId });
      }
    };
    initialize();
  }, []);

  // Redirect based on onboarding status
  useEffect(() => {
    if (isOnboardingComplete === null) return; // Still loading

    const inOnboarding = segments[0] === 'onboarding';

    if (!isOnboardingComplete && !inOnboarding) {
      // Redirect to onboarding if not complete
      router.replace('/onboarding');
    }
  }, [isOnboardingComplete, segments, router]);

  // Don't render until we know onboarding status
  if (isOnboardingComplete === null) {
    return null;
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="orders/index" />
        <Stack.Screen name="orders/[id]" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="wishlist" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="address" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="order-confirmation" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Playfair_700Bold,
    Playfair_700Bold_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
        <Toast />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
