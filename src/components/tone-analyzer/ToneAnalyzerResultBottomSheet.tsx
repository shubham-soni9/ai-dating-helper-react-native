import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  FlatList,
  Clipboard,
  Alert,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { ToneAnalysisResult } from '@/types/tone-analyzer';

interface ToneAnalyzerResultBottomSheetProps {
  visible: boolean;
  result: ToneAnalysisResult | null;
  onClose: () => void;
}

type Tab = 'overview' | 'emotions' | 'details';

export default function ToneAnalyzerResultBottomSheet({
  visible,
  result,
  onClose,
}: ToneAnalyzerResultBottomSheetProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!result) return null;

  // const copyToClipboard = (text: string) => {
  //   Clipboard.setString(text);
  //   Alert.alert('Copied!', 'Text copied to clipboard');
  // };

  const renderEmotionItem = ({ item }: { item: string }) => (
    <View
      style={[styles.emotionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.emotionDot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.emotionText, { color: colors.text }]}>{item}</Text>
    </View>
  );

  const renderOverviewContent = () => (
    <View>
      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Overall Tone</Text>
        <Text style={[styles.metricValue, { color: colors.text }]}>{result.overallTone}</Text>
      </View>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Toxicity Level</Text>
        <Text
          style={[styles.metricValue, { color: getToxicityColor(result.toxicityLevel, colors) }]}>
          {result.toxicityLevel}
        </Text>
      </View>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Conversation Health</Text>
        <Text
          style={[
            styles.metricValue,
            { color: getHealthColor(result.conversationHealth, colors) },
          ]}>
          {result.conversationHealth}
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

  const renderEmotionsContent = () => (
    <View>
      <Text style={[styles.sectionDescription, { color: colors.mutedText }]}>
        Detected emotional signals in the conversation
      </Text>
      <FlatList
        data={result.emotionalSignals}
        renderItem={renderEmotionItem}
        keyExtractor={(item, index) => `emotion-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderDetailsContent = () => (
    <View>
      <View
        style={[
          styles.detailCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Your Tone</Text>
        <Text style={[styles.detailText, { color: colors.mutedText }]}>{result.userTone}</Text>
      </View>

      <View
        style={[
          styles.detailCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Other Person&apos;s Tone</Text>
        <Text style={[styles.detailText, { color: colors.mutedText }]}>
          {result.otherPersonTone}
        </Text>
      </View>
    </View>
  );

  const getToxicityColor = (level: string, colors: any) => {
    switch (level.toLowerCase()) {
      case 'none':
      case 'low':
        return colors.success || '#4CAF50';
      case 'medium':
        return colors.warning || '#FF9800';
      case 'high':
        return colors.error || '#F44336';
      default:
        return colors.text;
    }
  };

  const getHealthColor = (health: string, colors: any) => {
    switch (health.toLowerCase()) {
      case 'healthy':
        return colors.success || '#4CAF50';
      case 'concerning':
      case 'needs attention':
        return colors.warning || '#FF9800';
      case 'toxic':
        return colors.error || '#F44336';
      default:
        return colors.text;
    }
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Tone Analysis Results</Text>
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
                activeTab === 'emotions' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('emotions')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'emotions' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Emotions
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor: activeTab === 'emotions' ? colors.primary : colors.mutedText,
                  },
                ]}>
                <Text style={styles.tabBadgeText}>{result.emotionalSignals?.length || 0}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'details' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('details')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'details' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Details
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'overview' && renderOverviewContent()}
            {activeTab === 'emotions' && renderEmotionsContent()}
            {activeTab === 'details' && renderDetailsContent()}
          </View>
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
  emotionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  emotionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
