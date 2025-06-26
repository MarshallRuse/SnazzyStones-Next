import { ListingImage, Money, ShopListingResponse, ShopProductionPartner, ShopSectionResponse } from './EtsyAPITypes';

export type ListingImageMin = Pick<ListingImage, 'url_75x75' | 'url_170x135' | 'url_fullxfull'>;

export type ProductMinAPIData = Pick<
    ShopListingResponse,
    | 'listing_id'
    | 'title'
    | 'description'
    | 'shop_section_id'
    | 'original_creation_timestamp'
    | 'num_favorers'
    | 'url'
    | 'production_partners'
    | 'quantity'
    | 'tags'
> & {
    images: ListingImageMin[];
    price?: Money;
    facebookAppId?: string;
};

export interface Product {
    listing_id: number;
    title: string;
    description: string;
    url: string;
    images: ListingImage[];
    production_partners?: ShopProductionPartner[];
    price?: Money;
    quantity: number;
    num_favorers: number;
    tags: string[];
    facebookAppId?: string;
}

export interface MenuItemType {
    isLink: boolean;
    link?: string;
    displayText: string;
    submenu?: MenuItemType[];
}

export interface Dimensions {
    width: number;
    height: number;
}

export type CategoriesMinAPIData = Pick<ShopSectionResponse, 'shop_section_id' | 'title'>;
