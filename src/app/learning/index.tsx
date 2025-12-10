import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { LearningResource } from '@/types/home';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/auth/AuthProvider';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

export default function LearningListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { session } = useAuth();

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadResources();
  }, [page, resources.length]);

  const loadResources = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoading(true);
      }

      const from = isRefresh ? 0 : (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('learning_resources')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newResources = data as LearningResource[];

      if (isRefresh) {
        setResources(newResources);
      } else {
        setResources((prev) => [...prev, ...newResources]);
      }

      // Check if there are more items
      const totalItems = count || 0;
      const currentItems = isRefresh ? newResources.length : resources.length + newResources.length;
      setHasMore(currentItems < totalItems);

      if (!isRefresh && newResources.length > 0) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    loadResources(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      loadResources();
    }
  };

  const handleResourcePress = (resource: LearningResource) => {
    router.push(`/learning/${resource.id}`);
  };

  const categoryColors = {
    messaging: '#3B82F6',
    profile: '#10B981',
    dating: '#EF4444',
    social: '#8B5CF6',
    relationship: '#F59E0B',
  };

  const categoryIcons = {
    messaging: 'chatbubble',
    profile: 'person',
    dating: 'heart',
    social: 'people',
    relationship: 'infinite',
  };

  const formatReadTime = (minutes: number): string => {
    if (minutes < 1) return '< 1 min read';
    return `${minutes} min read`;
  };

  const getDifficultyLabel = (level: number): string => {
    const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[level - 1] || 'Medium';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderResource = ({ item }: { item: LearningResource }) => {
    const iconColor = categoryColors[item.category as keyof typeof categoryColors] || '#6B7280';
    const iconName = categoryIcons[item.category as keyof typeof categoryIcons] || 'document-text';

    return (
      <TouchableOpacity
        style={[styles.resourceCard, { backgroundColor: colors.surface }]}
        onPress={() => handleResourcePress(item)}
        activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
            <Ionicons name={iconName as any} size={20} color={iconColor} />
          </View>
          <View style={styles.metaInfo}>
            <Text style={[styles.categoryText, { color: iconColor }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
            <Text style={[styles.dateText, { color: colors.mutedText }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        {item.author_name && (
          <Text style={[styles.authorText, { color: colors.mutedText }]} numberOfLines={1}>
            By {item.author_name}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={12} color={colors.mutedText} />
              <Text style={[styles.metaText, { color: colors.mutedText }]}>
                {formatReadTime(item.estimated_read_time)}
              </Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: iconColor + '20' }]}>
              <Text style={[styles.difficultyText, { color: iconColor, fontSize: 10 }]}>
                {getDifficultyLabel(item.difficulty_level)}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={12} color={colors.mutedText} />
              <Text style={[styles.statText, { color: colors.mutedText, fontSize: 12 }]}>
                {item.views_count}
              </Text>
            </View>
            {item.completion_count > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle" size={12} color={colors.mutedText} />
                <Text style={[styles.statText, { color: colors.mutedText, fontSize: 12 }]}>
                  {item.completion_count}
                </Text>
              </View>
            )}
          </View>
        </View>

        {item.url && (
          <View style={styles.urlIndicator}>
            <Ionicons name="globe" size={12} color={colors.primary} />
            <Text style={[styles.urlText, { color: colors.primary }]}>Web Article</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.mutedText }]}>
          Loading more articles...
        </Text>
      </View>
    );
  };

  if (loading && resources.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Learning Articles</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading articles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Learning Articles</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={resources}
        renderItem={renderResource}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  resourceCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metaInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 11,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  authorText: {
    fontSize: 13,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    marginLeft: 3,
  },
  urlIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  urlText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginTop: 8,
  },
});
