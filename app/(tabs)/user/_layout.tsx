import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function UserLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, headerTitle: "마이페이지" }} />
            <Stack.Screen 
                name="edit" 
                options={{ 
                    headerShown: false, 
                    headerTitle: "",
                    headerBackTitle: "뒤로",
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerShadowVisible: false
                }} 
            />
            <Stack.Screen
                name="profile"
                options={{
                    headerBackTitle: '뒤로',
                    headerTintColor: Colors.light.tint,
                    headerShadowVisible: false
                }}
            />
            <Stack.Screen
                name="setting"
                options={{
                    headerShown: false, 
                    headerBackTitle: '뒤로',
                    headerTintColor: Colors.light.tint,
                    headerShadowVisible: false
                }}
            />
            <Stack.Screen
                name="password"
                options={{
                    headerShown: false, 
                    headerBackTitle: '뒤로',
                    headerTintColor: Colors.light.tint,
                    headerShadowVisible: false
                }}
            />
        </Stack>
        
    );
}
