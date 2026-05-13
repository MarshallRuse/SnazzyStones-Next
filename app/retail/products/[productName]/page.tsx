import Favorite from "@mui/icons-material/Favorite";
import he from "he";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTALink from "@/components/CTAElements/CTALink";
import ImageGallery from "@/components/ImageGallery";
import { fetchCategoriesFromCache } from "@/utils/fetching/categories/etsyCategories";
import { fetchProductsFromCache } from "@/utils/fetching/products/etsyProducts";
import formatProductTitleAsURL from "@/utils/formatProductTitleAsURL";
import ProductPageDescription from "./ProductPageDescription";
import ReviewsSection from "./ReviewsSection";
import ShareButtons from "./ShareButtons";

interface ProductPageProps {
	params: Promise<{
		productName: string;
	}>;
}

// Generate metadata
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const products = await fetchProductsFromCache();
	const { productName } = await params;
	const product = products.find((prod) =>
		prod.title.includes("|")
			? formatProductTitleAsURL(prod.title) === productName
			: prod.listing_id.toString() === productName,
	);

	if (!product) return {};

	const titleHead =
		(typeof product.title === "string" ? product.title.split("|")[0] : "")
			?.trim() || "Product";
	const title = `${titleHead} | Snazzy Stones`;
	const firstLine =
		typeof product.description === "string"
			? product.description.split("\n")[0]?.trim() ?? ""
			: "";
	const description = firstLine
		? he.decode(firstLine)
		: "Handmade silver and gemstone jewellery from Snazzy Stones.";
	const productURL = `https://snazzystones.ca/retail/products/${productName}`;
	const ogImages =
		product.images?.map((img, ind) => ({
			url: img.url_fullxfull,
			width: 442,
			height: 442,
			alt: `Product listing image ${ind + 1} for ${titleHead}`,
			type: "image/jpeg" as const,
		})) ?? [];

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: productURL,
			...(ogImages.length > 0 ? { images: ogImages } : {}),
			siteName: "SnazzyStones",
		},
		twitter: {
			card: "summary",
		},
	};
}

// Generate static params
export async function generateStaticParams() {
	const products = await fetchProductsFromCache();

	return products.map((listing) => ({
		productName: listing.title.includes("|")
			? formatProductTitleAsURL(listing.title)
			: listing.listing_id.toString(),
	}));
}

export default async function ProductPage({ params }: ProductPageProps) {
	const products = await fetchProductsFromCache();
	const categories = await fetchCategoriesFromCache();

	const { productName } = await params;

	const product = products.find((prod) =>
		prod.title.includes("|")
			? formatProductTitleAsURL(prod.title) === productName
			: prod.listing_id.toString() === productName,
	);

	if (!product) {
		notFound();
	}

	const category = categories.find(
		(section) => section.shop_section_id === product.shop_section_id,
	)?.title;

	const productURL = `https://snazzystones.ca/retail/products/${productName}`;

	return (
		<>
			<section className="grid md:grid-cols-[3fr_2fr] md:grid-flow-row md:items-stretch gap-4 py-16 w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] justify-center mx-auto px-4 sm:px-6 lg:px-8">
				<div className="min-w-0 md:self-start">
					<ImageGallery
						images={product.images}
						productTitle={product.title}
						listingId={product.listing_id}
					/>
				</div>

				<div className="flex flex-col text-sm text-slate-500 w-full min-w-0 max-w-xl md:max-w-none pt-2 md:h-0 md:min-h-full md:overflow-hidden md:pl-6">
					<nav className="flex flex-nowrap shrink-0">
						<Link
							href="/"
							className="text-bluegreen-500 navItem max-w-max inline-flex mx-1"
						>
							Home
						</Link>
						{category && (
							<>
								/
								<Link
									href={`/retail/categories/${category.replace(" ", "_")}`}
									className="text-bluegreen-500 navItem max-w-max inline-flex mx-1"
								>
									{category}
								</Link>
							</>
						)}
					</nav>
					<div className="flex flex-col md:flex-row items-start md:items-center md:gap-4 mb-12 md:mb-0 text-blueyonder-500 shrink-0">
						<h1 className="text-2xl mt-4 font-semibold mb-4 md:mb-auto">
							{product.title}
						</h1>
						{(product.production_partners?.length ?? 0) > 0 &&
							product.production_partners?.[0]?.location && (
								<div className="flex rounded-md shadow-light w-14 md:w-auto">
									<Image
										src={`/svg/flags/${product.production_partners?.[0]?.location}.svg`}
										width={105}
										height={70}
										style={{ objectFit: "cover" }}
										className="rounded-md"
										alt={`A flag of ${product.production_partners?.[0]?.location}, location of our production partners`}
										priority
									/>
								</div>
							)}
					</div>
					{/* <p className='text-bluegreen-500 text-2xl font-semibold m-0'>
                        {isLoading ? (
                            <Skeleton width={85} height={30} sx={{ bgColor: "#14b6b8" }} />
                        ) : isError ? (
                            new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
                                product.price.amount / product.price.divisor
                            )
                        ) : (
                            new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
                                (countryData.countryCode === "CA"
                                    ? product.price.amount - 1400
                                    : product.price.amount) / product.price.divisor
                            )
                        )}
                    </p> */}
					<ProductPageDescription
						key={product.listing_id}
						description={product.description}
					/>
					<p className="text-base shrink-0">
						<span className="font-semibold">Availability:</span>
						<span className="text-bluegreen-500">
							{" "}
							{product.quantity} in stock
						</span>
					</p>
					<div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
						<CTALink
							href={`https://snazzystonesjewelry.etsy.com/listing/${product.listing_id}`}
							target="_blank"
							rel="noreferrer"
							type="external"
						>
							Purchase on Etsy
						</CTALink>
						{product.num_favorers > 0 && (
							<div className="text-bluegreen-500 font-medium">
								<Favorite /> {product.num_favorers}{" "}
								{product.num_favorers > 1 ? "people" : "person"} favorited this
								item!
							</div>
						)}
					</div>
					<div className="mt-8 shrink-0 mx-auto md:mx-0">
						<ShareButtons
							productURL={productURL}
							facebookAppId={product.facebookAppId}
						/>
					</div>
				</div>
			</section>

			<ReviewsSection listingId={product.listing_id.toString()} />
		</>
	);
}
