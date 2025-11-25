import { createContext, useMemo, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

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
};

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const effective = mode === 'system' ? (system ?? 'light') : mode;
  const isDark = effective === 'dark';
  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);
  const value = useMemo(() => ({ mode, setMode, colors, isDark }), [mode, colors, isDark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
