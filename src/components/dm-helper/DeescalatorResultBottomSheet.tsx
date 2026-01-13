import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/theme/ThemeProvider';
import { DeescalatorResult } from '@/types/deescalator';

interface DeescalatorResultBottomSheetProps {
  visible: boolean;
  result: DeescalatorResult | null;
  onClose: () => void;
}

export default function DeescalatorResultBottomSheet({
  visible,
  result,
  onClose,
}: DeescalatorResultBottomSheetProps) {
  const { colors } = useTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  if (!visible || !result) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {result.error ? 'Invalid Image' : 'De-escalation Analysis'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.mutedText }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}>
          {result.error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.accent }]}>⚠️ {result.error}</Text>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Situation Analysis</Text>
              <Text style={[styles.analysisText, { color: colors.mutedText }]}>
                {result.situationAnalysis}
              </Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                What Your Partner is Feeling
              </Text>
              {result.partnerEmotions.map((emotion: string, index: number) => (
                <Text key={index} style={[styles.emotionText, { color: colors.text }]}>
                  • {emotion}
                </Text>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                What Your Partner Needs
              </Text>
              {result.partnerNeeds.map((need: string, index: number) => (
                <Text key={index} style={[styles.needText, { color: colors.text }]}>
                  • {need}
                </Text>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Approach Strategy</Text>
              <Text style={[styles.approachText, { color: colors.mutedText }]}>
                {result.approach}
              </Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Message Suggestions</Text>
              {result.suggestions.map((suggestion: string, index: number) => (
                <View key={index} style={styles.suggestionContainer}>
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    • {suggestion}
                  </Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(suggestion, index)}
                    style={styles.copyButton}>
                    <Text style={[styles.copyText, { color: colors.primary }]}>
                      {copiedIndex === index ? '✓ Copied!' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Next Steps</Text>
              {result.nextSteps.map((step: string, index: number) => (
                <Text key={index} style={[styles.nextStepText, { color: colors.mutedText }]}>
                  • {step}
                </Text>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  approachText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  emotionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  needText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  suggestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    marginRight: 12,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  copyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextStepText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
