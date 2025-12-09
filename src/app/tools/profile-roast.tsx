import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
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
      <Stack.Screen options={{ title: 'Profile Roast' }} />

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

          {/* Generate Button - Reusing existing component */}
          <View style={styles.generateButtonContainer}>
            <GenerateButton onPress={handleGenerate} disabled={!image?.base64 || isLoading} />
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay - Reusing existing component */}
      <ProgressOverlay visible={isLoading} />

      {/* Result Modal - Simple result display */}
      {showResult && result && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showResult}
          onRequestClose={() => setShowResult(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Profile Roast Results
                </Text>
                <TouchableOpacity onPress={() => setShowResult(false)}>
                  <Text style={[styles.closeButton, { color: colors.text }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={[styles.scoreText, { color: colors.primary }]}>
                  Profile Score: {result.profileScore}/100
                </Text>
                <Text style={[styles.headlineText, { color: colors.text }]}>
                  {result.roastHeadline}
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Strengths:</Text>
                {result.strengths.map((strength, index) => (
                  <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                    • {strength}
                  </Text>
                ))}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Weaknesses:</Text>
                {result.weaknesses.map((weakness, index) => (
                  <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                    • {weakness}
                  </Text>
                ))}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Fixes:</Text>
                {result.quickFixes.map((fix, index) => (
                  <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                    • {fix}
                  </Text>
                ))}

                {result.photoScores && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Photo Scores:</Text>
                    {result.photoScores.map((score, index) => (
                      <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                        Photo {index + 1}: {score}/100
                      </Text>
                    ))}
                  </>
                )}

                {result.bioScore && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Bio Score:</Text>
                    <Text style={[styles.listItem, { color: colors.text }]}>
                      {result.bioScore}/100
                    </Text>
                  </>
                )}

                <Text style={[styles.confidenceText, { color: colors.mutedText }]}>
                  Confidence: {Math.round(result.confidenceScore * 100)}%
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
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
  generateButtonContainer: {
    marginTop: 20,
    marginBottom: 100, // Space for fixed button
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  headlineText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  confidenceText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
