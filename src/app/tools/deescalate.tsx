import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { DeescalatorParams, DeescalatorRequest, DeescalatorResult } from '@/types/deescalator';
import { API_GET_DEESCALATOR_HELP } from '@/constants/apiConstants';
import { processImageForApi } from '@/utils/imageHelper';
import MultiImagePickerSection, {
  PickedImage,
} from '@/components/dm-helper/MultiImagePickerSection';
import DeescalatorParameterSelector from '@/components/dm-helper/DeescalatorParameterSelector';
import ExtraNotesSection from '@/components/dm-helper/ExtraNotesSection';
import GenerateButton from '@/components/dm-helper/GenerateButton';
import ProgressOverlay from '@/components/dm-helper/ProgressOverlay';
import DeescalatorResultBottomSheet from '@/components/dm-helper/DeescalatorResultBottomSheet';

export default function DeescalateTool() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [images, setImages] = useState<PickedImage[]>([]);
  const [params, setParams] = useState<DeescalatorParams>({
    whatYouWant: 'sort_this_out',
    tone: 'soft',
  });
  const [extraNotes, setExtraNotes] = useState('');
  const [showExtraNotes, setShowExtraNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DeescalatorResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const buildPrompt = () => {
    const whatYouWantLabel = getWhatYouWantLabel(params.whatYouWant);
    const toneLabel = getToneLabel(params.tone);

    const parts = [`What I want: ${whatYouWantLabel}`, `Tone: ${toneLabel}`];

    if (extraNotes.trim()) {
      parts.push(`Additional Notes: ${extraNotes}`);
    }

    return parts.join('\n');
  };

  const getWhatYouWantLabel = (value: string): string => {
    const options = [
      { label: 'Sort this out', value: 'sort_this_out' },
      { label: 'End this conversation', value: 'end_conversation' },
      { label: 'Help me break up', value: 'help_breakup' },
      { label: 'Make them understand', value: 'make_understand' },
      { label: 'Calm the situation', value: 'calm_situation' },
      { label: 'Apologize effectively', value: 'apologize' },
      { label: 'Set boundaries', value: 'set_boundaries' },
      { label: 'Avoid conflict', value: 'avoid_conflict' },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getToneLabel = (value: string): string => {
    const options = [
      { label: 'Intense', value: 'intense' },
      { label: 'Soft', value: 'soft' },
      { label: 'Humble', value: 'humble' },
      { label: 'Extra Humble', value: 'extra_humble' },
      { label: 'Firm', value: 'firm' },
      { label: 'Gentle', value: 'gentle' },
      { label: 'Direct', value: 'direct' },
      { label: 'Empathetic', value: 'empathetic' },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      Alert.alert('Images Required', 'Please select at least one chat screenshot.');
      return;
    }

    setIsGenerating(true);

    try {
      const api = API_GET_DEESCALATOR_HELP;

      // Process and verify image encoding
      const processedImages = images.map((img) => processImageForApi(img.base64));

      const body: DeescalatorRequest = {
        prompt: buildPrompt(),
        images: processedImages,
      };

      let apiResult: DeescalatorResult;

      if (api) {
        const res = await fetch(api, {
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

        apiResult = (await res.json()) as DeescalatorResult;
      } else {
        // Simulate API delay for demo
        await new Promise((resolve) => setTimeout(resolve, 3000));
        apiResult = {
          situationAnalysis: 'The conversation has become tense with emotional escalation.',
          partnerEmotions: ['frustrated', 'defensive', 'misunderstood'],
          partnerNeeds: ['to feel heard', 'validation', 'clarification'],
          suggestions: [
            'Acknowledge their feelings without agreeing with accusations',
            'Use "I" statements to express your perspective',
            'Suggest taking a break and revisiting the conversation later',
          ],
          approach:
            'Use empathetic listening and calm, measured responses to de-escalate the tension.',
          nextSteps: [
            'Wait for their response before continuing',
            'Keep tone neutral and avoid defensive language',
            'Focus on finding common ground',
          ],
        };
      }

      console.log('API Result:', JSON.stringify(apiResult, null, 2));

      setResult(apiResult);
      setIsGenerating(false);
      setShowResult(true);
    } catch (error) {
      console.error('Generation Error:', error);
      setIsGenerating(false);
      Alert.alert('Error', 'Failed to generate de-escalation suggestions. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'De-escalator' }} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <MultiImagePickerSection images={images} onImagesChange={setImages} maxImages={3} />

        <DeescalatorParameterSelector params={params} onParamsChange={setParams} />

        <ExtraNotesSection
          visible={showExtraNotes}
          notes={extraNotes}
          onNotesChange={setExtraNotes}
          onToggle={() => setShowExtraNotes(!showExtraNotes)}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <GenerateButton onPress={handleGenerate} disabled={images.length === 0} />

      <ProgressOverlay visible={isGenerating} />

      <DeescalatorResultBottomSheet
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
  bottomSpacer: {
    height: 20,
  },
});
