import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../lib/api';
import { getAuthToken, clearAuthToken, clearRefreshToken, fetchMeUser } from '../lib/api';

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (u: User | null) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!getAuthToken();

    useEffect(() => {
        // Attempt to fetch user if token exists
        if (isAuthenticated && !user) {
            fetchMeUser().then(setUser).catch(() => {
                setUser(null);
            });
        }
    }, [isAuthenticated, user]);

    const logout = () => {
        clearAuthToken();
        clearRefreshToken();
        setUser(null);
    };

    const value = useMemo(() => ({ user, isAuthenticated, setUser, logout }), [user, isAuthenticated]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}


