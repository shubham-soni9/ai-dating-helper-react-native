import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { GirlMessage, UserMessage, WizardMessage } from '../components/live-chat/ChatBubbles';
import ScoreModal from '../components/live-chat/ScoreModal';
import ChatInput from '../components/live-chat/ChatInput';
import ProcessingIndicator from '../components/live-chat/ProcessingIndicator';
import { SCENARIOS, LiveUsageScenario } from '../data/liveUsageScenarios';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Status = 'idle' | 'analyzing' | 'scored' | 'wizard_typing' | 'ready_to_proceed';

export default function LiveUsage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [showTooltip, setShowTooltip] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [scenario, setScenario] = useState<LiveUsageScenario>(SCENARIOS[0]);

  // Typewriter effect state
  const [wizardTexts, setWizardTexts] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load random scenario on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SCENARIOS.length);
    setScenario(SCENARIOS[randomIndex]);
  }, []);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [sentMessage, status, wizardTexts]);

  // Analysis Loop
  useEffect(() => {
    if (status === 'analyzing') {
      const steps = 3; // Matches ProcessingIndicator steps length
      let current = 0;
      const interval = setInterval(() => {
        current++;
        if (current >= steps) {
          clearInterval(interval);
          setStatus('scored');
        } else {
          setAnalysisStep(current);
        }
      }, 800); // Total ~2.4s
      return () => clearInterval(interval);
    }
  }, [status]);

  // Wizard Typing Effect
  useEffect(() => {
    if (status === 'wizard_typing') {
      let index = 0;
      const replies = scenario.wizardReplies;
      const maxLen = Math.max(...replies.map((r) => r.length));

      // Initialize with empty strings
      setWizardTexts(replies.map(() => ''));

      const interval = setInterval(() => {
        setWizardTexts((prev) => {
          // Just recalculate based on index to ensure consistency and avoid dependency issues
          return replies.map((reply) => reply.slice(0, index + 1));
        });

        index++;
        if (index >= maxLen) {
          clearInterval(interval);
          setStatus('ready_to_proceed');
        }
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }
  }, [status, scenario.wizardReplies]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSentMessage(inputText);
    setInputText('');
    setStatus('analyzing');
    setAnalysisStep(0);
    setShowTooltip(false);
  };

  const handleHelpMeOut = () => {
    setStatus('wizard_typing');
  };

  const handleProceed = () => {
    router.push('/onboarding-question');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="relative flex-1 px-4 pt-4">
          {/* Header */}
          <View className="mb-6 items-center">
            <Text className="text-lg font-bold text-white">Test Your Social Skills...</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Girl's Message */}
            <GirlMessage avatar={scenario.girlAvatar} message={scenario.girlMessage} />

            {/* User Sent Message */}
            {sentMessage && <UserMessage message={sentMessage} />}

            {/* Processing Indicator */}
            {status === 'analyzing' && <ProcessingIndicator step={analysisStep} />}

            {/* Wizard Reply */}
            {(status === 'wizard_typing' || status === 'ready_to_proceed') && (
              <View>
                {wizardTexts.map((text, index) => (
                  <WizardMessage
                    key={index}
                    text={text}
                    isTyping={
                      status === 'wizard_typing' &&
                      text.length < scenario.wizardReplies[index].length
                    }
                    title={`OPTION ${index + 1}`}
                    showAvatar={index === 0}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Score Dialog */}
          <ScoreModal
            visible={status === 'scored'}
            onHelp={handleHelpMeOut}
            score={scenario.rating.score}
            title={scenario.rating.title}
            description={scenario.rating.description}
          />

          {/* Input Area */}
          {status === 'idle' && (
            <ChatInput
              ref={inputRef}
              inputText={inputText}
              setInputText={setInputText}
              onSend={handleSend}
              showTooltip={showTooltip}
            />
          )}

          {/* Proceed Button */}
          {status === 'ready_to_proceed' && (
            <Animated.View entering={SlideInDown} className="absolute bottom-8 left-4 right-4">
              <TouchableOpacity
                onPress={handleProceed}
                className="items-center rounded-xl bg-emerald-500 py-4 shadow-lg shadow-emerald-900/20">
                <Text className="text-lg font-bold text-white">Let&apos;s Become Better</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
