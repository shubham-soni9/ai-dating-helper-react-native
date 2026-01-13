import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { presentPaywall } from '@/utils/Paywall';

export default function Payment() {
  const { colors } = useTheme();
  const { setSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const show = async () => {
      const ok = await presentPaywall();
      if (ok) {
        setSubscription({ isSubscribed: true, trialActive: false });
        router.replace('/dashboard');
        console.log('User subscribed successfully');
      } else {
        console.log('User cancelled payment');
        // Dummy Change. Jump to Error Screen or Welcome Screen
        router.replace('/dashboard');
      }
    };
    show();
  }, [setSubscription, router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.mutedText }}>Loading payment options…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
