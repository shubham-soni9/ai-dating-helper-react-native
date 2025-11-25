import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeTab() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>Home</Text>
      <Text style={{ marginTop: 8, color: colors.mutedText }}>This is the Home tab</Text>
    </View>
  );
}
