import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Text, Pressable, Image, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

type MediaAsset = {
  uri: string;
  type: 'image' | 'video';
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
      const next: MediaAsset[] = result.assets.map(
        (a) =>
          ({
            uri: a.uri,
            type: a.type === 'video' ? 'video' : 'image',
          }) as const
      );
      setAssets(next);
    }
  };

  const renderItem = ({ item }: { item: MediaAsset }) => (
    <Pressable
      onPress={() =>
        item.type === 'image'
          ? router.push({ pathname: '/media-image', params: { uri: item.uri } })
          : router.push({ pathname: '/media-video', params: { uri: item.uri } })
      }
      style={{ flex: 1, aspectRatio: 1, borderRadius: 8, overflow: 'hidden' }}>
      {item.type === 'image' ? (
        <Image
          source={{ uri: item.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <Video
          source={{ uri: item.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode={ResizeMode.COVER}
          isMuted
        />
      )}
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
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={{ padding: 8, gap: 8 }}
        columnWrapperStyle={{ gap: 8 }}
      />
    </View>
  );
}
