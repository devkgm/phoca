import { Slot } from "expo-router";
import { AuthProvider } from "@/context/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <Slot />
                </SafeAreaView>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}
