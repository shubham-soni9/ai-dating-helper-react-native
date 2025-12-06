import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { ResourceItem } from '@/types/resources';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ResourcesTab() {
  const { colors } = useTheme();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = process.env.EXPO_PUBLIC_RESOURCES_API_URL;
        if (url) {
          const res = await fetch(url);
          const json = await res.json();
          setItems(json.items as ResourceItem[]);
        } else {
          setItems([
            { id: '1', title: 'The Art of the DM', summary: 'Principles for engaging messages' },
            { id: '2', title: 'Playful Tone Guide', summary: 'Examples and pitfalls' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.mutedText }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
              <Text style={{ color: colors.mutedText, marginTop: 4 }}>{item.summary}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
