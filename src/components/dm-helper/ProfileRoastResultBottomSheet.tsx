import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { ProfileRoastResult } from '@/types/profile-roast';

interface ProfileRoastResultBottomSheetProps {
  visible: boolean;
  result: ProfileRoastResult | null;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function ProfileRoastResultBottomSheet({
  visible,
  result,
  onClose,
}: ProfileRoastResultBottomSheetProps) {
  const { colors } = useTheme();

  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🔥'; // Fire
    if (score >= 60) return '👍'; // Thumbs up
    return '😬'; // Grimace
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Outstanding profile!';
    if (score >= 60) return 'Good foundation, room to improve!';
    return 'Time for a profile makeover!';
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.background }]}
          onPress={() => {}}>
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Profile Analysis</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeButton, { color: colors.mutedText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Score Card - Eye catching design */}
          <View style={styles.scoreCard}>
            <View style={[styles.scoreCircle, { borderColor: getScoreColor(result.profileScore) }]}>
              <Text style={[styles.scoreText, { color: getScoreColor(result.profileScore) }]}>
                {result.profileScore}
              </Text>
              <Text style={[styles.scoreSubText, { color: getScoreColor(result.profileScore) }]}>
                /100
              </Text>
            </View>
            <Text style={[styles.scoreEmoji, { color: colors.text }]}>
              {getScoreEmoji(result.profileScore)}
            </Text>
            <Text style={[styles.scoreMessage, { color: colors.text }]}>
              {getScoreMessage(result.profileScore)}
            </Text>
            <Text style={[styles.roastHeadline, { color: colors.mutedText }]}>
              {result.roastHeadline}
            </Text>
          </View>

          {/* Content with proper scrolling */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={true}
            overScrollMode="never"
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled">
            {/* Strengths Section */}
            {result.strengths.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: '#4CAF50' }]}>💪 Your Strengths</Text>
                  <View style={[styles.sectionBadge, { backgroundColor: '#4CAF5020' }]}>
                    <Text style={[styles.sectionBadgeText, { color: '#4CAF50' }]}>
                      {result.strengths.length}
                    </Text>
                  </View>
                </View>
                {result.strengths.map((strength, index) => (
                  <View
                    key={index}
                    style={[
                      styles.itemCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}>
                    <Text style={[styles.itemText, { color: colors.text }]}>• {strength}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Weaknesses Section */}
            {result.weaknesses.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: '#FF9800' }]}>
                    ⚠️ Areas to Improve
                  </Text>
                  <View style={[styles.sectionBadge, { backgroundColor: '#FF980020' }]}>
                    <Text style={[styles.sectionBadgeText, { color: '#FF9800' }]}>
                      {result.weaknesses.length}
                    </Text>
                  </View>
                </View>
                {result.weaknesses.map((weakness, index) => (
                  <View
                    key={index}
                    style={[
                      styles.itemCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}>
                    <Text style={[styles.itemText, { color: colors.text }]}>• {weakness}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Quick Fixes Section */}
            {result.quickFixes.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: '#2196F3' }]}>🔧 Quick Fixes</Text>
                  <View style={[styles.sectionBadge, { backgroundColor: '#2196F320' }]}>
                    <Text style={[styles.sectionBadgeText, { color: '#2196F3' }]}>
                      {result.quickFixes.length}
                    </Text>
                  </View>
                </View>
                {result.quickFixes.map((fix, index) => (
                  <View
                    key={index}
                    style={[
                      styles.itemCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}>
                    <Text style={[styles.itemText, { color: colors.text }]}>• {fix}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Photo Scores */}
            {result.photoScores && result.photoScores.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>📸 Photo Scores</Text>
                <View style={styles.photoScoresGrid}>
                  {result.photoScores.map((score, index) => (
                    <View
                      key={index}
                      style={[
                        styles.photoScoreCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ]}>
                      <Text style={[styles.photoScoreNumber, { color: colors.text }]}>
                        Photo {index + 1}
                      </Text>
                      <Text style={[styles.photoScoreValue, { color: getScoreColor(score) }]}>
                        {score}/100
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bio Score */}
            {result.bioScore && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Bio Score</Text>
                <View
                  style={[
                    styles.bioScoreCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.bioScoreValue, { color: getScoreColor(result.bioScore) }]}>
                    {result.bioScore}/100
                  </Text>
                </View>
              </View>
            )}

            {/* Confidence */}
            <View style={styles.confidenceSection}>
              <Text style={[styles.confidenceText, { color: colors.mutedText }]}>
                Analysis Confidence: {Math.round(result.confidenceScore * 100)}%
              </Text>
            </View>

            {/* Bottom padding to ensure last content is visible */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Score Card Styles
  scoreCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreSubText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  roastHeadline: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Section Styles
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Photo Scores Grid
  photoScoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoScoreCard: {
    flex: 1,
    minWidth: (screenWidth - 80) / 2,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  photoScoreNumber: {
    fontSize: 12,
    marginBottom: 4,
  },
  photoScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Bio Score
  bioScoreCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  bioScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Confidence
  confidenceSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  confidenceText: {
    fontSize: 12,
  },
  // Legacy styles (kept for compatibility)
  scoreTextLegacy: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  headlineText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
});
