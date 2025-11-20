import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { ThemeProvider } from '../contexts/ThemeContext';

let Inter_400Regular: any;
let Inter_500Medium: any;
let Inter_600SemiBold: any;
let Inter_700Bold: any;
let PlusJakartaSans_400Regular: any;
let PlusJakartaSans_500Medium: any;
let PlusJakartaSans_600SemiBold: any;
let PlusJakartaSans_700Bold: any;
let DMSans_400Regular: any;
let DMSans_500Medium: any;
let DMSans_600SemiBold: any;
let DMSans_700Bold: any;

// Only import fonts on native platforms
if (typeof window === 'undefined' || !('document' in window)) {
  const inter = require('@expo-google-fonts/inter');
  const plusJakarta = require('@expo-google-fonts/plus-jakarta-sans');
  const dmSans = require('@expo-google-fonts/dm-sans');

  Inter_400Regular = inter.Inter_400Regular;
  Inter_500Medium = inter.Inter_500Medium;
  Inter_600SemiBold = inter.Inter_600SemiBold;
  Inter_700Bold = inter.Inter_700Bold;
  PlusJakartaSans_400Regular = plusJakarta.PlusJakartaSans_400Regular;
  PlusJakartaSans_500Medium = plusJakarta.PlusJakartaSans_500Medium;
  PlusJakartaSans_600SemiBold = plusJakarta.PlusJakartaSans_600SemiBold;
  PlusJakartaSans_700Bold = plusJakarta.PlusJakartaSans_700Bold;
  DMSans_400Regular = dmSans.DMSans_400Regular;
  DMSans_500Medium = dmSans.DMSans_500Medium;
  DMSans_600SemiBold = dmSans.DMSans_600SemiBold;
  DMSans_700Bold = dmSans.DMSans_700Bold;
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlusJakarta-Regular': PlusJakartaSans_400Regular,
    'PlusJakarta-Medium': PlusJakartaSans_500Medium,
    'PlusJakarta-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakarta-Bold': PlusJakartaSans_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
    'DMSans-Bold': DMSans_700Bold,
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
