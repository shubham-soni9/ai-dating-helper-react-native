import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { CommunityPost } from '@/types/home';

const { width } = Dimensions.get('window');

interface CommunitySectionProps {
  posts: CommunityPost[];
  onPostPress: (post: CommunityPost) => void;
  onViewAll?: () => void;
}

export function CommunitySection({ posts, onPostPress, onViewAll }: CommunitySectionProps) {
  const { colors } = useTheme();

  if (posts.length === 0) return null;

  const categoryIcons = {
    success_story: 'trophy',
    question: 'help-circle',
    tip: 'bulb',
    discussion: 'chatbubbles',
  };

  const categoryColors = {
    success_story: '#10B981',
    question: '#3B82F6',
    tip: '#F59E0B',
    discussion: '#8B5CF6',
  };

  const categoryLabels = {
    success_story: 'Success Story',
    question: 'Question',
    tip: 'Tip',
    discussion: 'Discussion',
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Community</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {posts.map((post) => {
          const iconName =
            categoryIcons[post.category as keyof typeof categoryIcons] || 'document-text';
          const iconColor =
            categoryColors[post.category as keyof typeof categoryColors] || '#6B7280';
          const categoryLabel =
            categoryLabels[post.category as keyof typeof categoryLabels] || 'Post';

          return (
            <TouchableOpacity
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 2,
                },
              ]}
              onPress={() => onPostPress(post)}
              activeOpacity={0.8}>
              {post.is_featured && (
                <View style={[styles.featuredBadge, { backgroundColor: '#F59E0B' + '20' }]}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.featuredText, { color: '#F59E0B' }]}>Featured</Text>
                </View>
              )}

              <View style={styles.postHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: iconColor + '20' }]}>
                  <Ionicons name={iconName as any} size={12} color={iconColor} />
                  <Text style={[styles.categoryText, { color: iconColor }]}>{categoryLabel}</Text>
                </View>
                <Text style={[styles.timeText, { color: colors.mutedText }]}>
                  {formatTimeAgo(post.created_at)}
                </Text>
              </View>

              <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={2}>
                {post.title}
              </Text>

              <Text style={[styles.postContent, { color: colors.mutedText }]} numberOfLines={3}>
                {post.content}
              </Text>

              <View style={[styles.postFooter, { borderTopColor: colors.border }]}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={14} color={colors.mutedText} />
                    <Text style={[styles.statText, { color: colors.mutedText }]}>
                      {post.likes_count}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble" size={14} color={colors.mutedText} />
                    <Text style={[styles.statText, { color: colors.mutedText }]}>
                      {post.comments_count}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 2,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  postCard: {
    width: width * 0.75,
    marginRight: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
