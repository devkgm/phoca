import { Tabs } from "expo-router";
import TabBarIcon from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
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
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="upload"
        options={{
          title: '업로드',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="image-outline" color={color} />,
        }}
      /> */}
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
