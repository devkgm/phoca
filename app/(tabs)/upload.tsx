import { View, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/auth';
import { imageAPI } from '@/utils/api';
import { useAlert } from '@/context/alert';

interface ImageState {
  uri: string;
  type: string;
  name: string;
}

 function UploadScreen() {
  const [images, setImages] = useState<ImageState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { userId } = useAuth();
  const { alert } = useAlert();
  
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => {
        const filename = asset.uri.split('/').pop() || 'image';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        return {
          uri: asset.uri,
          type,
          name: filename,
        };
      });

      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (images.length === 0 || !userId) {
      alert("오류", "이미지를 선택하거나 다시 로그인해주세요.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        } as any);
      });
      formData.append('userId', userId.toString());
      
      const response = await imageAPI.uploadImages(formData);

      alert("성공", "이미지가 업로드되었습니다.");
      setImages([]);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert("오류", error.response.data.message);
      } else {
        alert("오류", "이미지 업로드 중 오류가 발생했습니다.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>사진 업로드</ThemedText>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity 
          style={styles.uploadBox} 
          onPress={pickImages}
          disabled={isUploading}
        >
          <Ionicons name="images-outline" size={40} color="#666" />
          <ThemedText style={styles.uploadText}>
            사진을 선택하세요 (여러 장 선택 가능)
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.imageGrid}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                disabled={isUploading}
              >
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {images.length > 0 && (
          <TouchableOpacity 
            style={[
              styles.uploadButton,
              (isUploading) && styles.disabledButton
            ]}
            onPress={uploadImages}
            disabled={isUploading}
          >
            <ThemedText style={styles.buttonText}>
              {isUploading ? `업로드 중... (${images.length}장)` : `${images.length}장 업로드`}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  uploadBox: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  imageGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  uploadText: {
    marginTop: 10,
    color: '#666'
  },
  uploadButton: {
    width: '100%',
    backgroundColor: '#000',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 5,
    opacity: 0.9,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  disabledButton: {
    opacity: 0.5
  }
});
