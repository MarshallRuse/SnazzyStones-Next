import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Redis keys
export const REDIS_KEYS = {
    INSTAGRAM_ACCESS_TOKEN: 'instagram:access_token',
    INSTAGRAM_TOKEN_EXPIRES_AT: 'instagram:token_expires_at',
};

// Helper functions for Instagram token management
export async function getInstagramToken(): Promise<string> {
    const token = await redis.get<string>(REDIS_KEYS.INSTAGRAM_ACCESS_TOKEN);
    // If no token in Redis, fall back to env var (for initial setup)
    return token || process.env.INSTAGRAM_KEY || '';
}

export async function getInstagramTokenExpiresAt(): Promise<number> {
    const expiresAt = await redis.get<number>(REDIS_KEYS.INSTAGRAM_TOKEN_EXPIRES_AT);
    if (expiresAt) return expiresAt;

    // If not in Redis, check if it's in env var
    const envExpiresAt = process.env.INSTAGRAM_TOKEN_EXPIRES_AT;
    return envExpiresAt ? parseInt(envExpiresAt, 10) : 0;
}

export async function setInstagramToken(token: string, expiresAt: number): Promise<void> {
    // Store token in Redis
    await redis.set(REDIS_KEYS.INSTAGRAM_ACCESS_TOKEN, token);
    await redis.set(REDIS_KEYS.INSTAGRAM_TOKEN_EXPIRES_AT, expiresAt);

    console.log('Instagram token updated in Redis');
}
