import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { HistoryItem } from '@/types/history';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HistoryTab() {
  const { colors } = useTheme();
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const raw = await SecureStore.getItemAsync('recent_history');
      setItems(raw ? JSON.parse(raw) : []);
    };
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        ListEmptyComponent={() => (
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.mutedText }}>No history yet</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}>
            {item.thumbnailUrl ? (
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={{ width: 40, height: 40, borderRadius: 8 }}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: colors.background,
                }}
              />
            )}
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text numberOfLines={2} style={{ color: colors.text, fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text style={{ color: colors.mutedText }}>{item.tool}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
