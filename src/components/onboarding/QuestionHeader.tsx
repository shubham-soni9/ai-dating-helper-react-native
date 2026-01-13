import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface QuestionHeaderProps {
  step: number;
  question: string;
  description?: string;
}

export const QuestionHeader = ({ step, question, description }: QuestionHeaderProps) => {
  return (
    <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-6">
      <Text className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400">
        Question {step}
      </Text>
      <Text className="text-2xl font-bold leading-tight text-white">{question}</Text>
      {description && <Text className="mt-2 text-base text-gray-400">{description}</Text>}
    </Animated.View>
  );
};
