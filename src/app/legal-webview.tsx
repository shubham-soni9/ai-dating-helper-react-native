import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authColors } from '../theme/authColors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalWebView() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={authColors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{title || 'Legal'}</Text>
        <View style={styles.placeholder} />
      </View>

      {url ? (
        <WebView
          source={{ uri: url }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={authColors.button} />
            </View>
          )}
          style={styles.webview}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No URL provided</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: authColors.inputBorder,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    color: authColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  webview: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: authColors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: authColors.secondaryText,
  },
});
