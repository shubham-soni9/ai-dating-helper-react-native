import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import faqData from '@/data/faqs.json';

export default function FAQ() {
  const { colors } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      \n <Stack.Screen options={{ headerShown: true, title: 'FAQ & Help Center' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {faqData.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <View
              key={idx}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <TouchableOpacity
                onPress={() => setOpenIndex(isOpen ? null : idx)}
                style={styles.header}>
                <Text style={[styles.question, { color: colors.text }]}>{item.q}</Text>
                <Text style={{ color: colors.mutedText }}>{isOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isOpen && <Text style={[styles.answer, { color: colors.mutedText }]}>{item.a}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  question: { fontSize: 16, fontWeight: '600' },
  answer: { marginTop: 8, fontSize: 14, lineHeight: 20 },
});
