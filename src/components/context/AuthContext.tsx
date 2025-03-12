import React, { createContext, useEffect, useState } from 'react';
import {AuthContextProps, JwtPayload} from "../../interfaces/Context.ts";


export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            parseAndStoreToken(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    function parseAndStoreToken(token: string) {
        try {
            let payloadBase64 = token.split('.')[1];
            payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

            const pad = payloadBase64.length % 4;
            if (pad) {
                payloadBase64 += '==='.slice(0, 4 - pad);
            }

            const decodedJson = atob(payloadBase64);
            const payload: JwtPayload = JSON.parse(decodedJson);

            setRole(payload.role);
            setUserId(payload.user_id);
            setName(payload.name);
        } catch (error) {
            // If there's an error (invalid token, etc.), reset everything to null.
            console.error('Invalid token:', error);
            setRole(null);
            setUserId(null);
            setName(null);
        } finally {
            setIsLoading(false);
        }
    }

    const login = (token: string) => {
        localStorage.setItem('token', token);
        parseAndStoreToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setRole(null);
        setUserId(null);
    };

    const contextValue: AuthContextProps = {
        isLoading,
        role,
        userId,
        name,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
