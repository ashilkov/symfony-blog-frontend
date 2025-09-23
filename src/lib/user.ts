import type { User, RegisterPayload } from './types';
import { graphql } from './http';
import { request } from './http';

export async function fetchMeUser(): Promise<User> {
    const QUERY = `query { meUser { id username email fullname } }`;
    const result = await graphql<{ meUser: User }>(QUERY);

    return result.meUser;
}

export function register(payload: RegisterPayload) {
    return request<{ success: boolean; user?: any }>(`/api/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
