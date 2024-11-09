import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'confirm';
  }[];
  onClose?: () => void;
}

export default function CustomAlert({ 
  visible, 
  title, 
  message, 
  buttons = [{ text: '확인', onPress: () => {}, style: 'default' }],
  onClose 
}: CustomAlertProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.contentContainer}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.message}>{message}</ThemedText>
          </View>
          
          <View style={[
            styles.buttonContainer,
            buttons.length > 1 && styles.multipleButtons
          ]}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'confirm' && styles.confirmButton,
                  index < buttons.length - 1 && buttons.length > 1 && styles.buttonBorder
                ]}
                onPress={() => {
                  button.onPress();
                  if (onClose) onClose();
                }}
              >
                <ThemedText style={[
                  styles.buttonText,
                  button.style === 'cancel' && styles.cancelText,
                  button.style === 'confirm' && styles.confirmText
                ]}>
                  {button.text}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonBorder: {
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
  },
  cancelText: {
    color: '#666',
  },
  confirmButton: {
    backgroundColor: Colors.light.tint + '10',
  },
  confirmText: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
}); 