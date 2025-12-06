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

export default function ScoreModal({
  visible,
  onHelp,
  score,
  title,
  description,
}: ScoreModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/80 px-4">
        <Animated.View
          entering={FadeInDown.springify()}
          className="w-full items-center rounded-2xl border border-gray-700 bg-gray-800 p-6">
          <Text className="mb-2 text-center text-xl font-bold text-white">{title}</Text>
          <Text className="my-4 text-6xl font-bold text-white">{score}</Text>
          <Text className="mb-8 text-center text-gray-400">{description}</Text>

          <TouchableOpacity
            onPress={onHelp}
            className="w-full items-center rounded-xl bg-emerald-500 py-4">
            <Text className="text-lg font-bold text-white">Help me out 😉</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
