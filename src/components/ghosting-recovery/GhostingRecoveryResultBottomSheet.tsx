import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/theme/ThemeProvider';
import { GhostingRecoveryResult } from '@/types/ghosting-recovery';

interface GhostingRecoveryResultBottomSheetProps {
  visible: boolean;
  result: GhostingRecoveryResult | null;
  onClose: () => void;
}

type Tab = 'overview' | 'messages' | 'advice';

export default function GhostingRecoveryResultBottomSheet({
  visible,
  result,
  onClose,
}: GhostingRecoveryResultBottomSheetProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!result) return null;

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setToastMessage('Copied to clipboard');
    setTimeout(() => setToastMessage(null), 1500);
  };

  const renderMessageItem = ({ item }: { item: string }) => (
    <View
      style={[styles.messageCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.messageText, { color: colors.text }]}>{item}</Text>
      <TouchableOpacity
        style={[styles.copyButton, { backgroundColor: colors.primary + '20' }]}
        onPress={() => copyToClipboard(item)}
        activeOpacity={0.7}>
        <Text style={[styles.copyButtonText, { color: colors.primary }]}>Copy</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOverviewContent = () => (
    <View>
      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Ghosting Status</Text>
        <Text
          style={[styles.metricValue, { color: result.isGhosted ? colors.error : colors.success }]}>
          {result.isGhosted ? 'Ghosting Detected' : 'Not Ghosting'}
        </Text>
      </View>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Ghosting Stage</Text>
        <Text style={[styles.metricValue, { color: getStageColor(result.ghostingStage, colors) }]}>
          {result.ghostingStage}
        </Text>
      </View>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Ghosting Probability</Text>
        <Text style={[styles.metricValue, { color: colors.text }]}>
          {Math.round(result.ghostingProbability * 100)}%
        </Text>
      </View>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Recovery Chance</Text>
        <Text
          style={[styles.metricValue, { color: getRecoveryColor(result.recoveryChance, colors) }]}>
          {Math.round(result.recoveryChance * 100)}%
        </Text>
      </View>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Confidence Score</Text>
        <Text style={[styles.metricValue, { color: colors.text }]}>
          {Math.round(result.confidenceScore * 100)}%
        </Text>
      </View>
    </View>
  );

  const renderMessagesContent = () => (
    <View>
      <Text style={[styles.sectionDescription, { color: colors.mutedText }]}>
        Recommended tone: {result.recommendedTone}
      </Text>
      <FlatList
        data={result.recommendedMessage}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => `message-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderAdviceContent = () => (
    <View>
      {result.moveOnAdvice ? (
        <View
          style={[
            styles.adviceCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Text style={[styles.adviceTitle, { color: colors.text }]}>Move On Advice</Text>
          <Text style={[styles.adviceText, { color: colors.mutedText }]}>
            {result.moveOnAdvice}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.adviceCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Text style={[styles.adviceTitle, { color: colors.text }]}>Recovery Recommended</Text>
          <Text style={[styles.adviceText, { color: colors.mutedText }]}>
            Your recovery chance is {Math.round(result.recoveryChance * 100)}%. Try one of the
            suggested messages above!
          </Text>
        </View>
      )}
    </View>
  );

  const getStageColor = (stage: string, colors: any) => {
    switch (stage.toLowerCase()) {
      case 'early fade':
        return colors.warning || '#FF9800';
      case 'soft ghost':
        return colors.error || '#F44336';
      case 'hard ghost':
        return colors.error || '#D32F2F';
      case 'zombie risk':
        return colors.mutedText || '#9E9E9E';
      default:
        return colors.text;
    }
  };

  const getRecoveryColor = (chance: number, colors: any) => {
    if (chance >= 0.75) return colors.success || '#4CAF50';
    if (chance >= 0.5) return colors.warning || '#FF9800';
    if (chance >= 0.25) return colors.error || '#F44336';
    return colors.error || '#D32F2F';
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>👻 Ghosting Analysis</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeButton, { color: colors.mutedText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'overview' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('overview')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'overview' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'messages' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('messages')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'messages' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Messages
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor: activeTab === 'messages' ? colors.primary : colors.mutedText,
                  },
                ]}>
                <Text style={styles.tabBadgeText}>{result.recommendedMessage?.length || 0}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'advice' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('advice')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'advice' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Advice
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'overview' && renderOverviewContent()}
            {activeTab === 'messages' && renderMessagesContent()}
            {activeTab === 'advice' && renderAdviceContent()}
          </View>

          {toastMessage && (
            <View
              style={[
                styles.toast,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <Text style={{ color: colors.text }}>{toastMessage}</Text>
            </View>
          )}
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
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignSelf: 'center',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  metricCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  messageCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  copyButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  adviceCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
