/**
 * Script to initialize Redis with Instagram access token
 *
 * Usage:
 * npx tsx scripts/setup-instagram-token.ts <access_token> <expires_in_seconds>
 *
 * Example:
 * npx tsx scripts/setup-instagram-token.ts IGQVJWXw2a1c1YzU4NnV2TS1lMDB... 5184000
 *
 * Note: If expires_in_seconds is not provided, the default value of 60 days will be used
 */

import { redis, REDIS_KEYS } from '../lib/redis';

async function main() {
    // Get command line arguments
    const [, , accessToken, expiresInStr] = process.argv;

    if (!accessToken) {
        console.error('Error: Access token is required');
        console.log('Usage: npx tsx scripts/setup-instagram-token.ts <access_token> [expires_in_seconds]');
        process.exit(1);
    }

    // Default to 60 days if not provided
    const expiresIn = expiresInStr ? parseInt(expiresInStr, 10) : 60 * 24 * 60 * 60; // 60 days in seconds
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    try {
        // Store in Redis
        await redis.set(REDIS_KEYS.INSTAGRAM_ACCESS_TOKEN, accessToken);
        await redis.set(REDIS_KEYS.INSTAGRAM_TOKEN_EXPIRES_AT, expiresAt);

        console.log('Instagram token stored in Redis successfully');
        console.log(`Token will expire on: ${new Date(expiresAt * 1000).toLocaleString()}`);

        // Verify it was stored correctly
        const storedToken = await redis.get(REDIS_KEYS.INSTAGRAM_ACCESS_TOKEN);
        const storedExpiresAt = await redis.get(REDIS_KEYS.INSTAGRAM_TOKEN_EXPIRES_AT);

        console.log('\nVerification:');
        console.log(`Access Token: ${storedToken ? 'Successfully stored' : 'Failed to store'}`);
        console.log(`Expires At: ${storedExpiresAt ? 'Successfully stored' : 'Failed to store'}`);
    } catch (error) {
        console.error('Error storing token in Redis:', error);
        process.exit(1);
    } finally {
        // Close Redis connection
        process.exit(0);
    }
}

main();
