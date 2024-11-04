import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false, headerTitle: "로그인" }} />
            <Stack.Screen 
                name="signup" 
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
