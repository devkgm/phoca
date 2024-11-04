import { View, Modal, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { userAPI } from '@/utils/api';
import { FollowUser } from '@/interfaces/interface';
import { useRouter } from 'expo-router';
import { API_DOMAIN } from '@/config/api';

interface FollowModalProps {
  visible: boolean;
  onClose: () => void;
  title: '팔로워' | '팔로잉';
  userId: string;
}

export default function FollowModal({ visible, onClose, title, userId }: FollowModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible, userId]);

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

  const handleUserPress = (userId: string) => {
    onClose();
    router.push(`/home/profile?userId=${userId}`);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>{title}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.userList}>
            {users.map((user) => (
              <TouchableOpacity 
                key={user._id} 
                style={styles.userItem}
                onPress={() => handleUserPress(user._id)}
              >
                {user.profileImage ? (
                  <Image 
                    source={{ uri: API_DOMAIN + '/' + user.profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImage}>
                    <Ionicons name="person-circle-outline" size={40} color={Colors.light.icon} />
                  </View>
                )}
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>{user.name}</ThemedText>
                  <ThemedText style={styles.userBio}>{user.bio}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
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
}); 