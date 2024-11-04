import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { API_DOMAIN } from '@/config/api';

interface ProfileSectionProps {
  userInfo: {
    name: string;
    bio: string;
    profileImage?: string;
  };
  followers: number;
  following: number;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
  followButton?: React.ReactNode;
}

export default function ProfileSection({
  userInfo,
  followers,
  following,
  onFollowersPress,
  onFollowingPress,
  followButton
}: ProfileSectionProps) {
  return (
    <View style={styles.profileSection}>
      <View style={styles.profileImage}>
        {userInfo.profileImage ? (
          <Image 
            source={{ uri: API_DOMAIN + '/' + userInfo.profileImage }}
            style={styles.profileImageStyle}
          />
        ) : (
          <Ionicons name="person-circle-outline" size={80} color={Colors.light.icon} />
        )}
      </View>
      
      {followButton}

      <View style={styles.followInfo}>
        <TouchableOpacity 
          style={styles.followItem}
          onPress={onFollowersPress}
        >
          <ThemedText style={styles.followCount}>{followers}</ThemedText>
          <ThemedText style={styles.followLabel}>팔로워</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.followItem}
          onPress={onFollowingPress}
        >
          <ThemedText style={styles.followCount}>{following}</ThemedText>
          <ThemedText style={styles.followLabel}>팔로잉</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.userBio}>{userInfo.bio}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
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
  profileImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
}); 