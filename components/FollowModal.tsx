import { View, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { userAPI } from '@/utils/api';
import { FollowUser } from '@/interfaces/interface';
import { useRouter } from 'expo-router';
import UserProfileLink from '@/components/UserProfileLink';
import  { 
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import BottomSheetModal from './BottomSheetModal';

interface FollowModalProps {
  visible: boolean;
  onClose: () => void;
  title: '팔로워' | '팔로잉';
  userId: string;
}

export default function FollowModal({ visible, onClose, title, userId }: FollowModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.ease
      });
      backdropOpacity.value = withTiming(1, { 
        duration: 250 
      });
      fetchUsers();
    }
  }, [visible]);

  const handleClose = () => {
    translateY.value = withTiming(1000, {
      duration: 200,
      easing: Easing.ease
    });
    backdropOpacity.value = withTiming(0, { 
      duration: 200 
    });
    setTimeout(onClose, 200);
  };

  const handleProfilePress = () => {
    handleClose();
  };

  const fetchUsers = async () => {
    try {
      const response = await (title === '팔로워' 
        ? userAPI.getFollowers(userId)
        : userAPI.getFollowing(userId)
      );
      setUsers(title === '팔로워' ? response.data.followers : response.data.following);
    } catch (error) {
      console.error('팔로우 정보 로딩 실패:', error);
    }
  };

  if (!visible) return null;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      handleClose={handleClose}
      title={title}
      height="70%"
      translateY={translateY}
      backdropOpacity={backdropOpacity}
    >
      <ScrollView style={styles.userList}>
        {users.map((user) => (
          <View key={user._id} style={styles.userItem}>
            <View style={styles.userContent}>
              <UserProfileLink
                userId={user._id}
                name={user.name}
                profileImage={user.profileImage}
                routePath="/(tabs)/home/profile"
                size="medium"
                onPress={handleProfilePress}
              />
              <ThemedText style={styles.userBio}>{user.bio}</ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  userList: {
    padding: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userContent: {
    flex: 1,
  },
  userBio: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 4,
    marginLeft: 46,
  },
}); 