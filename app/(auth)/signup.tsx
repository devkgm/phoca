import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import axios from 'axios';
import { authAPI } from "@/utils/api";

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        // 입력값 유효성 검사
        if (!email || !password || !confirmPassword) {
            Alert.alert("오류", "모든 필드를 입력해주세요.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("오류", "올바른 이메일 형식이 아닙니다.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("오류", "비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await authAPI.signup({email, password})

            Alert.alert("성공", response.data.message, [
                {
                    text: "확인",
                    onPress: () => {
                        login(response.data.id); // 자동 로그인 처리
                        router.replace("/home");
                    }
                }
            ]);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                Alert.alert("오류", error.response.data.message);
            } else {
                Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
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
            <ThemedText style={{ fontSize: 24, marginBottom: 30 }}>회원가입</ThemedText>
            
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
                    marginBottom: 15,
                }}
                placeholder="비밀번호"
                placeholderTextColor={Colors.light.icon}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
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
                placeholder="비밀번호 확인"
                placeholderTextColor={Colors.light.icon}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                onPress={handleSignup}
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: Colors.light.tint,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    회원가입
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    marginTop: 15,
                    padding: 10,
                }}
            >
                <ThemedText>이미 계정이 있으신가요? 로그인하기</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}
