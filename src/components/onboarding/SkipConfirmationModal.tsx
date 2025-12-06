import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkipConfirmationModalProps {
  visible: boolean;
  onConfirmSkip: () => void;
  onCancel: () => void;
}

export const SkipConfirmationModal = ({
  visible,
  onConfirmSkip,
  onCancel,
}: SkipConfirmationModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/80 px-6">
        <View className="w-full rounded-2xl border border-gray-800 bg-[#1E1E1E] p-6 shadow-2xl">
          <Text className="mb-3 text-center text-xl font-bold text-white">Are you sure?</Text>
          <Text className="mb-6 text-center leading-relaxed text-gray-400">
            We think the welcome experience is crucial to your success. If you go through it we have
            a surprise for you at the end.
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onConfirmSkip}
              className="flex-1 items-center justify-center rounded-full bg-gray-800 py-3">
              <Text className="font-semibold text-gray-400">Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel} className="flex-1">
              <LinearGradient
                colors={['#FF006B', '#FF4D00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text className="font-semibold text-white">Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingVertical: 12,
  },
});
