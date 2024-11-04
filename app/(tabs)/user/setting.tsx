import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SettingScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>설정 화면</ThemedText>
    </ThemedView>
  );
} 