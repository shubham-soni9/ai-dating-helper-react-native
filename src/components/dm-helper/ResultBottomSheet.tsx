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
import { DMResult } from '@/types/dm';

interface ResultBottomSheetProps {
  visible: boolean;
  result: DMResult | null;
  onClose: () => void;
}

type Tab = 'suggestions' | 'hints';

export default function ResultBottomSheet({ visible, result, onClose }: ResultBottomSheetProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('suggestions');

  if (!result) return null;

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'Text copied to clipboard');
  };

  const renderSuggestionItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => copyToClipboard(item)}
      activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>#{index + 1}</Text>
        </View>
        <TouchableOpacity onPress={() => copyToClipboard(item)}>
          <Text style={[styles.copyIcon, { color: colors.mutedText }]}>📋</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.cardText, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderHintItem = ({ item, index }: { item: string; index: number }) => (
    <View
      style={[styles.hintCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.hintBullet, { backgroundColor: colors.primary }]} />
      <Text style={[styles.hintText, { color: colors.text }]}>{item}</Text>
    </View>
  );

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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Your Results</Text>
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
                activeTab === 'suggestions' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('suggestions')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'suggestions' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Suggestions
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor:
                      activeTab === 'suggestions' ? colors.primary : colors.mutedText,
                  },
                ]}>
                <Text style={styles.tabBadgeText}>{result.dmSuggestions?.length || 0}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'hints' && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
              onPress={() => setActiveTab('hints')}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'hints' ? colors.primary : colors.mutedText,
                  },
                ]}>
                Tips
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor: activeTab === 'hints' ? colors.primary : colors.mutedText,
                  },
                ]}>
                <Text style={styles.tabBadgeText}>{result.hints?.length || 0}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'suggestions' ? (
              <>
                <Text style={[styles.contentDescription, { color: colors.mutedText }]}>
                  Tap any suggestion to copy it to your clipboard
                </Text>
                <FlatList
                  data={result.dmSuggestions || []}
                  renderItem={renderSuggestionItem}
                  keyExtractor={(_, index) => `suggestion-${index}`}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <>
                <Text style={[styles.contentDescription, { color: colors.mutedText }]}>
                  Keep these tips in mind when sending your message
                </Text>
                <FlatList
                  data={result.hints || []}
                  renderItem={renderHintItem}
                  keyExtractor={(_, index) => `hint-${index}`}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}
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
  contentDescription: {
    fontSize: 13,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  copyIcon: {
    fontSize: 20,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  hintCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  hintBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  hintText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
