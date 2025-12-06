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
      <Text className="text-gray-400 font-medium text-sm mb-2 uppercase tracking-wider">
        Question {step}
      </Text>
      <Text className="text-white text-2xl font-bold leading-tight">
        {question}
      </Text>
      {description && (
        <Text className="text-gray-400 text-base mt-2">
          {description}
        </Text>
      )}
    </Animated.View>
  );
};
