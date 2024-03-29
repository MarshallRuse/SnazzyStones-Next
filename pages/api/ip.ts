import requestIp from "request-ip";
import { WebServiceClient } from "@maxmind/geoip2-node";
import { NextApiRequest, NextApiResponse } from "next";

export interface APIIPResponse {
    countryCode: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIIPResponse>) {
    const detectedIp = requestIp.getClientIp(req);
    const client = new WebServiceClient(process.env.MAXMIND_ACCOUNTID, process.env.MAXMIND_GEOLOCATION_KEY, {
        host: "geolite.info",
    });

    //example CA address: 24.212.160.117
    // example US address: 192.199.248.75
    const geoDataResponse = await client.country(process.env.NODE_ENV === "production" ? detectedIp : "24.212.160.117"); //sub in detectedIp in production
    const countryCode = geoDataResponse.country.isoCode;

    res.status(200).json({ countryCode });
}
