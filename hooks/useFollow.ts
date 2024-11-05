import { useState, useEffect } from 'react';
import { userAPI } from '@/utils/api';
import { FollowUser } from '@/interfaces/interface';
import { Alert } from 'react-native';

export const useFollow = (currentUserId: string | null, targetUserId?: string) => {
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchFollowInfo = async () => {
    if (!currentUserId) return;
    
    try {
      // targetUserId가 있으면 해당 유저의 팔로우 정보를, 없으면 현재 유저의 정보를 가져옴
      const userId = targetUserId || currentUserId;
      const [followersRes, followingRes] = await Promise.all([
        userAPI.getFollowers(userId),
        userAPI.getFollowing(userId)
      ]);
      setFollowers(followersRes.data.followers);
      setFollowing(followingRes.data.following);
      
      // targetUserId가 있을 때만 isFollowing 상태를 설정
      if (targetUserId) {
        setIsFollowing(followersRes.data.followers.some(
          (follower: FollowUser) => follower._id === currentUserId
        ));
      }
    } catch (error) {
      console.error('팔로우 정보 로딩 실패:', error);
    }
  };

  const handleFollow = async (targetId?: string) => {
    if (!currentUserId || (!targetId && !targetUserId)) return;
    
    const userToFollow = targetId || targetUserId;
    if (!userToFollow) return;

    try {
      // 현재 팔로우 상태 확인
      const followersRes = await userAPI.getFollowers(userToFollow);
      const currentIsFollowing = followersRes.data.followers.some(
        (follower: FollowUser) => follower._id === currentUserId
      );

      if (currentIsFollowing) {
        console.log('언팔로우');
        await userAPI.unfollowUser(userToFollow, currentUserId);
      } else {
        console.log('팔로우');
        await userAPI.followUser(userToFollow, currentUserId);
      }
      setIsFollowing(!currentIsFollowing);
      fetchFollowInfo(); // 팔로우 정보 새로고침
    } catch (error) {
      console.error('팔로우 작업 실패:', error);
      Alert.alert('오류', '작업을 완료할 수 없습니다.');
    }
  };

  useEffect(() => {
    fetchFollowInfo();
  }, [currentUserId, targetUserId]);

  return {
    followers,
    following,
    isFollowing,
    handleFollow,
    fetchFollowInfo
  };
}; 