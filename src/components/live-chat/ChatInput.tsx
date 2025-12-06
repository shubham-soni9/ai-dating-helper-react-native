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
      <View className="pb-2 absolute bottom-4 left-4 right-4">
        {/* Tooltip */}
        {showTooltip && (
          <Animated.View exiting={FadeOut} className="items-center mb-4">
            <View className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 mb-2">
              <Text className="text-white text-sm">
                Write your reply. We’ll rate it and suggest a better version.
              </Text>
              <View className="absolute bottom-[-6px] left-1/2 -ml-1 w-3 h-3 bg-gray-800 border-b border-r border-gray-700 rotate-45" />
            </View>
            <Ionicons name="arrow-up-outline" size={30} color="white" />
            <Text className="text-white font-bold text-lg mt-1">How would you reply to this?</Text>
          </Animated.View>
        )}

        <Pressable
          onPress={() => (ref as any)?.current?.focus()}
          className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
          <TextInput
            ref={ref}
            className="flex-1 text-white text-base max-h-24"
            placeholder="Type your reply here"
            placeholderTextColor="#9ca3af"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          {inputText.length > 0 && (
            <TouchableOpacity
              onPress={onSend}
              className="ml-2 p-2 rounded-full bg-emerald-500">
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>
    );
  }
);

export default ChatInput;
