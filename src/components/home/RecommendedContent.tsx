import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { LearningResource } from '@/types/home';

const { width } = Dimensions.get('window');

interface RecommendedContentProps {
  resources: LearningResource[];
  onResourcePress: (resource: LearningResource) => void;
  onViewAll?: () => void;
}

export function RecommendedContent({
  resources,
  onResourcePress,
  onViewAll,
}: RecommendedContentProps) {
  const { colors } = useTheme();

  if (resources.length === 0) return null;

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recommended for You</Text>
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        {resources.map((resource) => {
          const iconColor =
            categoryColors[resource.category as keyof typeof categoryColors] || '#6B7280';
          const iconName =
            categoryIcons[resource.category as keyof typeof categoryIcons] || 'document-text';

          return (
            <TouchableOpacity
              key={resource.id}
              style={[
                styles.resourceCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 2,
                },
              ]}
              onPress={() => onResourcePress(resource)}
              activeOpacity={0.8}>
              <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                <Ionicons name={iconName as any} size={24} color={iconColor} />
              </View>

              <Text style={[styles.resourceTitle, { color: colors.text }]} numberOfLines={2}>
                {resource.title}
              </Text>

              {resource.author_name && (
                <Text style={[styles.authorText, { color: colors.mutedText }]} numberOfLines={1}>
                  By {resource.author_name}
                </Text>
              )}

              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={12} color={colors.mutedText} />
                  <Text style={[styles.metaText, { color: colors.mutedText }]}>
                    {formatReadTime(resource.estimated_read_time)}
                  </Text>
                </View>

                <View style={[styles.difficultyBadge, { backgroundColor: iconColor + '20' }]}>
                  <Text style={[styles.difficultyText, { color: iconColor }]}>
                    {getDifficultyLabel(resource.difficulty_level)}
                  </Text>
                </View>
              </View>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons name="eye" size={12} color={colors.mutedText} />
                    <Text style={[styles.statText, { color: colors.mutedText }]}>
                      {resource.views_count}
                    </Text>
                  </View>
                  {resource.completion_count > 0 && (
                    <View style={styles.statItem}>
                      <Ionicons name="checkmark-circle" size={12} color={colors.mutedText} />
                      <Text style={[styles.statText, { color: colors.mutedText }]}>
                        {resource.completion_count}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={[styles.xpBadge, { backgroundColor: '#F59E0B' + '20' }]}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.xpText, { color: '#F59E0B' }]}>+{resource.xp_reward}</Text>
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
    paddingVertical: 10,
  },
  scrollView: {
    overflow: 'visible',
  },
  resourceCard: {
    width: width * 0.7,
    marginRight: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
  },
  authorText: {
    fontSize: 12,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
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
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    marginLeft: 2,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
});
