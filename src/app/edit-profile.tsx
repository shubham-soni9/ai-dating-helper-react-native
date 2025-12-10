import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';

export default function EditProfile() {
  const { colors } = useTheme();
  const { profile, updateDisplayName } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(profile?.name ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length > 50) {
      Alert.alert('Too Long', 'Display name must be 50 characters or less.');
      return;
    }
    setSaving(true);
    try {
      await updateDisplayName(trimmed);
      Alert.alert('Updated', 'Your display name has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: true, title: 'Edit Profile' }} />

      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Display Name</Text>
        <TextInput
          value={name}
          onChangeText={(t) => setName(t.slice(0, 50))}
          placeholder="Enter your name"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
          ]}
        />

        <Text style={[styles.label, { color: colors.mutedText, marginTop: 16 }]}>Email</Text>
        <TextInput
          value={profile?.email || ''}
          editable={false}
          style={[
            styles.input,
            {
              borderColor: colors.border,
              color: colors.mutedText,
              backgroundColor: colors.surface,
            },
          ]}
        />

        <Button mode="contained" onPress={handleSave} loading={saving} style={styles.saveButton}>
          Update Profile
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: { marginTop: 24 },
});
