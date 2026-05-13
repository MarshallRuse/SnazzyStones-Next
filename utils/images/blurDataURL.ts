export async function fetchImageAsDataURL(
	imageURL: string,
): Promise<string | undefined> {
	if (!imageURL) return undefined;
	if (imageURL.startsWith("data:image/")) return imageURL;

	try {
		const response = await fetch(imageURL);
		if (!response.ok) return undefined;

		const contentType = response.headers.get("content-type") ?? "image/jpeg";
		const buffer = Buffer.from(await response.arrayBuffer());

		return `data:${contentType};base64,${buffer.toString("base64")}`;
	} catch (error) {
		console.error(`Failed to create blur placeholder for ${imageURL}`, error);
		return undefined;
	}
}
