import { View, Text } from 'react-native';

export default function SettingsTab() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f3e8ff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#1f2937' }}>Settings</Text>
      <Text style={{ marginTop: 8, color: '#374151' }}>App preferences</Text>
    </View>
  );
}
