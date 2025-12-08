import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { DMParams, DMRequest, DMResult } from '@/types/dm';
import { API_GET_DM_BY_IMAGE } from '@/constants/apiConstants';
import { processImageForApi } from '@/utils/imageHelper';
import ImagePickerSection from '@/components/dm-helper/ImagePickerSection';
import ParameterSelector from '@/components/dm-helper/ParameterSelector';
import ExtraNotesSection from '@/components/dm-helper/ExtraNotesSection';
import GenerateButton from '@/components/dm-helper/GenerateButton';
import ProgressOverlay from '@/components/dm-helper/ProgressOverlay';
import ResultBottomSheet from '@/components/dm-helper/ResultBottomSheet';

type PickedImage = { uri: string; base64?: string | null };

const CATEGORIES = [
  { label: 'Casual', value: 'casual' },
  { label: 'Romantic', value: 'romantic' },
  { label: 'Professional', value: 'professional' },
  { label: 'Friendly', value: 'friendly' },
  { label: 'Playful', value: 'playful' },
];

const TONES = [
  { label: 'Warm', value: 'warm' },
  { label: 'Confident', value: 'confident' },
  { label: 'Thoughtful', value: 'thoughtful' },
  { label: 'Fun', value: 'fun' },
  { label: 'Direct', value: 'direct' },
];

const INTENTIONS = [
  { label: 'Start Conversation', value: 'start_conversation' },
  { label: 'Show Interest', value: 'show_interest' },
  { label: 'Ask Question', value: 'ask_question' },
  { label: 'Give Compliment', value: 'give_compliment' },
  { label: 'Make Plans', value: 'make_plans' },
];

export default function DMHelper() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [image, setImage] = useState<PickedImage | null>(null);
  const [params, setParams] = useState<DMParams>({
    category: 'casual',
    tone: 'warm',
    intention: 'start_conversation',
  });
  const [extraNotes, setExtraNotes] = useState('');
  const [showExtraNotes, setShowExtraNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DMResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const buildPrompt = () => {
    const selectedCat = CATEGORIES.find((c) => c.value === params.category);
    const selectedTone = TONES.find((t) => t.value === params.tone);
    const selectedInt = INTENTIONS.find((i) => i.value === params.intention);

    const parts = [
      `Category: ${selectedCat?.label || params.category}`,
      `Tone: ${selectedTone?.label || params.tone}`,
      `Intention: ${selectedInt?.label || params.intention}`,
    ];

    if (extraNotes.trim()) {
      parts.push(`Additional Notes: ${extraNotes}`);
    }

    return parts.join('\n');
  };

  const handleGenerate = async () => {
    if (!image || !image.base64) {
      Alert.alert('Image Required', 'Please select an image first.');
      return;
    }

    setIsGenerating(true);

    try {
      const api = API_GET_DM_BY_IMAGE;

      // Process and verify image encoding
      const processedImage = processImageForApi(image.base64);

      const body: DMRequest = {
        prompt: buildPrompt(),
        image: processedImage,
      };

      let apiResult: DMResult;

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

        apiResult = (await res.json()) as DMResult;
      } else {
        // Simulate API delay for demo
        await new Promise((resolve) => setTimeout(resolve, 3000));
        apiResult = {
          dmSuggestions: [
            'Hey, loved your recent post—what inspired it?',
            "Your vibe is great. What's story behind that photo?",
            'That looks amazing! Where did you take this?',
          ],
          hints: [
            'Keep it specific to show you actually looked at their content',
            'Invite a reply without pressure',
            'Be genuine and show your personality',
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
      Alert.alert('Error', 'Failed to generate suggestions. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'DM Helper' }} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <ImagePickerSection image={image} onImagePicked={setImage} />

        <ParameterSelector
          params={params}
          onParamsChange={setParams}
          categories={CATEGORIES}
          tones={TONES}
          intentions={INTENTIONS}
        />

        <ExtraNotesSection
          visible={showExtraNotes}
          notes={extraNotes}
          onNotesChange={setExtraNotes}
          onToggle={() => setShowExtraNotes(!showExtraNotes)}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <GenerateButton onPress={handleGenerate} disabled={!image} />

      <ProgressOverlay visible={isGenerating} />

      <ResultBottomSheet
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
