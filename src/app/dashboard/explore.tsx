import { View, Text } from 'react-native';

export default function ExploreTab() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#dcfce7',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#1f2937' }}>Explore</Text>
      <Text style={{ marginTop: 8, color: '#374151' }}>Discover new content here</Text>
    </View>
  );
}
