"use client"

import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ token: null | string; error: null | string }>;
    signIn: (email: string, password: string) => Promise<{ token: null | string; error: null | string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiClient = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const signUp = async (email: string, password: string, fullName: string): Promise<{ token: null | string; error: null | string }> => {
        setLoading(true);
        try {
            const response = await apiClient.post('/signup', {
                name: fullName,
                email,
                password,
            });

            const token = response.data.token;
            Cookies.set('accessToken',token);
            router.push('/dashboard');
            router.refresh();
            return {token,error : null}; // Return token on success
        } catch (error) {
            let errorMessage = "An unexpected error occurred. Please try again."; // Default error message
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            return {token : null,error : errorMessage}
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string): Promise<{ token: null | string; error: null | string }> => {
        setLoading(true);
        try {
            const response = await apiClient.post('/signin', {
                email,
                password,
            });

            const token = response.data.token;
            Cookies.set('accessToken',token);
            router.push('/dashboard');
            router.refresh();
            return {token,error : null}; // Return token on success
        } catch (error) {
            let errorMessage = "An unexpected error occurred. Please try again."; // Default error message
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            return {token : null,error : errorMessage}
        } finally {
            setLoading(false);
        }
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
