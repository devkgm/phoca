import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions, FlatList, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageViewing from 'react-native-image-viewing';
import { API_DOMAIN } from '@/config/api';
import { DayImage } from "@/interfaces/interface";

interface ImageViewerProps {
  isVisible: boolean;
  images: DayImage[];
  initialImageIndex: number;
  onClose: () => void;
}

const ImageViewer = ({ isVisible, images, initialImageIndex, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  useEffect(() => {
    if (isVisible) {
      setCurrentIndex(initialImageIndex);
    }
  }, [isVisible, initialImageIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  const imageUrls = images.map(image => ({ uri: API_DOMAIN + '/' + image.path }));

  return (
    <ImageViewing
      images={imageUrls}
      imageIndex={currentIndex}
      visible={isVisible}
      onRequestClose={onClose}
      HeaderComponent={({ imageIndex }) => (
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{imageIndex + 1} / {images.length}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
});

export default ImageViewer;
