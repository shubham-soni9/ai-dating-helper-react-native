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
  <View className="mb-6 flex-row items-end">
    <View className="mr-2 h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-purple-500">
      <Image source={{ uri: avatar }} style={{ width: 32, height: 32 }} />
    </View>
    <View className="max-w-[80%] rounded-2xl rounded-bl-none bg-gray-800 px-4 py-3">
      <Text className="text-base text-white">{message}</Text>
    </View>
  </View>
);

type UserMessageProps = {
  message: string;
};

export const UserMessage = ({ message }: UserMessageProps) => (
  <Animated.View entering={FadeInDown} className="mb-6 flex-row items-end justify-end">
    <View className="max-w-[80%] rounded-2xl rounded-br-none bg-blue-600 px-4 py-3">
      <Text className="text-base text-white">{message}</Text>
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
  <View className="mb-6 flex-row items-end">
    <View className="mr-2 h-8 w-8 items-center justify-center">
      {showAvatar && (
        <View className="h-full w-full items-center justify-center overflow-hidden rounded-full bg-emerald-600">
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
