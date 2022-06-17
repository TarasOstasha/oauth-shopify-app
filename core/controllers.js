const log = console.log;
import { Shopify } from "@shopify/shopify-api";
import {
    shops,
    products,
} from "../middleware/state.js";

async function getProducts(shop) {
    try {
        const session = shops[shop];
        log('products session', session);
        // Create a new client for the specified shop.
        const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
        const products = await client.get({
            path: 'products',
        });
        log(products);
        return products
    } catch (error) {
        log('products error', error);
    }
};

async function productsCount(shop) {
    const session = shops[shop];
    log(Shopify.Context.API_VERSION);
    const path = `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    const { Product } = await import(path);
    const countData = await Product.count({ session });
    return countData
}

async function prepareData(shop) {
    const products = await getProducts(shop)
    products.push(...products);
    // countData = await productsCount(shop);
};

export {
    getProducts,
    productsCount,
    prepareData,
}