import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Text, Pressable, Image, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';

type MediaAsset = {
  uri: string;
  type: 'image' | 'video';
  thumbUri?: string;
};

export default function MediaPicker() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const router = useRouter();

  const pickMedia = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow media library access to pick files.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const base: MediaAsset[] = result.assets.map((a) => ({
        uri: a.uri,
        type: a.type === 'video' ? 'video' : 'image',
      }));
      const withThumbs: MediaAsset[] = await Promise.all(
        base.map(async (item) => {
          if (item.type === 'video') {
            try {
              const { uri } = await VideoThumbnails.getThumbnailAsync(item.uri, { time: 1000 });
              return { ...item, thumbUri: uri };
            } catch {
              return item;
            }
          }
          return item;
        })
      );
      setAssets(withThumbs);
    }
  };

  const ImageTile = ({ item }: { item: MediaAsset }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/media-image', params: { uri: item.uri } })}
      style={{ flex: 1, aspectRatio: 1, borderRadius: 8, overflow: 'hidden' }}>
      <Image
        source={{ uri: item.uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </Pressable>
  );

  const VideoTile = ({ item }: { item: MediaAsset }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/media-video', params: { uri: item.uri } })}
      style={{ flex: 1, aspectRatio: 1, borderRadius: 8, overflow: 'hidden' }}>
      <View style={{ width: '100%', height: '100%' }}>
        <Image
          source={{ uri: item.thumbUri || item.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            right: 6,
            bottom: 6,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 12,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}>
          <Text style={{ color: 'white', fontSize: 12 }}>▶︎</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Pressable
          onPress={pickMedia}
          style={{
            backgroundColor: '#2563eb',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            alignSelf: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Pick Images/Videos</Text>
        </Pressable>
      </View>
      <FlatList
        data={assets}
        keyExtractor={(item, index) => item.uri + index}
        renderItem={({ item }) =>
          item.type === 'image' ? <ImageTile item={item} /> : <VideoTile item={item} />
        }
        numColumns={3}
        contentContainerStyle={{ padding: 8, gap: 8 }}
        columnWrapperStyle={{ gap: 8 }}
      />
    </View>
  );
}
