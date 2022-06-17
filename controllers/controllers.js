const log = console.log;
import { Shopify } from "@shopify/shopify-api";
import { shops, state, } from "../middleware/state.js";


async function productsCount(shop) {
    const session = shops[shop];
    log(Shopify.Context.API_VERSION);
    const path = `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    const { Product } = await import(path);
    const countData = await Product.count({ session });
    return countData
}

export {
    productsCount,
}