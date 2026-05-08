/**
 * Value for the `x-api-key` header on Open API v3 requests.
 * Per Etsy’s listings tutorial, use keystring and shared secret separated by ":".
 * @see https://developers.etsy.com/documentation/tutorials/listings
 */
export const getEtsyApiKey = () => {
	const keystring = process.env.ETSY_API_KEYSTRING;
	if (!keystring) {
		throw new Error("ETSY_API_KEYSTRING is not set");
	}

	const sharedsecret = process.env.ETSY_API_SHARED_SECRET;
	if (!sharedsecret) {
		throw new Error("ETSY_API_SHARED_SECRET is not set");
	}

	return `${keystring}:${sharedsecret}`;
};
