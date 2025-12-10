import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { UserProgress } from '@/types/home';

const { width } = Dimensions.get('window');

interface UserStatsBadgeProps {
  userProgress: UserProgress;
  onPress?: () => void;
}

export function UserStatsBadge({ userProgress, onPress }: UserStatsBadgeProps) {
  const { colors } = useTheme();

  const getLevelColor = (level: number): string => {
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  const getNextLevelXP = (currentLevel: number): number => {
    // XP required for each level (exponential growth)
    const xpTable = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    return xpTable[currentLevel] || 4500 + (currentLevel - 10) * 1000;
  };

  const getCurrentLevelXP = (currentLevel: number): number => {
    if (currentLevel <= 1) return 0;
    const xpTable = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    return xpTable[currentLevel - 1] || 4500 + (currentLevel - 11) * 1000;
  };

  const currentLevelXP = getCurrentLevelXP(userProgress.current_level);
  const nextLevelXP = getNextLevelXP(userProgress.current_level);
  const currentLevelProgress = userProgress.total_xp - currentLevelXP;
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.min((currentLevelProgress / xpForNextLevel) * 100, 100);

  const levelColor = getLevelColor(userProgress.current_level);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.levelContainer}>
        <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
          <Text style={[styles.levelText, { color: levelColor }]}>
            LVL {userProgress.current_level}
          </Text>
        </View>

        <View style={styles.xpContainer}>
          <Text style={[styles.xpText, { color: colors.mutedText }]}>
            {userProgress.total_xp} XP
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: levelColor,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.xpRemainingText, { color: colors.mutedText }]}>
            {xpForNextLevel - currentLevelProgress} XP to next level
          </Text>
        </View>
      </View>

      {userProgress.weekly_streak > 0 && (
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color="#F59E0B" />
          <Text style={[styles.streakText, { color: '#F59E0B' }]}>
            {userProgress.weekly_streak} day streak
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  xpContainer: {
    flex: 1,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  xpRemainingText: {
    fontSize: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
