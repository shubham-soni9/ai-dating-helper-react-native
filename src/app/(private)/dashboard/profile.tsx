import { View, Text, Switch, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ProfileTab() {
  const { colors, isDark, setMode } = useTheme();
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
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
      <Text
        onPress={async () => {
          setIsSigningOut(true);
          try {
            await signOut();
            router.replace('/welcome');
          } catch (error) {
            console.error('Sign out error:', error);
          } finally {
            setIsSigningOut(false);
          }
        }}
        style={{ color: colors.primary }}>
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </Text>
      {isSigningOut && (
        <View style={{ marginTop: 8 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}
