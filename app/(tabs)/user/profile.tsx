import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Modal, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useState, useCallback, useEffect, useRef } from 'react';
import Calendar from '@/components/Calendar';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth';
import DiaryEditor from '@/components/DiaryEditor';
import { diaryAPI, userAPI } from '@/utils/api';
import { UserInfo, FollowUser, Diary } from '@/interfaces/interface';
import ImageViewer from '@/components/ImageViewer';
import FollowModal from '@/components/FollowModal';
import FollowButton from '@/components/FollowButton';
import { useFollow } from '@/hooks/useFollow';
import PostCard from '@/components/PostCard';
import { format } from 'date-fns';
import DiaryCard from '@/components/DiaryCard';
import { ko } from 'date-fns/locale';
import { useNavigation } from 'expo-router';
import { API_DOMAIN } from '@/config/api';
import ProfileSection from '@/components/ProfileSection';

export default function UserProfileScreen() {
  const { userId: currentUserId } = useAuth();
  const { userId, userName } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: userName as string || '로딩 중...',
    email: '',
    bio: ''
  });
  const [showImageViewer, setShowImageViewer] = useState(false);
  const scrollViewRef = useRef(null);
  const calendarRef = useRef<View>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [diary, setDiary] = useState<Diary | null>(null);
  const navigation = useNavigation();

  const { 
    followers, 
    following, 
    isFollowing, 
    handleFollow 
  } = useFollow(userId as string, currentUserId);

  const fetchUserInfo = async () => {
    try {
      const response = await userAPI.getUser(userId as string);
      setUserInfo(response.data.user);
    } catch (error) {
      console.error('사용자 정보 로딩 실패:', error);
      Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
    }
  };
  const fetchDiary = async () => {
    if (!userId) return;

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ko });
      const response = await diaryAPI.getSharedPostsByUserDate(userId as string, formattedDate);
      if (response.data.post) {
        setDiary(response.data.post);
      } else {
        setDiary(null);
      }
    } catch (error) {
      console.error('다이어리 로딩 실패:', error);
    }
  };
  useEffect(() => {
    fetchDiary();
  }, [selectedDate]);
  useEffect(() => {
    fetchUserInfo();
  }, [userId]);
  useEffect(() => {
    navigation.setOptions({
      title: userInfo.name
    });
  }, [userInfo.name]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.topSection}>
          <ProfileSection
            userInfo={userInfo}
            followers={followers.length}
            following={following.length}
            onFollowersPress={() => setShowFollowers(true)}
            onFollowingPress={() => setShowFollowing(true)}
            followButton={
              currentUserId !== userId && (
                <TouchableOpacity 
                  style={[
                    styles.followButton,
                    isFollowing && styles.followingButton
                  ]}
                  onPress={handleFollow}
                >
                  <ThemedText style={styles.followButtonText}>
                    {isFollowing ? '언팔로우' : '팔로우'}
                  </ThemedText>
                </TouchableOpacity>
              )
            }
          />

          <View ref={calendarRef} style={styles.calendarSection}>
            <Calendar 
              onSelectDate={setSelectedDate}
              refresh={refresh}
            />
          </View>
        </View>

        <View style={styles.diarySection}>
          {diary && <DiaryCard item={diary} userId={userId as string} />}
        </View>
      </ScrollView>

      <Modal
        visible={showImageViewer}
        transparent={true}
        onRequestClose={() => setShowImageViewer(false)}
      >
        <ImageViewer
          selectedDate={selectedDate}
          userId={userId as string}
          onClose={() => setShowImageViewer(false)}
        />
      </Modal>

      <FollowModal
        visible={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="팔로워"
        userId={userId as string}
      />
      <FollowModal
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="팔로잉"
        userId={userId as string}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  followItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  followCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  followLabel: {
    fontSize: 12,
    color: Colors.light.text,
  },
  userBio: {
    textAlign: 'center',
    marginVertical: 10,
  },
  calendarSection: {
    width: '62%',
  },
  diarySection: {
    padding: 20,
  },
  followButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 10,
  },
  followingButton: {
    backgroundColor: '#ccc',
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
