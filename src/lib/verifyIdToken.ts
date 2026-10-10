import {firebaseConfig} from '@/app/config/firebaseConfig';

/**
 * Verify a Firebase Auth ID token server-side without firebase-admin, using
 * the Identity Toolkit lookup endpoint (it rejects expired or forged tokens).
 * Returns the user's uid, or null if the token is not valid.
 */
export async function verifyIdToken(idToken: string | null | undefined): Promise<string | null> {
    if (!idToken) return null;
    try {
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({idToken}),
                signal: AbortSignal.timeout(5000),
            },
        );
        if (!res.ok) return null;
        const data = await res.json() as {users?: {localId?: string}[]};
        return data.users?.[0]?.localId ?? null;
    } catch {
        return null;
    }
}

export function bearerToken(req: Request): string | null {
    const header = req.headers.get('authorization') ?? '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    return match ? match[1] : null;
}
