import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Button from '@/components/Button';

export default function DeescalateTool() {
  const { colors } = useTheme();
  const [context, setContext] = useState('');
  const [tips, setTips] = useState<string[]>([]);

  const generate = () => {
    setTips([
      'Acknowledge feelings without agreeing with accusations',
      'Ask a clarifying question to reframe',
      'Offer a pause and suggest revisiting later',
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>De-escalation Tips</Text>
      <TextInput
        value={context}
        onChangeText={setContext}
        placeholder="Describe the chat context"
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
        ]}
        multiline
      />
      <Button title="Generate" onPress={generate} />
      {tips.map((t, i) => (
        <Text key={i} style={{ color: colors.mutedText, marginTop: 8 }}>
          • {t}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 100,
  },
});
