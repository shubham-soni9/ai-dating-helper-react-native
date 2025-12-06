import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Image, FlatList } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import { DMParams, DMRequest, DMResult } from '@/types/dm';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/auth/AuthProvider';

type Picked = { uri: string };

export default function DMHelper() {
  const { colors } = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [images, setImages] = useState<Picked[]>([]);
  const [params, setParams] = useState<DMParams>({ category: '', tone: '', intention: '' });
  const [prompt, setPrompt] = useState('');

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow media library access.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled) {
      setImages(res.assets.map((a) => ({ uri: a.uri })));
    }
  };

  const buildPrompt = () => {
    const parts = [
      `Category: ${params.category}`,
      `Tone: ${params.tone}`,
      `Intention: ${params.intention}`,
      `Notes: ${prompt}`,
    ];
    return parts.join('\n');
  };

  const onSubmit = async () => {
    try {
      const api = process.env.EXPO_PUBLIC_DM_API_URL;
      const body: DMRequest = {
        imageUrls: images.map((i) => i.uri),
        category: params.category,
        tone: params.tone,
        intention: params.intention,
        prompt: buildPrompt(),
        userId: session?.userId || 'anon',
      };
      let result: DMResult;
      if (api) {
        const res = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : '',
          },
          body: JSON.stringify(body),
        });
        result = (await res.json()) as DMResult;
      } else {
        result = {
          suggestions: [
            { text: 'Hey, loved your recent post—what inspired it?' },
            { text: 'Your vibe is great. What’s the story behind that photo?' },
          ],
          hints: ['Keep it specific', 'Invite a reply without pressure'],
        };
      }
      const prev = await SecureStore.getItemAsync('recent_tools');
      const next = [
        { key: 'dm-helper', title: 'DM Girl By Screenshot' },
        ...((prev ? JSON.parse(prev) : []) as { key: string; title: string }[]),
      ].slice(0, 6);
      await SecureStore.setItemAsync('recent_tools', JSON.stringify(next));
      const histPrev = await SecureStore.getItemAsync('recent_history');
      const histNext = [
        {
          id: String(Date.now()),
          title: body.prompt.slice(0, 40) + '…',
          tool: 'DM Helper',
          thumbnailUrl: images[0]?.uri,
          createdAt: Date.now(),
        },
        ...((histPrev ? JSON.parse(histPrev) : []) as any[]),
      ].slice(0, 20);
      await SecureStore.setItemAsync('recent_history', JSON.stringify(histNext));
      router.push({ pathname: '/tools/dm-result', params: { data: JSON.stringify(result) } });
    } catch {
      Alert.alert('Error', 'Failed to generate suggestions.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>DM Helper</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={params.category}
          onChangeText={(t) => setParams((p) => ({ ...p, category: t }))}
          placeholder="Category"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
          ]}
        />
        <TextInput
          value={params.tone}
          onChangeText={(t) => setParams((p) => ({ ...p, tone: t }))}
          placeholder="Tone"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
          ]}
        />
        <TextInput
          value={params.intention}
          onChangeText={(t) => setParams((p) => ({ ...p, intention: t }))}
          placeholder="Intention"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
          ]}
        />
      </View>
      <View style={{ height: 12 }} />
      <Button title="Pick Screenshot" onPress={pickImages} />
      <FlatList
        horizontal
        data={images}
        keyExtractor={(i, idx) => i.uri + idx}
        contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={{ width: 80, height: 120, borderRadius: 8 }} />
        )}
      />
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Notes to personalize"
        placeholderTextColor={colors.mutedText}
        style={[
          styles.notes,
          { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
        ]}
        multiline
      />
      <View style={{ height: 12 }} />
      <Button title="Generate" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  notes: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 100,
  },
});
