import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';

type PickedImage = { uri: string; base64?: string | null };

interface ImagePickerSectionProps {
  image: PickedImage | null;
  onImagePicked: (image: PickedImage) => void;
}

export default function ImagePickerSection({ image, onImagePicked }: ImagePickerSectionProps) {
  const { colors } = useTheme();

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please allow media library access to pick images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      onImagePicked({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Screenshot</Text>
      <Text style={[styles.description, { color: colors.mutedText }]}>
        Upload a screenshot of the profile or post you want to message about
      </Text>

      <TouchableOpacity
        style={[
          styles.picker,
          {
            backgroundColor: colors.surface,
            borderColor: image ? colors.primary : colors.border,
          },
        ]}
        onPress={pickImage}
        activeOpacity={0.7}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <View style={[styles.changeOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
              <Text style={styles.changeText}>Tap to change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.iconText, { color: colors.primary }]}>📷</Text>
            </View>
            <Text style={[styles.placeholderText, { color: colors.text }]}>
              Tap to select image
            </Text>
            <Text style={[styles.placeholderSubtext, { color: colors.mutedText }]}>
              JPG, PNG supported
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  picker: {
    borderWidth: 2,
    borderRadius: 16,
    borderStyle: 'dashed',
    overflow: 'hidden',
    minHeight: 200,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    alignItems: 'center',
  },
  changeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 13,
  },
});
