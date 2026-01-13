import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { UserAchievement } from '@/types/home';

interface RecentAchievementsProps {
  achievements: UserAchievement[];
  onViewAll?: () => void;
}

export function RecentAchievements({ achievements, onViewAll }: RecentAchievementsProps) {
  const { colors } = useTheme();

  if (achievements.length === 0) return null;

  const getAchievementIcon = (achievementId: string): string => {
    const iconMap: Record<string, string> = {
      first_message: 'paper-plane',
      conversation_starter: 'chatbubble',
      profile_optimizer: 'person-circle',
      social_detective: 'search',
      first_date_expert: 'calendar',
      emotional_intelligence: 'heart',
      weekly_warrior: 'flame',
      knowledge_seeker: 'book',
      community_helper: 'people',
      xp_master: 'star',
    };
    return iconMap[achievementId] || 'trophy';
  };

  const getAchievementColor = (achievementId: string): string => {
    const colorMap: Record<string, string> = {
      first_message: '#3B82F6',
      conversation_starter: '#10B981',
      profile_optimizer: '#8B5CF6',
      social_detective: '#EF4444',
      first_date_expert: '#F59E0B',
      emotional_intelligence: '#EC4899',
      weekly_warrior: '#F59E0B',
      knowledge_seeker: '#6366F1',
      community_helper: '#14B8A6',
      xp_master: '#F59E0B',
    };
    return colorMap[achievementId] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recent Achievements</Text>
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
        {achievements.map((achievement) => {
          const iconName = getAchievementIcon(achievement.achievement_id);
          const iconColor = getAchievementColor(achievement.achievement_id);
          const unlockedDate = new Date(achievement.unlocked_at).toLocaleDateString();

          return (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 2,
                },
              ]}>
              <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                <Ionicons name={iconName as any} size={28} color={iconColor} />
              </View>

              <Text style={[styles.achievementTitle, { color: colors.text }]} numberOfLines={2}>
                {achievement.title}
              </Text>

              <Text
                style={[styles.achievementDescription, { color: colors.mutedText }]}
                numberOfLines={2}>
                {achievement.description}
              </Text>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={[styles.xpBadge, { backgroundColor: '#F59E0B' + '20' }]}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.xpText, { color: '#F59E0B' }]}>
                    +{achievement.xp_reward}
                  </Text>
                </View>
                <Text style={[styles.dateText, { color: colors.mutedText }]}>{unlockedDate}</Text>
              </View>
            </View>
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
  achievementCard: {
    width: 140,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  achievementDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  dateText: {
    fontSize: 10,
  },
});
