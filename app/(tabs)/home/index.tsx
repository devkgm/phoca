import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { Colors } from '@/constants/Colors';
import { diaryAPI } from '@/utils/api';
import PostCard from '@/components/PostCard';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import { ThemedText } from '@/components/ThemedText';
import {SharedPost} from "@/interfaces/interface";

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 50;

export default function HomeScreen() {
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
        renderItem={PostCard}
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