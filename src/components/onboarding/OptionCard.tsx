import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolateColor,
  Layout,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface OptionCardProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  helpText?: string;
  callout?: string;
}

export const OptionCard = ({ label, isSelected, onPress, helpText, callout }: OptionCardProps) => {
  // Animation for selection
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      layout={Layout.springify()}
      className="mb-4 overflow-hidden rounded-2xl"
      activeOpacity={0.9}>
      {isSelected ? (
        <LinearGradient
          colors={['#FF006B', '#FF4D00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-[1px]">
          <View className="rounded-2xl bg-[#1E1E1E] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="mr-2 flex-1 text-lg font-semibold text-white">{label}</Text>
              <View className="rounded-full bg-white p-1">
                <Ionicons name="checkmark" size={16} color="#FF006B" />
              </View>
            </View>

            {helpText && (
              <Animated.View entering={FadeInDown} className="mt-3 rounded-xl bg-white p-3">
                <Text className="text-sm font-medium text-black">{helpText}</Text>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      ) : (
        <View className="rounded-2xl border border-gray-800 bg-[#1E1E1E] p-4">
          <View className="flex-row items-center justify-between">
            <Text className="mr-2 flex-1 text-lg font-medium text-gray-300">{label}</Text>
            <View className="ml-1 h-6 w-6 rounded-full border-2 border-gray-600" />
          </View>

          {callout && (
            <View className="mt-3 rounded-lg border border-[#333] bg-[#2A2A2A] p-2">
              <Text className="text-xs italic text-gray-400">{callout}</Text>
            </View>
          )}
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
};
