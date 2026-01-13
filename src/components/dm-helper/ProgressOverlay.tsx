import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ProgressOverlayProps {
  visible: boolean;
}

const PROGRESS_STEPS = [
  { label: 'Analyzing screenshot...', duration: 2000 },
  { label: 'Understanding context...', duration: 2500 },
  { label: 'Crafting personalized messages...', duration: 3000 },
  { label: 'Refining suggestions...', duration: 2000 },
  { label: 'Finalizing results...', duration: 1500 },
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

    const updateStep = () => {
      if (currentStepIndex < PROGRESS_STEPS.length) {
        setCurrentStep(currentStepIndex);

        const stepDuration = PROGRESS_STEPS[currentStepIndex].duration;
        const targetProgress = ((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100;

        Animated.timing(progress, {
          toValue: targetProgress,
          duration: stepDuration,
          useNativeDriver: false,
          easing: Easing.linear,
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

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <Text style={styles.icon}>🤖</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Working on it...</Text>

          <Text style={[styles.stepText, { color: colors.mutedText }]}>
            {PROGRESS_STEPS[currentStep]?.label || 'Processing...'}
          </Text>

          <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.primary,
                  width: widthInterpolation,
                },
              ]}
            />
          </View>

          <View style={styles.stepsList}>
            {PROGRESS_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <View key={index} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor: isCompleted
                          ? colors.primary
                          : isActive
                            ? colors.primary
                            : colors.border,
                        opacity: isActive || isCompleted ? 1 : 0.3,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  stepText: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    minHeight: 24,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  stepsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
