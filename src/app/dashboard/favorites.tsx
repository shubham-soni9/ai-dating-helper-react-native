import { View, Text } from 'react-native';

export default function FavoritesTab() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#1f2937' }}>Favorites</Text>
      <Text style={{ marginTop: 8, color: '#374151' }}>Your saved items</Text>
    </View>
  );
}
