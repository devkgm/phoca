import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet,  RefreshControl } from 'react-native';
import { diaryAPI } from '@/utils/api';
import PostCard from '@/components/PostCard';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import { ThemedText } from '@/components/ThemedText';
import {SharedPost} from "@/interfaces/interface";
import { useAuth } from '@/context/auth';
import { Like } from '@/interfaces/interface';

export default function HomeScreen() {
  const { userId } = useAuth();
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchSharedPosts = async (date: Date) => {
    try {
      const response = await diaryAPI.getSharedPosts();
      const allPosts = response.data.posts;
      
      // 선택된 날짜와 같은 날의 게시물만 필터링
      const filteredPosts = allPosts.filter((post: SharedPost) => {
        const postDate = new Date(post.date);
        return (
          postDate.getFullYear() === date.getFullYear() &&
          postDate.getMonth() === date.getMonth() &&
          postDate.getDate() === date.getDate()
        );
      });
      
      setSharedPosts(filteredPosts);
    } catch (error) {
      console.error('공유된 게시물 로딩 실패:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSharedPosts(selectedDate);
    setRefreshing(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchSharedPosts(date);
  };

  const updatePostLikes = (postId: string, newLikes: Like[]) => {
    setSharedPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: newLikes }
          : post
      )
    );
  };

  useEffect(() => {
    fetchSharedPosts(selectedDate);
  }, []);

  return (
    <View style={styles.container}>
      <WeeklyCalendar 
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
      />
      <FlatList
        data={sharedPosts}
        renderItem={({ item }) => (
          <PostCard 
            item={item} 
            userId={userId as string}
            onLikesUpdate={(newLikes) => updatePostLikes(item._id, newLikes)}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              이 날짜에 공유된 게시물이 없습니다.
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 