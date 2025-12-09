import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { ProfileRoastResult } from '@/types/profile-roast';

interface ProfileRoastResultBottomSheetProps {
  visible: boolean;
  result: ProfileRoastResult | null;
  onClose: () => void;
}

export default function ProfileRoastResultBottomSheet({
  visible,
  result,
  onClose,
}: ProfileRoastResultBottomSheetProps) {
  const { colors } = useTheme();

  if (!result) return null;

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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Profile Roast Results</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeButton, { color: colors.mutedText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.scoreText, { color: colors.primary }]}>
              Profile Score: {result.profileScore}/100
            </Text>
            <Text style={[styles.headlineText, { color: colors.text }]}>
              {result.roastHeadline}
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Strengths:</Text>
            {result.strengths.map((strength, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                • {strength}
              </Text>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weaknesses:</Text>
            {result.weaknesses.map((weakness, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                • {weakness}
              </Text>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Fixes:</Text>
            {result.quickFixes.map((fix, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                • {fix}
              </Text>
            ))}

            {result.photoScores && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Photo Scores:</Text>
                {result.photoScores.map((score, index) => (
                  <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                    Photo {index + 1}: {score}/100
                  </Text>
                ))}
              </>
            )}

            {result.bioScore && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Bio Score:</Text>
                <Text style={[styles.listItem, { color: colors.text }]}>
                  {result.bioScore}/100
                </Text>
              </>
            )}

            <Text style={[styles.confidenceText, { color: colors.mutedText }]}>
              Confidence: {Math.round(result.confidenceScore * 100)}%
            </Text>
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
    paddingBottom: 16,
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
  scoreText: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  confidenceText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});