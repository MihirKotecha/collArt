"use client"

import axios from 'axios';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => void;
    signIn: (email: string, password: string) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);


    const signUp = async (email: string, password: string, fullName: string) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/signup', {
                name: fullName,
                email,
                password
            });
            const token = response.data.token;
            localStorage.setItem('accessToken',token)
            setLoading(false);
            return token;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
    };

    const signOut = async () => {
    };

    const value = {
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
