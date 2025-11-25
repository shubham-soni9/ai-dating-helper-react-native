import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

import '../../global.css';

export default function App() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
      }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24, color: colors.text }}>
        Home
      </Text>
      <Pressable
        onPress={() => router.push('/media-picker')}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        }}>
        <Text style={{ color: colors.onPrimary, fontSize: 16 }}>Open Media Picker</Text>
      </Pressable>
      <View style={{ height: 12 }} />
      <Pressable
        onPress={() => router.push('/dashboard')}
        style={{
          backgroundColor: colors.accent,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        }}>
        <Text style={{ color: colors.onAccent, fontSize: 16 }}>Open Dashboard</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
