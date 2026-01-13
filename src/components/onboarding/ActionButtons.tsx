import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionButtonsProps {
  onContinue: () => void;
  onSkip: () => void;
  canContinue: boolean;
  isLastStep?: boolean;
}

export const ActionButtons = ({
  onContinue,
  onSkip,
  canContinue,
  isLastStep,
}: ActionButtonsProps) => {
  return (
    <View className="mb-6 mt-auto">
      <TouchableOpacity
        onPress={canContinue ? onContinue : undefined}
        activeOpacity={canContinue ? 0.8 : 1}
        className="w-full"
        disabled={!canContinue}>
        <LinearGradient
          colors={canContinue ? ['#FF006B', '#FF4D00'] : ['#1F2937', '#1F2937']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientButton, canContinue && styles.gradientButtonActive]}>
          <Text className={`text-lg font-bold ${canContinue ? 'text-white' : 'text-gray-500'}`}>
            {isLastStep ? 'Finish' : 'Continue'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSkip} className="mt-4 items-center py-2">
        <Text className="font-medium text-[#FF006B] opacity-60">Skip Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 16,
  },
  gradientButtonActive: {
    shadowColor: '#FF006B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
