import { View, Text, Switch } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileTab() {
  const { colors, isDark, setMode } = useTheme();
  const { profile, signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18 }}>
          {profile?.name || 'Guest'}
        </Text>
        <Text style={{ color: colors.mutedText, marginTop: 4 }}>
          {profile?.email || 'Not signed in'}
        </Text>
      </View>
      <View style={{ height: 12 }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <Text style={{ color: colors.text }}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={(v) => setMode(v ? 'dark' : 'light')} />
      </View>
      <View style={{ height: 12 }} />
      <Text onPress={signOut} style={{ color: colors.primary }}>
        Sign out
      </Text>
    </SafeAreaView>
  );
}
