import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function Notifications() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      \n <Stack.Screen options={{ headerShown: true, title: 'Notifications' }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Coming Soon</Text>
        <Text style={{ color: colors.mutedText }}>
          Notification preferences will be available in a future update.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
