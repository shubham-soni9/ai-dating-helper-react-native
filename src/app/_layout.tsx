import { Stack } from 'expo-router';
import '../../global.css';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AuthProvider, useAuth } from '@/auth/AuthProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperThemeWrapper>
          <AuthProvider>
            <ThemedSystemBars />
            <ThemedStack />
          </AuthProvider>
        </PaperThemeWrapper>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function PaperThemeWrapper({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const paperTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      background: colors.background,
      surface: colors.surface,
      onSurface: colors.text,
    },
  };
  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}

function ThemedStack() {
  const { colors } = useTheme();
  const { subscription } = useAuth();
  const isPaid = subscription.isSubscribed;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Protected guard={isPaid}>
        <Stack.Screen name="(private)" />
      </Stack.Protected>
      <Stack.Protected guard={!isPaid}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Screen name="legal-webview" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

function ThemedSystemBars() {
  const { colors, isDark } = useTheme();
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setButtonStyleAsync(isDark ? 'dark' : 'light');
    NavigationBar.setPositionAsync('absolute');
    NavigationBar.setBackgroundColorAsync(isDark ? '#FFFFFF' : '#000000');
    NavigationBar.setBorderColorAsync(isDark ? '#FFFFFF' : '#000000');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, [isDark]);
  return (
    <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} animated />
  );
}
