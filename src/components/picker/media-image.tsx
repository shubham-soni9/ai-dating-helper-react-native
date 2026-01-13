import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';

export default function MediaImage() {
  const params = useLocalSearchParams<{ uri: string }>();
  const uri = params.uri as string;
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ExpoImage source={{ uri }} style={{ flex: 1 }} contentFit="contain" />
    </View>
  );
}
