import { View, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { Comment } from '@/interfaces/interface';
import { socialAPI } from '@/utils/api';
import { getRelativeTime } from '@/utils/date';
import UserProfileLink from '@/components/UserProfileLink';
import  { 
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import BottomSheetModal from './BottomSheetModal';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  diaryId: string;
  userId: string;
  comments: Comment[];
  onCommentsUpdate: (newComments: Comment[]) => void;
}

export default function CommentModal({ 
  visible, 
  onClose, 
  diaryId,
  userId,
  comments,
  onCommentsUpdate
}: CommentModalProps) {
  const [newComment, setNewComment] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);
  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await socialAPI.addComment(diaryId, userId, newComment.trim());
      onCommentsUpdate([...comments, response.data.comment]);
      setNewComment('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    translateY.value = withTiming(1000, {
      duration: 200,
      easing: Easing.ease
    });
    backdropOpacity.value = withTiming(0, { 
      duration: 200 
    });
    setTimeout(onClose, 200);
  };

  const handleProfilePress = () => {
    handleClose();
  };
  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      handleClose={handleClose}
      title="댓글"
      translateY={translateY}
      backdropOpacity={backdropOpacity}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.commentList}
        showsVerticalScrollIndicator={false}
      >
        {comments.map((comment) => (
          <View key={comment._id} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <View style={styles.userInfoContainer}>
                <UserProfileLink
                  userId={comment.userId._id}
                  name={comment.userId.name}
                  profileImage={comment.userId.profileImage}
                  size="small"
                  showName={false}
                  onPress={handleProfilePress}
                  routePath="/(tabs)/home/profile"
                />
                <View style={styles.nameAndDate}>
                  <ThemedText style={styles.userName}>{comment.userId.name}</ThemedText>
                  <ThemedText style={styles.commentDate}>
                    {getRelativeTime(comment.createdAt)}
                  </ThemedText>
                </View>
              </View>
            </View>
            <ThemedText style={styles.commentContent}>
              {comment.content}
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="댓글을 입력하세요..."
          multiline
          maxLength={200}
        />
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!newComment.trim() || isSubmitting) && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={!newComment.trim() || isSubmitting ? '#ccc' : Colors.light.tint} 
          />
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  commentList: {
    flex: 1,
    padding: 15,
  },
  commentItem: {
    marginBottom: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInfo: {
    flex: 1,
  },
  nameAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    color: Colors.light.text,
  },
  commentContent: {
    marginLeft: 36,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  submitButton: {
    padding: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
}); 