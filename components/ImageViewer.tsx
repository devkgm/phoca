import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, FlatList, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { API_DOMAIN } from '@/config/api';
import { DayImage } from "@/interfaces/interface";


interface ImageViewerProps {
  isVisible: boolean;
  images: DayImage[];
  initialImageIndex: number;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ImageViewer = ({ isVisible, images, initialImageIndex, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  if (!images || images.length === 0) {
    return null;
  }

  const handleSwipe = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50 && currentIndex > 0) {
        // 오른쪽으로 스와이프
        setCurrentIndex(prev => prev - 1);
      } else if (translationX < -50 && currentIndex < images.length - 1) {
        // 왼쪽으로 스와이프
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const renderThumbnail = ({ item, index }: { item: DayImage; index: number }) => (
    <TouchableOpacity
      onPress={() => setCurrentIndex(index)}
      style={[
        styles.thumbnail,
        currentIndex === index && styles.selectedThumbnail
      ]}
    >
      <Image
        source={{ uri: API_DOMAIN + '/' + item.path }}
        style={styles.thumbnailImage}
        contentFit="cover"
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <PanGestureHandler
            onHandlerStateChange={handleSwipe}
          >
            <Animated.View 
              entering={FadeIn}
              style={styles.mainImageContainer}
            >
              <Image
                source={{ uri: API_DOMAIN + '/' + images[currentIndex].path }}
                style={styles.mainImage}
                contentFit="contain"
              />
            </Animated.View>
          </PanGestureHandler>

          {/* 이미지 인디케이터 */}
          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>

          {/* 썸네일 목록 */}
          <View style={styles.thumbnailContainer}>
            <FlatList
              data={images}
              renderItem={renderThumbnail}
              keyExtractor={item => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailList}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  mainImageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
  },
  thumbnailList: {
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 15,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ImageViewer; 