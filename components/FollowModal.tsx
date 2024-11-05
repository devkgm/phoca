import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { FollowUser } from '@/interfaces/interface';
import UserProfileLink from '@/components/UserProfileLink';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import BottomSheetModal from './BottomSheetModal';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/context/auth';

interface FollowModalProps {
  visible: boolean;
  onClose: () => void;
  title: '팔로워' | '팔로잉';
  userId: string;
  onFollowUpdate?: () => void;
}

export default function FollowModal({ visible, onClose, title, userId, onFollowUpdate }: FollowModalProps) {
  if (!visible) return null;

  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);
  const { userId: currentUserId } = useAuth();
  
  const { following: myFollowing, handleFollow } = useFollow(currentUserId);
  const { followers: ownerFollowers, following: ownerFollowing } = useFollow(userId);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.ease
      });
      backdropOpacity.value = withTiming(1, { 
        duration: 250 
      });
    } else {
      translateY.value = withTiming(1000, {
        duration: 200,
        easing: Easing.ease
      });
      backdropOpacity.value = withTiming(0, { 
        duration: 200 
      });
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

  const toggleFollow = async (targetUserId: string) => {
    await handleFollow(targetUserId);
    if (onFollowUpdate) onFollowUpdate();
  };

  const isUserFollowing = (targetUserId: string) => {
    return myFollowing.some(user => user._id === targetUserId);
  };

  const displayUsers = title === '팔로워' ? ownerFollowers : ownerFollowing;

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
        {displayUsers.map((user) => (
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
            {user._id !== currentUserId && (
              <TouchableOpacity
                style={[
                  styles.followButton,
                  { backgroundColor: isUserFollowing(user._id) ? "#FF4500" : Colors.light.tint }
                ]}
                onPress={() => toggleFollow(user._id)}
              >
                <ThemedText style={styles.followButtonText}>
                  {isUserFollowing(user._id) ? '언팔로우' : '맞팔로우'}
                </ThemedText>
              </TouchableOpacity>
            )}
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
  followButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
