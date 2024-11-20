import { Tabs, useRouter } from "expo-router";
import TabBarIcon from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff', 
          borderTopWidth: 0.2,
          borderTopColor: '#dbdbdb',
          height: 45,
          paddingBottom: 0
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#8e8e8e',
      }}
      screenListeners={({ navigation, route }) => ({
        tabPress: (e) => {
          e.preventDefault();
          // 현재 활성화된 탭을 다시 누르면 해당 탭의 첫 화면으로 이동
          if (navigation.isFocused()) {
            router.replace(`/(tabs)/${route.name}`);
          } else {
            // 다른 탭으로 이동할 때도 해당 탭의 첫 화면으로 이동
            router.replace(`/(tabs)/${route.name}`);
          }
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: '프로필',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
