import requestIp from 'request-ip';
import { WebServiceClient } from '@maxmind/geoip2-node';
import { NextResponse } from 'next/server';

export interface APIIPResponse {
    countryCode: string;
}

export async function GET(request: Request) {
    // Note: requestIp.getClientIp needs to be adapted for new Request object
    // You may need to get IP from headers or use Next.js middleware
    const detectedIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip');
    console.log('detectedIp', detectedIp);
    const client = new WebServiceClient(process.env.MAXMIND_ACCOUNTID!, process.env.MAXMIND_GEOLOCATION_KEY!, {
        host: 'geolite.info',
    });

    const geoDataResponse = await client.country(
        process.env.NODE_ENV === 'production' ? detectedIp || '' : '24.212.160.117'
    );

    const countryCode = geoDataResponse.country?.isoCode;

    if (!countryCode) {
        return NextResponse.json<APIIPResponse>({ countryCode: 'CA' });
    }

    return NextResponse.json<APIIPResponse>({ countryCode });
}
