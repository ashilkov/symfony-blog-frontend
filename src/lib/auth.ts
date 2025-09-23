import type { LoginPayload } from './types';

const TOKEN_STORAGE_KEY = 'authToken';
const REFRESH_TOKEN_STORAGE_KEY = 'authRefreshToken';

export function setAuthToken(token: string) {
    try { localStorage.setItem(TOKEN_STORAGE_KEY, token); } catch {}
}

export function getAuthToken(): string | null {
    try { return localStorage.getItem(TOKEN_STORAGE_KEY); } catch { return null; }
}

export function clearAuthToken() {
    try { localStorage.removeItem(TOKEN_STORAGE_KEY); } catch {}
}

export function setRefreshToken(token: string) {
    try { localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token); } catch {}
}

export function getRefreshToken(): string | null {
    try { return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY); } catch { return null; }
}

export function clearRefreshToken() {
    try { localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY); } catch {}
}

// Token refresh function
export async function refreshToken(): Promise<{ token: string; refreshToken?: string }> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const url = `http://symfony-blog.local/api/token/refresh`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
        // Clear tokens on refresh failure
        clearAuthToken();
        clearRefreshToken();
        const message = data?.message || 'Token refresh failed';
        throw new Error(message);
    }

    const newToken: string | undefined = data?.token;
    const newRefreshToken: string | undefined = data?.refresh_token || data?.refreshToken;
    
    if (!newToken) {
        clearAuthToken();
        clearRefreshToken();
        throw new Error('No token received from refresh');
    }

    setAuthToken(newToken);
    if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
    }

    return { token: newToken, refreshToken: newRefreshToken };
}

// Symfony JWT login (LexikJWTAuthenticationBundle): returns { token: string }
export async function login(payload: LoginPayload) {
    const url = `http://symfony-blog.local/api/login`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
        const message = data?.message || 'Login failed';
        throw new Error(message);
    }
    const token: string | undefined = data?.token;
    const refreshToken: string | undefined = data?.refresh_token || data?.refreshToken;
    if (!token) {
        throw new Error('No token received');
    }
    setAuthToken(token);
    if (refreshToken) {
        setRefreshToken(refreshToken);
    }
    return { token, refreshToken } as { token: string; refreshToken?: string };
}
