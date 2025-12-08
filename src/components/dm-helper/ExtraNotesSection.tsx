import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ExtraNotesSectionProps {
  visible: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
  onToggle: () => void;
}

export default function ExtraNotesSection({
  visible,
  notes,
  onNotesChange,
  onToggle,
}: ExtraNotesSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {!visible ? (
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={onToggle}
          activeOpacity={0.7}>
          <Text style={[styles.addButtonIcon, { color: colors.primary }]}>+</Text>
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Extra Notes</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.notesContainer}>
          <View style={styles.notesHeader}>
            <Text style={[styles.notesTitle, { color: colors.text }]}>Extra Notes</Text>
            <TouchableOpacity
              onPress={onToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.removeButton, { color: colors.mutedText }]}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.notesDescription, { color: colors.mutedText }]}>
            Add any specific details or context to personalize your message
          </Text>
          <TextInput
            value={notes}
            onChangeText={onNotesChange}
            placeholder="E.g., We met at a coffee shop last week..."
            placeholderTextColor={colors.mutedText}
            style={[
              styles.textArea,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  notesContainer: {
    width: '100%',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    fontSize: 13,
    fontWeight: '500',
  },
  notesDescription: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
  },
});
