/**
 * Instagram API helper functions
 */
import { getInstagramToken, getInstagramTokenExpiresAt } from './redis';

// Check if token needs refreshing (refresh if < 7 days remaining)
export const shouldRefreshToken = async (): Promise<boolean> => {
    const tokenExpiresAt = await getInstagramTokenExpiresAt();
    if (!tokenExpiresAt) return true;

    const now = Math.floor(Date.now() / 1000);
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;

    return !tokenExpiresAt || tokenExpiresAt - now < sevenDaysInSeconds;
};

// Refresh Instagram access token if needed
export const refreshTokenIfNeeded = async (): Promise<string> => {
    const currentToken = await getInstagramToken();

    if (!currentToken) {
        throw new Error('Instagram access token is not set in Redis or environment variables');
    }

    // If token doesn't need refreshing, just return the current token
    if (!(await shouldRefreshToken())) {
        return currentToken;
    }

    try {
        // Call the refresh token endpoint
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        const response = await fetch(`${baseUrl}/api/instagram/refresh-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('Failed to refresh Instagram token, using existing token');
            return currentToken;
        }

        const data = await response.json();
        console.log('Instagram token refreshed successfully');

        // Get the freshly updated token from Redis
        return await getInstagramToken();
    } catch (error) {
        console.error('Error refreshing Instagram token:', error);
        return currentToken; // Fall back to the current token
    }
};

// Fetch Instagram feed with automatic token refresh
export const fetchInstagramFeed = async (limit: number = 8): Promise<any> => {
    try {
        // Get a valid token (refresh if needed)
        const accessToken = await refreshTokenIfNeeded();

        // Build the Instagram API URL
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,thumbnail_url,permalink&access_token=${accessToken}&limit=${limit}`;

        // Fetch the data
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Instagram API error: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching Instagram feed:', error);
        throw error;
    }
};
