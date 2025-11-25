import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

export default function MediaImage() {
  const params = useLocalSearchParams<{ uri: string }>();
  const uri = params.uri as string;
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <ExpoImage source={{ uri }} style={{ flex: 1 }} contentFit="contain" />
    </View>
  );
}
