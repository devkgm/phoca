import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth";
import { authAPI } from "@/utils/api";
import axios from 'axios';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("jip0806@naver.com");
    const [password, setPassword] = useState("123456");
    
    const passwordRef = useRef<TextInput>(null);

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
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText style={styles.title}>로그인</ThemedText>
                
                <TextInput 
                    style={styles.input}
                    placeholder="이메일"
                    placeholderTextColor={Colors.light.icon}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                />
                
                <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    placeholder="비밀번호"
                    placeholderTextColor={Colors.light.icon}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/signup")}
                    style={styles.signupButton}
                >
                    <Text style={styles.signupButtonText}>회원가입</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: Colors.light.icon,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    loginButton: {
        width: "100%",
        height: 50,
        backgroundColor: Colors.light.tint,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    signupButton: {
        width: "100%",
        height: 50,
        backgroundColor: "transparent",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.light.tint,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signupButtonText: {
        color: Colors.light.tint,
        fontSize: 16,
        fontWeight: "bold",
    },
});
