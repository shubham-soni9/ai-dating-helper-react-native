import { View, Text, Pressable, TextInput, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { Tool } from '@/types/tools';
import { TOOLS } from '@/data/tools';
import { LinearGradient } from 'expo-linear-gradient';

export default function ToolsTab() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(
    () =>
      TOOLS.filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const toolsData = useMemo(() => {
    if (searchQuery) {
      return filteredTools;
    }

    // Sort tools: Critical first, then ready tools, then upcoming tools
    const criticalTools = filteredTools.filter((tool) => tool.badge === 'Critical');
    const readyTools = filteredTools.filter((tool) => tool.isReady && !tool.badge);
    const upcomingTools = filteredTools.filter((tool) => !tool.isReady && !tool.badge);

    return [...criticalTools, ...readyTools, ...upcomingTools];
  }, [filteredTools, searchQuery]);

  const renderItem = ({ item }: { item: Tool }) => (
    <Pressable
      onPress={() => item.isReady && router.push(item.route as any)}
      disabled={!item.isReady}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          opacity: !item.isReady ? 0.7 : pressed ? 0.95 : 1,
          transform: [{ scale: pressed && item.isReady ? 0.98 : 1 }],
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        },
      ]}>
      {item.badge === 'Critical' && (
        <LinearGradient
          colors={[item.color + '15', item.color + '05']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />
      )}

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={[styles.iconContainer, { backgroundColor: item.color + '20', marginRight: 10 }]}>
            <Ionicons name={item.icon} size={24} color={item.color || colors.primary} />
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={[styles.title, { color: colors.text, fontSize: 16, flex: 1 }]}
              numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.description, { color: colors.mutedText, fontSize: 12, marginTop: 4 }]}
          numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Ionicons name="search" size={20} color={colors.mutedText} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name or feature..."
          placeholderTextColor={colors.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={colors.mutedText} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={toolsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.surface }]}>
              <Ionicons name="search-outline" size={40} color={colors.mutedText} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No tools found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              Try searching with different keywords
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 32,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    flex: 1,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 19,
    opacity: 0.85,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
});
