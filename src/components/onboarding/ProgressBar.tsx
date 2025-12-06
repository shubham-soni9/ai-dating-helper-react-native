import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export const ProgressBar = ({ totalSteps, currentStep }: ProgressBarProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(currentStep / totalSteps, { duration: 500 });
  }, [currentStep, totalSteps]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-800">
      <Animated.View style={[animatedStyle, { height: '100%' }]}>
        <LinearGradient
          colors={['#FF006B', '#FF4D00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};
