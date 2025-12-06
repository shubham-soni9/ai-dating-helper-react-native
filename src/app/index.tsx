import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/auth/AuthProvider';
import '../../global.css';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export default function App() {
  const { session, subscription, initialized } = useAuth();
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const seen = await SecureStore.getItemAsync('onboarding_seen');
      setOnboardingSeen(seen === 'true');
    };
    load();
  }, []);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    const revenuecatApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

    const iosApiKey = revenuecatApiKey;
    const androidApiKey = revenuecatApiKey;

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: iosApiKey });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: androidApiKey });
    }
  }, []);

  if (onboardingSeen === null || !initialized) return null;

  if (!session && !onboardingSeen) return <Redirect href="/welcome" />;

  if (!session && onboardingSeen) return <Redirect href="/create-user" />;

  if (session && !subscription.isSubscribed) return <Redirect href="/welcome" />;

  return <Redirect href="/dashboard" />;
}
