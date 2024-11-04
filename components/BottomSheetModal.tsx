import { Modal, View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
  SharedValue
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string;
  translateY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
}

export default function BottomSheetModal({ 
  visible, 
  onClose, 
  handleClose,
  title,
  children,
  height = '80%',
  translateY,
  backdropOpacity
}: BottomSheetModalProps) {

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.ease
      });
      backdropOpacity.value = withTiming(1, { 
        duration: 250 
      });
    }
  }, [visible]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startY + event.translationY;
      if (newValue > 0) {
        translateY.value = newValue;
        backdropOpacity.value = 1 - (newValue / 1000);
      }
    },
    onEnd: (event) => {
      if (event.translationY > 50) {
        translateY.value = withTiming(1000, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(handleClose)();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
        backdropOpacity.value = withTiming(1, { duration: 200 });
      }
    },
  });

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={handleClose}
      animationType="none"
    >
      <GestureHandlerRootView style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.modalContent, modalStyle, { height }]}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>{title}</ThemedText>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 