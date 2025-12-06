import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

type RecentTool = { key: string; title: string };

export default function HomeTab() {
  const { colors } = useTheme();
  const [recent, setRecent] = useState<RecentTool[]>([]);

  useEffect(() => {
    const load = async () => {
      const raw = await SecureStore.getItemAsync('recent_tools');
      setRecent(raw ? JSON.parse(raw) : []);
    };
    load();
  }, []);

  const Daily = () => (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Daily Tip</Text>
      <Text style={{ marginTop: 6, color: colors.mutedText }}>
        Ask about specifics in the last photo to invite reply.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 16 }}>
        Daily Icebreaker
      </Text>
      <Text style={{ marginTop: 6, color: colors.mutedText }}>
        That trip looks epic. What was the best moment?
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingVertical: 12 }}>
        <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: '600', color: colors.text }}>
          Recently Used Tools
        </Text>
        <FlatList
          horizontal
          data={recent}
          keyExtractor={(i) => i.key}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          ListEmptyComponent={() => (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ color: colors.mutedText }}>No recent tools</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}>
              <Text style={{ color: colors.text }}>{item.title}</Text>
            </Pressable>
          )}
        />
      </View>
      <Daily />
    </SafeAreaView>
  );
}
