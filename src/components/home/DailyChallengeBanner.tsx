import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { DailyChallenge, UserChallengeCompletion } from '@/types/home';

const { width } = Dimensions.get('window');

interface DailyChallengeBannerProps {
  challenge: DailyChallenge | null;
  completion: UserChallengeCompletion | null;
  onPress?: () => void;
  onComplete?: () => void;
}

export function DailyChallengeBanner({
  challenge,
  completion,
  onPress,
  onComplete,
}: DailyChallengeBannerProps) {
  const { colors } = useTheme();

  if (!challenge) return null;

  const isCompleted = completion !== null;
  const categoryIcons = {
    messaging: 'chatbubble',
    profile: 'person',
    dating: 'heart',
    social: 'people',
    relationship: 'infinite',
  };

  const categoryColors = {
    messaging: '#3B82F6',
    profile: '#10B981',
    dating: '#EF4444',
    social: '#8B5CF6',
    relationship: '#F59E0B',
  };

  const iconName = categoryIcons[challenge.category as keyof typeof categoryIcons] || 'star';
  const iconColor = categoryColors[challenge.category as keyof typeof categoryColors] || '#6B7280';

  const handlePress = () => {
    if (isCompleted) {
      onPress?.();
    } else {
      onComplete?.();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          shadowOpacity: 0.06,
          shadowRadius: 3,
          elevation: 2,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName as any} size={20} color={iconColor} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Daily Challenge</Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          </View>
        )}
      </View>

      <Text style={[styles.challengeTitle, { color: colors.text }]}>{challenge.title}</Text>
      <Text style={[styles.challengeDescription, { color: colors.mutedText }]}>
        {challenge.description}
      </Text>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.rewardContainer}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.rewardText, { color: colors.mutedText }]}>
            +{challenge.xp_reward} XP
          </Text>
        </View>

        {isCompleted ? (
          <Text style={[styles.statusText, { color: '#10B981' }]}>Completed!</Text>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: iconColor }]}
            onPress={onComplete}>
            <Text style={styles.actionButtonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
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
  header: {
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
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  completedBadge: {
    marginLeft: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
