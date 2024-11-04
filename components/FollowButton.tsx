import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

interface FollowButtonProps {
  isFollowing: boolean;
  onPress: () => void;
}

export default function FollowButton({ isFollowing, onPress }: FollowButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.followButton, isFollowing && styles.followingButton]} 
      onPress={onPress}
    >
      <ThemedText style={[
        styles.followButtonText,
        isFollowing && styles.followingButtonText
      ]}>
        {isFollowing ? '팔로잉' : '팔로우'}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 10,
  },
  followingButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: Colors.light.tint,
  },
}); 