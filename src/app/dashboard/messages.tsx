import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';

export default function MessagesTab() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>Messages</Text>
      <Text style={{ marginTop: 8, color: colors.mutedText }}>Chat and conversations</Text>
      <View style={{ height: 16 }} />
      <Pressable
        onPress={() => router.push('/media-picker')}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        }}>
        <Text style={{ color: colors.onPrimary, fontSize: 16 }}>Open Media Picker</Text>
      </Pressable>
    </View>
  );
}
