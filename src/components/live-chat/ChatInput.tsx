import React, { forwardRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type ChatInputProps = {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  showTooltip: boolean;
};

const ChatInput = forwardRef<TextInput, ChatInputProps>(
  ({ inputText, setInputText, onSend, showTooltip }, ref) => {
    return (
      <View className="absolute bottom-4 left-4 right-4 pb-2">
        {/* Tooltip */}
        {showTooltip && (
          <Animated.View exiting={FadeOut} className="mb-4 items-center">
            <View className="mb-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2">
              <Text className="text-sm text-white">
                Write your reply. We’ll rate it and suggest a better version.
              </Text>
              <View className="absolute bottom-[-6px] left-1/2 -ml-1 h-3 w-3 rotate-45 border-b border-r border-gray-700 bg-gray-800" />
            </View>
            <Ionicons name="arrow-up-outline" size={30} color="white" />
            <Text className="mt-1 text-lg font-bold text-white">How would you reply to this?</Text>
          </Animated.View>
        )}

        <Pressable
          onPress={() => (ref as any)?.current?.focus()}
          className="flex-row items-center rounded-xl border border-gray-700 bg-gray-800 px-4 py-3">
          <TextInput
            ref={ref}
            className="max-h-24 flex-1 text-base text-white"
            placeholder="Type your reply here"
            placeholderTextColor="#9ca3af"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          {inputText.length > 0 && (
            <TouchableOpacity onPress={onSend} className="ml-2 rounded-full bg-emerald-500 p-2">
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>
    );
  }
);

export default ChatInput;
