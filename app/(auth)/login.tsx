import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth";
import { authAPI } from "@/utils/api";
import axios from 'axios';
import { useAlert } from "@/context/alert";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_AUTH } from '@/config/auth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { alert } = useAlert();
    const passwordRef = useRef<TextInput>(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        // androidClientId: GOOGLE_AUTH.ANDROID_CLIENT_ID,
    });

    useEffect(()=> {
    // router.replace("/home")
    })

    useEffect(() => {
        handleGoogleResponse();
    }, [response]);

    const handleGoogleResponse = async () => {
        if (response?.type === 'success') {
            const { authentication } = response;
            
            try {
                const userInfoResponse = await fetch(
                    'https://www.googleapis.com/userinfo/v2/me',
                    {
                        headers: { Authorization: `Bearer ${authentication.accessToken}` },
                    }
                );
                const userInfo = await userInfoResponse.json();
                const googleLoginResponse = await authAPI.googleLogin({
                    email: userInfo.email,
                    name: userInfo.name
                });

                login(googleLoginResponse.data.user.id);
                alert("성공", "구글 로그인 성공", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/home")
                    }
                ]);
            } catch (error) {
                console.log(error);
                alert("오류", "구글 로그인 중 오류가 발생했습니다.");
            }
        }
    };

    const handleLogin = async () => {
        // 입력값 유효성 검사
        if (!email || !password) {
            alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await authAPI.login({email, password})

            // userId를 login 함수에 전달
            login(response.data.user.id);
            alert("성공", response.data.message, [
                {
                    text: "확인",
                    onPress: () => router.replace("/home")
                }
            ]);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert("오류", error.response.data.message);
            } else {
                alert("오류", "로그인 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: Colors.light.background }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <ThemedText style={styles.subText}>내 손안에 포토 캘린더</ThemedText>
                    <ThemedText style={styles.logoText}>Phoca</ThemedText>
                </View>
                
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

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <ThemedText style={styles.dividerText}>또는</ThemedText>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => promptAsync()}
                    disabled={!request}
                >
                    <Image 
                        source={require('@/assets/images/google-logo.webp')} 
                        style={styles.googleIcon}
                    />
                    <Text style={styles.googleButtonText}>Google로 계속하기</Text>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginBottom: 10,
        lineHeight: 48,
    },
    subText: {
        fontSize: 16,
        color: Colors.light.icon,
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#999',
    },
    googleButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#ddd',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "500",
    },
});
