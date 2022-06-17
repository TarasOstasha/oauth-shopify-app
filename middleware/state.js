import dotenv from 'dotenv';
dotenv.config();
import { Shopify, ApiVersion } from '@shopify/shopify-api';

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST, SHOP } = process.env;

const context = {
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    API_VERSION: ApiVersion.April22,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
};

const shops = {};

/* 
    dev vars
*/
let products = [];
let countData = 0;

export { 
    context, shops, 
    products, countData
}