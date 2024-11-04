import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Phoca'
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerBackTitle: '뒤로',
          headerTintColor: Colors.light.tint,
        }}
      />
    </Stack>
  );
}
