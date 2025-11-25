import { View, Text } from 'react-native';

export default function HomeTab() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#1f2937' }}>Home</Text>
      <Text style={{ marginTop: 8, color: '#374151' }}>This is the Home tab</Text>
    </View>
  );
}
