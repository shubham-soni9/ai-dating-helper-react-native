import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { SUPPORT_EMAIL } from '@/constants/commonConstants';

export default function PrivacySecurity() {
  const { colors } = useTheme();

  const handleDeletionRequest = () => {
    const subject = 'Account Deletion Request';
    const body = `Please delete my account and all associated data.\n\nDevice: ${Platform.OS} ${Platform.Version}\n`;
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Email App Not Found', 'Please configure an email app to send the request.');
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      \n <Stack.Screen options={{ headerShown: true, title: 'Privacy & Security' }} />
      <View style={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>Your Privacy</Text>
        <Text style={[styles.paragraph, { color: colors.mutedText }]}>
          We follow GDPR best practices. Your data is processed to provide AI guidance and is not
          sold to third parties. You can request deletion of your account at any time.
        </Text>
        <Text style={[styles.subheading, { color: colors.text }]}>Data Storage</Text>
        <Text style={[styles.paragraph, { color: colors.mutedText }]}>
          Authentication is handled by Supabase. Operational content may be processed temporarily to
          generate results, then discarded. We minimize retention.
        </Text>

        <TouchableOpacity
          onPress={handleDeletionRequest}
          style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>Request Account Deletion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subheading: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  paragraph: { fontSize: 14, lineHeight: 20 },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
