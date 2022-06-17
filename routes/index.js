// import { log, } from '../../../high-level/index.js';
// import { RegisterController } from '../controllers/auth.js';

import { Shopify } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import { shops, state, } from "../middleware/state.js";
const log = console.log;
import { getProducts, productsCount, prepareData, } from '../core/controllers.js';


export default function router(app) {

    // [
    //   { path: '/register', method: 'post', controller: RegisterController }
    // ].forEach(
    //   // it is like - router.post('/register', mediator.bind(new RegisterController()));
    //   item => router[item.method](item.path, mediator.bind(new item.controller()))
    // );


    app.get("/api/products", async (req, res) => {
        const products = await getProducts(req.query.shop);
        res.status(200).send(state.products);
    });

    // app.get("api/products-count", verifyRequest(app), async (req, res) => {
    app.get("/api/products-count", async (req, res) => {
        const countData = await productsCount(req.query.shop);
        res.status(200).send(countData);
    });

}


async function mediator(req, res, next) {
    const DTO = await this.go(req, res);
    res.json(DTO);
};




