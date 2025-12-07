import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ToolsTab() {
  const { colors } = useTheme();
  const router = useRouter();
  const Tile = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        height: 120,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Tile title="DM Girl This Girl" onPress={() => router.push('/tools/dm-helper')} />
        <Tile title="Get Out of Angry Chatting" onPress={() => router.push('/tools/deescalate')} />
      </View>
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Tile title="Coming Soon" onPress={() => {}} />
        <Tile title="Coming Soon" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
