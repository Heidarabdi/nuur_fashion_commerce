import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/lib/query-client';

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

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
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
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
