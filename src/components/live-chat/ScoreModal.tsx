import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type ScoreModalProps = {
  visible: boolean;
  onHelp: () => void;
  score: string;
  title: string;
  description: string;
};

export default function ScoreModal({ visible, onHelp, score, title, description }: ScoreModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/80 items-center justify-center px-4">
        <Animated.View
          entering={FadeInDown.springify()}
          className="bg-gray-800 w-full rounded-2xl p-6 border border-gray-700 items-center">
          <Text className="text-white font-bold text-xl mb-2 text-center">{title}</Text>
          <Text className="text-white text-6xl font-bold my-4">{score}</Text>
          <Text className="text-gray-400 text-center mb-8">
            {description}
          </Text>

          <TouchableOpacity
            onPress={onHelp}
            className="bg-emerald-500 w-full py-4 rounded-xl items-center">
            <Text className="text-white font-bold text-lg">Help me out 😉</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
