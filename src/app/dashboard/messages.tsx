import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function MessagesTab() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>Messages</Text>
      <Text style={{ marginTop: 8, color: colors.mutedText }}>Chat and conversations</Text>
    </View>
  );
}
