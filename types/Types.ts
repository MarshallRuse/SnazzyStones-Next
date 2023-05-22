import {ListingImage, Money, ShopProductionPartner} from "./EtsyAPITypes";

export interface Product {
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