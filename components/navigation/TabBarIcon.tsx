import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

export default function TabBarIcon({ name, color }: TabBarIconProps) {
  return <Ionicons size={24} name={name} color={color} />;
}
