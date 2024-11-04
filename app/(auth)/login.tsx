import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { authAPI } from "@/utils/api";
import axios from 'axios';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("jip0806@naver.com");
    const [password, setPassword] = useState("123456");
    useEffect(()=> {
    // router.replace("/home")
    })
    const handleLogin = async () => {
        // 입력값 유효성 검사
        if (!email || !password) {
            Alert.alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await authAPI.login({email, password})

            // userId를 login 함수에 전달
            login(response.data.user.id);
            Alert.alert("성공", response.data.message, [
                {
                    text: "확인",
                    onPress: () => router.replace("/home")
                }
            ]);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                Alert.alert("오류", error.response.data.message);
            } else {
                Alert.alert("오류", "로그인 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
            }}
        >
            <ThemedText style={{ fontSize: 24, marginBottom: 30 }}>로그인</ThemedText>
            
            <TextInput 
                style={{
                    width: "100%",
                    height: 50,
                    borderWidth: 1,
                    borderColor: Colors.light.icon,
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 15,
                }}
                placeholder="이메일"
                placeholderTextColor={Colors.light.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            
            <TextInput
                style={{
                    width: "100%", 
                    height: 50,
                    borderWidth: 1,
                    borderColor: Colors.light.icon,
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 30,
                }}
                placeholder="비밀번호"
                placeholderTextColor={Colors.light.icon}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                onPress={handleLogin}
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: Colors.light.tint,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 15,
                }}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    로그인
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/signup")}
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "transparent",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.light.tint,
                }}
            >
                <Text style={{ color: Colors.light.tint, fontSize: 16, fontWeight: "bold" }}>
                    회원가입
                </Text>
            </TouchableOpacity>
        </ThemedView>
    );
}
