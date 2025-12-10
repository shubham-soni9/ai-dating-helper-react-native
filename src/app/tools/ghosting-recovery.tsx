import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import {
  GhostingRecoveryParams,
  GhostingRecoveryRequest,
  GhostingRecoveryResult,
} from '@/types/ghosting-recovery';
import { API_GHOSTING_RECOVERY } from '@/constants/apiConstants';
import { processImageForApi } from '@/utils/imageHelper';
import MultiImagePickerSection from '@/components/dm-helper/MultiImagePickerSection';
import Dropdown from '@/components/dm-helper/Dropdown';
import ExtraNotesSection from '@/components/dm-helper/ExtraNotesSection';
import GenerateButton from '@/components/dm-helper/GenerateButton';
import ProgressOverlay from '@/components/dm-helper/ProgressOverlay';
import GhostingRecoveryResultBottomSheet from '@/components/ghosting-recovery/GhostingRecoveryResultBottomSheet';

export type PickedImage = { uri: string; base64?: string | null };

const ANALYSIS_INTENTS = [
  { label: "Detect if I'm being ghosted", value: 'detect_ghosting' },
  { label: 'Get a recovery message suggestion', value: 'recovery_message' },
  { label: 'Know when to move on', value: 'move_on_advice' },
];

const PERSPECTIVES = [
  { label: 'The other person', value: 'other_person' },
  { label: 'Me (I went quiet)', value: 'me_quiet' },
  { label: 'Mutual fade', value: 'mutual_fade' },
];

export default function GhostingRecovery() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [images, setImages] = useState<PickedImage[]>([]);
  const [params, setParams] = useState<GhostingRecoveryParams>({
    analysisIntent: 'detect_ghosting',
    perspective: 'other_person',
  });
  const [extraNotes, setExtraNotes] = useState('');
  const [showExtraNotes, setShowExtraNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GhostingRecoveryResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const buildPrompt = () => {
    const selectedIntent = ANALYSIS_INTENTS.find((i) => i.value === params.analysisIntent);
    const selectedPerspective = PERSPECTIVES.find((p) => p.value === params.perspective);

    const parts = [
      `Analysis Intent: ${selectedIntent?.label || params.analysisIntent}`,
      `Perspective: ${selectedPerspective?.label || params.perspective}`,
    ];

    if (extraNotes.trim()) {
      parts.push(`Additional Context: ${extraNotes}`);
    }

    return parts.join('\n');
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      Alert.alert('Images Required', 'Please select at least one chat screenshot.');
      return;
    }

    // Validate all images have base64 data
    const validImages = images.filter((img) => img.base64);
    if (validImages.length === 0) {
      Alert.alert('Image Error', 'Please select valid images.');
      return;
    }

    setIsGenerating(true);

    try {
      // Process all images for API
      const processedImages = validImages.map((img) => processImageForApi(img.base64));

      const body: GhostingRecoveryRequest = {
        prompt: buildPrompt(),
        images: processedImages,
        analysisIntent: params.analysisIntent,
        perspective: params.perspective,
      };

      let apiResult: GhostingRecoveryResult;

      if (API_GHOSTING_RECOVERY) {
        const res = await fetch(API_GHOSTING_RECOVERY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : '',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error('API request failed');
        }

        apiResult = (await res.json()) as GhostingRecoveryResult;
      } else {
        // Simulate API delay for demo
        await new Promise((resolve) => setTimeout(resolve, 3000));
        apiResult = {
          isGhosted: true,
          ghostingStage: 'Soft Ghost',
          ghostingProbability: 0.87,
          recommendedMessage: [
            'Hey! I know life gets busy—no pressure at all. Just wanted to say I enjoyed our chats and would love to continue when you have space 😊',
            "Thought I'd check in - hope everything's going well on your end! No rush to respond, just wanted you to know I was thinking of you.",
            "Hey there! Life can get crazy sometimes. If you're up for continuing our conversation when things settle down, I'd love that.",
            "No worries if you're busy - just wanted to say I appreciated our connection and would be happy to chat again whenever you're free.",
          ],
          recommendedTone: 'light, no guilt, single emoji',
          recoveryChance: 0.62,
          moveOnAdvice: null,
          confidenceScore: 0.93,
          toolType: 'ghosting-recovery',
        };
      }

      console.log('API Result:', JSON.stringify(apiResult, null, 2));

      // Check for error in response
      if (apiResult.error) {
        setIsGenerating(false);
        Alert.alert('Analysis Error', apiResult.error);
        return;
      }

      setResult(apiResult);
      setIsGenerating(false);
      setShowResult(true);
    } catch (error) {
      console.error('Generation Error:', error);
      setIsGenerating(false);
      Alert.alert('Error', 'Failed to analyze ghosting. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{ headerShown: true, title: 'Ghosting Recovery', headerBackTitle: 'Ghosting Recovery' }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
        <MultiImagePickerSection images={images} onImagesChange={setImages} maxImages={3} />

        <View style={styles.dropdownContainer}>
          <Dropdown
            value={params.analysisIntent}
            options={ANALYSIS_INTENTS}
            onChange={(value) => setParams({ ...params, analysisIntent: value })}
            placeholder="What do you want?"
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Dropdown
            value={params.perspective}
            options={PERSPECTIVES}
            onChange={(value) => setParams({ ...params, perspective: value })}
            placeholder="Who stopped replying?"
          />
        </View>

        <ExtraNotesSection
          visible={showExtraNotes}
          notes={extraNotes}
          onNotesChange={setExtraNotes}
          onToggle={() => setShowExtraNotes(!showExtraNotes)}
        />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <GenerateButton onPress={handleGenerate} disabled={images.length === 0} />

      <ProgressOverlay visible={isGenerating} />

      <GhostingRecoveryResultBottomSheet
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});
