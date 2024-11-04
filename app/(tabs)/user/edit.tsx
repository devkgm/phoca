import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/auth';
import { userAPI } from '@/utils/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = useAuth();
  const [name, setName] = useState(params.name as string);
  const [bio, setBio] = useState(params.bio as string);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }

    try {
      const response = await userAPI.updateUser(userId as string, {name, bio});

      Alert.alert('성공', '프로필이 업데이트되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            router.back();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('오류', '프로필 업데이트에 실패했습니다.');
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
}); 