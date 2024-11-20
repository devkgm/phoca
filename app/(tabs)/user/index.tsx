import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
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
import FollowModal from '@/components/FollowModal';
import { API_DOMAIN } from '@/config/api';
import ProfileSection from '@/components/ProfileSection';
import { useAlert } from '@/context/alert';

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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const { alert } = useAlert();
  const fetchUserInfo = async () => {
    if (!userId) return;

    try {
      const response = await userAPI.getUser(userId);
      setUserInfo(response.data.user);
    } catch (error) {
      console.error('사용자 정보 로딩 실패:', error);
      alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const fetchFollowInfo = async () => {
    if (!userId) return;

    try {
      const [followersRes, followingRes] = await Promise.all([
        userAPI.getFollowers(userId),
        userAPI.getFollowing(userId)
      ]);
      setFollowers(followersRes.data.followers);
      setFollowing(followingRes.data.following);
    } catch (error) {
      console.error('팔로우 정보 로딩 실패:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
      fetchFollowInfo();
    }, [userId])
  );

  const handleEditProfile = () => {
    router.push({
      pathname: '/user/edit',
      params: {
        name: userInfo.name,
        bio: userInfo.bio,
        profileImage: userInfo.profileImage
      }
    });
  };

  const handleFollowUpdate = () => {
    fetchFollowInfo();
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
          <ProfileSection
            userInfo={userInfo}
            followers={followers.length}
            following={following.length}
            onFollowersPress={() => setShowFollowers(true)}
            onFollowingPress={() => setShowFollowing(true)}
          />

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

      <FollowModal
        visible={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="팔로워"
        userId={userId as string}
        onFollowUpdate={handleFollowUpdate}
      />
      <FollowModal
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="팔로잉"
        userId={userId as string}
        onFollowUpdate={handleFollowUpdate}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
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
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  followItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  followCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  followLabel: {
    fontSize: 12,
    color: Colors.light.text,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userList: {
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userBio: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 2,
  },
  profileImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
