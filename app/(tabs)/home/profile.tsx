import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useState, useCallback, useRef, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth';
import ImageViewer from '@/components/ImageViewer';
import DiaryEditor from '@/components/DiaryEditor';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { userAPI, imageAPI, diaryAPI } from '@/utils/api';
import { API_DOMAIN } from '@/config/api';
import { DayImage, UserInfo} from "@/interfaces/interface";

export default function MyPageScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));
  const [dayImages, setDayImages] = useState<DayImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '로딩 중...',
    email: '',
    bio: ''
  });
  const scrollViewRef = useRef(null);
  const calendarRef = useRef<View>(null);
  const [refresh, setRefresh] = useState<number>(0);
// 일별 이미지 가져오기
const fetchDayImages = async (date: Date|null) => {
  if (!userId || !date) return;
  
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const response = await imageAPI.getImagesByDay(userId, year, month, day);
    
    setDayImages(response.data.images);
  } catch (error) {
    console.error('일별 이미지 로딩 실패:', error);
    setDayImages([]); // 에러 발생 시 빈 배열 전달
  }
};
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

  const handleDeleteImage = async (imageId: string) => {
    try {
      await imageAPI.deleteImage(imageId);
      setDayImages(prev => prev.filter(img => img._id !== imageId));
      setRefresh(prev => prev + 1);
    } catch (error) {
      Alert.alert('오류', '이미지 삭제에 실패했습니다.');
    }
  };



  const renderItem = ({ item, drag, isActive }: RenderItemParams<DayImage>) => {
    return (
      <View style={[styles.imageSlideContainer, isActive && styles.activeImage]}>
        <TouchableOpacity 
          onPress={() => setSelectedImageIndex(dayImages.indexOf(item))}
          onLongPress={drag}
        >
          <Image
            source={{ uri: API_DOMAIN + '/' + item.path }}
            style={styles.galleryImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleDeleteImage(item._id)}
        >
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };



  useEffect(() => {
    fetchDayImages(selectedDate);
  }, [selectedDate]);

  

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
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
      <ScrollView ref={scrollViewRef}>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Ionicons name="person-circle-outline" size={100} color={Colors.light.icon} />
          </View>
          <ThemedText style={styles.userName}>
            {userInfo.name}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {userInfo.email}
          </ThemedText>
          <ThemedText style={styles.userBio}>
            {userInfo.bio}
          </ThemedText>
        </View>

        <View 
          ref={calendarRef}
          style={styles.calendarSection}
        >
          <Calendar 
            onSelectDate={(date: Date) => {
              setSelectedDate(date);
              scrollToCalendar();
            }}
            refresh={refresh}
          />
        </View>

        <View style={styles.diarySection}>
          <DiaryEditor 
            onSave={fetchUserInfo}
            selectedDate={selectedDate}
            setRefresh={setRefresh}
          />
        </View>

        
      </ScrollView>

      {selectedImageIndex !== -1 && dayImages.length > 0 && (
        <ImageViewer
          isVisible={selectedImageIndex !== -1}
          images={dayImages}
          initialImageIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
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
    justifyContent: 'flex-end'
  },
  editButton: {
    padding: 10,
    marginRight: 10,
  },
  settingButton: {
    padding: 10,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center'
  },
  profileImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  userEmail: {
    color: Colors.light.icon,
    marginBottom: 10
  },
  userBio: {
    textAlign: 'center',
    marginBottom: 20
  },
  calendarSection: {
    marginBottom: 0
  },
  
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  noImagesText: {
    textAlign: 'center',
    color: Colors.light.icon,
    marginTop: 20,
  },
  diarySection: {
  },
  imageSlider: {
    flexGrow: 0,
    marginTop: 10,
  },
  imageSlideContainer: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  activeImage: {
    opacity: 0.8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },

});
