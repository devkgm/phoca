import { API_DOMAIN } from "@/config/api";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DayImage, SharedPost, Like, Comment } from "@/interfaces/interface";
import { useAuth } from "@/context/auth";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { socialAPI } from '@/utils/api';
import CommentModal from '@/components/CommentModal';
import UserProfileLink from '@/components/UserProfileLink';

const { width } = Dimensions.get('window');
const IMAGE_GAP = 10;
const IMAGE_HEIGHT = width * 0.6;

interface PostCardProps {
  item: SharedPost;
  userId: string;
  onLikesUpdate: (newLikes: Like[]) => void;
  onCommentsUpdate: (newComments: Comment[]) => void;
}

export default function PostCard({ item, userId, onLikesUpdate, onCommentsUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { userId: currentUserId } = useAuth();
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setIsLiked(item.likes.some(like => like.userId._id === currentUserId));
  }, [item.likes, currentUserId]);

  const renderImage = ({ item: image }: { item: DayImage }) => (
    <Image
      source={{ uri: API_DOMAIN + "/" + image.path }}
      style={[
        styles.slideImage,
        { height: IMAGE_HEIGHT, width: (IMAGE_HEIGHT / image.height) * image.width, borderRadius: 10 }
      ]}
      resizeMode="contain"
    />
  );
  const handleLike = async () => {
    try {
      const response = await socialAPI.toggleLike(item._id, currentUserId as string);
      onLikesUpdate(response.data.likes);
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const navigateToProfile = () => {
    router.push({
      pathname: '/(tabs)/home/profile',
      params: {
        userId: item.userId,
        userName: item.userName
      }
    });
  };

  const handleCommentsUpdate = (newComments: Comment[]) => {
    onCommentsUpdate(newComments);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <UserProfileLink
          userId={item.userId}
          name={item.userName}
          profileImage={item.profileImage}
          routePath="/(tabs)/home/profile"
          size="small"
        />
      </View>

      {item.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <FlatList
            data={item.images}
            renderItem={renderImage}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(image) => image._id}
            decelerationRate="normal"
            contentContainerStyle={styles.imageList}
          />
        </View>
      )}
      <Text style={styles.content}>{item.content}</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={handleLike}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? Colors.light.tint : Colors.light.text} 
          />
          <Text style={styles.socialCount}>{item.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={() => setShowComments(true)}
        >
          <Ionicons name="chatbubble-outline" size={24} color={Colors.light.text} />
          <Text style={styles.socialCount}>{item.comments.length}</Text>
        </TouchableOpacity>
      </View>

      <CommentModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        diaryId={item._id}
        userId={userId}
        comments={item.comments}
        onCommentsUpdate={handleCommentsUpdate}
      />
    </View>
  );
}    
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  carouselContainer: {
    marginBottom: 15,
  },
  imageList: {
    gap: IMAGE_GAP,
  },
  slideImage: {
    backgroundColor: '#f8f8f8',
  },
  content: {
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  socialCount: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.light.text,
  },
});
