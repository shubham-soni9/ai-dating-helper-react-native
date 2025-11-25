import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function MediaVideo() {
  const params = useLocalSearchParams<{ uri: string }>();
  const uri = params.uri as string;
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Video
        source={{ uri }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
      />
    </View>
  );
}
