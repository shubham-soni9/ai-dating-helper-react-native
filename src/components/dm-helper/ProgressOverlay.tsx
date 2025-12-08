import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ProgressOverlayProps {
  visible: boolean;
}

const PROGRESS_STEPS = [
  { label: 'Analyzing screenshot...', duration: 6000 },
  { label: 'Understanding context...', duration: 8000 },
  { label: 'Crafting personalized messages...', duration: 10000 },
  { label: 'Refining suggestions...', duration: 8000 },
  { label: 'Finalizing results...', duration: 8000 },
];

export default function ProgressOverlay({ visible }: ProgressOverlayProps) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      progress.setValue(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let currentStepIndex = 0;
    let startTime = Date.now();

    const updateStep = () => {
      if (currentStepIndex < PROGRESS_STEPS.length) {
        setCurrentStep(currentStepIndex);
        
        const stepDuration = PROGRESS_STEPS[currentStepIndex].duration;
        const targetProgress = ((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100;

        Animated.timing(progress, {
          toValue: targetProgress,
          duration: stepDuration,
          useNativeDriver: false,
        }).start();

        currentStepIndex++;
        timeoutId = setTimeout(updateStep, stepDuration);
      }
    };

    updateStep();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🤖</Text>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Working on it...
          </Text>
          
          <Text style={[styles.stepText, { color: colors.mutedText }]}>
            {PROGRESS_