import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type GirlMessageProps = {
  avatar: string;
  message: string;
};

export const GirlMessage = ({ avatar, message }: GirlMessageProps) => (
  <View className="flex-row items-end mb-6">
    <View className="w-8 h-8 rounded-full bg-purple-500 items-center justify-center mr-2 overflow-hidden">
      <Image source={{ uri: avatar }} style={{ width: 32, height: 32 }} />
    </View>
    <View className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%]">
      <Text className="text-white text-base">{message}</Text>
    </View>
  </View>
);

type UserMessageProps = {
  message: string;
};

export const UserMessage = ({ message }: UserMessageProps) => (
  <Animated.View entering={FadeInDown} className="flex-row justify-end items-end mb-6">
    <View className="bg-blue-600 rounded-2xl rounded-br-none px-4 py-3 max-w-[80%]">
      <Text className="text-white text-base">{message}</Text>
    </View>
  </Animated.View>
);

type WizardMessageProps = {
  text: string;
  isTyping: boolean;
  title?: string;
  showAvatar?: boolean;
};

export const WizardMessage = ({
  text,
  isTyping,
  title = 'WIZARD SUGGESTION',
  showAvatar = true,
}: WizardMessageProps) => (
  <View className="flex-row items-end mb-6">
    <View className="mr-2 h-8 w-8 items-center justify-center">
      {showAvatar && (
        <View className="h-full w-full items-center justify-center rounded-full bg-emerald-600 overflow-hidden">
          <Ionicons name="flash" size={18} color="white" />
        </View>
      )}
    </View>
    <View className="max-w-[80%] rounded-2xl rounded-bl-none border border-emerald-500/50 bg-gray-800 px-4 py-3">
      <Text className="mb-1 text-xs font-bold text-emerald-400">{title}</Text>
      <Text className="text-base text-white">
        {text}
        {isTyping && <Text className="text-emerald-500">|</Text>}
      </Text>
    </View>
  </View>
);
