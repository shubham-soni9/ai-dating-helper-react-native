import { View, Text } from 'react-native';

export default function MessagesTab() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fde2e2',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#1f2937' }}>Messages</Text>
      <Text style={{ marginTop: 8, color: '#374151' }}>Chat and conversations</Text>
    </View>
  );
}
