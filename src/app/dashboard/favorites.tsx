import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function FavoritesTab() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>Favorites</Text>
      <Text style={{ marginTop: 8, color: colors.mutedText }}>Your saved items</Text>
    </View>
  );
}
