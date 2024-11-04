import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, headerTitle: "홈" }} />
            <Stack.Screen 
                name="profile" 
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerShadowVisible: false
                }}
            />
        </Stack>
    );
}
