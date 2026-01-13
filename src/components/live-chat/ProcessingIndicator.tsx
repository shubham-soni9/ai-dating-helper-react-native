import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type ProcessingIndicatorProps = {
  step: number;
};

const STEPS = ['Analyzing tone...', 'Checking clarity...', 'Generating suggestions...'];

export default function ProcessingIndicator({ step }: ProcessingIndicatorProps) {
  return (
    <Animated.View entering={FadeIn} className="items-center justify-center py-8">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="mt-4 text-sm text-gray-400">{STEPS[step]}</Text>
    </Animated.View>
  );
}
