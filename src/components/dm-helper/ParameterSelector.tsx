import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { DMParams } from '@/types/dm';
import Dropdown from './Dropdown';

interface Option {
  label: string;
  value: string;
}

interface ParameterSelectorProps {
  params: DMParams;
  onParamsChange: (params: DMParams) => void;
  categories: Option[];
  tones: Option[];
  intentions: Option[];
}

export default function ParameterSelector({
  params,
  onParamsChange,
  categories,
  tones,
  intentions,
}: ParameterSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Message Style</Text>
      <Text style={[styles.sectionDescription, { color: colors.mutedText }]}>
        Choose how you want your message to come across
      </Text>

      <View style={styles.row}>
        <View style={styles.dropdownWrapper}>
          <Text style={[styles.dropdownLabel, { color: colors.mutedText }]}>Category</Text>
          <Dropdown
            value={params.category}
            options={categories}
            onChange={(value) => onParamsChange({ ...params, category: value })}
            placeholder="Select category"
          />
        </View>

        <View style={styles.dropdownWrapper}>
          <Text style={[styles.dropdownLabel, { color: colors.mutedText }]}>Tone</Text>
          <Dropdown
            value={params.tone}
            options={tones}
            onChange={(value) => onParamsChange({ ...params, tone: value })}
            placeholder="Select tone"
          />
        </View>
      </View>

      <View style={styles.fullWidth}>
        <Text style={[styles.dropdownLabel, { color: colors.mutedText }]}>Intention</Text>
        <Dropdown
          value={params.intention}
          options={intentions}
          onChange={(value) => onParamsChange({ ...params, intention: value })}
          placeholder="Select intention"
        />
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
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dropdownWrapper: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
