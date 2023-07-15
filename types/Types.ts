import { ListingImage, Money, ShopProductionPartner } from "./EtsyAPITypes";

export interface Product {
    listing_id: number;
    title: string;
    description: string;
    url: string;
    images: ListingImage[];
    production_partners?: ShopProductionPartner[];
    price: Money;
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
