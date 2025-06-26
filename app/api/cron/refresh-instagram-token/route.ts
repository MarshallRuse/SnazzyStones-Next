import { NextResponse } from 'next/server';

// This is the endpoint that will be called by Vercel Cron Jobs
export async function GET(request: Request) {
    // Validate the request has proper authentication
    // This example uses the Vercel Cron authentication header
    const authHeader = request.headers.get('Authorization');

    // In production, validate the cron job secret against your stored secret
    if (process.env.VERCEL_CRON_SECRET && authHeader !== `Bearer ${process.env.VERCEL_CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Build the base URL using environment variables
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        // Call your Instagram token refresh endpoint
        const response = await fetch(`${baseUrl}/api/instagram/refresh-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to refresh token: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        // Log success to Vercel logs
        console.log('Instagram token refresh completed via cron job', data);

        return NextResponse.json({
            success: true,
            message: 'Instagram token refresh initiated',
            result: data,
        });
    } catch (error) {
        console.error('Instagram token refresh cron job failed:', error);
        return NextResponse.json({ error: 'Failed to execute token refresh' }, { status: 500 });
    }
}
