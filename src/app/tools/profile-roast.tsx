import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { ProfileRoastParams, ProfileRoastRequest, ProfileRoastResult } from '@/types/profile-roast';
import { API_PROFILE_ROAST } from '@/constants/apiConstants';
import { processImageForApi } from '@/utils/imageHelper';
import ImagePickerSection from '@/components/dm-helper/ImagePickerSection';
import Dropdown from '@/components/dm-helper/Dropdown';
import ExtraNotesSection from '@/components/dm-helper/ExtraNotesSection';
import GenerateButton from '@/components/dm-helper/GenerateButton';
import ProgressOverlay from '@/components/dm-helper/ProgressOverlay';
import ProfileRoastResultBottomSheet from '@/components/dm-helper/ProfileRoastResultBottomSheet';

type PickedImage = { uri: string; base64?: string | null };

const ROAST_INTENTS = [
  { label: 'Brutal but helpful', value: 'brutal_but_helpful' },
  { label: 'Gentle & encouraging', value: 'gentle_encouraging' },
  { label: 'Gen-Z humor', value: 'gen_z_humor' },
  { label: 'Executive summary', value: 'executive_summary' },
];

const FOCUS_AREAS = [
  { label: 'All', value: 'all' },
  { label: 'Photos only', value: 'photos_only' },
  { label: 'Bio / prompts only', value: 'bio_only' },
  { label: 'First photo + first prompt', value: 'first_photo_prompt' },
];

export default function ProfileRoast() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [image, setImage] = useState<PickedImage | null>(null);
  const [params, setParams] = useState<ProfileRoastParams>({
    roastIntent: 'brutal_but_helpful',
    focusArea: 'all',
  });
  const [extraNotes, setExtraNotes] = useState('');
  const [showExtraNotes, setShowExtraNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProfileRoastResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleImagePicked = (pickedImage: PickedImage) => {
    setImage(pickedImage);
  };

  const handleGenerate = async () => {
    if (!image?.base64) {
      Alert.alert('Error', 'Please select a profile screenshot first.');
      return;
    }

    if (!session?.accessToken) {
      Alert.alert('Error', 'Please sign in to use this feature.');
      return;
    }

    setIsLoading(true);

    try {
      // Process and verify image encoding
      const processedImage = processImageForApi(image.base64);

      const requestBody: ProfileRoastRequest = {
        prompt: extraNotes || 'Analyze this dating profile and provide feedback.',
        images: [processedImage],
        roastIntent: params.roastIntent,
        focusArea: params.focusArea,
      };

      const response = await fetch(API_PROFILE_ROAST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Profile roast response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze profile');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setShowResult(true);
    } catch (error) {
      console.error('Profile roast error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to analyze profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'Profile Roast' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Image Upload - Reusing DM Helper's single image picker */}
          <ImagePickerSection image={image} onImagePicked={handleImagePicked} />

          {/* Roast Intent - Reusing Dropdown component */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Roast Style</Text>
            <Dropdown
              value={params.roastIntent}
              options={ROAST_INTENTS}
              onChange={(value) => setParams((prev) => ({ ...prev, roastIntent: value }))}
              placeholder="Select roast style"
            />
          </View>

          {/* Focus Area - Reusing Dropdown component */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Focus On</Text>
            <Dropdown
              value={params.focusArea}
              options={FOCUS_AREAS}
              onChange={(value) => setParams((prev) => ({ ...prev, focusArea: value }))}
              placeholder="Select focus area"
            />
          </View>

          {/* Extra Notes - Reusing existing component */}
          <ExtraNotesSection
            visible={showExtraNotes}
            notes={extraNotes}
            onNotesChange={setExtraNotes}
            onToggle={() => setShowExtraNotes(!showExtraNotes)}
          />

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Generate Button - Fixed at bottom outside scroll */}
      <GenerateButton onPress={handleGenerate} disabled={!image?.base64 || isLoading} />

      {/* Loading Overlay - Reusing existing component */}
      <ProgressOverlay visible={isLoading} />

      {/* Result Bottom Sheet */}
      <ProfileRoastResultBottomSheet
        visible={showResult}
        result={result}
        onClose={() => setShowResult(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Space for fixed button
  },
  content: {
    gap: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  bottomSpacer: {
    height: 20,
  },
});
