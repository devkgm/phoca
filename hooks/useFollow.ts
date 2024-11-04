import { useState, useEffect } from 'react';
import { userAPI } from '@/utils/api';
import { FollowUser } from '@/interfaces/interface';
import { Alert } from 'react-native';

export const useFollow = (targetUserId: string, currentUserId: string | null) => {
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchFollowInfo = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        userAPI.getFollowers(targetUserId),
        userAPI.getFollowing(targetUserId)
      ]);
      setFollowers(followersRes.data.followers);
      setFollowing(followingRes.data.following);
      
      setIsFollowing(followersRes.data.followers.some(
        (follower: FollowUser) => follower._id === currentUserId
      ));
    } catch (error) {
      console.error('팔로우 정보 로딩 실패:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId) return;
    
    try {
      if (isFollowing) {
        await userAPI.unfollowUser(targetUserId, currentUserId);
      } else {
        await userAPI.followUser(targetUserId, currentUserId);
      }
      setIsFollowing(!isFollowing);
      fetchFollowInfo(); // 팔로우 정보 새로고침
    } catch (error) {
      console.error('팔로우 작업 실패:', error);
      Alert.alert('오류', '작업을 완료할 수 없습니다.');
    }
  };

  useEffect(() => {
    fetchFollowInfo();
  }, [targetUserId, currentUserId]);

  return {
    followers,
    following,
    isFollowing,
    handleFollow,
    fetchFollowInfo
  };
}; 