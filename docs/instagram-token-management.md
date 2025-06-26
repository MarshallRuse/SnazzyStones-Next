# Instagram Token Management with Upstash Redis

This document explains how to set up and manage Instagram access tokens using Upstash Redis for automatic token refreshing.

## Overview

Instagram Graph API access tokens expire after approximately 60 days. This system automatically refreshes these tokens before they expire, ensuring uninterrupted access to Instagram data. Instead of using environment variables (which are immutable during runtime in Vercel), we use Upstash Redis to store and update the tokens.

## Prerequisites

1. An Instagram Business or Creator account
2. A Facebook Developer account with an app that has Instagram Graph API access
3. A long-lived Instagram access token
4. An Upstash Redis database

## Setup Instructions

### 1. Create an Upstash Redis database

1. Go to [Upstash](https://upstash.com/) and create an account if you don't have one
2. Create a new Redis database
3. Copy the REST API URL and token from the database dashboard

### 2. Add Environment Variables to Vercel

Add these environment variables to your Vercel project:

```
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
NEXT_PUBLIC_BASE_URL=your_production_url (e.g., https://yourapp.vercel.app)
VERCEL_CRON_SECRET=random_secure_string
```

For local development, create a `.env.local` file with the same variables.

### 3. Initialize Redis with your current Instagram token

Use the provided setup script to initialize Redis with your current Instagram token:

```bash
npx tsx scripts/setup-instagram-token.ts <your_instagram_token> [expires_in_seconds]
```

If you don't specify `expires_in_seconds`, it will default to 60 days.

### 4. Deploy to Vercel with Cron Jobs Enabled

1. Make sure you've added the `vercel.json` file with cron job configuration
2. Deploy your application to Vercel
3. Go to the Vercel dashboard and verify that cron jobs are enabled for your project

## How It Works

1. **Token Storage**: Instagram access tokens and their expiration timestamps are stored in Upstash Redis.

2. **Automatic Refresh**: The system checks if the token needs refreshing before making any Instagram API calls. If the token expires in less than 7 days, it automatically refreshes the token.

3. **Weekly Cron Job**: A weekly Vercel cron job runs to ensure tokens are always fresh, providing redundancy in case automatic refreshing during API calls fails.

4. **Fallback Mechanism**: If Redis fails or token refresh fails, the system falls back to using the most recent available token.

## API Endpoints

-   `/api/instagram/refresh-token` - Manually trigger a token refresh
-   `/api/cron/refresh-instagram-token` - Endpoint called by Vercel Cron job (authenticated)

## Troubleshooting

### Token Not Refreshing

1. Check Redis connection - verify your Upstash Redis environment variables
2. Verify the current token hasn't been revoked by Instagram
3. Check Vercel logs for any errors during the refresh process

### Missing Instagram Feed

1. Ensure your Instagram account is a Business or Creator account
2. Verify the token is valid using the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
3. Check if the API is returning errors in Vercel logs

## Monitoring Token Status

You can check the current status of your Instagram token by calling the refresh token endpoint:

```
GET /api/instagram/refresh-token
```

This will return the current token status, including when it expires.
