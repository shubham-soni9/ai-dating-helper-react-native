import { ScrollView, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import GoogleIcon from 'assets/google-icon.svg';
import EmailIcon from 'assets/email-icon.svg';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@/theme/ThemeProvider';

export default function CreateUser() {
  const [imageHeight, setImageHeight] = useState(300); // fallback
  const asset = require('assets/communication.jpg');
  const router = useRouter();
  const { session, subscription, initialized } = useAuth();
  const { colors } = useTheme();
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const seen = await SecureStore.getItemAsync('onboarding_seen');
      setOnboardingSeen(!!seen);
    })();
  }, []);

  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (!initialized) {
    return null;
  }

  const openLiveUsage = () => {
    // If Onboarding is already seen, then let move to payemnt
    if (!onboardingSeen) {
      router.push('/live-usage');
    }
  };

  const handleEmailLogin = () => {
    router.push('/sign-in-with-email');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setImageHeight(height * 0.4);
      }}>
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        <Image source={asset} style={[styles.image, { height: imageHeight }]} resizeMode="cover" />

        <Text style={[styles.title, { color: colors.text }]}>Become a Pro</Text>

        <Text style={[styles.subtitle, { color: colors.text }]}>
          Join{' '}
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            10000+
          </Text>{' '}
          happy users and become better communication partner.
        </Text>

        <Button
          style={[styles.googleButton, { borderColor: colors.border }]}
          labelStyle={{ fontSize: 19, fontWeight: '700' }}
          contentStyle={{ paddingVertical: 8 }}
          mode="outlined"
          onPress={() => {}}
          textColor={colors.text}
          icon={() => <GoogleIcon width={24} height={24} />}>
          Continue with Google
        </Button>

        <Button
          style={[styles.emailButton, { borderColor: colors.border }]}
          labelStyle={{ fontSize: 19, fontWeight: '700' }}
          contentStyle={{ paddingVertical: 8, alignItems: 'center' }}
          mode="outlined"
          onPress={handleEmailLogin}
          textColor={colors.text}
          icon={() => <EmailIcon width={30} height={30} fill={colors.text} />}>
          Continue with Email
        </Button>

        {onboardingSeen === false && (
          <Button
            style={{ marginTop: 40 }}
            labelStyle={{ fontSize: 19, fontWeight: '700' }}
            contentStyle={{
              paddingVertical: 8,
              alignItems: 'center',
              flexDirection: 'row-reverse',
            }}
            mode="contained"
            onPress={openLiveUsage}
            icon="arrow-right">
            Skip For now
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  scrollStyle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
  },

  googleButton: {
    width: '80%',
  },

  emailButton: {
    marginTop: 10,
    width: '80%',
  },

  title: {
    marginTop: 20,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
