import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { FooterLinks } from '../components/common/FooterLinks';
import { validateEmail } from '../utils/validation';
import { authService } from '../services/authService';
import { EmailStep } from '../components/auth/EmailStep';
import { VerifyStep } from '../components/auth/VerifyStep';
import { useAuth } from '../auth/AuthProvider';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@/theme/ThemeProvider';

type AuthStep = 'email' | 'verify';

export default function SignIn() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!initialized) return;
    if (session && subscription) {
      router.replace('/dashboard');
    } else if (session && !subscription) {
      if (onboardingSeen === false) {
        router.replace('/onboarding');
      } else if (onboardingSeen === true) {
        router.replace('/payments');
      }
    }
  }, [initialized, session, subscription, onboardingSeen, router]);

  if (!initialized) {
    return null;
  }

  const handleEmailContinue = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authService.sendVerificationCode(email);
      setStep('verify');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 8) return;

    setLoading(true);
    setError('');

    try {
      await authService.verifyCode(email, code);
      // Navigate to dashboard or main app on success
      if (!subscription) {
        router.replace('/payments');
      } else if (!onboardingSeen) {
        router.replace('/live-usage');
      } else {
        router.replace('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendCode(email);
      Alert.alert('Sent', 'Code resent to your email');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  const openLegal = (url: string, title: string) => {
    router.push({
      pathname: '/legal-webview',
      params: { url, title },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {step === 'email' ? (
              <EmailStep
                email={email}
                onChangeEmail={setEmail}
                onContinue={handleEmailContinue}
                loading={loading}
                error={error}
                onErrorClear={() => setError('')}
              />
            ) : (
              <VerifyStep
                email={email}
                onEditEmail={() => {
                  setStep('email');
                  setError('');
                }}
                onVerify={handleVerify}
                onResend={handleResend}
                loading={loading}
                error={error}
                onErrorClear={() => setError('')}
              />
            )}

            <Text style={[styles.termsText, { color: colors.mutedText }]}>
              By continuing, you acknowledge that you understand and agree to the{' '}
              <Text
                style={[styles.link, { color: colors.mutedText }]}
                onPress={() =>
                  openLegal('https://neon.com/terms-of-service', 'Terms & Conditions')
                }>
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text
                style={[styles.link, { color: colors.mutedText }]}
                onPress={() => openLegal('https://neon.com/privacy-policy', 'Privacy Policy')}>
                Privacy Policy
              </Text>
              .
            </Text>

            <FooterLinks
              onTermsPress={() =>
                openLegal('https://neon.com/terms-of-service', 'Terms & Conditions')
              }
              onPrivacyPress={() => openLegal('https://neon.com/privacy-policy', 'Privacy Policy')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
