import { Slot } from "expo-router";
import { AuthProvider } from "@/context/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { AlertProvider } from '@/context/alert';

export default function RootLayout() {
    return (
        <AlertProvider>
            <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <Slot />
                    </SafeAreaView>
                </GestureHandlerRootView>
            </AuthProvider>
        </AlertProvider>
    );
}
