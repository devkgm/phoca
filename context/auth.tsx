import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    isLoggedIn: boolean;
    userId: string | null;
    login: (id: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const login = (id: string) => {
        setIsLoggedIn(true);
        setUserId(id);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 