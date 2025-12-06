import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as Clipboard from 'expo-clipboard';
import { DMResult } from '@/types/dm';

export default function DMResultScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ data: string }>();
  const data = useMemo(
    () => (params.data ? (JSON.parse(params.data as string) as DMResult) : undefined),
    [params]
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Suggestions</Text>
      <FlatList
        data={data?.suggestions || []}
        keyExtractor={(i, idx) => i.text + idx}
        contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}>
            <Text style={{ color: colors.text }}>{item.text}</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(item.text);
                  Alert.alert('Copied', 'Text copied to clipboard');
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                }}>
                <Text style={{ color: colors.onPrimary }}>Copy</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 }}>
        Hints
      </Text>
      <FlatList
        data={data?.hints || []}
        keyExtractor={(i, idx) => i + idx}
        contentContainerStyle={{ paddingVertical: 8, gap: 6 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}>
            <Text style={{ color: colors.mutedText }}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}
