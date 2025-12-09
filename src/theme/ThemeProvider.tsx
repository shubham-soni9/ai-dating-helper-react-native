import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  overlay: string;
  tabInactive: string;
  error: string;
  warning: string;
  success: string;
};

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f9fafb',
  text: '#111827',
  mutedText: '#374151',
  border: '#e5e7eb',
  primary: '#2563eb',
  onPrimary: '#ffffff',
  accent: '#10b981',
  onAccent: '#ffffff',
  overlay: 'rgba(0,0,0,0.6)',
  tabInactive: '#6b7280',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
};

const darkColors: ThemeColors = {
  background: '#0f172a',
  surface: '#111827',
  text: '#e5e7eb',
  mutedText: '#9ca3af',
  border: '#374151',
  primary: '#3b82f6',
  onPrimary: '#ffffff',
  accent: '#22c55e',
  onAccent: '#111827',
  overlay: 'rgba(255,255,255,0.4)',
  tabInactive: '#9ca3af',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
};

const THEME_STORAGE_KEY = '@app_theme_mode';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedTheme &&
          (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')
        ) {
          setMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme when it changes
  const handleSetMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
      setMode(newMode); // Still update the state even if storage fails
    }
  };

  // Determine effective theme based on mode and system preference
  const effective = mode === 'system' ? system || 'light' : mode;
  const isDark = effective === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({ mode, setMode: handleSetMode, colors, isDark }),
    [mode, colors, isDark]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
