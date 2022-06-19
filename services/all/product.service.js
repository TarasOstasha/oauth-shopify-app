import { log } from 'high-level';
import { rand_str_long, pro, lex, } from '../../my_modules/staff.js';
import { User } from '../../models/index.js';
import mail from './mail.service.js';
import user from './user.service.js';

import { shops, state, } from "../../middleware/state.js";
import { Shopify } from "@shopify/shopify-api";

class ProductService {
    constructor() { }

    // async getGQL(shop, query) {
    //     const session = shops[shop];
    //     log('products session GQL', session);
    //     // Create a new client for the specified shop.
    //     const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
    //     const products = await client.query({
    //         data: `{
    //             products (first: 10) {
    //               edges {
    //                 node {
    //                   id
    //                   title
    //                   descriptionHtml
    //                 }
    //               }
    //             }
    //           }`,
    //       });
    //     log(products);
    //     state.preparedProducts = products; // !!!!!!!!!!!
    //     return {
    //         ok: true,
    //         result: {
    //             products
    //         }
    //     }
    // }

    async get(shop) {
        const session = shops[shop];
        log('products session', session);
        // Create a new client for the specified shop.
        const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
        const products = await client.get({
            path: 'products',
        });
        log(products);
        state.preparedProducts = products; // !!!!!!!!!!!
        return {
            ok: true,
            result: {
                products
            }
        }
    }

    async productsCount(shop) {
        const session = shops[shop];
        log(Shopify.Context.API_VERSION);
        const path = `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
        const { Product } = await import(path);
        const countData = await Product.count({ session });
        return {
            ok: true,
            result: {
                countData
            }
        }
    }

};

export default new ProductService();
