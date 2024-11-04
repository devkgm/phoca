import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useState, useCallback, useRef, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth';
import DiaryEditor from '@/components/DiaryEditor';
import { userAPI } from '@/utils/api';
import { UserInfo } from '@/interfaces/interface'


export default function MyPageScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '로딩 중...',
    email: '',
    bio: ''
  });
  const scrollViewRef = useRef(null);
  const calendarRef = useRef<View>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const fetchUserInfo = async () => {
    if (!userId) return;

    try {
      const response = await userAPI.getUser(userId);
      setUserInfo(response.data.user);
    } catch (error) {
      console.error('사용자 정보 로딩 실패:', error);
      Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [userId])
  );

  const handleEditProfile = () => {
    router.push({
      pathname: '/user/edit',
      params: {
        name: userInfo.name,
        bio: userInfo.bio
      }
    });
  };

  const scrollToCalendar = () => {
    if (calendarRef.current && scrollViewRef.current) {
      calendarRef.current.measureLayout(
        // @ts-ignore - RN 타입 정의의 한계
        scrollViewRef.current,
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({
            y: y - 20, // 헤더 높이와 여백을 고려한 오프셋
            animated: true
          });
        },
        () => console.error("측정 실패")
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.userName}>
          {userInfo.name}
        </ThemedText>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil-outline" size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => router.push('/user/setting')}
          >
            <Ionicons name="settings-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef}>
        <View style={styles.topSection}>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Ionicons name="person-circle-outline" size={80} color={Colors.light.icon} />
            </View>
            <ThemedText style={styles.userBio}>
              {userInfo.bio}
            </ThemedText>
          </View>

          <View ref={calendarRef} style={styles.calendarSection}>
            <Calendar 
              onSelectDate={(date: Date) => {
                setSelectedDate(date);
              }}
              refresh={refresh}
            />
          </View>
        </View>

        <View style={styles.diarySection}>
          <DiaryEditor 
            onSave={fetchUserInfo}
            selectedDate={selectedDate}
            setRefresh={setRefresh}
          />
        </View>
      </ScrollView>

      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 10,
    marginRight: 10,
  },
  settingButton: {
    padding: 10,
  },
  topSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  profileSection: {
    width: '35%',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userBio: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
    color: Colors.light.text,
  },
  calendarSection: {
    width: '62%',
  },
  diarySection:{},
  imageSlider: {
    flexGrow: 0,
    marginTop: 10,
  },
 
});
