import { Text, View, TextInput, TouchableOpacity, Alert, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import axios from 'axios';
import { authAPI } from "@/utils/api";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAlert } from '@/context/alert';

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();
    const { alert } = useAlert();

    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string) => {
        if (name.length > 10) {
            return { isValid: false, message: '이름은 10자 이하여야 합니다.' };
        }

        const nameRegex = /^[가-힣a-zA-Z0-9_.-]+$/;
        if (!nameRegex.test(name)) {
            return { 
                isValid: false, 
                message: '이름에는 한글, 영문, 숫자, 그리고 (_.-) 특수문자만 사용할 수 있습니다.' 
            };
        }

        return { isValid: true, message: '' };
    };

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword || !name || !profileImage) {
            alert("오류", "모든 필드를 입력해주세요.");
            return;
        }

        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            alert("오류", nameValidation.message);
            return;
        }

        if (!validateEmail(email)) {
            alert("오류", "올바른 이메일 형식이 아닙니다.");
            return;
        }

        if (password.length < 6) {
            alert("오류", "비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            alert("오류", "비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('name', name);

            const filename = profileImage.split('/').pop();
            formData.append('profileImage', {
                uri: profileImage,
                type: 'image/jpeg',
                name: filename,
            } as any);

            const response = await authAPI.signup(formData);

            alert("성공", response.data.message, [
                {
                    text: "확인",
                    style: 'confirm',
                    onPress: () => {
                        login(response.data.id);
                        router.replace("/home");
                    }
                }
            ]);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert("오류", error.response.data.message);
            } else {
                alert("오류", "회원가입 중 오류가 발생했습니다.");
            }
        }
    };

    const handleNameChange = (text: string) => {
        if (text.length <= 10) {
            setName(text);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText style={styles.title}>회원가입</ThemedText>
                
                <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Ionicons name="camera" size={40} color={Colors.light.icon} />
                            <ThemedText style={styles.profileImageText}>프로필 사진 선택</ThemedText>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput 
                    ref={nameRef}
                    style={styles.input}
                    placeholder="이름 (10자 이하)"
                    placeholderTextColor={Colors.light.icon}
                    value={name}
                    onChangeText={handleNameChange}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                    maxLength={10}
                />

                <TextInput 
                    ref={emailRef}
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
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    blurOnSubmit={false}
                />

                <TextInput
                    ref={confirmPasswordRef}
                    style={styles.input}
                    placeholder="비밀번호 확인"
                    placeholderTextColor={Colors.light.icon}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSignup}
                />

                <TouchableOpacity
                    onPress={handleSignup}
                    style={styles.signupButton}
                >
                    <Text style={styles.signupButtonText}>회원가입</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.loginLink}
                >
                    <ThemedText>이미 계정이 있으신가요? 로그인하기</ThemedText>
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
    profileImageContainer: {
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageText: {
        fontSize: 12,
        marginTop: 5,
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
    signupButton: {
        width: "100%",
        height: 50,
        backgroundColor: Colors.light.tint,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    signupButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginLink: {
        marginTop: 15,
        padding: 10,
    },
});
