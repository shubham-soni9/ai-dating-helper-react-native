import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Dropdown from './Dropdown';
import { DeescalatorParams } from '@/types/deescalator';

const WHAT_YOU_WANT_OPTIONS = [
  { label: 'Sort this out', value: 'sort_this_out' },
  { label: 'End this conversation', value: 'end_conversation' },
  { label: 'Help me break up', value: 'help_breakup' },
  { label: 'Make them understand', value: 'make_understand' },
  { label: 'Calm the situation', value: 'calm_situation' },
  { label: 'Apologize effectively', value: 'apologize' },
  { label: 'Set boundaries', value: 'set_boundaries' },
  { label: 'Avoid conflict', value: 'avoid_conflict' },
];

const TONE_OPTIONS = [
  { label: 'Intense', value: 'intense' },
  { label: 'Soft', value: 'soft' },
  { label: 'Humble', value: 'humble' },
  { label: 'Extra Humble', value: 'extra_humble' },
  { label: 'Firm', value: 'firm' },
  { label: 'Gentle', value: 'gentle' },
  { label: 'Direct', value: 'direct' },
  { label: 'Empathetic', value: 'empathetic' },
];

interface DeescalatorParameterSelectorProps {
  params: DeescalatorParams;
  onParamsChange: (params: DeescalatorParams) => void;
}

export default function DeescalatorParameterSelector({
  params,
  onParamsChange,
}: DeescalatorParameterSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Parameters</Text>

      <View style={styles.row}>
        <View style={styles.dropdownContainer}>
          <Text style={[styles.label, { color: colors.mutedText }]}>What you want</Text>
          <Dropdown
            options={WHAT_YOU_WANT_OPTIONS}
            value={params.whatYouWant}
            onChange={(value) => onParamsChange({ ...params, whatYouWant: value })}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={[styles.label, { color: colors.mutedText }]}>Tone</Text>
          <Dropdown
            options={TONE_OPTIONS}
            value={params.tone}
            onChange={(value) => onParamsChange({ ...params, tone: value })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
});
