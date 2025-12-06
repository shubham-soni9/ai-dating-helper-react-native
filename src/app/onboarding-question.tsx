import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ProgressBar } from '../components/onboarding/ProgressBar';
import { QuestionHeader } from '../components/onboarding/QuestionHeader';
import { OptionCard } from '../components/onboarding/OptionCard';
import { ActionButtons } from '../components/onboarding/ActionButtons';
import { SkipConfirmationModal } from '../components/onboarding/SkipConfirmationModal';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/auth/AuthProvider';

// Types
interface QuestionOption {
  id: string;
  label: string;
  helpText?: string;
  callout?: string;
}

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  description?: string;
}

// Data
const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What challenges do you face in dating conversations?',
    type: 'multiple',
    options: [
      {
        id: 'opt1',
        label: 'I struggle to start conversations naturally',
        helpText: 'We have great icebreakers for this!',
      },
      {
        id: 'opt2',
        label: "I don't know how to keep conversations interesting",
        helpText: 'Our AI suggests engaging topics.',
      },
      {
        id: 'opt3',
        label: 'I panic when someone seems upset with me',
        helpText: 'We help you interpret tone correctly.',
      },
    ],
  },
  {
    id: 'q2',
    text: 'How confident are you in your messaging skills?',
    type: 'single',
    options: [
      {
        id: 'opt1',
        label: 'Very confident - I just need occasional help',
      },
      {
        id: 'opt2',
        label: 'Somewhat confident but often overthink messages',
        callout: 'Let AI help you craft perfect responses without the stress!',
        helpText: 'Let AI help you craft perfect responses without the stress!',
      },
      {
        id: 'opt3',
        label: 'Not confident - I need guidance with most messages',
      },
    ],
  },
  {
    id: 'q3',
    text: 'What would help you most in dating?',
    type: 'multiple',
    options: [
      {
        id: 'opt1',
        label: 'Real-time conversation suggestions',
        helpText: 'Get instant replies for any message.',
      },
      {
        id: 'opt2',
        label: 'Help handling difficult situations',
        helpText: 'Navigate awkward moments with grace.',
      },
      {
        id: 'opt3',
        label: 'Tips to show my personality better',
        helpText: 'Stand out with authentic responses.',
      },
    ],
  },
];

export default function OnboardingQuestionScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [language, setLanguage] = useState('EN');
  const { session, subscription, initialized } = useAuth();

  const currentQuestion = QUESTIONS[currentStep];
  const currentSelections = selections[currentQuestion.id] || [];

  const handleOptionSelect = (optionId: string) => {
    setSelections((prev) => {
      const current = prev[currentQuestion.id] || [];

      if (currentQuestion.type === 'single') {
        // If single select, replace selection
        // If tapping same option, could deselect, but usually single select keeps one active.
        // Let's assume tapping same one keeps it selected or toggles.
        // Standard behavior for radio button is keep selected.
        // But let's allow toggle off if user wants? No, usually single select enforces one.
        return { ...prev, [currentQuestion.id]: [optionId] };
      } else {
        // Multiple select
        if (current.includes(optionId)) {
          return { ...prev, [currentQuestion.id]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [currentQuestion.id]: [...current, optionId] };
        }
      }
    });
  };

  const handleContinue = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finish onboarding
      console.log('Onboarding finished:', selections);
      // Here set onboardingSeen to true
      await SecureStore.setItemAsync('onboarding_seen', 'true');
      // If Session Does not exist, move this to create-user
      if (!session) {
        router.replace('/create-user');
      } else if (!subscription.isSubscribed) {
        router.replace('/payments'); // Or navigate to result screen
      } else {
        router.replace('/dashboard'); // Or navigate to result screen
      }
    }
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    router.replace('/payments'); // Navigate to payments
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <View className="flex-1 px-6">
        {/* Top Bar */}
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-[#1E1E1E]"
            onPress={() => console.log('Play audio')}>
            <Ionicons name="volume-high-outline" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center rounded-full bg-[#1E1E1E] px-3 py-2"
            onPress={() => setLanguage((prev) => (prev === 'EN' ? 'ES' : 'EN'))}>
            <Ionicons name="globe-outline" size={16} color="#9CA3AF" />
            <Text className="ml-2 font-medium text-gray-400">{language}</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <ProgressBar totalSteps={QUESTIONS.length} currentStep={currentStep + 1} />

        <FlatList
          data={currentQuestion.options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OptionCard
              label={item.label}
              isSelected={currentSelections.includes(item.id)}
              onPress={() => handleOptionSelect(item.id)}
              helpText={item.helpText}
              callout={item.callout}
            />
          )}
          ListHeaderComponent={
            <View className="mb-4">
              <QuestionHeader step={currentStep + 1} question={currentQuestion.text} />
            </View>
          }
          className="mt-8 flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <ActionButtons
          onContinue={handleContinue}
          onSkip={handleSkip}
          canContinue={currentSelections.length > 0}
          isLastStep={currentStep === QUESTIONS.length - 1}
        />
      </View>

      <SkipConfirmationModal
        visible={showSkipModal}
        onConfirmSkip={confirmSkip}
        onCancel={() => setShowSkipModal(false)}
      />
    </SafeAreaView>
  );
}
