// import { log, } from '../../../high-level/index.js';
import { getProductsController } from '../controllers/products.js';

import { Shopify } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import { shops, state, } from "../middleware/state.js";
const log = console.log;

export default function router(app) {
    [
        { path: '/api/products', method: 'get', controller: getProductsController }
    ].forEach(
        // it is like - router.post('/register', mediator.bind(new RegisterController()));
        item => app[item.method](item.path, mediator.bind(new item.controller()))
    );
}

async function mediator(req, res, next) {
    const DTO = await this.go(req, res);
    res.json(DTO);
};