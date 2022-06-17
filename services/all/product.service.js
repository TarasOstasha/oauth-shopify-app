import { log } from 'high-level';
import { rand_str_long, pro, lex, } from '../../my_modules/staff.js';
import { User } from '../../models/index.js';
import mail from './mail.service.js';
import user from './user.service.js';

import { shops, state, } from "../../middleware/state.js";
import { Shopify } from "@shopify/shopify-api";

class ProductService {
    constructor() { }

    async get(shop) {
        const session = shops[shop];
        log('products session', session);
        // Create a new client for the specified shop.
        const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
        const products = await client.get({
            path: 'products',
        });
        log(products);
        return {
            ok: true,
            result: {
                products
            }
        }
    }

};

export default new ProductService();
