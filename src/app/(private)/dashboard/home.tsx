import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type RecentTool = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  timestamp: number;
};

export default function HomeTab() {
  const { colors } = useTheme();
  const router = useRouter();
  const [recent, setRecent] = useState<RecentTool[]>([]);

  useEffect(() => {
    const load = async () => {
      const raw = await SecureStore.getItemAsync('recent_tools');
      if (raw) {
        const tools = JSON.parse(raw);
        // Sort by timestamp (most recent first)
        tools.sort((a: RecentTool, b: RecentTool) => b.timestamp - a.timestamp);
        setRecent(tools);
      }
    };
    load();
  }, []);

  const handleRecentToolPress = (tool: RecentTool) => {
    // Navigate to the tool's route
    router.push(`/tools/${tool.key}` as any);
  };

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
      {recent.length > 0 && (
        <View style={{ paddingVertical: 16 }}>
          <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: '600', color: colors.text }}>
            Recently Used Tools
          </Text>
          <FlatList
            horizontal
            data={recent}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleRecentToolPress(item)}
                style={({ pressed }) => [
                  styles.recentToolCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}>
                <View style={[styles.recentToolIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={[styles.recentToolText, { color: colors.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
      <Daily />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  recentToolCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentToolIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recentToolText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});
