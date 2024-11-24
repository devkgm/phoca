import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    userId: string | null;
    login: (id: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 앱 시작 시 저장된 userId 확인
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const savedUserId = await AsyncStorage.getItem('userId');
            if (savedUserId) {
                setUserId(savedUserId);
            }
        } catch (error) {
            console.error('로그인 상태 확인 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (id: string) => {
        try {
            await AsyncStorage.setItem('userId', id);
            setUserId(id);
        } catch (error) {
            console.error('로그인 상태 저장 실패:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userId');
            setUserId(null);
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    if (isLoading) {
        return null; // 또는 로딩 스피너 표시
    }

    return (
        <AuthContext.Provider value={{ userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 