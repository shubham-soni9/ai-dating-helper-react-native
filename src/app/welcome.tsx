import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useAuth } from '@/auth/AuthProvider';

export default function Welcome() {
  const route = useRouter();
  const { session, subscription, initialized } = useAuth();

  const openCreateUser = () => {
    if (session) {
      if (!subscription.isSubscribed) {
        route.push('/payments');
      } else {
        route.push('/dashboard');
      }
    } else {
      route.push('/create-user');
    }
  };

  const videoAssetId = require('assets/intro-video.mp4');

  const player = useVideoPlayer(videoAssetId, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <SafeAreaView className="flex-1 items-center">
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        <VideoView
          player={player}
          style={{ width: '100%', height: '70%' }}
          contentFit="cover"
          nativeControls={false}
        />

        <Text className="mb-4 mt-5 text-2xl font-bold">Let&apos;s up your game</Text>

        <StarRatingDisplay
          rating={5}
          starSize={24}
          color="#FA7000"
          starStyle={{ marginHorizontal: 0 }}
        />

        <Text className="mx-10 my-5 text-center text-xl">
          Join <Text className="text-3xl font-bold">10000+</Text> happy users increasing their
          matches every day
        </Text>

        <Button
          style={styles.button}
          labelStyle={{ fontSize: 20, fontWeight: '700' }}
          contentStyle={{ flexDirection: 'row-reverse', paddingVertical: 8 }}
          mode="contained"
          onPress={openCreateUser}
          icon="arrow-right">
          Continue
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
  },
  scrollStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
});

// First Screen
