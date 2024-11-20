import { StyleSheet, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { useAlert } from '@/context/alert';
import { useAuth } from '@/context/auth';
import { userAPI } from '@/utils/api';
import { useState } from 'react';

const validatePassword = (password: string) => {
  // 최소 8자, 영문 대소문자, 숫자, 특수문자 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

export default function PasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { alert } = useAlert();
  const { userId } = useAuth();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (!validatePassword(newPassword)) {
      alert('오류', 
        '새 비밀번호는 다음 조건을 만족해야 합니다:\n' +
        '• 최소 8자 이상\n' +
        '• 영문 대문자 1개 이상\n' +
        '• 영문 소문자 1개 이상\n' +
        '• 숫자 1개 이상\n' +
        '• 특수문자 1개 이상 (@$!%*?&#)'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (!userId) return;
      await userAPI.changePassword(userId, {
        currentPassword,
        newPassword
      });

      alert('성공', '비밀번호가 변경되었습니다.', [
        {
          text: '확인',
          style: 'confirm',
          onPress: () => router.back()
        }
      ]);
    } catch (error: any) {
      alert('오류', error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.back()}
        >
          <ThemedText>취소</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>비밀번호 변경</ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleChangePassword}
        >
          <ThemedText style={styles.saveButton}>완료</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="현재 비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="새 비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="새 비밀번호 확인"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
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
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButton: {
    width: 50,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
}); 