import { NextResponse } from 'next/server';
import { getInstagramToken, getInstagramTokenExpiresAt, setInstagramToken } from '@/lib/redis';

// Get environment variables or default values
const getEnvVar = (name: string, defaultValue: string = ''): string => {
    return process.env[name] || defaultValue;
};

const INSTAGRAM_ACCESS_TOKEN = getEnvVar('INSTAGRAM_KEY');
const INSTAGRAM_APP_ID = getEnvVar('INSTAGRAM_APP_ID');
const INSTAGRAM_APP_SECRET = getEnvVar('INSTAGRAM_APP_SECRET');

// Determine if token needs refreshing (refresh if < 7 days remaining)
const shouldRefreshToken = async (): Promise<boolean> => {
    const tokenExpiresAt = await getInstagramTokenExpiresAt();
    if (!tokenExpiresAt) return true;

    const now = Math.floor(Date.now() / 1000);
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;

    return !tokenExpiresAt || tokenExpiresAt - now < sevenDaysInSeconds;
};

// Refresh long-lived Instagram token
async function refreshInstagramToken(longLivedToken: string) {
    try {
        // Instagram Graph API endpoint to refresh token
        const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${longLivedToken}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to refresh token: ${JSON.stringify(data)}`);
        }

        // Calculate expiration time (returned in seconds, converted to timestamp)
        const expiresIn = data.expires_in; // Seconds until expiration
        const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

        // Store in Redis
        await setInstagramToken(data.access_token, expiresAt);

        return {
            accessToken: data.access_token,
            expiresAt: expiresAt,
        };
    } catch (error) {
        console.error('Error refreshing Instagram token:', error);
        throw error;
    }
}

export async function GET() {
    // Only allow this to be called from specific sources (add authentication as needed)
    try {
        // Check if token needs refreshing
        if (!(await shouldRefreshToken())) {
            const expiresAt = await getInstagramTokenExpiresAt();
            return NextResponse.json({
                message: 'Token is still valid',
                expiresAt: expiresAt,
            });
        }

        // Get current token from Redis
        const currentToken = await getInstagramToken();
        if (!currentToken) {
            return NextResponse.json(
                { error: 'No Instagram token found in Redis or environment variables' },
                { status: 500 }
            );
        }

        // Refresh the token
        const result = await refreshInstagramToken(currentToken);

        return NextResponse.json({
            message: 'Token refreshed successfully',
            expiresAt: result.expiresAt,
        });
    } catch (error) {
        console.error('Error in refresh token API:', error);
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
    }
}
