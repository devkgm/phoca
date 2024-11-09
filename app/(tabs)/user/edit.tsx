import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/auth';
import { userAPI } from '@/utils/api';
import * as ImagePicker from 'expo-image-picker';
import { API_DOMAIN } from '@/config/api';
import { Ionicons } from '@expo/vector-icons';
import { useAlert } from '@/context/alert';

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = useAuth();
  const [name, setName] = useState(params.name as string);
  const [bio, setBio] = useState(params.bio as string);
  const [profileImage, setProfileImage] = useState(params.profileImage as string);
  const { alert } = useAlert();
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const formData = new FormData();
      const filename = result.assets[0].uri.split('/').pop();
      
      formData.append('image', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      try {
        const response = await userAPI.uploadProfileImage(userId as string, formData);
        setProfileImage(response.data.profileImage);
      } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error);
        alert("오류", "이미지 업로드에 실패했습니다.");
    }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("오류", "이름을 입력해주세요.");
      return;
    }

    try {
      const response = await userAPI.updateUser(userId as string, {
        name,
        bio,
        profileImage
      });

      alert("성공", "프로필이 업데이트되었습니다.", [
        {
          text: '확인',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      alert("오류", "프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText>취소</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>프로필 편집</ThemedText>
        <TouchableOpacity onPress={handleSave}>
          <ThemedText style={styles.saveButton}>저장</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image 
              source={{ uri: API_DOMAIN + '/' + profileImage }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.profileImage}>
              <Ionicons name="person-circle-outline" size={80} color={Colors.light.icon} />
            </View>
          )}
          <ThemedText style={styles.changePhotoText}>프로필 사진 변경</ThemedText>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>이름</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>소개</ThemedText>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="자기소개를 입력하세요"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    color: Colors.light.tint,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoText: {
    color: Colors.light.tint,
    fontSize: 16,
  },
}); 