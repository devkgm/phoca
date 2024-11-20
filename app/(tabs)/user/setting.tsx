import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { useAlert } from '@/context/alert';
import { useAuth } from '@/context/auth';
import { userAPI } from '@/utils/api';

export default function SettingScreen() {
  const { alert } = useAlert();
  const { userId, logout } = useAuth();

  const handlePasswordChange = () => {
    router.push('/(tabs)/user/password');
  };

  const handleDeleteAccount = () => {
    alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: '탈퇴',
          style: 'confirm',
          onPress: async () => {
            try {
              if (!userId) return;
              await userAPI.deleteUser(userId);
              await logout();
              alert('완료', '회원 탈퇴가 완료되었습니다.', [
                {
                  text: '확인',
                  style: 'confirm',
                  onPress: () => router.replace('/')
                }
              ]);
            } catch (error) {
              alert('오류', '회원 탈퇴 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
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
          <ThemedText style={styles.headerTitle}>설정</ThemedText>
        </View>
        <View style={styles.headerButton}>
        </View>
      </View>
      
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handlePasswordChange}
        >
          <ThemedText>비밀번호 변경</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.deleteAccount]}
          onPress={handleDeleteAccount}
        >
          <ThemedText style={styles.deleteText}>회원 탈퇴</ThemedText>
        </TouchableOpacity>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deleteAccount: {
    marginTop: 30,
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
});