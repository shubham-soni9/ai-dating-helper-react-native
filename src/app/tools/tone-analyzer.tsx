import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { ToneAnalysisParams, ToneAnalysisRequest, ToneAnalysisResult } from '@/types/tone-analyzer';
import { API_TONE_ANALYZER } from '@/constants/apiConstants';
import { processImageForApi } from '@/utils/imageHelper';
import MultiImagePickerSection from '@/components/dm-helper/MultiImagePickerSection';
import Dropdown from '@/components/dm-helper/Dropdown';
import ExtraNotesSection from '@/components/dm-helper/ExtraNotesSection';
import GenerateButton from '@/components/dm-helper/GenerateButton';
import ProgressOverlay from '@/components/dm-helper/ProgressOverlay';
import ToneAnalyzerResultBottomSheet from '@/components/tone-analyzer/ToneAnalyzerResultBottomSheet';

export type PickedImage = { uri: string; base64?: string | null };

const ANALYSIS_INTENTS = [
  { label: 'Analyze emotional tone', value: 'emotional_tone' },
  { label: 'Detect aggression level', value: 'aggression_level' },
  { label: 'Identify manipulation', value: 'manipulation' },
  { label: 'Measure politeness & respect', value: 'politeness_respect' },
  { label: 'Evaluate maturity of conversation', value: 'maturity' },
];

const PERSPECTIVES = [
  { label: 'My tone', value: 'my_tone' },
  { label: "Other person's tone", value: 'other_tone' },
  { label: 'Both sides', value: 'both_sides' },
];

export default function ToneAnalyzer() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [images, setImages] = useState<PickedImage[]>([]);
  const [params, setParams] = useState<ToneAnalysisParams>({
    analysisIntent: 'emotional_tone',
    perspective: 'both_sides',
  });
  const [extraNotes, setExtraNotes] = useState('');
  const [showExtraNotes, setShowExtraNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ToneAnalysisResult | null>(null);
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

      const body: ToneAnalysisRequest = {
        prompt: buildPrompt(),
        images: processedImages,
        analysisIntent: params.analysisIntent,
        perspective: params.perspective,
      };

      let apiResult: ToneAnalysisResult;

      if (API_TONE_ANALYZER) {
        const res = await fetch(API_TONE_ANALYZER, {
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

        apiResult = (await res.json()) as ToneAnalysisResult;
      } else {
        // Simulate API delay for demo
        await new Promise((resolve) => setTimeout(resolve, 3000));
        apiResult = {
          overallTone: 'Supportive',
          userTone: 'Warm and encouraging',
          otherPersonTone: 'Appreciative and engaged',
          toxicityLevel: 'None',
          emotionalSignals: ['Affection', 'Gratitude', 'Comfort', 'Trust'],
          conversationHealth: 'Healthy',
          confidenceScore: 0.92,
          toolType: 'tone-analyzer',
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
      Alert.alert('Error', 'Failed to analyze tone. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'Tone Analyzer' }} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <MultiImagePickerSection images={images} onImagesChange={setImages} maxImages={3} />

        <View style={styles.dropdownContainer}>
          <Dropdown
            value={params.analysisIntent}
            options={ANALYSIS_INTENTS}
            onChange={(value) => setParams({ ...params, analysisIntent: value })}
            placeholder="What you want to analyze"
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Dropdown
            value={params.perspective}
            options={PERSPECTIVES}
            onChange={(value) => setParams({ ...params, perspective: value })}
            placeholder="Perspective"
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

      <GenerateButton onPress={handleGenerate} disabled={images.length === 0} />

      <ProgressOverlay visible={isGenerating} />

      <ToneAnalyzerResultBottomSheet
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
