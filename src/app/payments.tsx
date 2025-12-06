import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Payment() {
  const { colors } = useTheme();
  const { subscription, setSubscription } = useAuth();
  const router = useRouter();

  const startTrial = () => {
    setSubscription({ isSubscribed: false, trialActive: true });
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Unlock Full Access</Text>
      <Text style={{ color: colors.mutedText }}>
        Subscribe for unlimited suggestions. Try a 7-day free trial.
      </Text>
      <View style={{ height: 12 }} />
      <Button title="Start Trial" onPress={startTrial} />
      <Text style={{ color: colors.mutedText, marginTop: 8 }}>
        Current: {subscription.trialActive ? 'Trial Active' : 'No Subscription'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});
