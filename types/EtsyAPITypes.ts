import { ListingImageMin } from "./Types";

export interface ShopSectionResponse {
    shop_section_id: number;
    title: string;
    rank: number;
    user_id: number;
    active_listing_count: number;
}

export type WhenMade =
    | "made_to_order"
    | "2020_2023"
    | "2010_2019"
    | "2004_2009"
    | "before_2004"
    | "2000_2003"
    | "1990s"
    | "1980s"
    | "1970s"
    | "1960s"
    | "1950s"
    | "1940s"
    | "1930s"
    | "1920s"
    | "1910s"
    | "1900s"
    | "1800s"
    | "1700s"
    | "before_1700";

export interface Money {
    currency_code: string;
    amount: number;
    divisor: number;
}

export interface ListingsRequest {
    quantity: number;
    title: string;
    description: string;
    price: number;
    who_made: "i_did" | "someone_else" | "collective";
    when_made: WhenMade;
    taxonomy_id: number;
    shipping_profile_id?: number | null;
    return_policy_id?: number | null;
    materials?: string[] | null;
    shop_section_id?: number | null;
    processing_min?: number | null;
    processing_max?: number | null;
    tags?: string[] | null;
    styles?: string[] | null;
    item_weight?: number | null;
    item_length?: number | null;
    item_width?: number | null;
    item_height?: number | null;
    item_weight_unit?: "oz" | "lb" | "g" | "kg" | null;
    item_dimensions_unit?: "in" | "ft" | "mm" | "cm" | "m" | "yd" | "inches" | null;
    is_personalizable?: boolean | null;
    personalization_is_required?: boolean | null;
    personalization_char_count_max?: number | null;
    personalization_instructions?: string | null;
    production_partner_ids?: number[] | null;
    image_ids?: number[] | null;
    is_supply?: boolean;
    is_customizable?: boolean;
    should_auto_renew?: boolean;
    is_taxable?: boolean;
    type: "physical" | "download" | "both";
}

export interface ListingImage {
    listing_id: number;
    listing_image_id: number;
    hex_code?: string | null;
    red?: number | null;
    green?: number | null;
    blue?: number | null;
    hue?: number | null;
    saturation?: number | null;
    brightness?: number | null;
    is_black_and_white?: boolean | null;
    creation_tsz: number;
    created_timestamp: number;
    rank: number;
    url_75x75: string;
    url_170x135: string;
    url_570xN: string;
    url_fullxfull: string;
    full_height?: number | null;
    full_width?: number | null;
    alt_text?: string | null;
}

export interface ShopListingResponse {
    listing_id: number;
    user_id: number;
    shop_id: number;
    title: string;
    description: string;
    state: "active" | "inactive" | "sold_out" | "draft" | "expired";
    creation_timestamp: number;
    created_timestamp: number;
    ending_timestamp: number;
    original_creation_timestamp: number;
    last_modified_timestamp: number;
    updated_timestamp: number;
    state_timestamp: number;
    quantity: number;
    shop_section_id: number | null;
    featured_rank?: number;
    url: string;
    num_favorers: number;
    non_taxable: boolean;
    is_taxable: boolean;
    is_customizable: boolean;
    is_personalizable?: boolean;
    personalization_is_required?: boolean;
    personalization_char_count_max?: number | null;
    personalization_instructions?: string | null;
    listing_type: "physical" | "download" | "both";
    tags: string[] | null;
    materials: string[] | null;
    shipping_profile_id?: number | null;
    return_policy_id?: number | null;
    processing_min?: number | null;
    processing_max?: number | null;
    who_made?: "i_did" | "someone_else" | "collective" | null;
    when_made?: WhenMade | null;
    is_supply?: boolean | null;
    item_weight?: number | null;
    item_weight_unit?: "oz" | "lb" | "g" | "kg" | null;
    item_length?: number | null;
    item_width?: number | null;
    item_height?: number | null;
    item_dimensions_unit?: "in" | "ft" | "mm" | "cm" | "m" | "yd" | "inches" | null;
    is_private: boolean;
    style: string[] | null;
    file_data?: string;
    has_variations: boolean;
    should_auto_renew: boolean;
    language?: string | null;
    price: Money;
    taxonomy_id?: number | null;
    images?: ListingImage[];
    production_partners?: ShopProductionPartner[];
}

export interface ShopListingsResponse {
    count: number;
    results: ShopListingResponse[];
}

export interface ListingReview {
    shop_id: number;
    listing_id: number;
    rating: number;
    review?: string | null;
    language: string;
    image_url_fullxfull?: string | null;
    create_timestamp: number;
    created_timestamp: number;
    update_timestamp: number;
    updated_timestamp: number;
}

export interface ListingReviewResponse {
    count: number;
    results: ListingReview[];
}

export interface ShopProductionPartner {
    production_partner_id: number;
    partner_name: string;
    location: string;
}

export interface ShopListingCondensed {
    listing_id: number;
    title: string;
    description: string;
    images: ListingImageMin[];
    shop_section_id: number;
    original_creation_timestamp: number;
    num_favorers: number;
    price?: Money;
    production_partners?: ShopProductionPartner[];
}
