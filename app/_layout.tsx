import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { AlertProvider } from '@/context/alert';
import { useEffect } from "react";

function RootLayoutNav() {
    const { userId } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";

        if (!userId && !inAuthGroup) {
            // 로그인되지 않은 상태에서 auth 그룹이 아닌 경우 로그인 페이지로
            router.replace("/");
        } else if (userId && inAuthGroup) {
            // 로그인된 상태에서 auth 그룹인 경우 홈으로
            router.replace("/home");
        }
    }, [userId, segments]);

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AlertProvider>
            <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <RootLayoutNav />
                    </SafeAreaView>
                </GestureHandlerRootView>
            </AuthProvider>
        </AlertProvider>
    );
}
