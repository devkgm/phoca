import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/auth';
import { diaryAPI, imageAPI } from '@/utils/api';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { API_DOMAIN } from '@/config/api';
import ImageViewer from './ImageViewer';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {Diary, DayImage} from '@/interfaces/interface';

interface DiaryEditorProps {
  selectedDate: Date;
  onSave?: () => void;
  setRefresh?: (value: number) => void;
  readOnly?: boolean;
  userId?: string;
}


export default function DiaryEditor({ onSave, selectedDate, setRefresh }: DiaryEditorProps) {
  const [content, setContent] = useState('');
  const { userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [diary, setDiary] = useState<Diary | null>(null);
  const [dayImages, setDayImages] = useState<DayImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  useEffect(() => {
    fetchDiary();
    checkSharedStatus();
  }, [selectedDate]);
  const handleDeleteImage = async (imageId: string) => {
    try {
      await imageAPI.deleteImage(imageId);
      setDayImages(prev => prev.filter(img => img._id !== imageId));
      setRefresh((prev: number) => prev + 1);
    } catch (error) {
      Alert.alert('오류', '이미지 삭제에 실패했습니다.');
    }
  };
  const renderItem = ({ item, drag, isActive }: RenderItemParams<DayImage>) => {
    return (
      <View style={[styles.imageSlideContainer, isActive && styles.activeImage]}>
        <TouchableOpacity 
          onPress={() => setSelectedImageIndex(dayImages.indexOf(item))}
          onLongPress={drag}
        >
          <Image
            source={{ uri: API_DOMAIN + '/' + item.path }}
            style={styles.galleryImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleDeleteImage(item._id)}
        >
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };
  const checkSharedStatus = async () => {
    if (!selectedDate || !userId) return;

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ko });
      const response = await diaryAPI.getDiary(userId, formattedDate);
      setIsShared(response.data.diary?.shared || false);
    } catch (error) {
      console.error('공유 상태 확인 실패:', error);
    }
  };
  const fetchDiary = async () => {
    if (!userId) return;

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ko });
      const response = await diaryAPI.getDiary(userId, formattedDate);
      if (response.data.diary) {
        setDiary(response.data.diary);
        setContent(response.data.diary.content);
        setDayImages(response.data.diary.images);
      } else {
        setContent('');
        setDiary(null);
        setDayImages([]);
      }
    } catch (error) {
      console.error('다이어리 로딩 실패:', error);
    }
  };
  const handleAddImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const formData = new FormData();
      result.assets.forEach(asset => {
        const filename = asset.uri.split('/').pop() || 'image';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('images', {
          uri: asset.uri,
          type,
          name: filename,
        } as any);
      });
      formData.append('userId', userId!);
      formData.append('date', format(selectedDate, 'yyyy-MM-dd', { locale: ko }));

      try {
        const response = await imageAPI.uploadImages(formData);
        const newImages = response.data.images;
        setDayImages([...dayImages, ...newImages]);
        setRefresh((prev: number) => prev + 1);
      } catch (error) {
        Alert.alert('오류', '이미지 업로드에 실패했습니다.');
      }
    }
  };
  const handleSave = async () => {
    if (!userId) return;

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ko });
      const response = await diaryAPI.saveDiary({
        userId,
        date: formattedDate,
        content
      });

      Alert.alert('성공', '다이어리가 저장되었습니다.');
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      Alert.alert('오류', '다이어리 저장에 실패했습니다.');
    }
  };
  const toggleShareDiary = async () => {
    if (!selectedDate || !userId) return;

    if (!content.trim() && diary?.images.length === 0) {
      Alert.alert(
        '알림', 
        '다이어리에 내용을 작성하거나 이미지를 추가한 후에 공유할 수 있습니다.',
        [{ text: '확인' }]
      );
      return;
    }

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd', { locale: ko });
      const response = await diaryAPI.shareDiary({
        userId,
        date: formattedDate,
        shared: !isShared
      });

      if (response.status === 200) {
        setIsShared(!isShared);
        Alert.alert('성공', `다이어리가 ${!isShared ? '공유' : '비공유'}되었습니다.`);
      }
    } catch (error) {
      console.error('다이어리 공유 상태 변경 실패:', error);
      Alert.alert('오류', '다이어리 공유 상태 변경에 실패했습니다.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          다이어리
        </ThemedText>
        <View style={styles.galleryHeader}>
          <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddImages}
                >
            <Ionicons name="add-circle-outline" size={24} color={Colors.light.tint} />
          </TouchableOpacity>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <ThemedText style={styles.editButton}>수정</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSave}>
              <ThemedText style={styles.saveButton}>저장</ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.shareToggle} 
            onPress={toggleShareDiary}
            activeOpacity={0.8}
          >
            <View style={[
              styles.toggleTrack,
              isShared && styles.toggleTrackActive
            ]}>
              <View style={[
                styles.toggleThumb,
                isShared && styles.toggleThumbActive
              ]}>
                <ThemedText style={[
                  styles.toggleText,
                  isShared ? styles.toggleTextRight : styles.toggleTextLeft
                ]}>
                  {isShared ? '공유' : '미공유'}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={[styles.input, !isEditing && styles.disabledInput]}
        value={content}
        onChangeText={setContent}
        placeholder="오늘 하루는 어땠나요?"
        multiline
        numberOfLines={4}
        editable={isEditing}
      />
      {selectedDate &&
        dayImages.length > 0 &&
      (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
            </View>
            <DraggableFlatList
              data={dayImages}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              horizontal
              onDragEnd={({ data }) => setDayImages(data)}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        {selectedImageIndex !== -1 && dayImages.length > 0 && (
        <ImageViewer
          isVisible={selectedImageIndex !== -1}
          images={dayImages}
          initialImageIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    color: Colors.light.tint,
  },
  saveButton: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  galleryHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 15,
  },
  gallerySection: {
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },

  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addButton: {
    padding: 5,
  },
  shareToggle: {
    marginLeft: 10,
  },
  toggleTrack: {
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#767577',
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: Colors.light.tint,
  },
  toggleThumb: {
    width: '60%',
    height: '100%',
    borderRadius: 13,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 2,
    top:2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleThumbActive: {
    left: 'auto',
    right: 2,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  toggleTextLeft: {
    color: '#767577',
  },
  toggleTextRight: {
    color: Colors.light.tint,
  },
  imageSlideContainer: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  activeImage: {
    opacity: 0.8,
  },
}); 