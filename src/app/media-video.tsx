import { useLocalSearchParams } from 'expo-router';
import { View, Button } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

export default function MediaVideo() {
  const params = useLocalSearchParams<{ uri: string }>();
  const uri = params.uri as string;
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
      <VideoView
        style={{ flex: 1 }}
        player={player}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={{ padding: 12 }}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => (isPlaying ? player.pause() : player.play())}
        />
      </View>
    </View>
  );
}
