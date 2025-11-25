import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import '../../global.css';

export default function App() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24 }}>Home</Text>
      <Pressable
        onPress={() => router.push('/media-picker')}
        style={{
          backgroundColor: '#2563eb',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Open Media Picker</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
