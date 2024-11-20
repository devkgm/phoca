import { Tabs, useRouter } from "expo-router";
import TabBarIcon from "@/components/navigation/TabBarIcon";
import { useState } from "react";

export default function TabLayout() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

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
          // 현재 활성화된 탭을 다시 누를 때의 동작
          if (navigation.isFocused()) {
            if (route.name === 'home') {
              // 홈 탭은 새로고침
              e.preventDefault();
              console.log('refreshKey', refreshKey);
              setRefreshKey(prev => prev + 1);
            } else if (route.name === 'user') {
              // 프로필 탭은 아무 동작 하지 않음
              e.preventDefault();
            }
          } else {
            // 다른 탭으로 이동할 때는 해당 탭의 첫 화면으로 이동
            e.preventDefault();
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
